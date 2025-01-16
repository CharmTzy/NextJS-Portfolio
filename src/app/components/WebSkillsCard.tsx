"use client";
import { useCurrentTheme } from "../hooks/useCurrentTheme";
import { useEffect, useRef } from "react";
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
    name: "Material-UI",
    logo: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" fill="#0073E6" d="M24 5.601V1.592a.344.344 0 0 0-.514-.298l-2.64 1.508a.688.688 0 0 0-.346.597v4.009c0 .264.285.43.514.298l2.64-1.508A.688.688 0 0 0 24 5.6ZM.515 1.295l7.643 4.383a.688.688 0 0 0 .684 0l7.643-4.383a.344.344 0 0 1 .515.298v12.03c0 .235-.12.453-.319.58l-4.65 2.953 3.11 1.832c.22.13.495.127.713-.009l4.61-2.878a.344.344 0 0 0 .161-.292v-4.085c0-.254.14-.486.362-.606l2.507-1.346a.344.344 0 0 1 .506.303v7.531c0 .244-.13.47-.34.593l-7.834 4.592a.688.688 0 0 1-.71-.009l-5.953-3.681A.344.344 0 0 1 9 18.808v-3.624c0-.115.057-.222.153-.286l4.04-2.694a.688.688 0 0 0 .307-.572v-4.39a.137.137 0 0 0-.208-.117l-4.44 2.664a.688.688 0 0 1-.705.002L3.645 7.123a.138.138 0 0 0-.208.118v7.933a.344.344 0 0 1-.52.295L.5 14.019C.19 13.833 0 13.497 0 13.135V1.593c0-.264.286-.43.515-.298Z"></path>
      </svg>
    ),
  },
  {
    name: "NextUI",
    logo: "https://avatars.githubusercontent.com/u/86160567?s=200&v=4",
  },
  {
    name: "Bootstrap",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
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
    <div ref={ref} className={`card-container ${currentTheme === "dark" ? "card-container-dark" : "card-container-light"} ${isInView ? "animate-slide-up" : "opacity-0"} p-6 sm:p-8 shadow-lg rounded-lg sm:w-3/4 lg:w-1/2`}>
      <h1 className="text-2xl font-bold mb-8 text-center">Web Development</h1>
      <div className="slideshow-container w-full">
        <div className="slideshow-track" ref={trackRef}>
          {skills.concat(skills).map((skill, index) => (
            <div key={index} className="skill-slide">
              <div className="flex items-center justify-center h-16 w-16 mx-auto">{typeof skill.logo === "function" ? skill.logo() : <img src={skill.logo} alt={`${skill.name} logo`} className={`h-16 w-16 object-contain ${["Node.js", "Next.js"].includes(skill.name) && currentTheme === "dark" ? "bg-white rounded-lg p-2" : ""}`} />}</div>
              <p className="text-sm mt-2">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slideshow-container {
          position: relative;
          width: 100%;
          height: 100px;
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
          min-width: 100px;
        }
      `}</style>
    </div>
  );
}
