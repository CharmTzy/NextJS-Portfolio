import FadeUp from "./FadeUp";

export default function WebSkillsCard({ skills = [] }) {
  return (
    <FadeUp className="skills-table">
      {skills.map((skill) => (
        <div key={skill.title} className="skill-row">
          <div className="skill-row-label">{skill.title}</div>
          <div className="skill-row-tags">
            {skill.tags.map((tag) => (
              <span key={`${skill.title}-${tag.label}`} className="tag">
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </FadeUp>
  );
}
