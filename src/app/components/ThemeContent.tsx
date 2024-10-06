"use client";
import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";

type Theme = "day" | "night" | "winter";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({children}: {children: ReactNode}) => {
  const [theme, setTheme] = useState<Theme>("day");

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      // Correcting the sequence: day -> night -> winter
      if (prevTheme === "day") {
        return "night";
      } else if (prevTheme === "night") {
        return "winter";
      } else {
        return "day";
      }
    });
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};
