"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Icon } from "./Icons";
import type { ZoomItem } from "./zoom";

type Props = { t: Dictionary["lightbox"] };

const readItem = (el: Element): ZoomItem => ({
  src: el.getAttribute("data-zoom-src") ?? "",
  video: el.getAttribute("data-zoom-video") ?? undefined,
  alt: el.getAttribute("data-zoom-alt") ?? undefined,
  caption: el.getAttribute("data-zoom-caption") ?? undefined,
});
const keyOf = (item: ZoomItem) => `${item.src}|${item.video ?? ""}`;

/**
 * Site-wide viewer: click any [data-zoom] element (see zoomAttrs) to open it full screen.
 * Videos play with sound; images zoom 2× where clicked. Arrows / swipe / keyboard browse the group.
 */
export function Lightbox({ t }: Props) {
  const [items, setItems] = useState<ZoomItem[]>([]);
  const [index, setIndex] = useState(-1);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const trigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const open = index >= 0;
  const item = open ? items[index] : null;

  const openFrom = useCallback((el: HTMLElement) => {
    const group = el.getAttribute("data-zoom") ?? "";
    // Collect the group, skipping duplicates (the hero slider renders its reels twice for the loop)
    const seen = new Set<string>();
    const list: ZoomItem[] = [];
    document.querySelectorAll(`[data-zoom="${CSS.escape(group)}"]`).forEach((node) => {
      const it = readItem(node);
      if (it.src && !seen.has(keyOf(it))) {
        seen.add(keyOf(it));
        list.push(it);
      }
    });
    const start = list.findIndex((it) => keyOf(it) === keyOf(readItem(el)));
    trigger.current = el;
    setItems(list);
    setIndex(Math.max(0, start));
    setZoomed(false);
  }, []);

  const close = useCallback(() => {
    setIndex(-1);
    setZoomed(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback(
    (step: number) => {
      if (items.length < 2) return;
      setZoomed(false);
      setIndex((i) => (i + step + items.length) % items.length);
    },
    [items.length]
  );

  // Open on click / Enter / Space on any [data-zoom] element
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest<HTMLElement>("[data-zoom]");
      if (!el || e.defaultPrevented) return;
      // A link or button inside a zoomable card (e.g. "Get started") keeps working normally
      const control = target?.closest("a, button");
      if (control && el.contains(control) && control !== el) return;
      e.preventDefault();
      openFrom(el);
    };
    const onKey = (e: KeyboardEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-zoom]");
      if (el && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        openFrom(el);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openFrom]);

  // While open: lock page scroll, keyboard controls, focus the close button
  useEffect(() => {
    if (!open) return;
    const rtl = document.documentElement.dir === "rtl";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, go]);

  if (!item) return null;

  const toggleZoom = (e: ReactMouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
    setZoomed((z) => !z);
  };
  const followMouse = (e: ReactMouseEvent<HTMLImageElement>) => {
    if (!zoomed) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || item.caption || t.open}
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null || zoomed) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        const rtl = document.documentElement.dir === "rtl";
        if (Math.abs(dx) > 50) go((dx < 0) !== rtl ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button ref={closeBtn} type="button" className="lightbox__close" aria-label={t.close} onClick={close}>
        <Icon name="close" />
      </button>

      {items.length > 1 && (
        <>
          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label={t.prev} onClick={() => go(-1)}>
            <Icon name="chevron" />
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label={t.next} onClick={() => go(1)}>
            <Icon name="chevron" />
          </button>
        </>
      )}

      <figure className="lightbox__stage" onClick={(e) => e.target === e.currentTarget && close()}>
        {item.video ? (
          <video key={keyOf(item)} className="lightbox__media" src={item.video} poster={item.src} controls autoPlay playsInline />
        ) : (
          <img
            key={keyOf(item)}
            className={`lightbox__media lightbox__img${zoomed ? " is-zoomed" : ""}`}
            src={item.src}
            alt={item.alt ?? ""}
            style={{ transformOrigin: origin }}
            onClick={toggleZoom}
            onMouseMove={followMouse}
            title={zoomed ? t.zoomOut : t.zoomIn}
          />
        )}
        {(item.caption || items.length > 1) && (
          <figcaption className="lightbox__caption">
            {item.caption && <span dir="auto">{item.caption}</span>}
            {items.length > 1 && <span className="lightbox__count" dir="ltr">{index + 1} / {items.length}</span>}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
