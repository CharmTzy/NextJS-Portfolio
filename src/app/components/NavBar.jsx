// src/app/components/NavBar.jsx
"use client";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {Bars3Icon, XMarkIcon, CogIcon, SunIcon, MoonIcon} from "@heroicons/react/24/solid";
import {useCurrentTheme} from "../hooks/useCurrentTheme";

const navLinks = [
  {title: "Home", path: "#welcome"},
  {title: "AboutMe", path: "#about"},
  {title: "Skills", path: "#skills"},
  {title: "Projects", path: "#projects"},
];

const Navbar = ({className}) => {
  const {currentTheme, toggleTheme} = useCurrentTheme();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeSection, setActiveSection] = useState("#welcome");

  const getIcon = () => {
    return currentTheme === "light" ? (
      <SunIcon
        className={`h-6 w-6 transition-transform duration-500 ease-in-out cursor-pointer text-yellow-500 hover:text-yellow-600 ${isRotating ? "rotate-180" : "rotate-0"}`}
        onClick={() => {
          setIsRotating(true);
          setTimeout(() => {
            toggleTheme();
            setIsRotating(false);
          }, 500);
        }}
      />
    ) : (
      <MoonIcon
        className={`h-6 w-6 transition-transform duration-500 ease-in-out cursor-pointer text-blue-500 hover:text-blue-600 ${isRotating ? "rotate-180" : "rotate-0"}`}
        onClick={() => {
          setIsRotating(true);
          setTimeout(() => {
            toggleTheme();
            setIsRotating(false);
          }, 500);
        }}
      />
    );
  };

  useEffect(() => {
    if (!currentTheme) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      const sections = navLinks.map((link) => {
        const section = document.querySelector(link.path);
        if (section) {
          return {id: link.path, offsetTop: section.offsetTop};
        }
        return null;
      });

      const currentSection = sections.find((section) => section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + document.querySelector(section.id).offsetHeight);

      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentTheme, activeSection]);

  if (!currentTheme) {
    return <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-10 px-6 py-2 w-[95%] max-w-screen-xl lg:px-24 lg:py-6 ${className}`} />;
  }

  return (
    <div className={`${navbarOpen ? "overflow-hidden max-h-screen" : ""}`}>
      <nav
        className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-10 
          ${currentTheme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}
          bg-opacity-80 rounded-full border px-6 py-2 w-[95%] max-w-screen-xl shadow-lg lg:px-24 lg:py-6 ${className}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSettingsOpen(!settingsOpen)} className={`${currentTheme === "dark" ? "text-white" : "text-black"} hover:text-gray-500 focus:outline-none`}>
              <CogIcon className={`h-8 w-8 transition-transform duration-500 ${settingsOpen ? "rotate-90" : "rotate-0"}`} />
            </button>
            <div className={`transition-all duration-500 transform ${settingsOpen ? "translate-x-12 opacity-100" : "opacity-0"}`}>{getIcon()}</div>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setNavbarOpen(!navbarOpen)} className={`${currentTheme === "dark" ? "text-white" : "text-black"} hover:text-gray-500 focus:outline-none`}>
              {navbarOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex space-x-12 text-lg font-medium">
            {navLinks.map((link, index) => (
              <li key={index} className="relative group flex items-center">
                <span className={`absolute left-[-18px] ${activeSection === link.path ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity duration-300`}>
                  <span className={`inline-block w-2 h-2 mb-0.5 ${currentTheme === "dark" ? "bg-white" : "bg-black"} rounded-full`}></span>
                </span>
                <Link href={link.path} scroll={true} className={`${currentTheme === "dark" ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"} transition-all duration-300 font-mono`}>
                  {`</${link.title}>`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full ${currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} z-20 transform ${navbarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <button onClick={() => setNavbarOpen(false)} className="absolute top-8 right-8 focus:outline-none">
          <XMarkIcon className="h-8 w-8" />
        </button>
        <ul className="flex flex-col items-center justify-center space-y-12 h-full text-2xl font-mono">
          {navLinks.map((link, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className={`w-2 h-2 mb-0.5 rounded-full ${activeSection === link.path ? (currentTheme === "dark" ? "bg-white" : "bg-black") : "bg-transparent"}`}></span>
              <Link href={link.path} onClick={() => setNavbarOpen(false)} scroll={true} className="hover:text-gray-300 transition-colors">
                {`</${link.title}>`}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {navbarOpen && <div onClick={() => setNavbarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-10"></div>}
    </div>
  );
};

export default Navbar;
