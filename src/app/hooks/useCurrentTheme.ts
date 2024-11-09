"use client";
import {useTheme} from "next-themes";
import {useState, useEffect} from "react";

export function useCurrentTheme() {
  const {setTheme, theme} = useTheme();
  const [currentTheme, setCurrentTheme] = useState(null); 

  // Toggle theme between "light" and "dark"
  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCurrentTheme(newTheme);
    console.log("Theme toggled to:", newTheme); // Log the theme change
  };

  return {currentTheme, toggleTheme};
}
