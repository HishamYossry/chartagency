"use client";

import { useEffect, useRef } from "react";
import { ReelCard, type Reel } from "./ReelCard";

const SPEED = 40; // px per second

// Auto-scrolling reel strip that can also be swiped (touch) or dragged (mouse), looping in both directions.
export function ReelsSlider({ reels }: { reels: Reel[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    const half = () => track.scrollWidth / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pos = 0;
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let last = performance.now();
    let frame = 0;
    let dragX: number | null = null;
    let dragStart = 0;
    let dragged = false;

    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resumeSoon = (delay = 1500) => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { pos = scroller.scrollLeft; paused = false; }, delay);
    };

    // Seamless wrap while the user is swiping
    const onScroll = () => {
      if (!paused) return;
      const h = half();
      if (scroller.scrollLeft >= h) scroller.scrollLeft -= h;
      else if (scroller.scrollLeft <= 0) scroller.scrollLeft += h;
      resumeSoon();
    };
    const onTouchEnd = () => resumeSoon();
    const onWheel = () => { pause(); resumeSoon(); };
    const onLeave = () => resumeSoon(300);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragX = e.clientX;
      dragStart = scroller.scrollLeft;
      dragged = false;
      scroller.classList.add("is-dragging");
      pause();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragX === null) return;
      if (Math.abs(e.clientX - dragX) > 6) dragged = true;
      scroller.scrollLeft = dragStart - (e.clientX - dragX);
    };
    const onPointerUp = () => {
      if (dragX === null) return;
      dragX = null;
      scroller.classList.remove("is-dragging");
    };

    // A mouse drag ends with a click — don't let it open the lightbox
    const onClickCapture = (e: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      e.stopPropagation();
      e.preventDefault();
    };

    scroller.addEventListener("click", onClickCapture, true);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("wheel", onWheel, { passive: true });
    scroller.addEventListener("mouseenter", pause);
    scroller.addEventListener("mouseleave", onLeave);
    scroller.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const step = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!paused) {
        pos += SPEED * dt;
        if (pos >= half()) pos -= half();
        scroller.scrollLeft = pos;
      }
      frame = requestAnimationFrame(step);
    };
    if (!reduceMotion) frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      scroller.removeEventListener("click", onClickCapture, true);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("mouseenter", pause);
      scroller.removeEventListener("mouseleave", onLeave);
      scroller.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div className="marquee reels-marquee" data-autoscroll ref={scrollerRef}>
      <div className="marquee__track" ref={trackRef}>
        {reels.map((reel, i) => <ReelCard key={i} {...reel} zoomGroup="hero-reels" />)}
        {reels.map((reel, i) => <ReelCard key={`copy-${i}`} {...reel} decorative zoomGroup="hero-reels" />)}
      </div>
    </div>
  );
}
