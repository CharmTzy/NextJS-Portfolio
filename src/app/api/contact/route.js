import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { personalInfo } from "../../data/portfolio";

export const runtime = "nodejs";

const MIN_SUBMIT_MS = 2500;
const MAX_SUBMIT_MS = 30 * 60 * 1000;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_EMAIL_RATE_LIMIT_MAX = 3;

function getRateBucket(key) {
  globalThis.__portfolioContactRateLimit ??= new Map();

  const now = Date.now();
  const bucket = globalThis.__portfolioContactRateLimit.get(key);

  if (!bucket || bucket.resetAt < now) {
    const nextBucket = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    globalThis.__portfolioContactRateLimit.set(key, nextBucket);
    return nextBucket;
  }

  return bucket;
}

function isRateLimited(key, limit = Number(process.env.CONTACT_RATE_LIMIT_MAX || DEFAULT_RATE_LIMIT_MAX)) {
  const bucket = getRateBucket(key);
  bucket.count += 1;

  return bucket.count > limit;
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function sanitizeText(value = "", maxLength = 1000) {
  return String(value).replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email) {
  return sanitizeText(email, 254).toLowerCase();
}

const mailEnvKeys = {
  url: ["SMTP_URL", "EMAIL_SERVER", "MAIL_URL"],
  service: ["SMTP_SERVICE", "EMAIL_SERVICE", "MAIL_SERVICE"],
  host: ["SMTP_HOST", "EMAIL_HOST", "MAIL_HOST"],
  port: ["SMTP_PORT", "EMAIL_PORT", "MAIL_PORT"],
  secure: ["SMTP_SECURE", "EMAIL_SECURE", "MAIL_SECURE"],
  user: ["SMTP_USER", "EMAIL_USER", "MAIL_USER", "GMAIL_USER"],
  pass: ["SMTP_PASS", "EMAIL_PASS", "MAIL_PASS", "GMAIL_APP_PASSWORD", "GMAIL_APP_PASS"],
  from: ["SMTP_FROM", "CONTACT_FROM_EMAIL", "MAIL_FROM", "EMAIL_FROM"],
  to: ["CONTACT_TO_EMAIL", "MAIL_TO", "EMAIL_TO"],
};

function getEnvValue(names) {
  for (const name of names) {
    const value = process.env[name]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function getMailEnv() {
  const host = getEnvValue(mailEnvKeys.host);
  const service = getEnvValue(mailEnvKeys.service);

  return {
    url: getEnvValue(mailEnvKeys.url),
    service,
    host: host || (service ? "" : "smtp.gmail.com"),
    port: getEnvValue(mailEnvKeys.port),
    secure: getEnvValue(mailEnvKeys.secure),
    user: getEnvValue(mailEnvKeys.user),
    pass: getEnvValue(mailEnvKeys.pass),
    from: getEnvValue(mailEnvKeys.from),
    to: getEnvValue(mailEnvKeys.to) || personalInfo.email,
  };
}

function getMissingEnvLabel(key) {
  return mailEnvKeys[key].join(" or ");
}

function getMailConfigStatus() {
  const mailEnv = getMailEnv();
  const missing = [];

  if (!mailEnv.url && !mailEnv.user) {
    missing.push(getMissingEnvLabel("user"));
  }

  if (!mailEnv.url && !mailEnv.pass) {
    missing.push(getMissingEnvLabel("pass"));
  }

  const mode = mailEnv.url ? "smtp-url" : mailEnv.service || mailEnv.host;

  return {
    configured: missing.length === 0,
    missing,
    mode,
    recipient: mailEnv.to,
  };
}

function createTransporter() {
  const status = getMailConfigStatus();

  if (!status.configured) {
    return { transporter: null, status };
  }

  const mailEnv = getMailEnv();

  if (mailEnv.url) {
    return {
      transporter: nodemailer.createTransport(mailEnv.url),
      status,
    };
  }

  const port = Number(mailEnv.port || (mailEnv.host === "smtp.gmail.com" ? 465 : 587));
  const secure = mailEnv.secure ? mailEnv.secure === "true" : port === 465;

  const transportOptions = {
    auth: {
      user: mailEnv.user,
      pass: mailEnv.pass,
    },
  };

  if (mailEnv.service) {
    transportOptions.service = mailEnv.service;
  } else {
    transportOptions.host = mailEnv.host;
    transportOptions.port = port;
    transportOptions.secure = secure;
  }

  return {
    transporter: nodemailer.createTransport(transportOptions),
    status,
  };
}

function buildEmail({ name, senderEmail, message, ip, userAgent }) {
  const displayName = name || "Portfolio visitor";
  const mailEnv = getMailEnv();
  const recipient = mailEnv.to;
  const from = mailEnv.from || mailEnv.user || recipient;

  const text = [
    `Name: ${displayName}`,
    `Email: ${senderEmail}`,
    "",
    "Message:",
    message,
    "",
    "Request details:",
    `IP: ${ip}`,
    `User agent: ${userAgent || "Unknown"}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2328;">
      <h2 style="margin: 0 0 16px;">New portfolio contact</h2>
      <p><strong>Name:</strong> ${escapeHtml(displayName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space: pre-wrap; padding: 12px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa;">${escapeHtml(
        message
      )}</div>
      <hr style="border: 0; border-top: 1px solid #d0d7de; margin: 20px 0;" />
      <p style="font-size: 12px; color: #656d76;"><strong>IP:</strong> ${escapeHtml(ip)}</p>
      <p style="font-size: 12px; color: #656d76;"><strong>User agent:</strong> ${escapeHtml(userAgent || "Unknown")}</p>
    </div>
  `;

  return {
    from,
    to: recipient,
    replyTo: senderEmail,
    subject: `[Portfolio] Message from ${displayName}`,
    text,
    html,
  };
}

export async function GET(request) {
  const url = new URL(request.url);

  if (url.searchParams.get("health") === "mail") {
    const status = getMailConfigStatus();
    const response = {
      ok: true,
      mailConfigured: status.configured,
      missing: status.missing,
      mode: status.mode,
      recipient: status.recipient,
    };

    if (status.configured && url.searchParams.get("verify") === "true") {
      try {
        const { transporter } = createTransporter();
        await transporter.verify();
        response.smtpVerified = true;
      } catch (error) {
        console.error("Portfolio contact SMTP verification failed:", error);
        response.smtpVerified = false;
        response.verifyMessage = "SMTP login failed. Check the username, app password, and provider settings.";
      }
    }

    return NextResponse.json(response);
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  if (isRateLimited(`message:${ip}`)) {
    return jsonError("Too many messages from this connection. Please try again later.", 429);
  }

  const startedAt = Number(body.startedAt);
  const elapsedMs = Date.now() - startedAt;
  const honeypot = sanitizeText(body.website, 200);

  if (honeypot || !startedAt || elapsedMs < MIN_SUBMIT_MS || elapsedMs > MAX_SUBMIT_MS) {
    return NextResponse.json({ ok: true, message: "Thanks, your message was sent successfully." });
  }

  const name = sanitizeText(body.name, 120);
  const senderEmail = normalizeEmail(body.senderEmail);
  const message = String(body.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);

  if (!senderEmail || !isValidEmail(senderEmail)) {
    return jsonError("Please enter a valid email address.");
  }

  if (message.length < 10) {
    return jsonError("Please write a slightly longer message.");
  }

  const emailLimit = Number(process.env.CONTACT_EMAIL_RATE_LIMIT_MAX || DEFAULT_EMAIL_RATE_LIMIT_MAX);

  if (isRateLimited(`message-email:${senderEmail}`, emailLimit)) {
    return jsonError("Too many messages from this email address. Please try again later.", 429);
  }

  const { transporter, status } = createTransporter();

  if (!transporter) {
    const missingText = status.missing.join(", ");
    console.error(`Portfolio contact email is not configured. Missing: ${missingText}`);
    return jsonError(`Email service is not configured yet. Please email me directly at ${status.recipient}.`, 500);
  }

  try {
    await transporter.sendMail(buildEmail({ name, senderEmail, message, ip, userAgent }));
    return NextResponse.json({ ok: true, message: "Thanks, your message was sent successfully." });
  } catch (error) {
    console.error("Portfolio contact email failed:", error);
    return jsonError("Unable to send your message right now. Please try again later.", 500);
  }
}
