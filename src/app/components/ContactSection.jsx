"use client";

import { useCallback, useEffect, useState } from "react";
import FadeUp from "./FadeUp";
import { contactFormContent } from "../data/site-content";

const initialFormData = {
  name: "",
  senderEmail: "",
  message: "",
  website: "",
  challengeAnswer: "",
  emailVerificationCode: "",
};

export default function ContactSection({ links = [], intro }) {
  const [formData, setFormData] = useState({
    ...initialFormData,
  });
  const [challenge, setChallenge] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [emailVerificationToken, setEmailVerificationToken] = useState("");
  const [emailCodeSentTo, setEmailCodeSentTo] = useState("");
  const [requestingCode, setRequestingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [sent, setSent] = useState(false);

  const loadChallenge = useCallback(async () => {
    try {
      const response = await fetch(contactFormContent.apiEndpoint, { method: "GET" });
      const data = await response.json();

      if (!response.ok || !data.challenge) {
        throw new Error(contactFormContent.messages.verificationUnavailable);
      }

      setChallenge(data.challenge);
      setStartedAt(Date.now());
      setFormData((current) => ({ ...current, challengeAnswer: "" }));
    } catch {
      setChallenge(null);
      setStatus({
        type: "error",
        message: contactFormContent.messages.verificationUnavailable,
      });
    }
  }, []);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "senderEmail") {
      setEmailVerificationToken("");
      setEmailCodeSentTo("");
      setFormData((current) => ({
        ...current,
        senderEmail: value,
        emailVerificationCode: "",
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRequestEmailCode = async () => {
    if (!formData.senderEmail?.trim() || !formData.challengeAnswer?.trim() || !challenge) {
      setStatus({
        type: "error",
        message: contactFormContent.messages.emailCodeRequirements,
      });
      return;
    }

    setRequestingCode(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(contactFormContent.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request-email-code",
          senderEmail: formData.senderEmail,
          website: formData.website,
          challengeAnswer: formData.challengeAnswer,
          startedAt,
          challengeId: challenge.id,
          challengeToken: challenge.token,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok || !data.emailVerificationToken) {
        throw new Error(data.message || contactFormContent.messages.fallbackError);
      }

      setEmailVerificationToken(data.emailVerificationToken);
      setEmailCodeSentTo(formData.senderEmail.trim().toLowerCase());
      setFormData((current) => ({ ...current, emailVerificationCode: "" }));
      setStatus({
        type: "success",
        message: data.message || contactFormContent.messages.emailCodeSent,
      });
    } catch (error) {
      setEmailVerificationToken("");
      setEmailCodeSentTo("");
      setStatus({
        type: "error",
        message: error.message || contactFormContent.messages.fallbackError,
      });
    } finally {
      setRequestingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.message?.trim() ||
      !formData.senderEmail?.trim() ||
      !formData.challengeAnswer?.trim() ||
      !formData.emailVerificationCode?.trim() ||
      !emailVerificationToken ||
      !challenge
    ) {
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(contactFormContent.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          emailVerificationToken,
          startedAt,
          challengeId: challenge.id,
          challengeToken: challenge.token,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || contactFormContent.messages.fallbackError);
      }

      setSent(true);
      setFormData({ ...initialFormData });
      setEmailVerificationToken("");
      setEmailCodeSentTo("");
      setStatus({ type: "success", message: data.message || contactFormContent.messages.success });
      loadChallenge();
      window.setTimeout(() => {
        setSent(false);
        setStatus({ type: "idle", message: "" });
      }, contactFormContent.successResetDelayMs);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || contactFormContent.messages.fallbackError,
      });
      loadChallenge();
    } finally {
      setSubmitting(false);
    }
  };

  const submitDisabled =
    submitting ||
    requestingCode ||
    !formData.message?.trim() ||
    !formData.senderEmail?.trim() ||
    !formData.challengeAnswer?.trim() ||
    !formData.emailVerificationCode?.trim() ||
    !emailVerificationToken ||
    !challenge;

  const requestCodeDisabled = requestingCode || submitting || !formData.senderEmail?.trim() || !formData.challengeAnswer?.trim() || !challenge;

  return (
    <FadeUp className="contact-grid">
      <div className="contact-info">
        <h3>{contactFormContent.headline}</h3>
        <p>{intro}</p>
        <div className="contact-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-link"
              target={link.href.startsWith("mailto:") || link.href.startsWith("/") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") || link.href.startsWith("/") ? undefined : "noreferrer"}
              download={link.href.startsWith("/") ? true : undefined}
            >
              <div className="cl-icon" style={{ background: link.iconBackground }}>
                {link.icon}
              </div>
              <div>
                <div className="cl-label">{link.label}</div>
                <div className="cl-value">{link.value}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">{contactFormContent.labels.name}</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder={contactFormContent.placeholders.name}
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderEmail">{contactFormContent.labels.email}</label>
            <input
              id="senderEmail"
              name="senderEmail"
              type="email"
              placeholder={contactFormContent.placeholders.email}
              value={formData.senderEmail}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">{contactFormContent.labels.message}</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder={contactFormContent.placeholders.message}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="challengeAnswer">{contactFormContent.labels.verification}</label>
            <div className="verification-question">
              {challenge?.question || contactFormContent.messages.loadingVerification}
            </div>
            <input
              id="challengeAnswer"
              name="challengeAnswer"
              type="text"
              placeholder={contactFormContent.placeholders.verification}
              value={formData.challengeAnswer}
              onChange={handleChange}
              autoComplete="off"
              inputMode="numeric"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emailVerificationCode">{contactFormContent.labels.emailVerificationCode}</label>
            <div className="email-verification-row">
              <input
                id="emailVerificationCode"
                name="emailVerificationCode"
                type="text"
                placeholder={contactFormContent.placeholders.emailVerificationCode}
                value={formData.emailVerificationCode}
                onChange={handleChange}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
              />
              <button className="btn-ghost email-code-button" type="button" onClick={handleRequestEmailCode} disabled={requestCodeDisabled}>
                {requestingCode
                  ? contactFormContent.buttons.sendingVerification
                  : emailVerificationToken
                    ? contactFormContent.buttons.resendVerification
                    : contactFormContent.buttons.sendVerification}
              </button>
            </div>
            <p className="form-hint">
              {emailVerificationToken
                ? `${contactFormContent.messages.emailCodeSent} ${emailCodeSentTo}.`
                : contactFormContent.messages.emailCodeHelp}
            </p>
          </div>

          {status.message ? (
            <p className={`contact-form-status ${status.type === "error" ? "error" : "success"}`}>{status.message}</p>
          ) : null}

          <button className="btn-primary btn-block" type="submit" disabled={submitDisabled}>
            {submitting ? contactFormContent.buttons.sending : sent ? contactFormContent.buttons.success : contactFormContent.buttons.submitVerified}
          </button>
        </form>
      </div>
    </FadeUp>
  );
}
