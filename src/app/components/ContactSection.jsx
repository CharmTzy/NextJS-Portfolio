"use client";

import { useState } from "react";
import FadeUp from "./FadeUp";

export default function ContactSection({ links = [], intro, email }) {
  const [formData, setFormData] = useState({
    name: "",
    senderEmail: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio inquiry from ${formData.name || "a visitor"}`);
    const body = encodeURIComponent(
      `Name: ${formData.name || ""}\nEmail: ${formData.senderEmail || ""}\n\nMessage:\n${formData.message || ""}`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 3000);
  };

  return (
    <FadeUp className="contact-grid">
      <div className="contact-info">
        <h3>Let&apos;s build something together</h3>
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
          <div className="form-group">
            <label htmlFor="name">NAME</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderEmail">EMAIL</label>
            <input
              id="senderEmail"
              name="senderEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.senderEmail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">MESSAGE</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Tell me about your project or opportunity..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <button className="btn-primary" style={{ width: "100%", textAlign: "center", border: "none" }} type="submit">
            {sent ? "✓ Message Sent!" : "Send Message →"}
          </button>
        </form>
      </div>
    </FadeUp>
  );
}
