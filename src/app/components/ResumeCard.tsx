"use client";
import {Download, Eye} from "lucide-react";
import {useCurrentTheme} from "../hooks/useCurrentTheme";

export default function ResumeCard() {
  const {currentTheme} = useCurrentTheme();

  return (
    <div className={`rounded-3xl p-4 sm:p-6 shadow-sm ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className={`text-xs sm:text-sm ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>2024 CV</div>
          <div className="font-semibold text-base sm:text-lg">RESUME</div>
        </div>
        <div className="flex space-x-2">
          <button className={`p-2 rounded-full ${currentTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>
            <Download className="w-4 h-4" />
          </button>
          <button className={`p-2 rounded-full ${currentTheme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
