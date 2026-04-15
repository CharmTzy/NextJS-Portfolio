"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

const moodOptions = ["focused", "shipping", "curious", "proud", "thoughtful", "reflecting"];

export default function AdminUpdatesManager({ defaultPosts = [] }) {
  const [posts, setPosts] = useState(() => normalizeUpdatesFeed(defaultPosts));
  const [draft, setDraft] = useState(createEmptyUpdateDraft());
  const [message, setMessage] = useState("Compose a post and publish it to your updates feed.");

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
      setMessage("Add a title and some content before publishing.");
      return;
    }

    const nextPost = updateFromDraft(draft);
    const nextPosts = draft.id
      ? posts.map((post) => (post.id === nextPost.id ? nextPost : post))
      : [nextPost, ...posts.filter((post) => post.id !== nextPost.id)];

    persistPosts(nextPosts, draft.id ? `Updated "${nextPost.title}".` : `Published "${nextPost.title}".`);
    setDraft(createEmptyUpdateDraft());
  };

  const handleEdit = (post) => {
    setDraft(draftFromUpdate(post));
    setMessage(`Editing "${post.title}".`);
  };

  const handleDelete = (postId) => {
    const target = posts.find((post) => post.id === postId);

    if (!target) return;
    if (!window.confirm(`Delete "${target.title}"?`)) return;

    const nextPosts = posts.filter((post) => post.id !== postId);
    persistPosts(nextPosts, `Deleted "${target.title}".`);

    if (draft.id === postId) {
      setDraft(createEmptyUpdateDraft());
    }
  };

  const handleReset = () => {
    if (!window.confirm("Reset the feed back to the default starter posts?")) {
      return;
    }

    const nextPosts = resetManagedUpdates(defaultPosts);
    setPosts(nextPosts);
    setDraft(createEmptyUpdateDraft());
    setMessage("Reset the feed to the default starter posts.");
  };

  const handleClearDraft = () => {
    setDraft(createEmptyUpdateDraft());
    setMessage("Cleared the composer.");
  };

  const previewPost = updateFromDraft({
    ...draft,
    title: draft.title || "Preview title",
    content: draft.content || "Your post preview will appear here while you type.",
  });

  return (
    <div className="admin-layout">
      <div className="admin-main-column">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="section-label">Composer</div>
              <h2 className="admin-section-title">{draft.id ? "Edit post" : "Create a post"}</h2>
            </div>
            <div className="admin-badge">Local browser publishing</div>
          </div>

          <p className="admin-helper-text">
            This admin flow works like a lightweight social post composer. It saves updates in this
            browser and your public <Link href="/updates">updates page</Link> will read them automatically.
          </p>

          <div className="admin-status-banner">{message}</div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label htmlFor="post-title">TITLE</label>
                <input
                  id="post-title"
                  name="title"
                  type="text"
                  placeholder="What are you sharing today?"
                  value={draft.title}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-category">CATEGORY</label>
                <input
                  id="post-category"
                  name="category"
                  type="text"
                  placeholder="Portfolio, Build, Learning..."
                  value={draft.category}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-date">DATE</label>
                <input id="post-date" name="date" type="date" value={draft.date} onChange={updateDraftField} />
              </div>

              <div className="form-group">
                <label htmlFor="post-mood">MOOD</label>
                <select id="post-mood" name="mood" value={draft.mood} onChange={updateDraftField}>
                  {moodOptions.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="post-content">POST</label>
              <textarea
                id="post-content"
                name="content"
                rows="7"
                placeholder="Write your status update here..."
                value={draft.content}
                onChange={updateDraftField}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-tight">
              <div className="form-group">
                <label htmlFor="post-tags">TAGS</label>
                <input
                  id="post-tags"
                  name="tagsInput"
                  type="text"
                  placeholder="Next.js, Personal site, Design polish"
                  value={draft.tagsInput}
                  onChange={updateDraftField}
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-links">LINKS</label>
                <textarea
                  id="post-links"
                  name="linksInput"
                  rows="3"
                  placeholder={"Live demo | https://example.com\nGitHub | https://github.com/..."}
                  value={draft.linksInput}
                  onChange={updateDraftField}
                />
              </div>
            </div>

            <div className="admin-action-row">
              <button type="submit" className="btn-primary">
                {draft.id ? "Update Post" : "Publish Post"}
              </button>
              <button type="button" className="btn-ghost admin-ghost-button" onClick={handleClearDraft}>
                Clear Draft
              </button>
              <button type="button" className="btn-ghost admin-ghost-button" onClick={handleReset}>
                Reset Feed
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card">
          <div className="section-label">Preview</div>
          <h2 className="admin-section-title">Live post preview</h2>
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
          <div className="section-label">Published Feed</div>
          <h2 className="admin-section-title">{posts.length} saved posts</h2>
          <p className="admin-helper-text">
            Edit or delete existing posts here. These changes appear on <Link href="/updates">/updates</Link>{" "}
            in this browser.
          </p>

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
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-ghost admin-ghost-button admin-danger-button"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
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
