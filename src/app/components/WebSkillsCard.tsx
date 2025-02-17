"use client";

import { useCurrentTheme } from "../hooks/useCurrentTheme";
import { useInView } from "../hooks/useInView";
const skills = [
  {
    name: "HTML5",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
  },
  {
    name: "CSS3",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
  },
  {
    name: "Python",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  },
  {
    name: "Java",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  },
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
    name: "Next.js",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
  },
  {
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  },
  {
    name: "NextUI",
    logo: "https://avatars.githubusercontent.com/u/86160567?s=200&v=4",
  },
  {
    name: "Bootstrap",
    logo: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png",
  },
];

export default function WebSkillsGrid() {
  const { currentTheme } = useCurrentTheme();
  const { ref, isInView } = useInView(0.2);
  return (
    <div ref={ref} className={`card-container ${currentTheme === "dark" ? "card-container-dark" : "card-container-light"} ${isInView ? "animate-slide-up" : "opacity-0"}`}>
      <div className="flex flex-col items-center w-full px-8 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center">Full-stack Development</h1>
        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-6xl">
          {skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={skill.logo} alt={`${skill.name} logo`} className={`h-16 w-16 object-contain ${["Node.js", "Next.js"].includes(skill.name) && currentTheme === "dark" ? "bg-white rounded-lg p-2" : ""}`} />
              <p className={`text-sm mt-2 font-medium ${currentTheme === "dark" ? "text-white" : "text-gray-light"}`}>{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
