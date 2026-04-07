import FadeUp from "../components/FadeUp";
import WebSkillsCard from "../components/WebSkillsCard";

export default function Skill({ skills }) {
  return (
    <section id="skills">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">Expertise</div>
          <h2 className="section-title">Skills & Technologies</h2>
        </FadeUp>
        <WebSkillsCard skills={skills} />
      </div>
    </section>
  );
}
