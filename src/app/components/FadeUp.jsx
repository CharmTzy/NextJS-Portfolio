"use client";

import { useInView } from "../hooks/useInView";

export default function FadeUp({ as = "div", className = "", delay = 0, children, style = {} }) {
  const { ref, isInView } = useInView(0.08);
  const Component = as;

  return (
    <Component
      ref={ref}
      className={`fade-up ${isInView ? "visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
