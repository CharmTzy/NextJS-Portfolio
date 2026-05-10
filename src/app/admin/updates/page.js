import FadeUp from "../../components/FadeUp";
import AdminUpdatesManager from "../../components/AdminUpdatesManager";
import Navbar from "../../components/NavBar";
import SiteBackground from "../../components/SiteBackground";
import SiteFooter from "../../components/SiteFooter";
import { personalInfo } from "../../data/portfolio";
import { siteRoutes } from "../../data/site-content";
import { adminUpdatesContent, updatesFeed } from "../../data/updates";

export default function AdminUpdatesPage() {
  return (
    <main className="site-shell">
      <SiteBackground />
      <Navbar logo={personalInfo.shortLogo} ctaHref={siteRoutes.homeContact} />

      <section className="admin-hero">
        <div className="section-wrap">
          <FadeUp className="admin-hero-copy">
            <div className="hero-badge">
              <div className="badge-dot" />
              {adminUpdatesContent.hero.badge}
            </div>
            <h1 className="hero-title">
              <div className="name">{adminUpdatesContent.hero.titleTop}</div>
              <div className="role">{adminUpdatesContent.hero.titleBottom}</div>
            </h1>
            <p className="hero-tagline">{adminUpdatesContent.hero.description}</p>
          </FadeUp>

          <AdminUpdatesManager defaultPosts={updatesFeed} />
        </div>
      </section>

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
