export default function SiteFooter({ personalInfo }) {
  return (
    <footer>
      <p>
        Designed & built by <span>{personalInfo.name}</span> · {personalInfo.role} · {personalInfo.location}
        &nbsp;·&nbsp; Made with coffee and curiosity
      </p>
    </footer>
  );
}
