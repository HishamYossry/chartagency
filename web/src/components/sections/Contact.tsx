import type { Dictionary } from "@/i18n/get-dictionary";
import { getCmsUrl, type ContactInfo } from "@/lib/content";
import { Accent } from "../Accent";
import { LeadForm } from "../LeadForm";
import { Slots } from "../Slots";

type Props = { t: Dictionary["contact"]; slots: Dictionary["slots"]; contact: ContactInfo; fan: string[] };

export function Contact({ t, slots, contact, fan }: Props) {
  return (
    <section className="section section--white" id="contact">
      <div className="container">
        <div className="final">
          <div className="final__reels" aria-hidden="true">
            {fan.slice(0, 4).map((src) => <img key={src} src={src} alt="" loading="lazy" />)}
          </div>
          <div className="final__content">
            <Slots t={slots} light />
            <h2 className="final__title" data-reveal><Accent t={t.title} /></h2>
            <p data-reveal>{t.text}</p>
            <LeadForm t={t.form} whatsapp={contact.whatsapp} apiUrl={getCmsUrl()} />
            <div className="final__contacts" data-reveal>
              <a href={contact.phoneHref} dir="ltr">{contact.phoneDisplay}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <span>{t.address}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
