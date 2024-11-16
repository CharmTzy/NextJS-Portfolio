"use client";
import "../globals.css";
import Image from "next/image";
import {useCurrentTheme} from "../hooks/useCurrentTheme";
import {useInView} from "../hooks/useInView";
export default function AboutMeCard() {
  const {currentTheme} = useCurrentTheme();
  const {ref, isInView} = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center lg:items-start rounded-3xl shadow-md p-6 lg:p-8 
        ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} ${isInView ? "animate-slide-up" : "opacity-0"}`}
    >
      {/* Left Text Section */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-4">My Coding Journey</h2>
        <p className={`text-lg ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"} mb-4`}>
          Hi! I&apos;m a passionate software developer skilled in <strong>JavaScript</strong>, <strong>Python</strong>, and <strong>Java</strong>. My journey began with a curiosity for problem-solving and has led me to build real-world websites and applications. I love collaborating, learning new technologies, and contributing to open-source projects. I also participated in IoT projects and continued learning AI.
        </p>
        <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent`}>Coding is more than a skill. It&apos;s a craft that inspires me daily!</h2>
      </div>

      {/* Right Image Section */}
      <div className="flex justify-center items-center w-full lg:w-auto mt-6 lg:mt-0 lg:ml-8">
        <div className="relative flex items-center justify-center w-[240px] h-[240px] overflow-hidden rounded-xl border border-slate-800 p-[3px]">
          <div
            className="absolute inset-0 animate-rotate rounded-lg"
            style={{
              background: "conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545)",
            }}
          ></div>

          <div className={`relative z-10 flex items-center justify-center w-full h-full rounded-lg ${currentTheme === "dark" ? "bg-[#1F2937]" : "bg-white"}`}>
            <Image src="/about-me.png" alt="About Me" width={240} height={240} className="rounded-lg object-cover" priority />
          </div>
        </div>
      </div>
    </div>
  );
}
