import FadeUp from "./FadeUp";

export default function ExperienceCard({ experiences = [] }) {
  return (
    <FadeUp className="timeline">
      {experiences.map((experience) => (
        <div key={`${experience.role}-${experience.period}`} className="exp-card" tabIndex={0}>
          <div className="exp-header">
            <div>
              {experience.category ? <div className="exp-category">{experience.category}</div> : null}
              <div className="exp-role">{experience.role}</div>
              {experience.companyUrl ? (
                <a href={experience.companyUrl} target="_blank" rel="noreferrer" className="exp-company">
                  {experience.company}
                </a>
              ) : (
                <div className="exp-company">{experience.company}</div>
              )}
            </div>
            <div className="exp-period">{experience.period}</div>
          </div>
          <div className="exp-desc">{experience.description}</div>
          <div className="exp-techs">
            {experience.techs.map((tech) => (
              <span
                key={`${experience.role}-${tech.label}`}
                className={`tag ${tech.variant === "default" ? "" : tech.variant}`.trim()}
              >
                {tech.label}
              </span>
            ))}
          </div>
          {experience.details?.length ? (
            <div className="exp-hover-panel" aria-label={`${experience.role} achievements and projects`}>
              {experience.details.map((section) => (
                <div key={`${experience.role}-${section.title}`} className="exp-detail-card">
                  <div className="exp-detail-title">{section.title}</div>
                  <ul className="exp-detail-list">
                    {section.items.map((item) => (
                      <li key={`${experience.role}-${section.title}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </FadeUp>
  );
}
