import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getContent } from "@/lib/content";
import { IconSprite } from "@/components/Icons";
import { Lightbox } from "@/components/Lightbox";
import { fontVariables } from "../fonts";
import "../globals.css";
import "../case-studies.css";
import "../lightbox.css";

// No `dynamicParams = false` here: it would also forbid case studies added after a build.
// Unknown languages are rejected below with notFound().
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getContent(locale);
  return {
    metadataBase: new URL(process.env.SITE_URL || "https://chartagencydemo.com"),
    title: t.meta.title,
    description: t.meta.description,
    icons: { icon: "/assets/img/favicon.svg" },
    alternates: { languages: { en: "/en/", ar: "/ar/" } },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      images: ["/assets/img/reels/doctor-smiling.jpg"],
    },
  };
}

export const viewport: Viewport = { themeColor: "#F4F4F6" };

export default async function LocaleLayout({ children, params }: Props & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so [data-reveal] content starts hidden without a flash */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <IconSprite />
        {children}
        <Lightbox t={getDictionary(locale).lightbox} />
      </body>
    </html>
  );
}
