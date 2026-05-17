import FadeUp from "./FadeUp";

export default function ExperienceCard({ experiences = [] }) {
  return (
    <FadeUp className="timeline">
      {experiences.map((experience) => (
        <div key={`${experience.role}-${experience.period}`} className="exp-card">
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
          {experience.testimonialFile ? (
            <a
              href={experience.testimonialFile.href}
              target="_blank"
              rel="noreferrer"
              className="exp-testimonial-file"
            >
              <span className="exp-testimonial-file-label">{experience.testimonialFile.label}</span>
              <span className="exp-testimonial-file-action">{experience.testimonialFile.action}</span>
            </a>
          ) : null}
        </div>
      ))}
    </FadeUp>
  );
}
