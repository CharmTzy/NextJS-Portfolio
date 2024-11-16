"use client";
import {useCurrentTheme} from "../hooks/useCurrentTheme";
import {useInView} from "../hooks/useInView";

export default function ExperienceCard() {
  const {currentTheme} = useCurrentTheme();
  const {ref, isInView} = useInView(0.2);
  return (
    <div ref={ref} className={`card-container ${currentTheme === "dark" ? "card-container-dark" : "card-container-light"} ${isInView ? "animate-slide-up" : "opacity-0"}`}>
      <div className="mb-4">
        <div className={`text-sm ${currentTheme === "dark" ? "text-gray-dark" : "text-gray-light"}`}>3 YEARS OF</div>
        <div className="text-xl sm:text-2xl font-bold">EXPERIENCE</div>
      </div>
      <div className="space-y-4">
        {[
          {title: "Freelancer", company: "", period: "2023 - Present"},
          {title: "IT Application Engineer", company: "BitCare", period: "2024 - 2025", lineThrough: true, link: "https://bitcare.sg"},
        ].map(({title, company, period, lineThrough, link}, index) => (
          <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <div className={`font-semibold text-base sm:text-lg ${lineThrough ? "line-through" : ""}`}>{title}</div>
              {company && link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className={`link-hover ${currentTheme === "dark" ? "text-gray-dark" : "text-gray-light"}`}>
                  {company}
                </a>
              ) : (
                <div className={`text-sm ${currentTheme === "dark" ? "text-gray-dark" : "text-gray-light"}`}>{company}</div>
              )}
            </div>
            <div className={`text-sm ${currentTheme === "dark" ? "text-gray-dark" : "text-gray-light"}`}>{period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
