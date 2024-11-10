"use client";
import ResumeCard from "../components/ResumeCard";
import MapCard from "../components/MapCard";
import ExperienceCard from "../components/ExperienceCard";

import {Inter} from "next/font/google";
const inter = Inter({subsets: ["latin"]});


export default function About() {
  return (
    <div className={`flex flex-col items-center min-h-screen p-8 pt-24 ${inter.className}`}>
      {/* Heading */}
      <div className="flex items-center mb-20 w-full lg:ml-16">
        <h1 className="text-4xl font-bold flex items-center space-x-2 ml-4 lg:ml-52">
          <span className="flex items-center bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9] bg-clip-text text-transparent">
            <span>{"</"}</span>
            <span>About</span>
            <span>Me</span>
            <span>{">"}</span>
          </span>
        </h1>
        {/* Shorter line with a solid color that matches the end of the gradient */}
        <div className="w-16 mt-2 ml-2 h-[1px] bg-[#8678f9]" />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          <ResumeCard />
          <MapCard />
        </div>

        {/* Right Column */}
        <div className="col-span-1 md:col-span-2">
          <ExperienceCard />
        </div>
      </div>
    </div>
  );
}
