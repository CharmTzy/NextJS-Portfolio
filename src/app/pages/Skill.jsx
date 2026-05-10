import FadeUp from "../components/FadeUp";
import WebSkillsCard from "../components/WebSkillsCard";
import { homePageContent } from "../data/site-content";

export default function Skill({ skills }) {
  const { skillsSection } = homePageContent;

  return (
    <section id="skills">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">{skillsSection.label}</div>
          <h2 className="section-title">{skillsSection.title}</h2>
          <p className="section-subtitle">{skillsSection.subtitle}</p>
        </FadeUp>
        <WebSkillsCard skills={skills} />
      </div>
    </section>
  );
}
