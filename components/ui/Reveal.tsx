"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms before the reveal transition starts. */
  delay?: number;
  className?: string;
}

/**
 * Fades + slides its children up when scrolled into view (once).
 *
 * The reduced-motion fallback is pure CSS (`motion-reduce:` variants) rather
 * than a media-query read in the effect: the effect version had to setState
 * synchronously on mount, which both trips react-hooks/set-state-in-effect and
 * paints the hidden state for one frame before correcting it.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      // 700ms was slow enough to read as a page load rather than a reveal; 400ms
      // sits just past the micro-interaction window, which suits a section-sized
      // element. will-change is dropped once shown so the layer is released.
      className={`transition-[opacity,transform] duration-400 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 will-change-transform"
      } ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
