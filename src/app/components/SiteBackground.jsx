"use client";

import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickNewDirection(currentDir) {
  // Pick a new direction different from current.
  const candidates = [0, 1, 2, 3].filter((d) => d !== currentDir);
  return candidates[randInt(0, candidates.length - 1)];
}

/**
 * Background grid + animated dot.
 *
 * `animateDot` is intentionally opt-in so other pages keep the clean grid
 * without the moving dot.
 */
export default function SiteBackground({ animateDot = false, avoidSelector = ".hero-inner" } = {}) {
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

    const getBounds = (gridSize) => {
      const cols = Math.max(1, Math.floor(window.innerWidth / gridSize));
      const rows = Math.max(1, Math.floor(window.innerHeight / gridSize));
      return { cols, rows };
    };

    const heroActive = () => {
      // Dot should only show on the first screen (hero with the name).
      return window.scrollY < window.innerHeight * 0.9;
    };

    let gridSize = getGridSize();
    let { cols, rows } = getBounds(gridSize);

    const getAvoidRect = () => {
      const elements = Array.from(document.querySelectorAll(avoidSelector));
      if (!elements.length) return null;

      const pad = Math.max(140, Math.round(gridSize * 1.8));

      let left = Number.POSITIVE_INFINITY;
      let top = Number.POSITIVE_INFINITY;
      let right = Number.NEGATIVE_INFINITY;
      let bottom = Number.NEGATIVE_INFINITY;

      for (const el of elements) {
        const r = el.getBoundingClientRect();
        left = Math.min(left, r.left);
        top = Math.min(top, r.top);
        right = Math.max(right, r.right);
        bottom = Math.max(bottom, r.bottom);
      }

      return {
        left: left - pad,
        top: top - pad,
        right: right + pad,
        bottom: bottom + pad,
      };
    };

    const inAvoidRect = (x, y, avoidRect) => {
      if (!avoidRect) return false;
      return x >= avoidRect.left && x <= avoidRect.right && y >= avoidRect.top && y <= avoidRect.bottom;
    };

    const setDot = (x, y, visible) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", visible ? "1" : "0");
    };

    const chooseStart = () => {
      gridSize = getGridSize();
      ({ cols, rows } = getBounds(gridSize));
      const avoidRect = getAvoidRect();

      const minCol = 1;
      const maxCol = Math.max(minCol, cols - 2);
      const minRow = 1;
      const maxRow = Math.max(minRow, rows - 2);

      for (let i = 0; i < 250; i += 1) {
        const col = randInt(minCol, maxCol);
        const row = randInt(minRow, maxRow);
        const x = col * gridSize;
        const y = row * gridSize;
        if (!inAvoidRect(x, y, avoidRect)) return { col, row };
      }

      // Fallback: bottom-right
      return { col: maxCol, row: maxRow };
    };

    let pos = chooseStart();
    let dir = randInt(0, 3); // 0=r,1=d,2=l,3=u
    let runLeft = randInt(4, 10);

    const applyPos = (p, visible) => {
      const x = p.col * gridSize;
      const y = p.row * gridSize;
      setDot(x, y, visible);
    };

    applyPos(pos, heroActive());

    const step = () => {
      const visible = heroActive();
      if (!visible) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      const avoidRect = getAvoidRect();

      // If viewport resized, keep within bounds.
      // (We also handle in the resize handler, but this is extra safety.)
      gridSize = getGridSize();
      ({ cols, rows } = getBounds(gridSize));
      pos.col = clamp(pos.col, 1, Math.max(1, cols - 2));
      pos.row = clamp(pos.row, 1, Math.max(1, rows - 2));

      const dx = dir === 0 ? 1 : dir === 2 ? -1 : 0;
      const dy = dir === 1 ? 1 : dir === 3 ? -1 : 0;

      const attemptMove = () => {
        const next = {
          col: clamp(pos.col + dx, 1, Math.max(1, cols - 2)),
          row: clamp(pos.row + dy, 1, Math.max(1, rows - 2)),
        };

        const x = next.col * gridSize;
        const y = next.row * gridSize;
        if (inAvoidRect(x, y, avoidRect)) return null;
        return next;
      };

      let next = null;

      // Try current direction first.
      if (runLeft > 0) next = attemptMove();

      // If blocked or run ended, pick a new direction until we find a valid step.
      if (!next) {
        for (let i = 0; i < 8; i += 1) {
          dir = pickNewDirection(dir);
          runLeft = randInt(3, 9);

          const ndx = dir === 0 ? 1 : dir === 2 ? -1 : 0;
          const ndy = dir === 1 ? 1 : dir === 3 ? -1 : 0;

          const candidate = {
            col: clamp(pos.col + ndx, 1, Math.max(1, cols - 2)),
            row: clamp(pos.row + ndy, 1, Math.max(1, rows - 2)),
          };
          const x = candidate.col * gridSize;
          const y = candidate.row * gridSize;
          if (!inAvoidRect(x, y, avoidRect)) {
            next = candidate;
            break;
          }
        }
      }

      if (!next) {
        // Worst case (small screens): hide dot for this tick.
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      pos = next;
      runLeft -= 1;
      applyPos(pos, true);
    };

    const intervalMs = 260;
    const intervalId = window.setInterval(step, intervalMs);

    const onResize = () => {
      gridSize = getGridSize();
      ({ cols, rows } = getBounds(gridSize));
      pos.col = clamp(pos.col, 1, Math.max(1, cols - 2));
      pos.row = clamp(pos.row, 1, Math.max(1, rows - 2));
      applyPos(pos, heroActive());
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", step, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", step);
    };
  }, [animateDot, avoidSelector]);

  return <div ref={bgRef} className="site-background" aria-hidden="true" />;
}
