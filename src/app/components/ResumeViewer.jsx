"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink } from "lucide-react";

const DEFAULT_PDF_ZOOM = 80;
const MIN_VISIBLE_WINDOW_WIDTH = 160;
const TOP_EDGE_PADDING = 8;
const DOCK_CLEARANCE = 88;

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export default function ResumeViewer({ open, resumeUrl, title, onClose, onMinimize }) {
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setDragging(false);
      setPosition({ x: 0, y: 0 });
      dragRef.current = null;
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const toggleExpanded = () => {
    setDragging(false);
    dragRef.current = null;
    setExpanded((value) => !value);
  };

  const handleDragStart = (event) => {
    if (expanded || (event.pointerType === "mouse" && event.button !== 0)) return;
    if (event.target.closest("button, a")) return;

    const windowElement = windowRef.current;
    if (!windowElement) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      rect: windowElement.getBoundingClientRect(),
    };
    setDragging(true);
  };

  const handleDragMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || expanded) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const proposedLeft = drag.rect.left + deltaX;
    const proposedTop = drag.rect.top + deltaY;
    const minimumLeft = MIN_VISIBLE_WINDOW_WIDTH - drag.rect.width;
    const maximumLeft = window.innerWidth - MIN_VISIBLE_WINDOW_WIDTH;
    const maximumTop = Math.max(TOP_EDGE_PADDING, window.innerHeight - DOCK_CLEARANCE);
    const nextLeft = clamp(proposedLeft, minimumLeft, maximumLeft);
    const nextTop = clamp(proposedTop, TOP_EDGE_PADDING, maximumTop);

    setPosition({
      x: drag.originX + nextLeft - drag.rect.left,
      y: drag.originY + nextTop - drag.rect.top,
    });
  };

  const handleDragEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDragging(false);
  };

  const handleTitlebarDoubleClick = (event) => {
    if (event.target.closest("button, a")) return;
    toggleExpanded();
  };

  if (!open) return null;

  const viewerUrl = `${resumeUrl}#zoom=${DEFAULT_PDF_ZOOM}&toolbar=1&navpanes=0`;

  return (
    <div className="resume-viewer-overlay" onMouseDown={onClose}>
      <section
        ref={windowRef}
        className={`resume-viewer-window${expanded ? " expanded" : ""}${dragging ? " dragging" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          "--resume-window-x": `${position.x}px`,
          "--resume-window-y": `${position.y}px`,
        }}
      >
        <header
          className="resume-viewer-titlebar"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onDoubleClick={handleTitlebarDoubleClick}
        >
          <div className="resume-window-controls" aria-label="Resume window controls">
            <button
              type="button"
              className="resume-window-control resume-window-control--close"
              aria-label="Close resume"
              title="Close"
              onClick={onClose}
            />
            <button
              type="button"
              className="resume-window-control resume-window-control--minimize"
              aria-label="Minimize resume"
              title="Minimize"
              onClick={onMinimize}
            />
            <button
              type="button"
              className="resume-window-control resume-window-control--expand"
              aria-label={expanded ? "Restore resume window" : "Expand resume window"}
              title={expanded ? "Restore" : "Expand"}
              onClick={toggleExpanded}
            />
          </div>

          <div className="resume-viewer-title">{title}</div>

          <div className="resume-viewer-actions">
            <a href={resumeUrl} target="_blank" rel="noreferrer" aria-label="Open resume in a new tab" title="Open in new tab">
              <ExternalLink aria-hidden="true" />
            </a>
            <a href={resumeUrl} download="Wai-Yan-Aung-Resume.pdf" aria-label="Download resume" title="Download resume">
              <Download aria-hidden="true" />
            </a>
          </div>
        </header>

        <iframe className="resume-viewer-frame" src={viewerUrl} title={title} />
      </section>
    </div>
  );
}
