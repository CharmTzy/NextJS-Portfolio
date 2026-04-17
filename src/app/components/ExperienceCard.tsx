import FadeUp from "./FadeUp";

export default function ExperienceCard({ experiences = [] }) {
  return (
    <FadeUp className="experience-table">
      {experiences.map((experience) => (
        <div key={`${experience.role}-${experience.period}`} className="exp-row">
          <div className="exp-period">{experience.period}</div>
          <div className="exp-main">
            <div className="exp-role">{experience.role}</div>
            {experience.companyUrl ? (
              <a href={experience.companyUrl} target="_blank" rel="noreferrer" className="exp-company">
                ↗ {experience.company}
              </a>
            ) : (
              <div className="exp-company">{experience.company}</div>
            )}
            <div className="exp-desc">{experience.description}</div>
          </div>
          <div className="exp-techs">
            {experience.techs.map((tech) => (
              <span key={`${experience.role}-${tech.label}`} className="tag">
                {tech.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </FadeUp>
  );
}
