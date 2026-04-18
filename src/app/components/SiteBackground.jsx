"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + a continuously drifting blue dot.
 *
 * The dot traces a Lissajous curve inside the empty column to the right
 * of the hero name — a smooth, never-repeating-looking figure that keeps
 * the motion gentle and always in motion (no stepping, no pausing).
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

    const EDGE_MARGIN = 24;
    const GAP_FROM_NAME = 20;
    const TARGET_FPS = 30;
    const FRAME_MS = 1000 / TARGET_FPS;

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
      const vh = Math.min(h, window.innerHeight);
      return {
        left: r.right + GAP_FROM_NAME,
        right: w - EDGE_MARGIN,
        top: Math.max(EDGE_MARGIN, r.top - 40),
        bottom: Math.min(vh - EDGE_MARGIN, r.bottom + 80),
      };
    };

    const heroVisible = () => window.scrollY < window.innerHeight * 0.9;

    const setDot = (x, y, visible) => {
      bg.style.setProperty("--dot-x", `${x}px`);
      bg.style.setProperty("--dot-y", `${y}px`);
      bg.style.setProperty("--dot-opacity", visible ? "1" : "0");
    };

    const startTime = performance.now();
    let rafId = 0;
    let lastFrameAt = 0;
    let lastArea = null;
    let pendingAreaUpdate = true;

    const updateArea = () => {
      lastArea = getPlayArea();
      pendingAreaUpdate = false;
    };

    const tick = (now) => {
      rafId = window.requestAnimationFrame(tick);

      if (now - lastFrameAt < FRAME_MS) return;
      lastFrameAt = now;

      if (!heroVisible()) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      if (pendingAreaUpdate || !lastArea) {
        updateArea();
      }

      const area = lastArea;
      if (!area || area.right <= area.left || area.bottom <= area.top) {
        bg.style.setProperty("--dot-opacity", "0");
        return;
      }

      const t = (now - startTime) / 1000;

      const cx = (area.left + area.right) / 2;
      const cy = (area.top + area.bottom) / 2;
      const rx = (area.right - area.left) / 2;
      const ry = (area.bottom - area.top) / 2;

      const fillX = 0.82;
      const fillY = 0.78;

      const x = cx + rx * fillX * Math.sin(t * 0.38);
      const y = cy + ry * fillY * Math.sin(t * 0.27 + Math.PI / 3);

      setDot(x, y, true);
    };

    const onResize = () => {
      pendingAreaUpdate = true;
    };

    const onScroll = () => {
      pendingAreaUpdate = true;
    };

    updateArea();
    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [animateDot, anchorSelector]);

  return <div ref={bgRef} className="site-background" aria-hidden="true" />;
}
