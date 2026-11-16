"use client";

import { useEffect, useRef, useState } from "react";

// Week labels with a progress line that fills as the process section scrolls by.
export function WeeksBar({ weeks }: { weeks: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const p = (window.innerHeight * 0.7 - rect.top) / (rect.height * 0.8);
      setFill(Math.max(0, Math.min(1, p)) * 100);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="weeks" ref={ref} aria-hidden="true" data-reveal>
      {weeks.map((w) => <span key={w}>{w}</span>)}
      <i className="weeks__fill" style={{ width: `${fill}%` }} />
    </div>
  );
}
