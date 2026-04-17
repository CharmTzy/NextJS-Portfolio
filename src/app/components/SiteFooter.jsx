export default function SiteFooter({ personalInfo }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div>© {year} {personalInfo.name}</div>
      <div>{personalInfo.location} · Built with Next.js</div>
    </footer>
  );
}
