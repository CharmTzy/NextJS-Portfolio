"use client";
import {Download, Eye} from "lucide-react";
import {useCurrentTheme} from "../hooks/useCurrentTheme";
import {useInView} from "../hooks/useInView";
export default function ResumeCard() {
  const {currentTheme} = useCurrentTheme();
  const {ref, isInView} = useInView(0.2);
  return (
    <div ref={ref} className={`card-container ${currentTheme === "dark" ? "card-container-dark" : "card-container-light"} ${isInView ? "animate-slide-up" : "opacity-0"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className={`text-xs sm:text-sm ${currentTheme === "dark" ? "text-gray-dark" : "text-gray-light"}`}>2024 CV</div>
          <div className="font-semibold text-base sm:text-lg">RESUME</div>
        </div>
        <div className="flex space-x-2">
          {/* Download Button */}
          <a href="/WAI%20YAN%20AUNG%20RESUME.pdf" download className={`icon-button ${currentTheme === "dark" ? "icon-button-dark" : ""}`}>
            <Download className="w-4 h-4" />
          </a>

          {/* View Button */}
          <a href="/WAI%20YAN%20AUNG%20RESUME.pdf" target="_blank" rel="noopener noreferrer" className={`icon-button ${currentTheme === "dark" ? "icon-button-dark" : ""}`}>
            <Eye className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
