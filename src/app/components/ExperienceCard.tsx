"use client";
import {useCurrentTheme} from "../hooks/useCurrentTheme";

export default function ExperienceCard() {
  const {currentTheme} = useCurrentTheme();

  return (
    <div className={`rounded-3xl p-4 sm:p-6 shadow-sm ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="mb-4">
        <div className={`text-sm ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>6 YEARS OF</div>
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
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm hover:text-gray-500`} // Styled as plain text
                  style={{textDecoration: "none"}}
                >
                  {company}
                </a>
              ) : (
                <div className={`text-sm ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{company}</div>
              )}
            </div>
            <div className={`text-sm ${currentTheme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{period}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
