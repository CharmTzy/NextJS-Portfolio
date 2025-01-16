"use client";

import { Inter } from "next/font/google";
import WebSkillCard from "../components/WebSkillsCard";
const inter = Inter({ subsets: ["latin"] });

export default function About() {
  return (
    <div className={`flex flex-col items-center min-h-screen px-8 pt-16 ${inter.className}`}>
      {/* Heading */}
      <div className="flex items-center mb-12 w-full lg:ml-28 lg:w-10/12">
        <h1 className="text-4xl font-bold flex items-center space-x-2">
          <span className="flex items-center bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9] bg-clip-text text-transparent">
            <span>{"</"}</span>
            <span>Tech Stack</span>
            <span>{">"}</span>
          </span>
        </h1>
        <div className="w-16 mt-2 ml-2 h-[1px] bg-gradient-to-r from-[#8678f9] via-[#b2a8fd] to-[#41e4fd]" />
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-6xl space-y-8 pb-20">
        <div className="w-full">
          <WebSkillCard />
        </div>
      </div>
    </div>
  );
}
