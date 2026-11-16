// Marks an element as openable in the <Lightbox>. Elements with the same group can be browsed with ← →.
export type ZoomItem = { src: string; video?: string; alt?: string; caption?: string };

export function zoomAttrs(group: string, item: ZoomItem) {
  return {
    "data-zoom": group,
    "data-zoom-src": item.src,
    "data-zoom-video": item.video || undefined,
    "data-zoom-alt": item.alt || undefined,
    "data-zoom-caption": item.caption || undefined,
    role: "button",
    tabIndex: 0,
  } as const;
}
