import FadeUp from "./FadeUp";

type SkillTag = { label: string; variant?: string };
type Skill = { title: string; tags: SkillTag[] };

export default function WebSkillsCard({ skills = [] }: { skills?: Skill[] }) {
  return (
    <FadeUp className="skills-prose">
      {skills.map((skill, i) => (
        <div key={skill.title} className="skill-row">
          <div className="skill-row-index">{String(i + 1).padStart(2, "0")}</div>
          <div className="skill-row-label">{skill.title}</div>
          <div className="skill-row-tags">
            {skill.tags.map((tag, idx) => (
              <span key={tag.label}>
                {tag.label}
                {idx < skill.tags.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      ))}
    </FadeUp>
  );
}
