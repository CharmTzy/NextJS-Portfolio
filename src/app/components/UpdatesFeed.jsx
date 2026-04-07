import FadeUp from "./FadeUp";

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

export default function UpdatesFeed({ updates = [], sidebarCards = [] }) {
  return (
    <div className="updates-layout">
      <div className="updates-stream">
        {updates.map((post, index) => (
          <FadeUp key={`${post.date}-${post.title}`} className="update-card" delay={index * 0.06}>
            <div className="update-meta">
              <span className="update-date">{formatDate(post.date)}</span>
              <span className="update-category">{post.category}</span>
              <span className={`update-mood mood-${post.mood}`}>{post.mood}</span>
            </div>
            <h2 className="update-title">{post.title}</h2>
            <p className="update-content">{post.content}</p>

            <div className="update-tags">
              {post.tags.map((tag) => (
                <span key={`${post.title}-${tag}`} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            {post.links?.length ? (
              <div className="update-links">
                {post.links.map((link) => (
                  <a
                    key={`${post.title}-${link.href}`}
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
        ))}
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
