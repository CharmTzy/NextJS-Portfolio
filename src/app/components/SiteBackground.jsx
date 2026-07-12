"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + a scroll-aware accent marker.
 * The marker snaps to grid intersections so it feels part of the layout
 * instead of floating independently from the page.
 */
export default function SiteBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const SECTION_SELECTOR = "section[id]";
    const EDGE_MARGIN = 32;
    const SECTION_COLUMNS = [0.78, 0.72, 0.84, 0.76, 0.82];

    const getGridSize = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue("--grid-size");
      return Number.parseFloat(value) || 64;
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const snapWithinGrid = (value, min, max, gridSize) => {
      const minGrid = Math.ceil(min / gridSize) * gridSize;
      const maxGrid = Math.floor(max / gridSize) * gridSize;
      const snapped = Math.round(value / gridSize) * gridSize;
      return clamp(snapped, minGrid, maxGrid);
    };

    const getActiveSection = () => {
      const sections = [...document.querySelectorAll(SECTION_SELECTOR)];
      const viewportCenter = window.innerHeight / 2;

      return sections.reduce(
        (best, section, index) => {
          const rect = section.getBoundingClientRect();
          const visibleTop = clamp(rect.top, 0, window.innerHeight);
          const visibleBottom = clamp(rect.bottom, 0, window.innerHeight);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const centerDistance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          const score = visibleHeight * 2 - centerDistance * 0.2;

          if (!best || score > best.score) {
            return { section, index, rect, score };
          }

          return best;
        },
        null,
      );
    };

    const setDot = (x, y) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", "1");
    };

    let rafId = 0;
    const updateDot = () => {
      rafId = 0;

      const gridSize = getGridSize();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const active = getActiveSection();
      const columnRatio = active ? SECTION_COLUMNS[active.index % SECTION_COLUMNS.length] : 0.78;
      const x = snapWithinGrid(width * columnRatio, EDGE_MARGIN, width - EDGE_MARGIN, gridSize);

      const sectionTop = active?.rect?.top ?? height * 0.36;
      const sectionHeight = active?.rect?.height ?? height;
      const ySeed = sectionTop + Math.min(sectionHeight, height) * 0.42;
      const y = snapWithinGrid(ySeed, EDGE_MARGIN + gridSize, height - EDGE_MARGIN, gridSize);

      setDot(x, y);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateDot);
    };

    updateDot();
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, []);

  return (
    <div ref={bgRef} className="site-background" aria-hidden="true">
      <div className="grid-dot">
        <span className="grid-dot__ring" />
        <span className="grid-dot__ring grid-dot__ring--delayed" />
        <span className="grid-dot__core" />
      </div>
    </div>
  );
}
