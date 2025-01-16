"use client";
import { useCurrentTheme } from "../hooks/useCurrentTheme";
import { useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";

const skills = [
  {
    name: "React",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    name: "JavaScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
  },
  {
    name: "TypeScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
  },
  {
    name: "Node.js",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
  },
  {
    name: "MongoDB",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
  },
  {
    name: "Firebase",
    logo: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  },
  {
    name: "Next.js",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
  },
  {
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  },
  {
    name: "React Native",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
];

export default function SkillSlideshowBox() {
  const { currentTheme } = useCurrentTheme();
  const trackRef = useRef(null);
  const { ref, isInView } = useInView(0.2);

  useEffect(() => {
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const trackElement = trackRef.current;

    const scrollInterval = setInterval(() => {
      scrollAmount -= scrollSpeed;
      if (trackElement) {
        trackElement.style.transform = `translateX(${scrollAmount}px)`;
        const totalScrollWidth = trackElement.scrollWidth / 2;

        if (Math.abs(scrollAmount) >= totalScrollWidth) {
          scrollAmount = 0;
        }
      }
    }, 16);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div ref={ref} className={`card-container ${currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} ${isInView ? "animate-slide-up" : "opacity-0"} shadow-lg rounded-lg`} style={{ width: "50%" }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Web Development</h1>
      <div className="slideshow-container">
        <div className="slideshow-track" ref={trackRef}>
          {skills.concat(skills).map((skill, index) => (
            <div key={index} className="skill-slide">
              <img src={skill.logo} alt={`${skill.name} logo`} className="h-16 w-16 object-contain" />
              <p className="text-sm mt-2">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slideshow-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .slideshow-track {
          display: flex;
          width: calc(200%);
          animation: none;
        }
        .skill-slide {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 120px;
        }
      `}</style>
    </div>
  );
}
