import FadeUp from "../components/FadeUp";
import ProjectsGrid from "../components/ProjectsGrid";

export default function Projects({ projects }) {
  return (
    <section id="projects">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">Portfolio</div>
          <h2 className="section-title">Projects from GitHub</h2>
        </FadeUp>
        <ProjectsGrid projects={projects} />
      </div>
    </section>
  );
}
