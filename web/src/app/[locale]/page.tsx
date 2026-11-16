import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { Nav } from "@/components/Nav";
import { RevealObserver } from "@/components/RevealObserver";
import { Cases } from "@/components/sections/Cases";
import { Contact } from "@/components/sections/Contact";
import { FaqSection } from "@/components/sections/FaqSection";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Mission } from "@/components/sections/Mission";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Why } from "@/components/sections/Why";

// Safety net: pages refresh hourly even if an admin save notification is missed
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getContent(locale);

  return (
    <>
      <Nav locale={locale} t={t.nav} lang={t.lang} />
      <main id="top">
        <Hero t={t.hero} slots={t.slots} clients={t.clients} phoneImages={t.images.phone} />
        <Mission t={t.mission} photo={t.images.missionPhoto} />
        <Cases t={t.cases} locale={locale} viewLabel={t.caseDetail.viewCase} />
        <Why t={t.why} images={t.images} />
        <Services t={t.services} />
        <Process t={t.process} images={t.images} />
        <Testimonials t={t.testimonials} />
        <FaqSection t={t.faq} whatsapp={t.contactInfo.whatsapp} />
        <Contact t={t.contact} slots={t.slots} contact={t.contactInfo} fan={t.images.ctaFan} />
      </main>
      <Footer t={t.footer} contact={t.contactInfo} />
      <RevealObserver />
    </>
  );
}
