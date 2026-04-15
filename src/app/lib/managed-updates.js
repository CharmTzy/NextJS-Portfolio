export const MANAGED_UPDATES_STORAGE_KEY = "wya-portfolio-updates-v1";

function slugifyValue(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLink(link, index = 0) {
  if (!link) return null;

  const label = (link.label || "").trim();
  const href = (link.href || "").trim();

  if (!label || !href) return null;

  return {
    id: link.id || `${slugifyValue(label)}-${index}`,
    label,
    href,
  };
}

export function normalizeUpdatePost(post, index = 0) {
  const title = (post?.title || `Untitled post ${index + 1}`).trim();
  const date =
    typeof post?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(post.date)
      ? post.date
      : new Date().toISOString().slice(0, 10);

  const tags = Array.isArray(post?.tags)
    ? post.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  const links = Array.isArray(post?.links)
    ? post.links.map((link, linkIndex) => normalizeLink(link, linkIndex)).filter(Boolean)
    : [];

  return {
    id: post?.id || `${slugifyValue(`${date}-${title}`) || `post-${index + 1}`}`,
    date,
    category: (post?.category || "Update").trim(),
    title,
    content: (post?.content || "").trim(),
    mood: (post?.mood || "focused").trim().toLowerCase(),
    tags,
    links,
  };
}

export function normalizeUpdatesFeed(posts = []) {
  return [...posts]
    .map((post, index) => normalizeUpdatePost(post, index))
    .sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return a.title.localeCompare(b.title);
    });
}

export function loadManagedUpdates(defaultPosts = []) {
  if (typeof window === "undefined") {
    return normalizeUpdatesFeed(defaultPosts);
  }

  try {
    const raw = window.localStorage.getItem(MANAGED_UPDATES_STORAGE_KEY);

    if (!raw) {
      return normalizeUpdatesFeed(defaultPosts);
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return normalizeUpdatesFeed(defaultPosts);
    }

    return normalizeUpdatesFeed(parsed);
  } catch (error) {
    console.warn("Unable to load managed updates from localStorage:", error);
    return normalizeUpdatesFeed(defaultPosts);
  }
}

export function saveManagedUpdates(posts = []) {
  if (typeof window === "undefined") return;

  const normalized = normalizeUpdatesFeed(posts);
  window.localStorage.setItem(MANAGED_UPDATES_STORAGE_KEY, JSON.stringify(normalized));
}

export function resetManagedUpdates(defaultPosts = []) {
  const normalized = normalizeUpdatesFeed(defaultPosts);
  saveManagedUpdates(normalized);
  return normalized;
}

export function createEmptyUpdateDraft() {
  return {
    id: "",
    date: new Date().toISOString().slice(0, 10),
    category: "Update",
    title: "",
    content: "",
    mood: "focused",
    tagsInput: "",
    linksInput: "",
  };
}

export function draftFromUpdate(post) {
  const normalized = normalizeUpdatePost(post);

  return {
    id: normalized.id,
    date: normalized.date,
    category: normalized.category,
    title: normalized.title,
    content: normalized.content,
    mood: normalized.mood,
    tagsInput: normalized.tags.join(", "),
    linksInput: normalized.links.map((link) => `${link.label} | ${link.href}`).join("\n"),
  };
}

export function updateFromDraft(draft) {
  const tags = (draft.tagsInput || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const links = (draft.linksInput || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, href] = line.split("|").map((value) => value?.trim());
      return normalizeLink({ label, href }, index);
    })
    .filter(Boolean);

  return normalizeUpdatePost({
    id: draft.id,
    date: draft.date,
    category: draft.category,
    title: draft.title,
    content: draft.content,
    mood: draft.mood,
    tags,
    links,
  });
}
