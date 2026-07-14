"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + a perpetually drifting accent marker.
 *
 * The marker glides continuously between free grid intersections — spots
 * where nothing paints (no text, cards, images, buttons) — steering with
 * a soft spring so it never stops, and leaving a fading trail on a canvas
 * behind it. The viewport is re-scanned twice a second so the marker can
 * slip away when content moves over its position, and it fades out
 * entirely when there is no free space.
 */
export default function SiteBackground() {
  const bgRef = useRef(null);
  const dotRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const bg = bgRef.current;
    const dot = dotRef.current;
    const canvas = trailRef.current;
    if (!bg || !dot || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SAFETY_POLL = 450; // occlusion re-scan cadence (ms)
    const SAFETY_DEBOUNCE = 160; // extra scan after scroll/resize bursts (ms)
    const CLEARANCE = 36; // min gap between the dot and content (px)
    const EDGE = 48; // min gap from viewport edges (px)
    const NEAR_CELLS = 5; // wander legs stay within this many grid cells
    const ARRIVE = 40; // retarget this early so motion never stops (px)
    const PATH_PAD = 28; // travel paths keep this margin from content (px)
    const SPRING = 3; // idle glide stiffness
    const DAMP = 3.45; // just under critical damping → soft arcs
    const EVADE_SPRING = 12; // quicker step-aside when content covers the spot
    const EVADE_DAMP = 7;
    const MAX_DT = 0.05; // clamp frame delta (s), e.g. after tab switches
    const TRAIL_FADE = 4.2; // trail dissolve rate (/s)
    const TRAIL_WIDTH = 5; // px
    const TRAIL_ALPHA = 0.4;

    const PAINTED_TAGS = /^(IMG|SVG|VIDEO|CANVAS|PICTURE|IFRAME|BUTTON|INPUT|TEXTAREA|SELECT)$/;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paintCache = new WeakMap();

    let pos = null;
    let vel = { x: 0, y: 0 };
    let target = null;
    let prev = null; // last trail point
    let lastPoints = [];
    let lastRects = [];
    let evading = false;
    let visible = false;
    let accent = "23, 184, 166";
    let rafId = 0;
    let lastTime = 0;
    let pollTimer = 0;
    let burstTimer = 0;

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

    /** All free grid intersections plus the occluder rects that shaped them. */
    const scan = () => {
      const rects = getOccluderRects();
      const gridSize = getGridSize();
      const start = Math.ceil(EDGE / gridSize) * gridSize;
      const points = [];

      for (let x = start; x <= window.innerWidth - EDGE; x += gridSize) {
        for (let y = start; y <= window.innerHeight - EDGE; y += gridSize) {
          if (isFree(x, y, rects)) points.push({ x, y });
        }
      }

      return { rects, points };
    };

    const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const nearestOf = (points, x, y) => {
      let best = points[0];
      let bestDist = Infinity;
      for (const p of points) {
        const d = (p.x - x) ** 2 + (p.y - y) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = p;
        }
      }
      return best;
    };

    /** Liang-Barsky: does segment a→b cross the rect inflated by pad? */
    const segmentHitsRect = (a, b, r, pad) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let t0 = 0;
      let t1 = 1;
      const edges = [
        [-dx, a.x - (r.left - pad)],
        [dx, r.right + pad - a.x],
        [-dy, a.y - (r.top - pad)],
        [dy, r.bottom + pad - a.y],
      ];

      for (const [p, q] of edges) {
        if (p === 0) {
          if (q < 0) return false;
        } else {
          const t = q / p;
          if (p < 0) {
            if (t > t1) return false;
            if (t > t0) t0 = t;
          } else {
            if (t < t0) return false;
            if (t < t1) t1 = t;
          }
        }
      }

      return true;
    };

    /**
     * Next wander leg: a nearby free point, preferring the current heading
     * and a travel path that does not cross content.
     */
    const pickNextTarget = (points) => {
      const gridSize = getGridSize();
      const range = NEAR_CELLS * gridSize;
      const minLeg = gridSize * 0.75;

      let candidates = points.filter((p) => {
        const dx = p.x - pos.x;
        const dy = p.y - pos.y;
        return Math.abs(dx) <= range && Math.abs(dy) <= range && Math.hypot(dx, dy) > minLeg;
      });

      if (Math.hypot(vel.x, vel.y) > 24) {
        const ahead = candidates.filter((p) => (p.x - pos.x) * vel.x + (p.y - pos.y) * vel.y > 0);
        if (ahead.length) candidates = ahead;
      }

      const clearPath = candidates.filter((p) => !lastRects.some((r) => segmentHitsRect(pos, p, r, PATH_PAD)));
      if (clearPath.length) candidates = clearPath;

      if (!candidates.length) candidates = points;
      return randomOf(candidates);
    };

    const applyTransform = () => {
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    };

    const show = () => {
      bg.style.setProperty("--dot-opacity", "1");
      visible = true;
    };

    const hide = () => {
      bg.style.setProperty("--dot-opacity", "0");
      visible = false;
    };

    /** Re-read the world: free spots, theme accent; reposition if needed. */
    const refresh = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || accent;
      const { rects, points } = scan();

      if (!points.length) {
        hide();
        return;
      }

      lastPoints = points;
      lastRects = rects;

      if (!visible) {
        // reappear in place — no streak from a stale position
        target = randomOf(points);
        pos = { ...target };
        prev = { ...target };
        vel = { x: 0, y: 0 };
        applyTransform();
        show();
        return;
      }

      if (!isFree(pos.x, pos.y, rects)) {
        evading = true;
        target = nearestOf(points, pos.x, pos.y);
      } else if (!points.some((p) => p.x === target.x && p.y === target.y)) {
        target = pickNextTarget(points);
      }

      if (reduceMotion.matches) {
        // no animation loop → place instantly
        pos = { ...target };
        vel = { x: 0, y: 0 };
        evading = false;
        applyTransform();
      }
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (pos) prev = { ...pos };
    };

    const fadeTrail = (dt) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - Math.exp(-TRAIL_FADE * dt)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    const drawTrail = () => {
      if (!prev) {
        prev = { ...pos };
        return;
      }
      if (Math.hypot(pos.x - prev.x, pos.y - prev.y) < 0.75) return;
      ctx.strokeStyle = `rgba(${accent}, ${TRAIL_ALPHA})`;
      ctx.lineWidth = TRAIL_WIDTH;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      prev = { x: pos.x, y: pos.y };
    };

    /** Spring toward the target; hand off to the next leg before stopping. */
    const step = (dt) => {
      const spring = evading ? EVADE_SPRING : SPRING;
      const damp = evading ? EVADE_DAMP : DAMP;
      vel.x += ((target.x - pos.x) * spring - vel.x * damp) * dt;
      vel.y += ((target.y - pos.y) * spring - vel.y * damp) * dt;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      const dist = Math.hypot(target.x - pos.x, target.y - pos.y);
      if (evading) {
        if (dist < 12) evading = false;
      } else if (dist < ARRIVE && lastPoints.length) {
        target = pickNextTarget(lastPoints);
      }
    };

    const tick = (time) => {
      rafId = window.requestAnimationFrame(tick);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, MAX_DT) : 0.016;
      lastTime = time;

      fadeTrail(dt);
      if (!visible || !target) return;

      step(dt);
      drawTrail();
      applyTransform();
    };

    const startLoop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
      if (!reduceMotion.matches) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const scheduleBurstCheck = () => {
      if (burstTimer) return;
      burstTimer = window.setTimeout(() => {
        burstTimer = 0;
        refresh();
      }, SAFETY_DEBOUNCE);
    };

    const onResize = () => {
      sizeCanvas();
      scheduleBurstCheck();
    };

    sizeCanvas();
    refresh();
    startLoop();
    pollTimer = window.setInterval(refresh, SAFETY_POLL);
    reduceMotion.addEventListener("change", startLoop);
    window.addEventListener("scroll", scheduleBurstCheck, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearInterval(pollTimer);
      window.clearTimeout(burstTimer);
      reduceMotion.removeEventListener("change", startLoop);
      window.removeEventListener("scroll", scheduleBurstCheck);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={bgRef} className="site-background" aria-hidden="true">
      <canvas ref={trailRef} className="grid-trail" />
      <div ref={dotRef} className="grid-dot">
        <span className="grid-dot__ring" />
        <span className="grid-dot__ring grid-dot__ring--delayed" />
        <span className="grid-dot__core" />
      </div>
    </div>
  );
}
