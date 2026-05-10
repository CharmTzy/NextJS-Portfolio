import FadeUp from "../components/FadeUp";
import ProjectsGrid from "../components/ProjectsGrid";
import { homePageContent } from "../data/site-content";

export default function Projects({ projects }) {
  const { projectsSection } = homePageContent;

  return (
    <section id="projects">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">{projectsSection.label}</div>
          <h2 className="section-title">{projectsSection.title}</h2>
          <p className="section-subtitle">{projectsSection.subtitle}</p>
        </FadeUp>
        <ProjectsGrid projects={projects} />
      </div>
    </section>
  );
}
