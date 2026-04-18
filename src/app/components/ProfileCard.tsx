type HeroStat = {
  value: string;
  label: string;
};

type ProfileCardProps = {
  name: string;
  role: string;
  location: string;
  tagline: string;
  availability: string;
  stats: HeroStat[];
  primaryHref: string;
  secondaryHref: string;
};

export default function ProfileCard({ name, role, location, tagline, availability, stats, primaryHref, secondaryHref }: ProfileCardProps) {
  const trimmed = name.trim();
  const nameParts = trimmed.split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : trimmed;
  const firstNames = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";
  /** Short display names read better as one gradient lockup (e.g. “Wai Yan”). */
  const useFullNameLockup = nameParts.length > 0 && nameParts.length <= 2;

  return (
    <div className="hero-inner fade-up visible">
      <div className="hero-eyebrow">
        <div className="hero-badge">
          <div className="badge-dot" />
          {availability}
        </div>
        <span className="hero-location">{location}</span>
      </div>
      <h1 className={`hero-name${useFullNameLockup ? " hero-name-lockup" : ""}`}>
        {useFullNameLockup ? (
          <span className="hero-name-highlight">{trimmed}</span>
        ) : firstNames ? (
          <>
            {firstNames} <span className="hero-name-highlight">{lastName}</span>
          </>
        ) : (
          <span className="hero-name-highlight">{lastName}</span>
        )}
      </h1>
      <div className="hero-role-row">
        <div className="hero-rule" />
        <span className="hero-role">{role}</span>
      </div>
      <p className="hero-tagline" dangerouslySetInnerHTML={{ __html: tagline }} />
      <div className="hero-actions">
        <a href={primaryHref} className="btn-primary">
          View My Work
        </a>
        <a href={secondaryHref} className="btn-ghost">
          Get in Touch →
        </a>
      </div>
      <div className="hero-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="stat-num">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
