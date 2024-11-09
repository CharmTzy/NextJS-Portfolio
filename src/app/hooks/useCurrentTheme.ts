"use client";
// Initialize currentTheme using resolved theme on mount
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function useCurrentTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme(); // Use resolvedTheme for initial state
  const [currentTheme, setCurrentTheme] = useState(null);

  useEffect(() => {
    if (resolvedTheme) setCurrentTheme(resolvedTheme); // Set theme on mount to avoid hydration mismatch
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return { currentTheme, toggleTheme };
}
