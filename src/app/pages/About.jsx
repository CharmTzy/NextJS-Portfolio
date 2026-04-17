import FadeUp from "../components/FadeUp";
import ExperienceCard from "../components/ExperienceCard";

export default function About({ experiences }) {
  return (
    <section id="experience">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">(02) Experience</div>
          <h2 className="section-title">
            Where I&apos;ve <em>worked</em>
          </h2>
        </FadeUp>
        <ExperienceCard experiences={experiences} />
      </div>
    </section>
  );
}
