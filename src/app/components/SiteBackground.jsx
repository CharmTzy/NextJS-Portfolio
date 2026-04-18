"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + animated dot that continuously travels around the
 * viewport perimeter (outside the content column) so it never crosses
 * the hero text or other words.
 */
export default function SiteBackground({
  animateDot = false,
  avoidSelector = ".hero-inner, .hero-eyebrow, .hero-name, .hero-role-row, .hero-tagline, .hero-actions, h1, h2, p",
} = {}) {
  const bgRef = useRef(null);

  useEffect(() => {
    if (!animateDot) return;

    const bg = bgRef.current;
    if (!bg) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) return;

    let progress = Math.random();
    const DOT_RADIUS = 12;
    const MARGIN = 28;
    const SPEED = 0.0015;
    const TICK_MS = 32;

    let avoidRects = [];
    const PADDING = 16;

    const refreshAvoidRects = () => {
      const els = document.querySelectorAll(avoidSelector);
      const rects = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        if (r.bottom < -50 || r.top > window.innerHeight + 50) continue;
        rects.push({
          left: r.left - PADDING,
          top: r.top - PADDING,
          right: r.right + PADDING,
          bottom: r.bottom + PADDING,
        });
      }
      avoidRects = rects;
    };

    const setDot = (x, y) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", "1");
    };

    // Map progress [0,1) to a point on the perimeter rectangle.
    const perimeterPoint = (p) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const left = MARGIN;
      const right = w - MARGIN;
      const top = MARGIN;
      const bottom = h - MARGIN;
      const width = right - left;
      const height = bottom - top;
      const total = 2 * (width + height);
      const d = ((p % 1) + 1) % 1 * total;

      if (d < width) return { x: left + d, y: top };
      if (d < width + height) return { x: right, y: top + (d - width) };
      if (d < 2 * width + height) return { x: right - (d - width - height), y: bottom };
      return { x: left, y: bottom - (d - 2 * width - height) };
    };

    const insideAnyRect = (x, y) => {
      for (const r of avoidRects) {
        if (x + DOT_RADIUS >= r.left && x - DOT_RADIUS <= r.right && y + DOT_RADIUS >= r.top && y - DOT_RADIUS <= r.bottom) {
          return true;
        }
      }
      return false;
    };

    let tickCounter = 0;

    const tick = () => {
      tickCounter += 1;
      if (tickCounter % 8 === 0) refreshAvoidRects();

      progress += SPEED;
      if (progress >= 1) progress -= 1;

      let p = progress;
      let pt = perimeterPoint(p);
      // If current point happens to overlap content (rare on a proper
      // perimeter path, but possible if a section extends to the edge),
      // step forward along the perimeter until we find a clear spot.
      for (let i = 0; i < 40; i += 1) {
        if (!insideAnyRect(pt.x, pt.y)) break;
        p += 0.01;
        pt = perimeterPoint(p);
      }
      progress = p;

      setDot(pt.x, pt.y);
    };

    refreshAvoidRects();
    tick();
    const intervalId = window.setInterval(tick, TICK_MS);

    const onResize = () => refreshAvoidRects();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [animateDot, avoidSelector]);

  return <div ref={bgRef} className="site-background" aria-hidden="true" />;
}
