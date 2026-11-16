// Inline SVG sprite, rendered once per page; <Icon name="play" /> references it.
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.5C.4 8.2 2.3 4 6.3 4c2.2 0 3.6 1.2 4.4 2.4h.6C12.1 5.2 13.5 4 15.7 4c4 0 5.9 4.2 4.3 7.5C19.5 16.4 12 21 12 21Z" fill="currentColor" /></symbol>
      <symbol id="i-comment" viewBox="0 0 24 24"><path d="M12 3c5 0 9 3.4 9 7.7s-4 7.7-9 7.7c-1 0-2-.1-2.9-.4L4 20l1.4-3.9C3.9 14.7 3 12.8 3 10.7 3 6.4 7 3 12 3Z" fill="currentColor" /></symbol>
      <symbol id="i-share" viewBox="0 0 24 24"><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z" fill="currentColor" /></symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7L8 5Z" fill="currentColor" /></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1L12 2Z" fill="currentColor" /></symbol>
      <symbol id="i-chart" viewBox="0 0 64 64"><path d="M8 40h10l4-9 6 17 7-30 5 22h4c4 0 8-4 12-12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-ig" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" /></symbol>
      <symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M10 11v6.5a2.5 2.5 0 1 1-2.5-2.5M10 11a5 5 0 1 0 5 5V3c.5 2.3 2.4 4 5 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></symbol>
      <symbol id="i-fb" viewBox="0 0 24 24"><path d="M14 8h2.5V4.5H14A4 4 0 0 0 10 8.5V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1Z" fill="currentColor" /></symbol>
      <symbol id="i-yt" viewBox="0 0 24 24"><path d="M9.5 8.5v7l6-3.5-6-3.5Z" fill="currentColor" /></symbol>
      <symbol id="i-snap" viewBox="0 0 24 24"><path d="M12 3c3 0 5 2.2 5 5v3l2 .5-1.5 1.5c.5 1.5 2 2.5 3.5 3-1 .8-2.5.7-3 1.5-.3.6-1.5 0-3 1-1 .6-2 1.5-3 1.5s-2-.9-3-1.5c-1.5-1-2.7-.4-3-1-.5-.8-2-.7-3-1.5 1.5-.5 3-1.5 3.5-3L5 11.5 7 11V8c0-2.8 2-5 5-5Z" fill="#fff" stroke="#000" strokeWidth="1" /></symbol>
      <symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2z" fill="currentColor" /><circle cx="4" cy="4" r="2" fill="currentColor" /></symbol>
      <symbol id="i-up" viewBox="0 0 24 24"><path d="m6 12 6-6 6 6M6 19l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-expand" viewBox="0 0 24 24"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" fill="currentColor" /></symbol>
    </svg>
  );
}

export type IconName =
  | "heart" | "comment" | "share" | "play" | "check" | "arrow" | "star" | "chart"
  | "ig" | "tiktok" | "fb" | "yt" | "snap" | "linkedin" | "up" | "whatsapp" | "close" | "chevron" | "expand";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
