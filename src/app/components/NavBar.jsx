"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  FileText,
  Home,
  Mail,
  MoonStar,
  Send,
  SunMedium,
} from "lucide-react";
import { navigationContent } from "../data/site-content";
import { OPEN_RESUME_VIEWER_EVENT } from "../lib/site-events";
import ResumeViewer from "./ResumeViewer";

const navItems = navigationContent.items;

const navIcons = {
  Skills: Code2,
  Experience: BriefcaseBusiness,
  Projects: FolderKanban,
  Contact: Mail,
};

const navClasses = {
  Skills: "skills",
  Experience: "experience",
  Projects: "projects",
  Contact: "contact",
};

export default function Navbar({ logo, ctaHref = navigationContent.ctaHref }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeMinimized, setResumeMinimized] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);

    if (!isHomePage) {
      setActiveHash("");
      return undefined;
    }

    const handleScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.36;
      const sections = navItems
        .filter((item) => item.sectionId)
        .map((item) => document.getElementById(item.sectionId))
        .filter(Boolean);

      const current = sections.find((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        return marker >= top && marker < bottom;
      });

      setActiveHash(current?.id ? `#${current.id}` : "");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    const handleResumeRequest = () => {
      setResumeOpen(true);
      setResumeMinimized(false);
    };

    window.addEventListener(OPEN_RESUME_VIEWER_EVENT, handleResumeRequest);
    return () => window.removeEventListener(OPEN_RESUME_VIEWER_EVENT, handleResumeRequest);
  }, []);

  const currentTheme = mounted ? theme || "dark" : "dark";

  const getHref = (item) => {
    if (isHomePage && item.sectionId) return `#${item.sectionId}`;
    return item.href;
  };

  const isActive = (item) => {
    if (item.label === "Projects" && pathname.startsWith("/projects/")) return true;
    return isHomePage && item.sectionId ? activeHash === `#${item.sectionId}` : pathname === item.href;
  };

  const handleCta = () => {
    if (isHomePage && ctaHref.startsWith("#")) {
      document.querySelector(ctaHref)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.location.href = ctaHref;
  };

  const handleHome = (event) => {
    if (!isHomePage) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("hero")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const openResume = () => {
    setResumeOpen(true);
    setResumeMinimized(false);
  };

  const closeResume = () => {
    setResumeOpen(false);
    setResumeMinimized(false);
  };

  return (
    <>
      <nav className="dock-nav" aria-label="Primary navigation">
        <ul className="dock-list">
        <li>
          <Link
            href={isHomePage ? "#hero" : "/"}
            className={`dock-item dock-item--home${isHomePage && !activeHash ? " active" : ""}`}
            aria-label={`${logo} home`}
            aria-current={isHomePage && !activeHash ? "page" : undefined}
            onClick={handleHome}
          >
            <Home aria-hidden="true" />
            <span className="dock-tooltip">{logo}</span>
            <span className="dock-active-dot" aria-hidden="true" />
          </Link>
        </li>

        {navItems.map((item) => {
          const Icon = navIcons[item.label] || Code2;
          const active = isActive(item);

          return (
            <li key={`${item.label}-${item.href}`}>
              <Link
                href={getHref(item)}
                className={`dock-item dock-item--${navClasses[item.label] || "default"}${active ? " active" : ""}`}
                aria-label={item.label}
                aria-current={active ? "location" : undefined}
              >
                <Icon aria-hidden="true" />
                <span className="dock-tooltip">{item.label}</span>
                <span className="dock-active-dot" aria-hidden="true" />
              </Link>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className={`dock-item dock-item--resume${resumeOpen ? " active" : ""}`}
            aria-label={navigationContent.resumeLabel}
            onClick={openResume}
          >
            <FileText aria-hidden="true" />
            <span className="dock-tooltip">
              {resumeMinimized ? navigationContent.restoreResumeLabel : navigationContent.resumeLabel}
            </span>
            <span className="dock-active-dot" aria-hidden="true" />
          </button>
        </li>

        <li className="dock-divider" aria-hidden="true" />

        <li>
          <button
            type="button"
            className="dock-item dock-item--theme"
            aria-label={navigationContent.themeToggleLabel}
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          >
            {currentTheme === "dark" ? <SunMedium aria-hidden="true" /> : <MoonStar aria-hidden="true" />}
            <span className="dock-tooltip">{currentTheme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className="dock-item dock-item--hire"
            aria-label={navigationContent.ctaLabel}
            onClick={handleCta}
          >
            <Send aria-hidden="true" />
            <span className="dock-tooltip">{navigationContent.ctaLabel}</span>
          </button>
        </li>
        </ul>
      </nav>

      <ResumeViewer
        open={resumeOpen && !resumeMinimized}
        resumeUrl={navigationContent.resumeHref}
        title={navigationContent.resumeTitle}
        onClose={closeResume}
        onMinimize={() => setResumeMinimized(true)}
      />
    </>
  );
}
