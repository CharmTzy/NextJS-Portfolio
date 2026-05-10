import ProfileCard from "../components/ProfileCard";
import { heroContent } from "../data/site-content";

export default function Welcome({ personalInfo, stats }) {
  return (
    <section id="hero">
      <ProfileCard
        name={personalInfo.name}
        role={personalInfo.role}
        location={personalInfo.location}
        tagline={personalInfo.tagline}
        availability={personalInfo.availability}
        stats={stats}
        primaryHref={heroContent.primaryAction.href}
        primaryLabel={heroContent.primaryAction.label}
        secondaryHref={heroContent.secondaryAction.href}
        secondaryLabel={heroContent.secondaryAction.label}
      />
    </section>
  );
}
