import type { Dictionary } from "@/i18n/get-dictionary";
import { Accent } from "../Accent";
import { Faq } from "../Faq";

export function FaqSection({ t, whatsapp }: { t: Dictionary["faq"]; whatsapp: string }) {
  return (
    <section className="section" id="faq">
      <div className="container faq-wrap">
        <div className="faq-intro">
          <span className="chip" data-reveal>{t.chip}</span>
          <h2 className="h2" data-reveal><Accent t={t.title} /></h2>
          <p data-reveal>{t.text}</p>
          <a href={`https://wa.me/${whatsapp}`} className="btn btn--dark" target="_blank" rel="noopener" data-reveal>{t.cta}</a>
        </div>
        <Faq items={t.items} />
      </div>
    </section>
  );
}
