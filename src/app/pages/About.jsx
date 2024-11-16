"use client";
import ResumeCard from "../components/ResumeCard";
import MapCard from "../components/MapCard";
import ExperienceCard from "../components/ExperienceCard";
import AboutMeCard from "../components/AboutMeCard";
import {Inter} from "next/font/google";
const inter = Inter({subsets: ["latin"]});

export default function About() {
  return (
    <div className={`flex flex-col items-center min-h-screen px-8 pt-16 ${inter.className}`}>
      {/* Heading */}
      <div className="flex items-center mb-12 w-full ml-28 lg:w-10/12">
        <h1 className="text-4xl font-bold flex items-center space-x-2">
          <span className="flex items-center bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9] bg-clip-text text-transparent">
            <span>{"</"}</span>
            <span>About</span>
            <span>Me</span>
            <span>{">"}</span>
          </span>
        </h1>
        <div className="w-16 mt-2 ml-2 h-[1px] bg-gradient-to-r from-[#8678f9] via-[#b2a8fd] to-[#41e4fd]" />
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-6xl space-y-8 pb-20">
        <div className="w-full">
          <AboutMeCard />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-8">
            <ResumeCard />
            <MapCard />
          </div>

          {/* Right Column */}
          <div className="col-span-1 md:col-span-2">
            <ExperienceCard />
          </div>
        </div>
      </div>
    </div>
  );
}
