import Link from "next/link";
import FadeUp from "../components/FadeUp";
import Navbar from "../components/NavBar";
import SiteBackground from "../components/SiteBackground";
import SiteFooter from "../components/SiteFooter";
import { personalInfo } from "../data/portfolio";
import { siteRoutes } from "../data/site-content";
import { adminDashboardContent } from "../data/updates";

export default function AdminDashboardPage() {
  return (
    <main className="site-shell">
      <SiteBackground />
      <Navbar logo={personalInfo.shortLogo} ctaHref={siteRoutes.homeContact} />

      <section className="admin-hero">
        <div className="section-wrap">
          <FadeUp className="admin-hero-copy">
            <div className="hero-badge">
              <div className="badge-dot" />
              {adminDashboardContent.badge}
            </div>
            <h1 className="hero-title">
              <div className="name">{adminDashboardContent.titleTop}</div>
              <div className="role">{adminDashboardContent.titleBottom}</div>
            </h1>
            <p className="hero-tagline">{adminDashboardContent.description}</p>
          </FadeUp>

          <div className="admin-dashboard-grid">
            {adminDashboardContent.cards.map((card, index) => (
              <FadeUp key={card.title} className="admin-card admin-dashboard-card" delay={index * 0.06}>
                <div className="section-label">{adminDashboardContent.cardLabel}</div>
                <h2 className="admin-section-title">{card.title}</h2>
                <p className="admin-helper-text">{card.description}</p>
                <Link href={card.href} className="btn-primary admin-dashboard-link">
                  {card.label}
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
