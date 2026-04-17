type HeroStat = {
  value: string;
  label: string;
};

type ProfileCardProps = {
  name: string;
  role: string;
  tagline: string;
  availability: string;
  stats: HeroStat[];
  primaryHref: string;
  secondaryHref: string;
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return { first: fullName, last: "" };
  const last = parts.pop() as string;
  return { first: parts.join(" "), last };
}

export default function ProfileCard({
  name,
  role,
  tagline,
  availability,
  stats,
  primaryHref,
  secondaryHref,
}: ProfileCardProps) {
  const { first, last } = splitName(name);
  const year = new Date().getFullYear();

  return (
    <div className="hero-inner fade-up visible">
      <div className="hero-stamp">
        <div className="hero-stamp-left">
          <span className="hero-stamp-dot" />
          <span>{availability} · Singapore</span>
        </div>
        <div>Portfolio — {year} ©</div>
      </div>

      <div className="hero-body">
        <h1 className="hero-name">
          <span className="hero-name-line">{first}</span>
          <span className="hero-name-line wya-italic">{last}.</span>
        </h1>
        <div className="hero-sub">
          <span>
            {role} — building products that ship
          </span>
        </div>
        <p className="hero-tagline" dangerouslySetInnerHTML={{ __html: tagline }} />
        <div className="hero-actions">
          <a href={primaryHref} className="btn-primary">
            Selected Work →
          </a>
          <a href={secondaryHref} className="btn-ghost">
            Start a Project
          </a>
        </div>
      </div>

      <div className="hero-footer">
        <div className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="stat-num">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="hero-scroll-hint">Scroll</div>
      </div>
    </div>
  );
}
