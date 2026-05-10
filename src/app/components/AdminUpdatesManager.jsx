"use client";

import { useEffect, useState } from "react";
import {
  createEmptyUpdateDraft,
  draftFromUpdate,
  loadManagedUpdates,
  MANAGED_UPDATES_STORAGE_KEY,
  normalizeUpdatesFeed,
  resetManagedUpdates,
  saveManagedUpdates,
  updateFromDraft,
} from "../lib/managed-updates";
import { adminUpdatesContent } from "../data/updates";

export default function AdminUpdatesManager({ defaultPosts = [] }) {
  const { composer } = adminUpdatesContent;
  const [posts, setPosts] = useState(() => normalizeUpdatesFeed(defaultPosts));
  const [draft, setDraft] = useState(createEmptyUpdateDraft());
  const [message, setMessage] = useState(composer.initialMessage);

  useEffect(() => {
    setPosts(loadManagedUpdates(defaultPosts));

    const handleStorage = (event) => {
      if (event.key && event.key !== MANAGED_UPDATES_STORAGE_KEY) {
        return;
      }

      setPosts(loadManagedUpdates(defaultPosts));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultPosts]);

  const updateDraftField = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const persistPosts = (nextPosts, nextMessage) => {
    setPosts(nextPosts);
    saveManagedUpdates(nextPosts);
    setMessage(nextMessage);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.content.trim()) {
      setMessage(composer.validationMessage);
      return;
    }

    const nextPost = updateFromDraft(draft);
    const nextPosts = draft.id
      ? posts.map((post) => (post.id === nextPost.id ? nextPost : post))
      : [nextPost, ...posts.filter((post) => post.id !== nextPost.id)];

    persistPosts(
      nextPosts,
      draft.id ? composer.messages.updated(nextPost.title) : composer.messages.published(nextPost.title)
    );
    setDraft(createEmptyUpdateDraft());
  };

  const handleEdit = (post) => {
    setDraft(draftFromUpdate(post));
    setMessage(composer.messages.editing(post.title));
  };

  const handleDelete = (postId) => {
    const target = posts.find((post) => post.id === postId);

    if (!target) return;
    if (!window.confirm(composer.confirmations.delete(target.title))) return;

    const nextPosts = posts.filter((post) => post.id !== postId);
    persistPosts(nextPosts, composer.messages.deleted(target.title));

    if (draft.id === postId) {
      setDraft(createEmptyUpdateDraft());
    }
  };

  const handleReset = () => {
    if (!window.confirm(composer.confirmations.reset)) {
      return;
    }

    const nextPosts = resetManagedUpdates(defaultPosts);
    setPosts(nextPosts);
    setDraft(createEmptyUpdateDraft());
    setMessage(composer.resetMessage);
  };

  const handleClearDraft = () => {
    setDraft(createEmptyUpdateDraft());
    setMessage(composer.clearedMessage);
  };

  const previewPost = updateFromDraft({
    ...draft,
    title: draft.title || composer.preview.fallbackTitle,
    content: draft.content || composer.preview.fallbackContent,
  });

  return (
    <div className="admin-layout">
      <div className="admin-main-column">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="section-label">{composer.label}</div>
              <h2 className="admin-section-title">{draft.id ? composer.editTitle : composer.createTitle}</h2>
            </div>
            <div className="admin-badge">{composer.badge}</div>
          </div>

          <p className="admin-helper-text">{composer.helperText}</p>

          <div className="admin-status-banner">{message}</div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label htmlFor="post-title">{composer.fieldLabels.title}</label>
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  placeholder={composer.placeholders.title}
                  value={draft.title}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-category">{composer.fieldLabels.category}</label>
                <input
                  id="post-category"
                  name="category"
                  type="text"
                  placeholder={composer.placeholders.category}
                  value={draft.category}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-date">{composer.fieldLabels.date}</label>
                <input id="post-date" name="date" type="date" value={draft.date} onChange={updateDraftField} />
              </div>

              <div className="form-group">
                <label htmlFor="post-mood">{composer.fieldLabels.mood}</label>
                <select id="post-mood" name="mood" value={draft.mood} onChange={updateDraftField}>
                  {composer.moodOptions.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="post-content">{composer.fieldLabels.post}</label>
              <textarea
                id="post-content"
                name="content"
                rows="7"
                placeholder={composer.placeholders.content}
                value={draft.content}
                onChange={updateDraftField}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-tight">
              <div className="form-group">
                <label htmlFor="post-tags">{composer.fieldLabels.tags}</label>
                <input
                  id="post-tags"
                  name="tagsInput"
                  type="text"
                  placeholder={composer.placeholders.tags}
                  value={draft.tagsInput}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-links">{composer.fieldLabels.links}</label>
                <textarea
                  id="post-links"
                  name="linksInput"
                  rows="3"
                  placeholder={composer.placeholders.links}
                  value={draft.linksInput}
                  onChange={updateDraftField}
                />
              </div>
            </div>

            <div className="admin-action-row">
              <button type="submit" className="btn-primary">
                {draft.id ? composer.buttons.update : composer.buttons.publish}
              </button>
              <button type="button" className="btn-ghost admin-ghost-button" onClick={handleClearDraft}>
                {composer.buttons.clear}
              </button>
              <button type="button" className="btn-ghost admin-ghost-button" onClick={handleReset}>
                {composer.buttons.reset}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <div className="section-label">{composer.preview.label}</div>
          <h2 className="admin-section-title">{composer.preview.title}</h2>
          <div className="admin-preview-card">
            <div className="update-meta">
              <span className="update-date">{previewPost.date}</span>
              <span className="update-category">{previewPost.category}</span>
              <span className={`update-mood mood-${previewPost.mood}`}>{previewPost.mood}</span>
            </div>
            <h3 className="update-title">{previewPost.title}</h3>
            <p className="update-content">{previewPost.content}</p>

            {previewPost.tags.length ? (
              <div className="update-tags">
                {previewPost.tags.map((tag) => (
                  <span key={`preview-${tag}`} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {previewPost.links.length ? (
              <div className="update-links">
                {previewPost.links.map((link) => (
                  <span key={`preview-${link.href}`} className="proj-link">
                    ↗ {link.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="admin-side-column">
        <div className="admin-card">
          <div className="section-label">{composer.publishedFeed.label}</div>
          <h2 className="admin-section-title">
            {posts.length} {composer.publishedFeed.savedPostsSuffix}
          </h2>
          <p className="admin-helper-text">{composer.publishedFeed.helperText}</p>

          <div className="admin-post-list">
            {posts.map((post) => (
              <div key={post.id} className="admin-post-card">
                <div className="admin-post-meta">
                  <span>{post.date}</span>
                  <span>{post.category}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="admin-post-actions">
                  <button type="button" className="btn-ghost admin-ghost-button" onClick={() => handleEdit(post)}>
                    {composer.buttons.edit}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost admin-ghost-button admin-danger-button"
                    onClick={() => handleDelete(post.id)}
                  >
                    {composer.buttons.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
