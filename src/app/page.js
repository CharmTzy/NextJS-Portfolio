import Navbar from "./components/NavBar";
import SiteBackground from "./components/SiteBackground";
import SiteFooter from "./components/SiteFooter";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Skill from "./pages/Skill";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { contactLinks, experiences, getPortfolioData, personalInfo, skillCards } from "./data/portfolio";

export default async function Home() {
  const githubData = await getPortfolioData();

  const heroStats = [
    { value: "2+", label: "Years Building" },
    { value: `${githubData.profile.publicRepos}+`, label: "Public Repos" },
    { value: `${githubData.projects.length}+`, label: "Projects Built" },
  ];

  return (
    <main className="site-shell">
      <SiteBackground />

      <Navbar logo={personalInfo.shortLogo} />

      <Welcome personalInfo={personalInfo} stats={heroStats} />
      <Skill skills={skillCards} />
      <About experiences={experiences} />
      <Projects projects={githubData.projects} />
      <Contact
        contactLinks={contactLinks}
        intro="Whether it's a client project, a full-time opportunity, or a collaboration — if you need someone who thinks carefully about both design and engineering, reach out and let's talk."
        email={personalInfo.email}
      />

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
