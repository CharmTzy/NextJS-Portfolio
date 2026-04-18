"use client";

import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickNewDirection(currentDir) {
  const candidates = [0, 1, 2, 3].filter((d) => d !== currentDir);
  return candidates[randInt(0, candidates.length - 1)];
}

/**
 * Background grid + dot that walks around grid squares to the right of
 * the hero name. The dot stays inside a rectangular play area defined by
 * the name's right edge and the viewport right edge, moving one grid cell
 * per step and occasionally changing direction.
 */
export default function SiteBackground({
  animateDot = false,
  anchorSelector = ".hero-name",
} = {}) {
  const bgRef = useRef(null);

  useEffect(() => {
    if (!animateDot) return;

    const bg = bgRef.current;
    if (!bg) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    const getGridSize = () => {
      const raw = getComputedStyle(bg).getPropertyValue("--grid-size").trim();
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
    };

    let gridSize = getGridSize();
    const EDGE_MARGIN = 24;
    const GAP_FROM_NAME = 24;

    const measureTextRect = (el) => {
      try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();
        if (!rects.length) return el.getBoundingClientRect();
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for (const r of rects) {
          if (r.width < 1 || r.height < 1) continue;
          left = Math.min(left, r.left);
          right = Math.max(right, r.right);
          top = Math.min(top, r.top);
          bottom = Math.max(bottom, r.bottom);
        }
        return { left, right, top, bottom };
      } catch {
        return el.getBoundingClientRect();
      }
    };

    const getPlayArea = () => {
      const anchor = document.querySelector(anchorSelector);
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (!anchor) {
        return {
          left: w * 0.55,
          right: w - EDGE_MARGIN,
          top: EDGE_MARGIN,
          bottom: h - EDGE_MARGIN,
        };
      }

      const r = measureTextRect(anchor);
      return {
        left: r.right + GAP_FROM_NAME,
        right: w - EDGE_MARGIN,
        top: Math.max(EDGE_MARGIN, r.top - gridSize),
        bottom: Math.min(h - EDGE_MARGIN, r.bottom + gridSize),
      };
    };

    const snapGrid = (area) => {
      const startCol = Math.ceil(area.left / gridSize);
      const endCol = Math.floor(area.right / gridSize);
      const startRow = Math.ceil(area.top / gridSize);
      const endRow = Math.floor(area.bottom / gridSize);
      return { startCol, endCol, startRow, endRow };
    };

    const heroVisible = () => window.scrollY < window.innerHeight * 0.9;

    const setDot = (x, y, visible) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", visible ? "1" : "0");
    };

    const pickStart = () => {
      const area = getPlayArea();
      const { startCol, endCol, startRow, endRow } = snapGrid(area);
      if (endCol < startCol || endRow < startRow) return null;
      return {
        col: randInt(startCol, endCol),
        row: randInt(startRow, endRow),
      };
    };

    let pos = pickStart() || { col: 10, row: 4 };
    let dir = randInt(0, 3);
    let runLeft = randInt(3, 7);

    const step = () => {
      gridSize = getGridSize();
      const area = getPlayArea();
      const { startCol, endCol, startRow, endRow } = snapGrid(area);

      if (endCol < startCol || endRow < startRow || !heroVisible()) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      pos.col = clamp(pos.col, startCol, endCol);
      pos.row = clamp(pos.row, startRow, endRow);

      const attemptMove = (d) => {
        const dx = d === 0 ? 1 : d === 2 ? -1 : 0;
        const dy = d === 1 ? 1 : d === 3 ? -1 : 0;
        const nc = pos.col + dx;
        const nr = pos.row + dy;
        if (nc < startCol || nc > endCol || nr < startRow || nr > endRow) return null;
        return { col: nc, row: nr };
      };

      let next = null;
      if (runLeft > 0) next = attemptMove(dir);

      if (!next) {
        for (let i = 0; i < 6; i += 1) {
          dir = pickNewDirection(dir);
          runLeft = randInt(3, 7);
          next = attemptMove(dir);
          if (next) break;
        }
      }

      if (!next) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      pos = next;
      runLeft -= 1;
      setDot(pos.col * gridSize, pos.row * gridSize, true);
    };

    step();
    const intervalId = window.setInterval(step, 380);

    const onResize = () => {
      gridSize = getGridSize();
      step();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", step, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", step);
    };
  }, [animateDot, anchorSelector]);

  return <div ref={bgRef} className="site-background" aria-hidden="true" />;
}
