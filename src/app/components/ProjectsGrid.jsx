import Link from "next/link";
import FadeUp from "./FadeUp";

export default function ProjectsGrid({ projects = [] }) {
  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <FadeUp key={project.originalName} className="project-card" delay={index * 0.05}>
          <Link href={`/projects/${project.slug}`} className="project-card-main">
            <div className="project-thumb" style={{ background: project.gradient }}>
              <span style={{ zIndex: 1, position: "relative" }}>{project.emoji}</span>
            </div>
            <div className="project-body">
              <div className="project-kicker">Case Study</div>
              <div className="project-heading-row">
                <div className="project-title">{project.name}</div>
                <span className="project-star">⭐ {project.stars}</span>
              </div>
              <div className="project-desc">{project.description}</div>
              <div className="project-detail-cta">Read project story →</div>
            </div>
          </Link>

          <div className="project-footer">
            <div className="project-links">
              <Link href={`/projects/${project.slug}`} className="proj-link">
                Case Study
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
                <span
                  key={`${project.originalName}-${tag.label}`}
                  className={`tag ${tag.variant === "default" ? "" : tag.variant}`.trim()}
                >
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
