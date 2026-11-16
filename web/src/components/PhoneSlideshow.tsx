"use client";

import { useEffect, useState } from "react";

// Cross-fades through reel images inside the hero phone.
export function PhoneSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCurrent((n) => (n + 1) % images.length), 3200);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="phone__slides">
      {images.map((src, i) => (
        <img key={i} src={src} alt="" className={i === current ? "is-active" : undefined} />
      ))}
    </div>
  );
}
