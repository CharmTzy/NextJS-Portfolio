import FadeUp from "../components/FadeUp";
import ProjectsGrid from "../components/ProjectsGrid";

export default function Projects({ projects }) {
  return (
    <section id="projects">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">Selected Work</div>
          <h2 className="section-title">Selected Work</h2>
        </FadeUp>
        <ProjectsGrid projects={projects} />
      </div>
    </section>
  );
}
