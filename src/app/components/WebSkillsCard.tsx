import FadeUp from "./FadeUp";

export default function WebSkillsCard({ skills = [] }) {
  return (
    <div className="skills-grid">
      {skills.map((skill, index) => (
        <FadeUp key={skill.title} className="skill-card" delay={index * 0.05}>
          <div className="skill-icon" style={{ background: skill.iconBackground }}>
            {skill.icon}
          </div>
          <div className="skill-name">{skill.title}</div>
          <div className="skill-desc">{skill.description}</div>
          <div className="skill-tags">
            {skill.tags.map((tag) => (
              <span key={`${skill.title}-${tag.label}`} className={`tag ${tag.variant === "default" ? "" : tag.variant}`.trim()}>
                {tag.label}
              </span>
            ))}
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
