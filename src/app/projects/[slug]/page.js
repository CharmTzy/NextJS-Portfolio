import Link from "next/link";
import { notFound } from "next/navigation";
import FadeUp from "../../components/FadeUp";
import Navbar from "../../components/NavBar";
import SiteBackground from "../../components/SiteBackground";
import SiteFooter from "../../components/SiteFooter";
import { getProjectBySlug, getProjectSlugs, personalInfo } from "../../data/portfolio";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} — Wai Yan`,
    description: project.caseStudy.headline,
  };
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const infoCards = [
    { label: "Status", value: project.caseStudy.status },
    { label: "Role", value: project.caseStudy.role },
    { label: "Timeline", value: project.caseStudy.timeline },
    { label: "Primary stack", value: project.primaryLanguage },
  ];

  return (
    <main className="site-shell">
      <SiteBackground />

      <Navbar logo={personalInfo.shortLogo} ctaHref="/#contact" />

      <section className="project-detail-hero">
        <div className="section-wrap">
          <div className="project-detail-grid">
            <FadeUp className="project-detail-copy">
              <Link href="/#projects" className="project-back-link">
                ← Back to projects
              </Link>
              <div className="hero-badge">
                <div className="badge-dot" />
                {project.caseStudy.status}
              </div>
              <div className="project-detail-emoji" style={{ background: project.gradient }}>
                <span>{project.emoji}</span>
              </div>
              <h1 className="project-detail-title">{project.name}</h1>
              <p className="project-detail-headline">{project.caseStudy.headline}</p>
              <div className="hero-actions">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                    Visit {project.liveLabel || "Live"}
                  </a>
                ) : null}
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                  View GitHub →
                </a>
              </div>
            </FadeUp>

            <FadeUp className="project-detail-panel" delay={0.08}>
              <div className="project-summary-grid">
                {infoCards.map((item) => (
                  <div key={item.label} className="project-summary-card">
                    <div className="project-summary-label">{item.label}</div>
                    <div className="project-summary-value">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="project-tag-cloud">
                {project.tags.map((tag) => (
                  <span
                    key={`${project.originalName}-detail-${tag.label}`}
                    className={`tag ${tag.variant === "default" ? "" : tag.variant}`.trim()}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <div className="project-meta-strip">
                <span>Updated {project.updatedLabel}</span>
                <span>⭐ {project.stars} stars</span>
                <span>{project.originalName}</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="project-detail-section">
        <div className="section-wrap">
          <div className="project-body-grid">
            <div className="project-story-stack">
              <FadeUp className="project-story-card">
                <div className="section-label">Overview</div>
                <h2 className="project-section-title">What this project is about</h2>
                <p className="project-story-text">{project.caseStudy.challenge}</p>
              </FadeUp>

              <FadeUp className="project-story-card" delay={0.05}>
                <div className="section-label">Approach</div>
                <h2 className="project-section-title">How I built it</h2>
                <p className="project-story-text">{project.caseStudy.solution}</p>
              </FadeUp>

              <FadeUp className="project-story-card" delay={0.1}>
                <div className="section-label">Outcome</div>
                <h2 className="project-section-title">Why it matters</h2>
                <p className="project-story-text">{project.caseStudy.outcome}</p>
              </FadeUp>
            </div>

            <div className="project-side-stack">
              <FadeUp className="project-list-card" delay={0.06}>
                <div className="section-label">Highlights</div>
                <h2 className="project-section-title">What stands out</h2>
                <div className="project-bullet-list">
                  {project.caseStudy.highlights.map((item) => (
                    <div key={item} className="project-bullet-item">
                      <span className="project-bullet-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp className="project-list-card" delay={0.12}>
                <div className="section-label">Learnings</div>
                <h2 className="project-section-title">What I learned</h2>
                <div className="project-bullet-list">
                  {project.caseStudy.learnings.map((item) => (
                    <div key={item} className="project-bullet-item">
                      <span className="project-bullet-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
