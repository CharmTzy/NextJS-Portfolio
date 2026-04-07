"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MoonStar, SunMedium } from "lucide-react";

const navItems = [
  { label: "Skills", sectionId: "skills", href: "/#skills" },
  { label: "Experience", sectionId: "experience", href: "/#experience" },
  { label: "Projects", sectionId: "projects", href: "/#projects" },
  { label: "Updates", href: "/updates" },
  { label: "Contact", sectionId: "contact", href: "/#contact" },
];

export default function Navbar({ logo, ctaHref = "#contact" }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);

    if (!isHomePage) {
      setActiveHash("");
      return undefined;
    }

    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.sectionId)
        .map((item) => document.getElementById(item.sectionId))
        .filter(Boolean);

      const current = sections.find((section) => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        return window.scrollY >= top && window.scrollY < bottom;
      });

      if (current?.id) {
        setActiveHash(`#${current.id}`);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const currentTheme = mounted ? theme || "dark" : "dark";

  const getHref = (item) => {
    if (isHomePage && item.sectionId) {
      return `#${item.sectionId}`;
    }

    return item.href;
  };

  const isActive = (item) => {
    if (item.href === "/updates") {
      return pathname === "/updates";
    }

    return isHomePage && item.sectionId ? activeHash === `#${item.sectionId}` : false;
  };

  const handleCta = () => {
    if (isHomePage && ctaHref.startsWith("#")) {
      document.querySelector(ctaHref)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.location.href = ctaHref;
  };

  return (
    <nav>
      <Link href="/" className="nav-logo">
        {logo}
      </Link>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={`${item.label}-${item.href}`}>
            <Link href={getHref(item)} className={isActive(item) ? "active" : ""}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-right">
        <button
          type="button"
          className="theme-toggle"
          title="Toggle theme"
          aria-label="Toggle theme"
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
        >
          {currentTheme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
        </button>
        <button
          type="button"
          className="nav-cta"
          onClick={handleCta}
        >
          Hire Me
        </button>
      </div>
    </nav>
  );
}
