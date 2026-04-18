import FadeUp from "../components/FadeUp";
import WebSkillsCard from "../components/WebSkillsCard";

export default function Skill({ skills }) {
  return (
    <section id="skills">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">Expertise</div>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">A curated stack of tools and technologies I use to design, build, deploy, and improve modern digital products.</p>
        </FadeUp>
        <WebSkillsCard skills={skills} />
      </div>
    </section>
  );
}
