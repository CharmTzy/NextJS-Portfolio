"use client";
import Link from "next/link";
import React, {useState} from "react";
import {Bars3Icon, XMarkIcon, CogIcon, SunIcon, MoonIcon} from "@heroicons/react/24/solid";
import {useCurrentTheme} from "../hooks/useCurrentTheme";

const navLinks = [
  {title: "Home", path: "#home"},
  {title: "AboutMe", path: "#about"},
  {title: "Skills", path: "#skills"},
  {title: "Projects", path: "#projects"},
];

const Navbar = ({className}) => {
  const {currentTheme, toggleTheme} = useCurrentTheme();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  if (!currentTheme) return null;
  const getIcon = () => {
    if (currentTheme === "light") {
      return (
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
      );
    } else {
      return (
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
    }
  };

  return (
    <div className={`${navbarOpen ? "overflow-hidden max-h-screen" : ""}`}>
      <nav className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-10 bg-white bg-opacity-80 rounded-full border border-gray-300 px-6 py-2 w-[95%] max-w-screen-xl shadow-lg lg:px-24 lg:py-6 ${className}`}>
        <div className="flex items-center justify-between w-full">
          {/* Icons on the left side */}
          <div className="flex items-center space-x-4">
            {/* Settings (Cog) Icon */}
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="text-black hover:text-gray-700 focus:outline-none">
              <CogIcon className={`h-8 w-8 transition-transform duration-500 ${settingsOpen ? "rotate-90" : "rotate-0"}`} />
            </button>

            {/* Theme Toggle Icon - only appears when settingsOpen is true */}
            <div className={`transition-all duration-500 transform ${settingsOpen ? "translate-x-12 opacity-100" : "opacity-0"}`}>{getIcon()}</div>
          </div>

          {/* Hamburger icon for mobile */}
          <div className="lg:hidden">
            <button onClick={() => setNavbarOpen(!navbarOpen)} className="text-black hover:text-gray-700 focus:outline-none">
              {navbarOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
            </button>
          </div>

          {/* Navigation Links */}
          <ul className={`hidden lg:flex space-x-12 text-lg font-medium`}>
            {navLinks.map((link, index) => (
              <li key={index} className="relative group flex items-center">
                <span className="absolute left-[-18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block w-2 h-2 mb-0.5 bg-black rounded-full"></span>
                </span>
                <Link href={link.path} className="text-black hover:text-gray-700 transition-all duration-300 font-mono">
                  {`</${link.title}>`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className={`fixed top-0 left-0 w-full h-full bg-black text-white z-20 transform ${navbarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <button onClick={() => setNavbarOpen(false)} className="absolute top-8 right-8 text-white focus:outline-none">
          <XMarkIcon className="h-8 w-8" />
        </button>
        <ul className="flex flex-col items-center justify-center space-y-12 h-full text-2xl font-mono">
          {navLinks.map((link, index) => (
            <li key={index} className="flex items-center">
              <Link href={link.path} onClick={() => setNavbarOpen(false)} className="hover:text-gray-300 transition-colors">
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
