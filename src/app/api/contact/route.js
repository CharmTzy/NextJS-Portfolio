import { createHmac, randomInt, timingSafeEqual } from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { personalInfo } from "../../data/portfolio";

export const runtime = "nodejs";

const CHALLENGE_TTL_MS = 20 * 60 * 1000;
const MIN_SUBMIT_MS = 2500;
const MAX_SUBMIT_MS = 30 * 60 * 1000;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 5;
const EMAIL_CODE_TTL_MS = 10 * 60 * 1000;
const EMAIL_CODE_RATE_LIMIT_MAX = 3;

const challenges = [
  { id: "sum-4-7", question: "What is 4 + 7?", answer: "11" },
  { id: "sum-8-5", question: "What is 8 + 5?", answer: "13" },
  { id: "minus-15-6", question: "What is 15 - 6?", answer: "9" },
  { id: "minus-18-9", question: "What is 18 - 9?", answer: "9" },
  { id: "sum-6-9", question: "What is 6 + 9?", answer: "15" },
];

function getChallengeSecret() {
  return process.env.CONTACT_CHALLENGE_SECRET || process.env.SMTP_PASS || "development-contact-secret";
}

function getEmailVerificationSecret() {
  return process.env.CONTACT_EMAIL_VERIFY_SECRET || getChallengeSecret();
}

function signChallenge({ id, answer, expiresAt }) {
  return createHmac("sha256", getChallengeSecret())
    .update(`${id}.${answer}.${expiresAt}`)
    .digest("hex");
}

function safeCompare(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function createChallengePayload() {
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  const expiresAt = Date.now() + CHALLENGE_TTL_MS;
  const signature = signChallenge({ ...challenge, expiresAt });

  return {
    id: challenge.id,
    question: challenge.question,
    token: `${expiresAt}.${signature}`,
  };
}

function verifyChallenge({ challengeId, challengeToken, challengeAnswer }) {
  const challenge = challenges.find((item) => item.id === challengeId);

  if (!challenge || !challengeToken || !challengeAnswer) {
    return false;
  }

  const [expiresAtRaw, signature] = String(challengeToken).split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!expiresAt || !signature || expiresAt < Date.now()) {
    return false;
  }

  const expectedSignature = signChallenge({ ...challenge, expiresAt });
  const normalizedAnswer = String(challengeAnswer).trim().toLowerCase();

  return normalizedAnswer === challenge.answer && safeCompare(signature, expectedSignature);
}

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

function normalizeEmailCode(code) {
  return String(code || "").replace(/\D/g, "").slice(0, 6);
}

function signEmailCode({ email, code, expiresAt }) {
  return createHmac("sha256", getEmailVerificationSecret())
    .update(`${email}.${code}.${expiresAt}`)
    .digest("hex");
}

function createEmailVerificationPayload(email) {
  const code = String(randomInt(100000, 1000000));
  const expiresAt = Date.now() + EMAIL_CODE_TTL_MS;
  const signature = signEmailCode({ email, code, expiresAt });

  return {
    code,
    expiresAt,
    token: `${expiresAt}.${signature}`,
  };
}

function verifyEmailCode({ senderEmail, emailVerificationCode, emailVerificationToken }) {
  const email = normalizeEmail(senderEmail);
  const code = normalizeEmailCode(emailVerificationCode);

  if (!email || !code || !emailVerificationToken) {
    return false;
  }

  const [expiresAtRaw, signature] = String(emailVerificationToken).split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!expiresAt || !signature || expiresAt < Date.now()) {
    return false;
  }

  const expectedSignature = signEmailCode({ email, code, expiresAt });
  return safeCompare(signature, expectedSignature);
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

