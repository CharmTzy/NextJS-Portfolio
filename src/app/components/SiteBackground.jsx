"use client";

import { useEffect, useRef } from "react";

/**
 * Background grid + an accent marker that travels the grid lines.
 *
 * The marker runs along grid lines like a signal on a circuit trace —
 * straight runs, right-angle turns at intersections, never stopping —
 * and leaves a slowly fading glow mark on the lines it has traveled.
 * It only enters intersections and segments that are clear of painted
 * content (text, cards, images, buttons); when its position gets covered
 * or it has nowhere safe to go, it dissolves and respawns in free space.
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
    const PATH_PAD = 24; // traveled segments keep this margin from content (px)
    const SPEED = 120; // travel speed along grid lines (px/s)
    const STRAIGHT_BIAS = 0.65; // odds of continuing straight through an intersection
    const MAX_DT = 0.05; // clamp frame delta (s), e.g. after tab switches
    const TRAIL_FADE = 0.8; // mark dissolve rate (/s) — lingers a few seconds
    const FADE_CHUNK = 0.09; // apply fade in chunks so 8-bit alpha fully clears (s)

    const PAINTED_TAGS = /^(IMG|SVG|VIDEO|CANVAS|PICTURE|IFRAME|BUTTON|INPUT|TEXTAREA|SELECT)$/;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paintCache = new WeakMap();

    let pos = null; // current position, always on a grid line
    let from = null; // intersection the current segment started at
    let to = null; // intersection the marker is heading to
    let prev = null; // last trail point
    let lastRects = [];
    let visible = false;
    let accent = "23, 184, 166";
    let rafId = 0;
    let lastTime = 0;
    let fadeAcc = 0;
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

    /**
     * Where to go from the intersection `to`: an adjacent intersection
     * that is free and reachable along a clear grid segment. Prefers
     * continuing straight, avoids doubling back unless dead-ended.
     */
    const chooseNext = () => {
      const gridSize = getGridSize();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const hx = Math.sign(to.x - from.x);
      const hy = Math.sign(to.y - from.y);
      const options = [];

      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const n = { x: to.x + dx * gridSize, y: to.y + dy * gridSize };
        if (n.x < EDGE || n.x > width - EDGE || n.y < EDGE || n.y > height - EDGE) continue;
        if (!isFree(n.x, n.y, lastRects)) continue;
        if (lastRects.some((r) => segmentHitsRect(to, n, r, PATH_PAD))) continue;

        options.push({
          point: n,
          straight: dx === hx && dy === hy,
          reverse: dx === -hx && dy === -hy && (hx !== 0 || hy !== 0),
        });
      }

      if (!options.length) return null;

      const forward = options.filter((o) => !o.reverse);
      const pool = forward.length ? forward : options;
      const straight = pool.find((o) => o.straight);
      if (straight && Math.random() < STRAIGHT_BIAS) return straight.point;
      return randomOf(pool).point;
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

    /** Re-read the world: free spots, theme accent; react to coverage. */
    const refresh = () => {
      accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || accent;
      const { rects, points } = scan();
      lastRects = rects;

      if (!points.length) {
        hide();
        return;
      }

      if (!visible) {
        // respawn at a free intersection — no streak from a stale position
        const spawn = randomOf(points);
        pos = { ...spawn };
        from = { ...spawn };
        to = { ...spawn };
        prev = { ...spawn };
        applyTransform();
        show();
        return;
      }

      if (!isFree(pos.x, pos.y, rects)) {
        // content slid over the marker — dissolve; a later poll respawns it
        hide();
        return;
      }

      if (reduceMotion.matches) return;

      // path ahead compromised → double back along the same line if clear
      const aheadBlocked =
        !isFree(to.x, to.y, rects) || rects.some((r) => segmentHitsRect(pos, to, r, PATH_PAD));
      if (aheadBlocked) {
        const backClear =
          isFree(from.x, from.y, rects) && !rects.some((r) => segmentHitsRect(pos, from, r, PATH_PAD));
        if (backClear) {
          const swap = from;
          from = to;
          to = swap;
        } else {
          hide();
        }
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
      fadeAcc += dt;
      if (fadeAcc < FADE_CHUNK) return;
      const alpha = 1 - Math.exp(-TRAIL_FADE * fadeAcc);
      fadeAcc = 0;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };

    /**
     * Advance along the current segment at constant speed, carrying
     * leftover distance through intersections so motion never pauses.
     * Returns the intersections passed this frame (for crisp trail corners).
     */
    const step = (dt) => {
      let travel = SPEED * dt;
      const corners = [];
      let guard = 8;

      while (travel > 0 && guard-- > 0) {
        const remaining = Math.abs(to.x - pos.x) + Math.abs(to.y - pos.y);
        if (travel < remaining) {
          pos.x += Math.sign(to.x - pos.x) * travel;
          pos.y += Math.sign(to.y - pos.y) * travel;
          break;
        }

        travel -= remaining;
        pos.x = to.x;
        pos.y = to.y;
        corners.push({ x: to.x, y: to.y });

        const next = chooseNext();
        if (!next) {
          // boxed in — dissolve; a later poll respawns in open space
          hide();
          break;
        }
        from = to;
        to = next;
      }

      return corners;
    };

    /** Stroke this frame's movement: a soft glow pass + a bright core. */
    const drawTrail = (corners) => {
      if (!prev) {
        prev = { x: pos.x, y: pos.y };
        return;
      }
      if (!corners.length && Math.hypot(pos.x - prev.x, pos.y - prev.y) < 0.5) return;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      for (const c of corners) ctx.lineTo(c.x, c.y);
      ctx.lineTo(pos.x, pos.y);

      ctx.strokeStyle = `rgba(${accent}, 0.12)`;
      ctx.lineWidth = 9;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${accent}, 0.5)`;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      prev = { x: pos.x, y: pos.y };
    };

    const tick = (time) => {
      rafId = window.requestAnimationFrame(tick);
      const dt = lastTime ? Math.min((time - lastTime) / 1000, MAX_DT) : 0.016;
      lastTime = time;

      fadeTrail(dt);
      if (!visible) return;

      const corners = step(dt);
      drawTrail(corners);
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
