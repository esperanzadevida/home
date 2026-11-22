"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealState = "pending" | "hidden" | "visible" | "disabled";

export function RevealOnScroll({
  children,
  delayMs = 0,
  className,
  enabled = true,
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>(enabled ? "pending" : "disabled");

  useEffect(() => {
    if (!enabled) {
      setState("disabled");
      return;
    }

    const element = ref.current;

    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setState("visible");
      return;
    }

    const { top, bottom } = element.getBoundingClientRect();
    if (top <= window.innerHeight * 0.9 && bottom > 0) {
      setState("visible");
      return;
    }

    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("visible");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className ?? ""}`}
      data-reveal={state}
      style={{ "--scroll-reveal-delay": `${delayMs}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
