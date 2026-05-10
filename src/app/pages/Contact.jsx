import FadeUp from "../components/FadeUp";
import ContactSection from "../components/ContactSection";
import { homePageContent } from "../data/site-content";

export default function Contact({ contactLinks, intro }) {
  const { contactSection } = homePageContent;

  return (
    <section id="contact">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">{contactSection.label}</div>
          <h2 className="section-title">{contactSection.title}</h2>
        </FadeUp>
        <ContactSection links={contactLinks} intro={intro} />
      </div>
    </section>
  );
}
