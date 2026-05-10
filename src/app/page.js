import Navbar from "./components/NavBar";
import SiteBackground from "./components/SiteBackground";
import SiteFooter from "./components/SiteFooter";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Skill from "./pages/Skill";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { contactLinks, experiences, getPortfolioData, personalInfo, skillCards } from "./data/portfolio";
import { heroContent, homePageContent } from "./data/site-content";

export default async function Home() {
  const githubData = await getPortfolioData();

  const heroStats = [
    { value: heroContent.stats.yearsBuildingValue, label: heroContent.stats.yearsBuildingLabel },
    { value: `${githubData.profile.publicRepos}+`, label: heroContent.stats.publicReposLabel },
    { value: `${githubData.projects.length}+`, label: heroContent.stats.projectsBuiltLabel },
  ];

  return (
    <main className="site-shell">
      <SiteBackground animateDot anchorSelector=".hero-name" />

      <Navbar logo={personalInfo.shortLogo} />

      <Welcome personalInfo={personalInfo} stats={heroStats} />
      <Skill skills={skillCards} />
      <About experiences={experiences} />
      <Projects projects={githubData.projects} />
      <Contact contactLinks={contactLinks} intro={homePageContent.contactSection.intro} />

      <SiteFooter personalInfo={personalInfo} />
    </main>
  );
}
