import Link from "next/link";
import FadeUp from "./FadeUp";

export default function ProjectsGrid({ projects = [] }) {
  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <FadeUp key={project.originalName} className="project-card" delay={index * 0.05}>
          <Link href={`/projects/${project.slug}`} className="project-card-main">
            <div className="project-thumb" style={{ background: project.gradient }}>
              <div className="project-thumb-inner">
                <span className="project-emoji" aria-hidden="true">
                  {project.emoji}
                </span>
                <span className="project-thumb-badge">Case study</span>
              </div>
            </div>
            <div className="project-body">
              <div className="project-meta-row">
                <div className="project-kicker">Selected work</div>
                <div className="project-meta">
                  <span className="project-meta-item">{project.primaryLanguage}</span>
                  <span className="project-meta-dot" aria-hidden="true">
                    ·
                  </span>
                  <span className="project-meta-item">Updated {project.updatedLabel}</span>
                </div>
              </div>
              <div className="project-heading-row">
                <div className="project-title">{project.name}</div>
                <span className="project-star" title="GitHub stars" aria-label={`GitHub stars: ${project.stars}`}>
                  ★ {project.stars}
                </span>
              </div>
              <div className="project-desc">{project.description}</div>
              <div className="project-detail-cta">Read case study →</div>
            </div>
          </Link>

          <div className="project-footer">
            <div className="project-links">
              <Link href={`/projects/${project.slug}`} className="proj-link">
                Case study
              </Link>
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="proj-link">
                  ↗ {project.liveLabel || "Live"}
                </a>
              ) : null}
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                GitHub
              </a>
            </div>

            <div className="project-tags-row">
              {project.tags.map((tag) => (
                <span key={`${project.originalName}-${tag.label}`} className={`tag ${tag.variant === "default" ? "" : tag.variant}`.trim()}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
