import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getCaseSlugs, getCaseStudy, getContent } from "@/lib/content";
import { Nav } from "@/components/Nav";
import { RevealObserver } from "@/components/RevealObserver";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

// Same safety net as the home page; admin saves refresh it immediately
export const revalidate = 3600;

// Pre-render every language × case study at build time. Case studies added in the admin
// later are rendered on their first visit (dynamicParams defaults to true).
export async function generateStaticParams() {
  const perLocale = await Promise.all(
    locales.map(async (locale) => (await getCaseSlugs(locale)).map((slug) => ({ locale, slug })))
  );
  return perLocale.flat();
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const c = await getCaseStudy(locale, slug);
  if (!c) return {};

  const title = `${c.meta.title} — Chart Agency`;
  return {
    title,
    description: c.meta.description,
    alternates: {
      canonical: `/${locale}/case-studies/${slug}/`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/case-studies/${slug}/`])),
    },
    openGraph: {
      title,
      description: c.meta.description,
      type: "article",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      images: c.meta.image ? [c.meta.image] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [t, c] = await Promise.all([getContent(locale), getCaseStudy(locale, slug)]);
  if (!c) notFound();

  const home = `/${locale}/`;

  return (
    <>
      <Nav locale={locale} t={t.nav} lang={t.lang} base={home} path={`case-studies/${slug}/`} />
      <main id="top" className="cs-page">
        <CaseStudyView c={c} t={t.caseDetail} locale={locale} />
        <Contact t={t.contact} slots={t.slots} contact={t.contactInfo} fan={t.images.ctaFan} />
      </main>
      <Footer t={t.footer} contact={t.contactInfo} base={home} />
      <RevealObserver />
    </>
  );
}
