import FadeUp from "../components/FadeUp";
import ContactSection from "../components/ContactSection";

export default function Contact({ contactLinks, intro, email }) {
  return (
    <section id="contact">
      <div className="section-wrap">
        <FadeUp className="section-header">
          <div className="section-label">(04) Contact</div>
          <h2 className="section-title">
            Let&apos;s make something <em>good</em>
          </h2>
        </FadeUp>
        <ContactSection links={contactLinks} intro={intro} email={email} />
      </div>
    </section>
  );
}
