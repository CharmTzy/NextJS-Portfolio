import Link from "next/link";
import FadeUp from "./FadeUp";

function getYear(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return Number.isFinite(d.getTime()) ? d.getFullYear() : "—";
}

export default function ProjectsGrid({ projects = [] }) {
  return (
    <FadeUp className="projects-list">
      {projects.map((project, index) => (
        <Link
          key={project.originalName}
          href={`/projects/${project.slug}`}
          className="project-row"
        >
          <div className="project-index">{String(index + 1).padStart(2, "0")}</div>

          <div className="project-name-cell">
            <div className="project-name">{project.name}</div>
            <div className="project-desc">{project.description}</div>
            <div className="project-external">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  ↗ {project.liveLabel || "Live"}
                </a>
              ) : null}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                ↗ GitHub
              </a>
            </div>
          </div>

          <div className="project-stack">
            {project.tags.map((t) => t.label).join(" · ")}
          </div>

          <div className="project-year">{getYear(project.updatedAt)}</div>

          <div className="project-arrow">↗</div>
        </Link>
      ))}
    </FadeUp>
  );
}
