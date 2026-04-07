import FadeUp from "../components/FadeUp";
import Navbar from "../components/NavBar";
import SiteBackground from "../components/SiteBackground";
import SiteFooter from "../components/SiteFooter";
import UpdatesFeed from "../components/UpdatesFeed";
import { personalInfo } from "../data/portfolio";
import { updatesFeed, updatesPageContent } from "../data/updates";

export default function UpdatesPage() {
  return (
    <main className="site-shell">
      <SiteBackground />

      <Navbar logo={personalInfo.shortLogo} ctaHref="/#contact" />

      <section className="updates-hero">
        <div className="section-wrap">
          <div className="updates-hero-grid">
            <FadeUp className="updates-hero-copy">
              <div className="hero-badge">
                <div className="badge-dot" />
                {updatesPageContent.badge}
              </div>
              <h1 className="hero-title">
                <div className="name">{updatesPageContent.titleTop}</div>
                <div className="role">{updatesPageContent.titleBottom}</div>
              </h1>
              <p className="hero-tagline">{updatesPageContent.description}</p>
              <div className="hero-actions">
                <a href="/" className="btn-primary">
                  Back to Portfolio
                </a>
                <a href="/#contact" className="btn-ghost">
                  Work With Me →
                </a>
              </div>
            </FadeUp>

            <FadeUp className="updates-status-card" delay={0.12}>
              <div className="updates-status-label">Current status</div>
              <p className="updates-status-text">{updatesPageContent.currentStatus}</p>
              <div className="updates-status-stats">
                {updatesPageContent.stats.map((stat) => (
                  <div key={stat.label} className="updates-stat-box">
                    <div className="stat-num">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="updates-section">
        <div className="section-wrap">
          <FadeUp className="section-header">
            <div className="section-label">Feed</div>
            <h2 className="section-title">Quick posts, build notes, and personal status updates</h2>
          </FadeUp>
          <UpdatesFeed updates={updatesFeed} sidebarCards={updatesPageContent.sidebarCards} />
        </div>
      </section>

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
