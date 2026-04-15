import Link from "next/link";
import FadeUp from "../components/FadeUp";
import Navbar from "../components/NavBar";
import SiteBackground from "../components/SiteBackground";
import SiteFooter from "../components/SiteFooter";
import { personalInfo } from "../data/portfolio";

const adminCards = [
  {
    title: "Manage updates feed",
    description:
      "Create, edit, and delete social-style posts for your updates page from a focused publishing screen.",
    href: "/admin/updates",
    label: "Open composer",
  },
  {
    title: "Preview public feed",
    description:
      "Check how the published posts look on the public updates page with your current portfolio styling.",
    href: "/updates",
    label: "Open updates page",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="site-shell">
      <SiteBackground />
      <Navbar logo={personalInfo.shortLogo} ctaHref="/#contact" />

      <section className="admin-hero">
        <div className="section-wrap">
          <FadeUp className="admin-hero-copy">
            <div className="hero-badge">
              <div className="badge-dot" />
              Portfolio control room
            </div>
            <h1 className="hero-title">
              <div className="name">Admin</div>
              <div className="role">Publishing</div>
            </h1>
            <p className="hero-tagline">
              A lightweight admin area for your personal portfolio. Use it to manage updates like a small
              social feed, preview changes, and keep your site feeling alive.
            </p>
          </FadeUp>

          <div className="admin-dashboard-grid">
            {adminCards.map((card, index) => (
              <FadeUp key={card.title} className="admin-card admin-dashboard-card" delay={index * 0.06}>
                <div className="section-label">Admin</div>
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
