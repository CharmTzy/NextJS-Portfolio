"use client";

import { useEffect, useRef } from "react";

const SPEED = 74;
const TRAIL_LENGTH = 92;
const EDGE_PADDING = 32;
const RUN_LENGTHS = [3, 4, 2, 5, 3, 4];
const TURN_PATTERN = [1, -1, 1, 1, -1, -1];

const CONTENT_SELECTOR = [
  "nav",
  "footer",
  "main a",
  "main button",
  "main input",
  "main textarea",
  "main select",
  "main img",
  "main video",
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main p",
  "main li",
  "main label",
  "main span",
  "main [class*='card']",
  "main [class*='tile']",
  "main [class*='badge']",
  "main [class*='title']",
  "main [class*='desc']",
  "main [class*='stat']",
  "main [class*='label']",
  "main [class*='value']",
].join(",");

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

function parseColor(value) {
  const color = value.trim();
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const normalized = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  const channels = color.match(/[\d.]+/g)?.map(Number) ?? [88, 166, 255];
  return { r: channels[0], g: channels[1], b: channels[2] };
}

function mixColor(start, end, amount, alpha) {
  const channel = (from, to) => Math.round(from + (to - from) * amount);
  return `rgba(${channel(start.r, end.r)}, ${channel(start.g, end.g)}, ${channel(start.b, end.b)}, ${alpha})`;
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Site-wide grid signal. It moves at a fixed speed and only chooses grid
 * segments that stay clear of visible content in the current viewport.
 */
export default function SignalPathAnimation() {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const orb = orbRef.current;
    if (!layer || !canvas || !orb) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visits = new Map();

    let width = window.innerWidth;
    let height = window.innerHeight;
    let gridSize = 64;
    let dpr = 1;
    let colors = { start: parseColor("#5eead4"), end: parseColor("#17b8a6") };
    let occluders = [];
    let position = null;
    let target = null;
    let directionIndex = 1;
    let runSteps = 0;
    let runTarget = RUN_LENGTHS[0];
    let turnIndex = 0;
    let trail = [];
    let trailLength = 0;
    let animationFrame = 0;
    let scanFrame = 0;
    let lastTime = 0;
    let visible = false;

    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      colors = {
        start: parseColor(styles.getPropertyValue("--signal-blue") || "#5eead4"),
        end: parseColor(styles.getPropertyValue("--signal-violet") || "#17b8a6"),
      };
      gridSize = Number.parseFloat(styles.getPropertyValue("--grid-size")) || 64;
    };

    const setVisible = (nextVisible) => {
      visible = nextVisible;
      orb.style.opacity = nextVisible ? "1" : "0";
      canvas.style.opacity = nextVisible ? "1" : "0";
    };

    const placeOrb = () => {
      if (!position) return;
      orb.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    };

    const clearTrail = () => {
      trail = [];
      trailLength = 0;
      context.clearRect(0, 0, width, height);
    };

    const sizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineCap = "round";
      context.lineJoin = "round";
      clearTrail();
    };

    const getOccluders = () => {
      const rects = [];
      for (const element of document.querySelectorAll(CONTENT_SELECTOR)) {
        if (layer.contains(element)) continue;
        const style = getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;

        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        if (rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) continue;
        if (rect.width > width * 0.96 && rect.height > height * 0.85) continue;

        rects.push(rect);
      }
      return rects;
    };

    const getContentClearance = () => {
      if (width <= 640) return 18;
      if (width <= 900) return 28;
      return 44;
    };

    const pointIsFree = (point) => {
      const clearance = getContentClearance();
      return (
        point.x >= EDGE_PADDING &&
        point.x <= width - EDGE_PADDING &&
        point.y >= EDGE_PADDING &&
        point.y <= height - EDGE_PADDING &&
        occluders.every(
          (rect) =>
            point.x < rect.left - clearance ||
            point.x > rect.right + clearance ||
            point.y < rect.top - clearance ||
            point.y > rect.bottom + clearance,
        )
      );
    };

    const segmentIsFree = (start, end) => {
      const padding = Math.max(14, getContentClearance() - 8);
      return occluders.every((rect) => {
        const left = rect.left - padding;
        const right = rect.right + padding;
        const top = rect.top - padding;
        const bottom = rect.bottom + padding;

        if (start.y === end.y) {
          const minX = Math.min(start.x, end.x);
          const maxX = Math.max(start.x, end.x);
          return start.y < top || start.y > bottom || maxX < left || minX > right;
        }

        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        return start.x < left || start.x > right || maxY < top || minY > bottom;
      });
    };

    const gridKey = (point) => `${Math.round(point.x / gridSize)}:${Math.round(point.y / gridSize)}`;

    const viewportMoves = (from) =>
      DIRECTIONS.map((direction, index) => ({
        index,
        point: {
          x: from.x + direction.x * gridSize,
          y: from.y + direction.y * gridSize,
        },
      })).filter(
        ({ point }) =>
          point.x >= EDGE_PADDING &&
          point.x <= width - EDGE_PADDING &&
          point.y >= EDGE_PADDING &&
          point.y <= height - EDGE_PADDING,
      );

    const availableMoves = (from) =>
      viewportMoves(from).filter(({ point }) => pointIsFree(point) && segmentIsFree(from, point));

    const chooseNext = () => {
      if (!position) return null;
      const moves = availableMoves(position);
      if (!moves.length) return null;

      const reverse = (directionIndex + 2) % 4;
      const forward = moves.find((move) => move.index === directionIndex);

      if (forward && runSteps < runTarget) {
        runSteps += 1;
        return forward;
      }

      const turnDirection = TURN_PATTERN[turnIndex % TURN_PATTERN.length];
      const preferredTurn = (directionIndex + turnDirection + 4) % 4;
      const alternateTurn = (directionIndex - turnDirection + 4) % 4;
      const candidates = moves
        .filter((move) => move.index !== reverse)
        .sort((a, b) => {
          const preference = (move) => {
            if (move.index === preferredTurn) return 0;
            if (move.index === alternateTurn) return 1;
            if (move.index === directionIndex) return 2;
            return 3;
          };
          const visitDifference = (visits.get(gridKey(a.point)) || 0) - (visits.get(gridKey(b.point)) || 0);
          return visitDifference || preference(a) - preference(b);
        });

      const selected = candidates[0] || moves.find((move) => move.index === reverse) || moves[0];
      if (selected.index !== directionIndex) {
        directionIndex = selected.index;
        turnIndex += 1;
        runTarget = RUN_LENGTHS[turnIndex % RUN_LENGTHS.length];
        runSteps = 1;
      } else {
        runSteps += 1;
      }

      return selected;
    };

    const spawn = () => {
      const points = [];
      const firstX = Math.ceil(EDGE_PADDING / gridSize) * gridSize;
      const firstY = Math.ceil(EDGE_PADDING / gridSize) * gridSize;

      for (let x = firstX; x <= width - EDGE_PADDING; x += gridSize) {
        for (let y = firstY; y <= height - EDGE_PADDING; y += gridSize) {
          const point = { x, y };
          if (pointIsFree(point) && availableMoves(point).length) points.push(point);
        }
      }

      if (!points.length) {
        setVisible(false);
        clearTrail();
        return;
      }

      points.sort((a, b) => {
        const score = (point) =>
          Math.abs(point.x - width * 0.78) +
          Math.abs(point.y - height * 0.38) * 0.45 +
          (visits.get(gridKey(point)) || 0) * gridSize * 3;
        return score(a) - score(b);
      });

      position = { ...points[0] };
      directionIndex = position.y > height * 0.55 ? 3 : 1;
      runSteps = 0;
      runTarget = RUN_LENGTHS[turnIndex % RUN_LENGTHS.length];
      const next = chooseNext();
      target = next?.point ?? null;
      visits.set(gridKey(position), (visits.get(gridKey(position)) || 0) + 1);
      clearTrail();
      trail.push({ ...position });
      placeOrb();
      setVisible(true);

      if (!target && !reduceMotion.matches) {
        setVisible(false);
      }
    };

    const scan = () => {
      occluders = getOccluders();
      if (!position) {
        spawn();
        return;
      }

      const currentPointIsClear = pointIsFree(position);
      const activeSegmentIsClear = !target || (pointIsFree(target) && segmentIsFree(position, target));

      if (!currentPointIsClear || !activeSegmentIsClear) {
        setVisible(false);
        return;
      }

      if (!target) {
        const next = chooseNext();
        target = next?.point ?? null;
      }

      setVisible(Boolean(target) || reduceMotion.matches);
    };

    const scheduleScan = () => {
      if (scanFrame) return;
      scanFrame = window.requestAnimationFrame(() => {
        scanFrame = 0;
        scan();
      });
    };

    const pushTrailPoint = () => {
      if (!position) return;
      const last = trail[trail.length - 1];
      if (last && distance(last, position) < 2.25) return;

      const point = { ...position };
      if (last) trailLength += distance(last, point);
      trail.push(point);

      while (trail.length > 1 && trailLength > TRAIL_LENGTH) {
        const first = trail[0];
        const second = trail[1];
        const segmentLength = distance(first, second);
        const excess = trailLength - TRAIL_LENGTH;
        if (excess >= segmentLength) {
          trail.shift();
          trailLength -= segmentLength;
        } else {
          const ratio = excess / segmentLength;
          trail[0] = {
            x: first.x + (second.x - first.x) * ratio,
            y: first.y + (second.y - first.y) * ratio,
          };
          trailLength = TRAIL_LENGTH;
        }
      }
    };

    const drawTrail = () => {
      context.clearRect(0, 0, width, height);
      if (!visible || trail.length < 2 || reduceMotion.matches) return;

      const drawPass = (lineWidth, maxAlpha) => {
        context.lineWidth = lineWidth;
        for (let index = 1; index < trail.length; index += 1) {
          const amount = index / (trail.length - 1);
          const start = trail[index - 1];
          const end = trail[index];
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.strokeStyle = mixColor(colors.start, colors.end, amount, maxAlpha * amount);
          context.stroke();
        }
      };

      drawPass(8, 0.2);
      drawPass(2.2, 0.9);
    };

    const advance = (distanceToTravel) => {
      let remainingTravel = distanceToTravel;
      let guard = 10;

      while (remainingTravel > 0 && position && target && guard > 0) {
        guard -= 1;
        const remainingSegment = distance(position, target);
        if (remainingTravel < remainingSegment) {
          const ratio = remainingTravel / remainingSegment;
          position.x += (target.x - position.x) * ratio;
          position.y += (target.y - position.y) * ratio;
          remainingTravel = 0;
          break;
        }

        position = { ...target };
        remainingTravel -= remainingSegment;
        visits.set(gridKey(position), (visits.get(gridKey(position)) || 0) + 1);
        const next = chooseNext();
        target = next?.point ?? null;
        if (!target) {
          setVisible(false);
          break;
        }
      }
    };

    const tick = (time) => {
      animationFrame = window.requestAnimationFrame(tick);
      if (reduceMotion.matches || !visible || !position || !target) {
        lastTime = time;
        return;
      }

      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;
      advance(SPEED * delta);
      pushTrailPoint();
      placeOrb();
      drawTrail();
    };

    const handleResize = () => {
      readTheme();
      sizeCanvas();
      occluders = getOccluders();
      spawn();
    };

    const handleMotionPreference = () => {
      clearTrail();
      occluders = getOccluders();
      spawn();
    };

    readTheme();
    sizeCanvas();
    occluders = getOccluders();
    spawn();
    animationFrame = window.requestAnimationFrame(tick);

    const themeObserver = new MutationObserver(() => {
      readTheme();
      drawTrail();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const contentObserver = new MutationObserver(scheduleScan);
    contentObserver.observe(document.body, { childList: true, subtree: true });

    reduceMotion.addEventListener("change", handleMotionPreference);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", scheduleScan, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(scanFrame);
      themeObserver.disconnect();
      contentObserver.disconnect();
      reduceMotion.removeEventListener("change", handleMotionPreference);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", scheduleScan);
    };
  }, []);

  return (
    <div ref={layerRef} className="grid-signal-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="grid-signal-trail" />
      <div ref={orbRef} className="grid-signal-orb">
        <span className="grid-signal-orb__ring grid-signal-orb__ring--outer" />
        <span className="grid-signal-orb__ring grid-signal-orb__ring--inner" />
        <span className="grid-signal-orb__halo" />
        <span className="grid-signal-orb__core" />
      </div>
    </div>
  );
}
