"use client";

import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import FadeUp from "./FadeUp";
import { contactFormContent } from "../data/site-content";
import { OPEN_RESUME_VIEWER_EVENT } from "../lib/site-events";

const initialFormData = {
  name: "",
  senderEmail: "",
  message: "",
  website: "",
};

const contactIcons = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
  file: FileText,
};

export default function ContactSection({ links = [], intro }) {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [startedAt, setStartedAt] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.message.trim() || !formData.senderEmail.trim()) return;

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(contactFormContent.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, startedAt }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || contactFormContent.messages.fallbackError);
      }

      setSent(true);
      setFormData({ ...initialFormData });
      setStartedAt(Date.now());
      setStatus({ type: "success", message: data.message || contactFormContent.messages.success });
      window.setTimeout(() => {
        setSent(false);
        setStatus({ type: "idle", message: "" });
      }, contactFormContent.successResetDelayMs);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || contactFormContent.messages.fallbackError,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitDisabled = submitting || !formData.message.trim() || !formData.senderEmail.trim();

  return (
    <FadeUp className="contact-grid">
      <div className="contact-info">
        <h3>{contactFormContent.headline}</h3>
        <p>{intro}</p>
        <div className="contact-links">
          {links.map((link) => {
            const LinkIcon = contactIcons[link.icon] || Mail;
            const opensResumeViewer = link.icon === "file";

            return (
              <a
                key={link.label}
                href={link.href}
                className="contact-link"
                target={link.href.startsWith("mailto:") || opensResumeViewer ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") || opensResumeViewer ? undefined : "noreferrer"}
                onClick={
                  opensResumeViewer
                    ? (event) => {
                        event.preventDefault();
                        window.dispatchEvent(new Event(OPEN_RESUME_VIEWER_EVENT));
                      }
                    : undefined
                }
              >
                <div className="cl-icon">
                  <LinkIcon size={18} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <div className="cl-label">{link.label}</div>
                  <div className="cl-value">{link.value}</div>
                </div>
              </a>
            );
          })}
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

          {status.message ? (
            <p
              className={`contact-form-status ${status.type === "error" ? "error" : "success"}`}
              aria-live="polite"
            >
              {status.message}
            </p>
          ) : null}

          <button className="btn-primary btn-block" type="submit" disabled={submitDisabled}>
            {submitting ? contactFormContent.buttons.sending : sent ? contactFormContent.buttons.success : contactFormContent.buttons.submit}
          </button>
        </form>
      </div>
    </FadeUp>
  );
}
