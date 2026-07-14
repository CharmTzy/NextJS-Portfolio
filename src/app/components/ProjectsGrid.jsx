import Image from "next/image";
import Link from "next/link";
import FadeUp from "./FadeUp";
import { projectsContent } from "../data/site-content";

export default function ProjectsGrid({ projects = [] }) {
  const { card } = projectsContent;

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <FadeUp key={project.originalName} className="project-card" delay={index * 0.05}>
          <Link href={`/projects/${project.slug}`} className="project-card-main">
            <div className="project-thumb" style={{ background: project.gradient }}>
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="project-thumb-image"
                />
              ) : null}
              <div className="project-thumb-inner">
                {!project.imageUrl ? (
                  <span className="project-emoji" aria-hidden="true">
                    {project.emoji}
                  </span>
                ) : null}
                <span className="project-thumb-badge">{card.badge}</span>
              </div>
            </div>
            <div className="project-body">
              <div className="project-meta-row">
                <div className="project-kicker">{project.kicker}</div>
                <div className="project-meta">
                  <span className="project-meta-item">Updated {project.updatedLabel}</span>
                </div>
              </div>
              <div className="project-heading-row">
                <div className="project-title">{project.name}</div>
              </div>
              <div className="project-desc">{project.description}</div>
              <div className="project-detail-cta">{card.primaryActionLabel}</div>
            </div>
          </Link>

          <div className="project-footer">
            <div className="project-links">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="proj-link">
                  ↗ {project.liveLabel || card.liveFallbackLabel}
                </a>
              ) : null}
              {project.videoUrl ? (
                <a href={project.videoUrl} target="_blank" rel="noreferrer" className="proj-link">
                  ↗ {project.videoLabel || card.videoLinkLabel}
                </a>
              ) : null}
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                {card.githubLinkLabel}
              </a>
            </div>

            <div className="project-tags-row">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={`${project.originalName}-${tag.label}`} className={`tag ${tag.variant === "default" ? "" : tag.variant}`.trim()}>
                  {tag.label}
                </span>
              ))}
              {project.tags.length > 3 ? <span className="tag">+{project.tags.length - 3}</span> : null}
            </div>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
