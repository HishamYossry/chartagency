"use client";

import { useEffect } from "react";

// Staggers sibling [data-reveal] elements. Where CSS scroll-driven animations are supported
// the reveal itself is pure CSS (globals.css); otherwise this fades them in with an IntersectionObserver.
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

    els.forEach((el) => {
      const siblings = [...(el.parentElement?.children ?? [])].filter((c) => c.hasAttribute("data-reveal"));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
    });

    if (CSS.supports("animation-timeline: view()")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
