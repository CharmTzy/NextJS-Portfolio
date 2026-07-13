"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + a wandering accent marker.
 *
 * The marker drifts between free grid intersections — spots where nothing
 * paints (no text, cards, images, buttons) — so it never hides behind
 * content. A timer keeps it wandering while the page is idle; scroll and
 * resize checks make it step aside when content moves over its spot, and
 * it fades out entirely when the viewport has no free space.
 */
export default function SiteBackground() {
  const bgRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    const dot = dotRef.current;
    if (!bg || !dot) return;

    const HOP_INTERVAL = 4200; // idle wander cadence (ms)
    const SAFETY_INTERVAL = 180; // scroll/resize re-check cadence (ms)
    const SAFETY_POLL = 450; // fallback cadence when no events fire (ms)
    const CLEARANCE = 36; // min gap between the dot and content (px)
    const EDGE = 48; // min gap from viewport edges (px)
    const NEAR_CELLS = 4; // idle hops stay within this many grid cells

    const PAINTED_TAGS = /^(IMG|SVG|VIDEO|CANVAS|PICTURE|IFRAME|BUTTON|INPUT|TEXTAREA|SELECT)$/;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paintCache = new WeakMap();

    let current = null;
    let visible = false;
    let hopTimer = 0;
    let safetyTimer = 0;

    const getGridSize = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue("--grid-size");
      return Number.parseFloat(value) || 64;
    };

    const paintsOwnBox = (el) => {
      let paints = paintCache.get(el);
      if (paints === undefined) {
        const s = getComputedStyle(el);
        paints =
          (s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent") ||
          s.backgroundImage !== "none" ||
          s.boxShadow !== "none" ||
          Number.parseFloat(s.borderTopWidth) > 0 ||
          Number.parseFloat(s.borderLeftWidth) > 0;
        paintCache.set(el, paints);
      }
      return paints;
    };

    const hasOwnText = (el) => {
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      }
      return false;
    };

    /** Viewport rects of everything that would visually cover the dot. */
    const getOccluderRects = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const rects = [];

      for (const el of document.body.querySelectorAll("*")) {
        if (bg.contains(el)) continue;
        if (el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
        if (!(PAINTED_TAGS.test(el.tagName) || paintsOwnBox(el) || hasOwnText(el))) continue;

        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        if (rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue;
        // Page-sized frames and backdrops are scenery, not content.
        if (rect.width >= width * 0.92 && rect.height >= height * 0.92) continue;

        rects.push(rect);
      }

      return rects;
    };

    const isFree = (x, y, rects) =>
      rects.every(
        (r) => x < r.left - CLEARANCE || x > r.right + CLEARANCE || y < r.top - CLEARANCE || y > r.bottom + CLEARANCE,
      );

    const getFreePoints = () => {
      const gridSize = getGridSize();
      const rects = getOccluderRects();
      const start = Math.ceil(EDGE / gridSize) * gridSize;
      const points = [];

      for (let x = start; x <= window.innerWidth - EDGE; x += gridSize) {
        for (let y = start; y <= window.innerHeight - EDGE; y += gridSize) {
          if (isFree(x, y, rects)) points.push({ x, y });
        }
      }

      return points;
    };

    const showAt = (point, swift) => {
      dot.classList.toggle("grid-dot--swift", Boolean(swift));
      bg.style.setProperty("--dot-x", `${point.x}px`);
      bg.style.setProperty("--dot-y", `${point.y}px`);
      bg.style.setProperty("--dot-opacity", "1");
      current = point;
      visible = true;
    };

    const hide = () => {
      bg.style.setProperty("--dot-opacity", "0");
      visible = false;
    };

    /** Idle hops wander to a nearby free intersection; fall back to any. */
    const pickTarget = (points, gridSize) => {
      let pool = points;

      if (current && visible) {
        const away = points.filter((p) => p.x !== current.x || p.y !== current.y);
        const near = away.filter(
          (p) =>
            Math.abs(p.x - current.x) <= NEAR_CELLS * gridSize &&
            Math.abs(p.y - current.y) <= NEAR_CELLS * gridSize,
        );
        pool = near.length ? near : away.length ? away : points;
      }

      return pool[Math.floor(Math.random() * pool.length)];
    };

    /**
     * forceHop → idle wander (always move).
     * Otherwise move only when the current spot is covered or gone,
     * using the quicker "swift" glide to step out of the way.
     */
    const retarget = (forceHop) => {
      const points = getFreePoints();

      if (!points.length) {
        hide();
        return;
      }

      const stillFree = current && points.some((p) => p.x === current.x && p.y === current.y);
      if (!forceHop && visible && stillFree) return;

      showAt(pickTarget(points, getGridSize()), !forceHop);
    };

    const scheduleSafetyCheck = () => {
      if (safetyTimer) return;
      safetyTimer = window.setTimeout(() => {
        safetyTimer = 0;
        retarget(false);
      }, SAFETY_INTERVAL);
    };

    const startWandering = () => {
      window.clearInterval(hopTimer);
      hopTimer = 0;
      if (!reduceMotion.matches) {
        hopTimer = window.setInterval(() => retarget(true), HOP_INTERVAL);
      }
    };

    retarget(true);
    startWandering();
    reduceMotion.addEventListener("change", startWandering);
    window.addEventListener("scroll", scheduleSafetyCheck, { passive: true });
    window.addEventListener("resize", scheduleSafetyCheck, { passive: true });
    // Content can slide over the dot without firing scroll events
    // (entrance animations, lazy images, momentum scrolling quirks),
    // so a poll backs up the listeners. It only acts when the spot is lost.
    const safetyPoll = window.setInterval(() => retarget(false), SAFETY_POLL);

    return () => {
      window.clearInterval(hopTimer);
      window.clearInterval(safetyPoll);
      window.clearTimeout(safetyTimer);
      reduceMotion.removeEventListener("change", startWandering);
      window.removeEventListener("scroll", scheduleSafetyCheck);
      window.removeEventListener("resize", scheduleSafetyCheck);
    };
  }, []);

  return (
    <div ref={bgRef} className="site-background" aria-hidden="true">
      <div ref={dotRef} className="grid-dot">
        <span className="grid-dot__ring" />
        <span className="grid-dot__ring grid-dot__ring--delayed" />
        <span className="grid-dot__core" />
      </div>
    </div>
  );
}
