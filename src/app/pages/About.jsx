import FadeUp from "../components/FadeUp";
import ExperienceCard from "../components/ExperienceCard";
import { homePageContent } from "../data/site-content";

export default function About({ experiences }) {
  const { experienceSection } = homePageContent;

  return (
    <section id="experience">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">{experienceSection.label}</div>
          <h2 className="section-title">{experienceSection.title}</h2>
        </FadeUp>
        <ExperienceCard experiences={experiences} />
      </div>
    </section>
  );
}
