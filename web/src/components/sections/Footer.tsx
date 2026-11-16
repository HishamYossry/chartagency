import type { Dictionary } from "@/i18n/get-dictionary";
import type { ContactInfo } from "@/lib/content";
import { Icon, type IconName } from "../Icons";

const SOCIALS: { label: string; icon: IconName; key: keyof ContactInfo["socials"] }[] = [
  { label: "Instagram", icon: "ig", key: "instagram" },
  { label: "Facebook", icon: "fb", key: "facebook" },
  { label: "TikTok", icon: "tiktok", key: "tiktok" },
  { label: "LinkedIn", icon: "linkedin", key: "linkedin" },
];

type Props = {
  t: Dictionary["footer"];
  contact: ContactInfo;
  /** On sub-pages: the home page URL, so section links become "/en/#mission" */
  base?: string;
};

export function Footer({ t, contact, base = "" }: Props) {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <img src="/assets/img/logo-dark.png" alt="Chart Marketing Agency" width={130} height={46} loading="lazy" />
              <p>{t.tagline}</p>
            </div>
            <nav className="footer__links" aria-label="Footer">
              {t.links.map((link) => <a key={link.href} href={base + link.href}>{link.label}</a>)}
            </nav>
            <div className="footer__social">
              {SOCIALS.filter((s) => contact.socials[s.key]).map((s) => (
                <a key={s.label} href={contact.socials[s.key]} aria-label={s.label} target="_blank" rel="noopener"><Icon name={s.icon} /></a>
              ))}
            </div>
          </div>
          <p className="footer__word" aria-hidden="true" dir="ltr">{t.word}</p>
          <div className="footer__bottom">
            <p>© {new Date().getFullYear()} {t.rights}</p>
            <p>{t.photos}</p>
          </div>
        </div>
      </footer>

      <a href={`https://wa.me/${contact.whatsapp}`} className="wa-float" target="_blank" rel="noopener" aria-label={t.whatsapp}>
        <Icon name="whatsapp" />
      </a>
    </>
  );
}
