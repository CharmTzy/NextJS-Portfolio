"use client";

import FadeUp from "./FadeUp";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

/** Per-theme hex for Simple Icons CDN — fixes low-contrast logos on light/dark tiles. */
const ICON_THEME_HEX: Record<string, { dark: string; light: string }> = {
  nextdotjs: { dark: "FFFFFF", light: "000000" },
  vercel: { dark: "FFFFFF", light: "000000" },
  express: { dark: "FFFFFF", light: "000000" },
  github: { dark: "FFFFFF", light: "181717" },
  apple: { dark: "FFFFFF", light: "000000" },
  javascript: { dark: "FFEB3B", light: "F7DF1E" },
  react: { dark: "61DAFB", light: "087EA4" },
  reactnative: { dark: "61DAFB", light: "087EA4" },
  tailwindcss: { dark: "06B6D4", light: "0D9488" },
  stripe: { dark: "635BFF", light: "5B5FEF" },
  render: { dark: "46E3B7", light: "0D9488" },
  numpy: { dark: "5EAFD9", light: "013243" },
  pandas: { dark: "FF6A8B", light: "150458" },
  jupyter: { dark: "F37626", light: "D95E0F" },
  postman: { dark: "FF6C37", light: "E05200" },
  firebase: { dark: "FFCA28", light: "DD2C00" },
  mysql: { dark: "5FA8D3", light: "4479A1" },
  mongodb: { dark: "4AE374", light: "47A248" },
  postgresql: { dark: "6B9CF0", light: "4169E1" },
  amazonwebservices: { dark: "FFB84D", light: "FF9900" },
  nodedotjs: { dark: "7BD88F", light: "5FA04E" },
  python: { dark: "5A9FD4", light: "3776AB" },
  java: { dark: "FFB74D", light: "E65100" },
  typescript: { dark: "6CAEDD", light: "3178C6" },
  html5: { dark: "FF8A65", light: "E34F26" },
  css: { dark: "64B5F6", light: "1572B6" },
  scikitlearn: { dark: "FFB74D", light: "F7931E" },
  fastapi: { dark: "26C6DA", light: "009688" },
  windows: { dark: "4FC3F7", light: "0078D6" },
};

function resolveIconHex(iconSlug: string, fallback: string, theme: "dark" | "light") {
  const row = ICON_THEME_HEX[iconSlug];
  if (row) return row[theme];
  return fallback;
}

/** Self-hosted monochrome icons live in /public/icons; the brand color is applied via CSS mask. */
function buildIconSrc(iconSlug: string) {
  return `/icons/${iconSlug}.svg`;
}

export default function WebSkillsCard({ skills = [] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme: "dark" | "light" = mounted && resolvedTheme === "light" ? "light" : "dark";

  const filters = useMemo(() => ["All", ...skills.map((s) => s.title)], [skills]);
  const [activeFilter, setActiveFilter] = useState("All");

  const flatItems = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ label: string; iconSlug: string; color: string; groupTitle: string; iconUrl?: string }> = [];

    for (const group of skills) {
      for (const item of group.items || []) {
        const key = item.iconSlug || item.label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          label: item.label,
          iconSlug: item.iconSlug,
          color: item.color,
          groupTitle: group.title,
          iconUrl: item.iconUrl,
        });
      }
    }
    return out;
  }, [skills]);

  const visibleItems = useMemo(() => {
    if (activeFilter === "All") return flatItems;
    return flatItems.filter((item) => item.groupTitle === activeFilter);
  }, [activeFilter, flatItems]);

  return (
    <div className="skills-filter-shell">
      <div className="skills-filter-bar" role="tablist" aria-label="Filter skills">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              className={`skills-filter-chip${isActive ? " active" : ""}`}
              onClick={() => setActiveFilter(filter)}
              role="tab"
              aria-selected={isActive}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <FadeUp className="skill-tile-grid">
        {visibleItems.map((item) => {
          // Multicolor brand marks keep their own artwork; monochrome icons are
          // tinted per-theme through a CSS mask so a single SVG works on both themes.
          const logo = item.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="skill-tile-logo" src={item.iconUrl} alt="" aria-hidden="true" />
          ) : (
            <span
              className="skill-tile-logo skill-tile-logo--mask"
              style={{
                WebkitMaskImage: `url(${buildIconSrc(item.iconSlug)})`,
                maskImage: `url(${buildIconSrc(item.iconSlug)})`,
                backgroundColor: `#${resolveIconHex(item.iconSlug, item.color, theme)}`,
              }}
              aria-hidden="true"
            />
          );
          return (
            <div key={`${item.groupTitle}-${item.label}`} className="skill-tile" title={item.groupTitle}>
              {logo}
              <div className="skill-tile-label">{item.label}</div>
            </div>
          );
        })}
      </FadeUp>
    </div>
  );
}
