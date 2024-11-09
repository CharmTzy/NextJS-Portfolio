"use client";
import Image from "next/image";
import {Inter} from "next/font/google";
import { useCurrentTheme } from "../hooks/useCurrentTheme";

// Load the Inter font
const inter = Inter({subsets: ["latin"]});

export default function ProfileCard() {
  const {currentTheme} = useCurrentTheme(); // Use the custom hook

  return (
    <div className={`flex items-center justify-center min-h-screen ${currentTheme === "dark" ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black" : "bg-gradient-to-br from-purple-100 via-blue-100 to-green-100"} p-8 pt-24 ${inter.className}`}>
      {/* Main Profile Card */}
      <div className={`flex flex-col lg:flex-row items-center ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-3xl p-8 sm:p-12 shadow-lg max-w-4xl w-full animate-slide-up`}>
        {/* Profile Image */}
        <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-12 lg:relative lg:-top-20">
          <Image src="/profile-pic.jpeg" alt="Avatar" width={120} height={120} className="rounded-full object-cover lg:w-[180px] lg:h-[180px]" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Greeting Text */}
          <span className="text-lg lg:text-3xl font-mono mb-2">
            {Array.from("Helloworld I'm").map((letter, index) => (
              <span key={index} className="hover:text-[#41e4fd] transition-colors">
                {letter}
              </span>
            ))}
          </span>

          {/* Name with Gradient */}
          <h1 className="text-4xl lg:text-6xl font-mono font-bold mb-2">
            <span className={`block mt-4 text-transparent bg-clip-text bg-[200%_auto] ${currentTheme === "dark" ? "bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9]" : "bg-gradient-to-r from-[#41e4fd] via-[#b2a8fd] to-[#8678f9]"} animate-text-gradient`}>
              {Array.from("WAI YAN.").map((letter, index) => (
                <span key={index} className="hover:text-[#41e4fd] transition-colors">
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          {/* Job Title */}
          <h2 className="text-4xl lg:text-5xl font-mono font-bold mb-4">
            {Array.from("Fullstack Engineer").map((letter, index) => (
              <span key={index} className="hover:text-[#41e4fd] transition-colors">
                {letter}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className={`mt-2 text-base lg:text-lg ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} max-w-xl`}>Web Developer with experience in Frontend Web Designs. I ❤️ fun Web UI, collaboration, and making project ideas.</p>
          <p className={`mt-2 text-base lg:text-lg ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"} max-w-xl`}>I value simple content structure, clean design patterns, and thoughtful interactions.</p>

          {/* Call to Action */}
          <button className={`mt-6 ${currentTheme === "dark" ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white" : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"} font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform`}>Let’s Talk!</button>
        </div>
      </div>
    </div>
  );
}
