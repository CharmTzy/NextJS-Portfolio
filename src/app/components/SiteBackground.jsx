"use client";

import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Background grid + dot that smoothly walks grid cells inside the empty
 * column to the right of the hero name. The dot eases between adjacent
 * grid intersections, pausing briefly at each one, so the motion feels
 * organic rather than jumpy.
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
    const GAP_FROM_NAME = 16;
    const MOVE_DURATION = 700;
    const PAUSE_DURATION = 420;

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
        return { left: w * 0.58, right: w - EDGE_MARGIN, top: EDGE_MARGIN, bottom: Math.min(h - EDGE_MARGIN, h * 0.75) };
      }

      const r = measureTextRect(anchor);
      return {
        left: r.right + GAP_FROM_NAME,
        right: w - EDGE_MARGIN,
        top: Math.max(EDGE_MARGIN, r.top - gridSize * 0.6),
        bottom: Math.min(window.innerHeight - EDGE_MARGIN, r.bottom + gridSize * 0.6),
      };
    };

    const snapGrid = (area) => ({
      startCol: Math.ceil(area.left / gridSize),
      endCol: Math.floor(area.right / gridSize),
      startRow: Math.ceil(area.top / gridSize),
      endRow: Math.floor(area.bottom / gridSize),
    });

    const heroVisible = () => window.scrollY < window.innerHeight * 0.9;

    const setDot = (x, y, visible) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", visible ? "1" : "0");
    };

    let current = null;
    let target = null;
    let phaseStart = 0;
    let phase = "move";
    let lastDir = null;

    const cellToXY = (cell) => ({ x: cell.col * gridSize, y: cell.row * gridSize });

    const pickAnyCell = () => {
      const area = getPlayArea();
      const g = snapGrid(area);
      if (g.endCol < g.startCol || g.endRow < g.startRow) return null;
      return { col: randInt(g.startCol, g.endCol), row: randInt(g.startRow, g.endRow) };
    };

    const pickNeighbor = (from) => {
      const area = getPlayArea();
      const g = snapGrid(area);
      if (g.endCol < g.startCol || g.endRow < g.startRow) return null;

      const allDirs = [
        { dc: 1, dr: 0, d: "r" },
        { dc: -1, dr: 0, d: "l" },
        { dc: 0, dr: 1, d: "d" },
        { dc: 0, dr: -1, d: "u" },
        { dc: 1, dr: 1, d: "dr" },
        { dc: 1, dr: -1, d: "ur" },
        { dc: -1, dr: 1, d: "dl" },
        { dc: -1, dr: -1, d: "ul" },
      ];

      const options = allDirs
        .map(({ dc, dr, d }) => ({ cell: { col: from.col + dc, row: from.row + dr }, d }))
        .filter(({ cell }) => cell.col >= g.startCol && cell.col <= g.endCol && cell.row >= g.startRow && cell.row <= g.endRow);

      if (!options.length) return null;

      const preferred = lastDir ? options.filter((o) => o.d === lastDir) : [];
      const keepChance = 0.55;
      const pool = preferred.length && Math.random() < keepChance ? preferred : options;
      const pick = pool[randInt(0, pool.length - 1)];
      lastDir = pick.d;
      return pick.cell;
    };

    current = pickAnyCell();
    if (!current) current = { col: 12, row: 5 };
    target = pickNeighbor(current) || current;
    phaseStart = performance.now();
    phase = "move";

    const tick = () => {
      gridSize = getGridSize();

      if (!heroVisible()) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      const now = performance.now();
      const elapsed = now - phaseStart;

      if (phase === "move") {
        const t = Math.min(1, elapsed / MOVE_DURATION);
        const e = easeInOutCubic(t);
        const a = cellToXY(current);
        const b = cellToXY(target);
        const x = a.x + (b.x - a.x) * e;
        const y = a.y + (b.y - a.y) * e;
        setDot(x, y, true);

        if (t >= 1) {
          current = target;
          phase = "pause";
          phaseStart = now;
        }
      } else {
        const a = cellToXY(current);
        setDot(a.x, a.y, true);
        if (elapsed >= PAUSE_DURATION) {
          const next = pickNeighbor(current);
          if (next) {
            target = next;
          } else {
            const any = pickAnyCell();
            if (any) target = any;
          }
          phase = "move";
          phaseStart = now;
        }
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 32);

    const onResize = () => {
      gridSize = getGridSize();
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", tick, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", tick);
    };
  }, [animateDot, anchorSelector]);

  return <div ref={bgRef} className="site-background" aria-hidden="true" />;
}
