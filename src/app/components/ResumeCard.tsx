import {Download, Eye} from "lucide-react";

export default function ResumeCard() {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className="text-xs sm:text-sm text-gray-500">2024 CV</div>
          <div className="font-semibold text-base sm:text-lg">RESUME</div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-100">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-gray-100">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
