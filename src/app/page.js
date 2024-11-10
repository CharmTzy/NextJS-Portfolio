// src/app/page.js
"use client";
import Navbar from "./components/NavBar";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import {useCurrentTheme} from "./hooks/useCurrentTheme";
import {Inter} from "next/font/google";
import "./globals.css";
const inter = Inter({subsets: ["latin"]});

export default function Home() {
  const {currentTheme} = useCurrentTheme();
  if (!currentTheme) return null;

  return (
    <main className="flex min-h-screen flex-col">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Navbar className="slide-up" />

      {/* Wrapper for both sections to make them scrollable */}
      <div className={` ${currentTheme === "dark" ? "bg-gradient-to-br from-[#201926] via-[#161c22] to-[#17292D]" : "bg-gradient-to-br from-purple-100 via-blue-100 to-green-100"} `}>
        {/* Welcome Section */}
        <section id="welcome" className="slide-up w-full">
          <Welcome />
        </section>

        {/* About Section */}
        <section id="about" className="slide-up w-full lg:mt-20 lg:pt-24">
          <About />
        </section>
      </div>
    </main>
  );
}
