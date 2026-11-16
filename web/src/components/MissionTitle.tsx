"use client";

import { useEffect, useRef, useState } from "react";
import type { AccentText } from "./Accent";

const split = (text: string) => text.split(/\s+/).filter(Boolean);

// Heading whose words light up one by one as it scrolls into view.
export function MissionTitle({ t }: { t: AccentText }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = [
    ...split(t.before).map((w) => ({ w, accent: false })),
    ...split(t.accent).map((w) => ({ w, accent: true })),
    ...split(t.after).map((w) => ({ w, accent: false })),
  ];
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * 0.9 - rect.top) / (vh * 0.5);
      setLit(Math.round(Math.max(0, Math.min(1, progress)) * words.length));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [words.length]);

  return (
    <h2 className="h2 mission-title" ref={ref}>
      {words.map(({ w, accent }, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className={`w${accent ? " serif" : ""}${i < lit ? " is-lit" : ""}`}>{w}</span>
        </span>
      ))}
    </h2>
  );
}
