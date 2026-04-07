import ProfileCard from "../components/ProfileCard";

export default function Welcome({ personalInfo, stats }) {
  return (
    <section id="hero">
      <ProfileCard
        name={personalInfo.name}
        role={personalInfo.role}
        tagline={personalInfo.tagline}
        availability={personalInfo.availability}
        stats={stats}
        primaryHref="#projects"
        secondaryHref="#contact"
      />
    </section>
  );
}
