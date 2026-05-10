"use client";

import { useEffect, useState } from "react";
import {
  loadManagedUpdates,
  MANAGED_UPDATES_STORAGE_KEY,
  normalizeUpdatesFeed,
} from "../lib/managed-updates";
import { updatesPageContent } from "../data/updates";
import FadeUp from "./FadeUp";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function UpdatesFeed({ updates = [], sidebarCards = [] }) {
  const [managedUpdates, setManagedUpdates] = useState(() => normalizeUpdatesFeed(updates));

  useEffect(() => {
    setManagedUpdates(loadManagedUpdates(updates));

    const handleStorage = (event) => {
      if (event.key && event.key !== MANAGED_UPDATES_STORAGE_KEY) {
        return;
      }

      setManagedUpdates(loadManagedUpdates(updates));
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [updates]);

  return (
    <div className="updates-layout">
      <div className="updates-stream">
        {managedUpdates.length ? (
          managedUpdates.map((post, index) => (
            <FadeUp key={post.id || `${post.date}-${post.title}`} className="update-card" delay={index * 0.06}>
              <div className="update-meta">
                <span className="update-date">{formatDate(post.date)}</span>
                <span className="update-category">{post.category}</span>
                <span className={`update-mood mood-${post.mood}`}>{post.mood}</span>
              </div>
              <h2 className="update-title">{post.title}</h2>
              <p className="update-content">{post.content}</p>

              {post.tags?.length ? (
                <div className="update-tags">
                  {post.tags.map((tag) => (
                    <span key={`${post.id || post.title}-${tag}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {post.links?.length ? (
                <div className="update-links">
                  {post.links.map((link) => (
                    <a
                      key={`${post.id || post.title}-${link.href}`}
                      href={link.href}
                      target={link.href.startsWith("/") ? undefined : "_blank"}
                      rel={link.href.startsWith("/") ? undefined : "noreferrer"}
                      className="proj-link"
                    >
                      ↗ {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </FadeUp>
          ))
        ) : (
          <FadeUp className="update-card update-empty-card">
            <div className="section-label">{updatesPageContent.emptyState.label}</div>
            <h2 className="update-title">{updatesPageContent.emptyState.title}</h2>
            <p className="update-content">{updatesPageContent.emptyState.description}</p>
          </FadeUp>
        )}
      </div>

      <div className="updates-sidebar">
        {sidebarCards.map((card, index) => (
          <FadeUp key={card.title} className="updates-side-card" delay={index * 0.08}>
            <p className="updates-side-title">{card.title}</p>
            <div className="updates-side-list">
              {card.items.map((item) => (
                <div key={`${card.title}-${item}`} className="updates-side-item">
                  <span className="updates-side-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
