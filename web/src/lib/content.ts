import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";

// Content edited in the admin panel (admin.chartagencydemo.com) and served by its API.
// The bundled dictionaries are the fallback: if the API is unreachable the site still renders.

export type ContactInfo = {
  whatsapp: string; // digits only, e.g. 201014915106
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  socials: { instagram: string; facebook: string; tiktok: string; linkedin: string };
};

export type SiteImages = {
  phone: string[]; // hero phone slideshow
  missionPhoto: string;
  whySquad: string;
  whyPhoto: string;
  ctaFan: string[]; // reels fanned around the final call-to-action
  callAvatar: string;
  contentDay: string;
};

export type Mockup = "content" | "ad" | "booking" | "maps" | "chat";

export type Content = Dictionary & { contactInfo: ContactInfo; images: SiteImages };

const img = (path: string) => `/assets/img/${path}`;

const DEFAULT_EXTRAS: Pick<Content, "contactInfo" | "images"> = {
  contactInfo: {
    whatsapp: "201014915106",
    phoneDisplay: "+20 101 491 5106",
    phoneHref: "tel:+201014915106",
    email: "sales@chartagency.com",
    socials: { instagram: "#", facebook: "#", tiktok: "#", linkedin: "#" },
  },
  images: {
    phone: ["doctor-man", "dentist", "filming-surgery", "doctor-scrubs"].map((n) => img(`reels/${n}.jpg`)),
    missionPhoto: img("photos/doctor-glasses.jpg"),
    whySquad: img("photos/dental-xray.jpg"),
    whyPhoto: img("photos/doctor-woman.jpg"),
    ctaFan: ["doctor-smiling", "surgery", "facial-peel", "eye-exam"].map((n) => img(`reels/${n}.jpg`)),
    callAvatar: img("photos/doctor-coat.jpg"),
    contentDay: img("reels/filming-surgery.jpg"),
  },
};

// Read when the server starts (not baked in at build), so switching from the temporary
// domains to the real ones only needs new environment variables and a restart.
const API_URL = process.env.CMS_API_URL?.replace(/\/$/, "");

/** The admin's public address — the lead form posts to it from the browser. */
export const getCmsUrl = () => API_URL ?? "";

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

// Objects merge key by key; arrays and values from the API replace the fallback; null/undefined keep it.
function merge<T>(base: T, patch: unknown): T {
  if (!isObject(base) || !isObject(patch)) return (patch ?? base) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined) continue;
    out[key] = isObject(value) && isObject(out[key]) ? merge(out[key], value) : value;
  }
  return out as T;
}

type CaseCard = Dictionary["cases"]["items"][number];

export type CaseStudyDetail = {
  slug: string;
  dark: boolean;
  logo: string;
  cover: string;
  name: string;
  specialty: string;
  headline: string;
  summary: string;
  location: string;
  duration: string;
  services: string[];
  stats: CaseCard["stats"];
  reels: (CaseCard["reels"][number] & { cap?: string; video?: string })[];
  challenge: string;
  solution: string;
  results: string;
  quote: string;
  quoteBy: string;
  meta: { title: string; description: string; image: string };
  next: { slug: string; name: string; specialty: string; headline: string; logo: string } | null;
};

/** Slugs of the visible case studies — used to pre-render their pages. */
export const getCaseSlugs = async (locale: Locale): Promise<string[]> =>
  (await getContent(locale)).cases.items.map((item) => ("slug" in item ? String(item.slug) : "")).filter(Boolean);

/**
 * One case study for its details page. null = no such case study (404).
 * If the admin can't be reached, a basic page is built from the bundled card data.
 */
export const getCaseStudy = cache(async (locale: Locale, slug: string): Promise<CaseStudyDetail | null> => {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/v1/case-studies/${encodeURIComponent(slug)}?locale=${locale}`, {
        next: { tags: ["content"], revalidate: 3600 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      // Only the admin API's own JSON 404 means "no such case study". A 404 web page (e.g. the
      // host's placeholder before the admin is deployed) falls back to the bundled content.
      const isJson = res.headers.get("content-type")?.includes("application/json");
      if (res.status === 404 && isJson) return null;
      if (!res.ok || !isJson) throw new Error(`CMS responded ${res.status}`);
      return (await res.json()) as CaseStudyDetail;
    } catch (error) {
      console.warn(`[content] admin not reachable, using bundled case study "${slug}" (${(error as Error).message})`);
    }
  }

  const items = getDictionary(locale).cases.items;
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return null;
  const item = items[index];
  const next = items.length > 1 ? items[(index + 1) % items.length] : null;

  return {
    ...item,
    cover: "",
    headline: "",
    summary: "",
    location: "",
    duration: "",
    services: [],
    challenge: "",
    solution: "",
    results: "",
    quote: "",
    quoteBy: "",
    meta: { title: item.name, description: item.specialty, image: item.reels[0]?.img ?? "" },
    next: next && { slug: next.slug, name: next.name, specialty: next.specialty, headline: "", logo: next.logo },
  };
});

export const getContent = cache(async (locale: Locale): Promise<Content> => {
  const base: Content = { ...getDictionary(locale), ...DEFAULT_EXTRAS };
  if (!API_URL) return base;

  try {
    const res = await fetch(`${API_URL}/api/v1/content?locale=${locale}`, {
      next: { tags: ["content"], revalidate: 3600 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);
    return merge(base, await res.json());
  } catch (error) {
    console.warn(`[content] admin not reachable, using bundled ${locale} content (${(error as Error).message})`);
    return base;
  }
});
