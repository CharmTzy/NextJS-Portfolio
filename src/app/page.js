"use client";
import Navbar from "./components/NavBar";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Skill from "./pages/Skill";
import {useCurrentTheme} from "./hooks/useCurrentTheme";
import "./globals.css";

export default function Home() {
  const {currentTheme} = useCurrentTheme();
  if (!currentTheme) return null;

  return (
    <main className={`flex min-h-screen flex-col overflow-x-hidden ${currentTheme === "dark" ? "bg-gradient-to-br from-[#201926] via-[#161c22] to-[#17292D]" : "bg-gradient-to-br from-purple-100 via-blue-100 to-green-100"} `}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Navbar />

      <div>
        {/* Welcome Section */}
        <section id="welcome" className="w-full">
          <Welcome />
        </section>

        {/* About Section */}
        <section id="about" className="w-full lg:mt-20 lg:pt-24">
          <About />
        </section>

        <section id="skill" className="w-full lg:mt-20 lg:pt-24">
          <Skill/>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <a target="_blank" href="https://www.buymeacoffee.com/redx04" className={`flex items-center px-4 py-2 text-white border border-transparent rounded-full shadow-md transition-all hover:underline hover:shadow-lg hover:opacity-85 bg-amber-300`}>
          <img className="justify-center items-center" src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" />
        </a>
      </div>
    </main>
  );
}