function buildEmailVerification({ senderEmail, code, expiresAt, ip, userAgent }) {
  const mailEnv = getMailEnv();
  const from = mailEnv.from || mailEnv.user || mailEnv.to;
  const expiresInMinutes = Math.max(1, Math.round((expiresAt - Date.now()) / 60000));

  const text = [
    `Your Wai Yan portfolio contact verification code is ${code}.`,
    "",
    `This code expires in about ${expiresInMinutes} minutes.`,
    "If you did not request this code, you can ignore this email.",
    "",
    "Request details:",
    `IP: ${ip}`,
    `User agent: ${userAgent || "Unknown"}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2328;">
      <h2 style="margin: 0 0 12px;">Verify your email</h2>
      <p>Use this code to send your message through Wai Yan's portfolio contact form:</p>
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; padding: 16px; border: 1px solid #d0d7de; border-radius: 12px; background: #f6f8fa; text-align: center;">${escapeHtml(
        code
      )}</div>
      <p>This code expires in about ${expiresInMinutes} minutes.</p>
      <p style="font-size: 12px; color: #656d76;">If you did not request this code, you can ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #d0d7de; margin: 20px 0;" />
      <p style="font-size: 12px; color: #656d76;"><strong>IP:</strong> ${escapeHtml(ip)}</p>
      <p style="font-size: 12px; color: #656d76;"><strong>User agent:</strong> ${escapeHtml(userAgent || "Unknown")}</p>
    </div>
  `;

  return {
    from,
    to: senderEmail,
    subject: "Your portfolio contact verification code",
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

  return NextResponse.json({ ok: true, challenge: createChallengePayload() });
}

async function handleEmailVerificationRequest({ body, ip, userAgent }) {
  const startedAt = Number(body.startedAt);
  const elapsedMs = Date.now() - startedAt;
  const honeypot = sanitizeText(body.website, 200);

  if (honeypot || !startedAt || elapsedMs > MAX_SUBMIT_MS) {
    return NextResponse.json({
      ok: true,
      message: "If that email can receive mail, a verification code is on the way.",
    });
  }

  const senderEmail = normalizeEmail(body.senderEmail);

  if (!senderEmail || !isValidEmail(senderEmail)) {
    return jsonError("Please enter a valid email address before requesting a code.");
  }

  const codeLimit = Number(process.env.CONTACT_EMAIL_CODE_RATE_LIMIT_MAX || EMAIL_CODE_RATE_LIMIT_MAX);

  if (isRateLimited(`email-code-ip:${ip}`, codeLimit) || isRateLimited(`email-code-email:${senderEmail}`, codeLimit)) {
    return jsonError("Too many verification codes requested. Please try again later.", 429);
  }

  if (
    !verifyChallenge({
      challengeId: body.challengeId,
      challengeToken: body.challengeToken,
      challengeAnswer: body.challengeAnswer,
    })
  ) {
    return jsonError("Please answer the verification check before requesting an email code.");
  }

  const { transporter, status } = createTransporter();

  if (!transporter) {
    const missingText = status.missing.join(", ");
    console.error(`Portfolio contact email verification is not configured. Missing: ${missingText}`);
    return jsonError(`Email verification is not configured yet. Please email me directly at ${status.recipient}.`, 500);
  }

  const verification = createEmailVerificationPayload(senderEmail);

  try {
    await transporter.sendMail(
      buildEmailVerification({
        senderEmail,
        code: verification.code,
        expiresAt: verification.expiresAt,
        ip,
        userAgent,
      })
    );

    return NextResponse.json({
      ok: true,
      emailVerificationToken: verification.token,
      message: `A 6-digit verification code was sent to ${senderEmail}.`,
    });
  } catch (error) {
    console.error("Portfolio contact email verification failed:", error);
    return jsonError("Unable to send the verification code right now. Please try again later.", 500);
  }
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

  if (body.action === "request-email-code") {
    return handleEmailVerificationRequest({ body, ip, userAgent });
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

  if (
    !verifyChallenge({
      challengeId: body.challengeId,
      challengeToken: body.challengeToken,
      challengeAnswer: body.challengeAnswer,
    })
  ) {
    return jsonError("Verification failed. Please try the new question.");
  }

  if (
    !verifyEmailCode({
      senderEmail,
      emailVerificationCode: body.emailVerificationCode,
      emailVerificationToken: body.emailVerificationToken,
    })
  ) {
    return jsonError("Please verify your email address with the 6-digit code before sending.");
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
