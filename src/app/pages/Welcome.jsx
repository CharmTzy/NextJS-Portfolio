"use client";
import ProfileCard from "../components/ProfileCard";
import {useCurrentTheme} from "../hooks/useCurrentTheme";
import {Inter} from "next/font/google";
const inter = Inter({subsets: ["latin"]});

export default function Welcome() {
  const {currentTheme} = useCurrentTheme();
  if (!currentTheme) return null;

  return (
    <div className={`flex items-center justify-center min-h-screen ${currentTheme === "dark" ? "bg-gradient-to-br from-[#201926] via-[#161c22] to-[#17292D]" : "bg-gradient-to-br from-purple-100 via-blue-100 to-green-100"} p-8 pt-24 ${inter.className}`}>
      <ProfileCard />
    </div>
  );
}
