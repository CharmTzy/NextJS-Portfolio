import FadeUp from "../../components/FadeUp";
import AdminUpdatesManager from "../../components/AdminUpdatesManager";
import Navbar from "../../components/NavBar";
import SiteBackground from "../../components/SiteBackground";
import SiteFooter from "../../components/SiteFooter";
import { personalInfo } from "../../data/portfolio";
import { updatesFeed } from "../../data/updates";

export default function AdminUpdatesPage() {
  return (
    <main className="site-shell">
      <SiteBackground />
      <Navbar logo={personalInfo.shortLogo} ctaHref="/#contact" />

      <section className="admin-hero">
        <div className="section-wrap">
          <FadeUp className="admin-hero-copy">
            <div className="hero-badge">
              <div className="badge-dot" />
              Updates manager
            </div>
            <h1 className="hero-title">
              <div className="name">Social-style</div>
              <div className="role">Post Composer</div>
            </h1>
            <p className="hero-tagline">
              Write quick status updates, edit existing posts, and preview how they appear on your public
              feed. This is the first step toward a full portfolio admin workflow.
            </p>
          </FadeUp>

          <AdminUpdatesManager defaultPosts={updatesFeed} />
        </div>
      </section>

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
