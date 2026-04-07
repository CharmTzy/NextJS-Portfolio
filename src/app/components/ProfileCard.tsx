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

export default function ProfileCard({
  name,
  role,
  tagline,
  availability,
  stats,
  primaryHref,
  secondaryHref,
}: ProfileCardProps) {
  return (
    <div className="hero-inner">
      <div className="hero-content fade-up visible">
        <div className="hero-badge">
          <div className="badge-dot" />
          {availability}
        </div>
        <h1 className="hero-title">
          <div className="name">{name}</div>
          <div className="role">{role}</div>
        </h1>
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

      <div className="hero-visual fade-up visible" style={{ transitionDelay: "0.2s" }}>
        <div className="hero-card">
          <div className="card-header">
            <div className="card-dot" style={{ background: "#ff5f57" }} />
            <div className="card-dot" style={{ background: "#febc2e" }} />
            <div className="card-dot" style={{ background: "#28c840" }} />
            <span className="card-file-label">DEVELOPER.PY — PYTHON</span>
          </div>
          <div className="card-window">
            <div className="code-line">
              <span className="ln">01</span>
              <span>
                <span className="kw">class</span> <span className="fn">WaiYanAung</span>:
              </span>
            </div>
            <div className="code-line">
              <span className="ln">02</span>
              <span>
                <span className="kw">def</span> __init__(self):
              </span>
            </div>
            <div className="code-line">
              <span className="ln">03</span>
              <span>
                self.name = <span className="str">&quot;{name}&quot;</span>
              </span>
            </div>
            <div className="code-line">
              <span className="ln">04</span>
              <span>
                self.role = <span className="str">&quot;AI</span>
              </span>
            </div>
            <div className="code-line">
              <span className="ln">05</span>
              <span>
                <span className="str">&quot;Engineer&quot;</span>
              </span>
            </div>
            <div className="code-line">
              <span className="ln">06</span>
              <span>
                self.stack = [<span className="str">&quot;React&quot;</span>, <span className="str">&quot;Node.js&quot;</span>]
              </span>
            </div>
            <div className="code-line">
              <span className="ln">07</span>
              <span>&nbsp;</span>
            </div>
            <div className="code-line">
              <span className="ln">08</span>
              <span>
                <span className="kw">def</span> <span className="fn">say_hello</span>(self):
              </span>
            </div>
            <div className="code-line">
              <span className="ln">09</span>
              <span>
                print(<span className="str">&quot;Crafting future-proof digital architectures.&quot;</span>)
                <span className="typing-cursor" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
