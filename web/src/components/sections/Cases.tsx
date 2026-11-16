import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { Accent } from "../Accent";
import { CaseLogo } from "../CaseLogo";
import { Counter } from "../Counter";
import { Icon } from "../Icons";
import { ReelCard } from "../ReelCard";

type Props = { t: Dictionary["cases"]; locale: Locale; viewLabel: string };

export function Cases({ t, locale, viewLabel }: Props) {
  const mid = t.midCta;
  return (
    <section className="section section--white" id="cases">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="chip" data-reveal>{t.chip}</span>
          <h2 className="h2" data-reveal><Accent t={t.title} /></h2>
        </div>

        <div className="cases">
          {t.items.map((item) => {
            const href = item.slug ? `/${locale}/case-studies/${item.slug}/` : "";
            return (
            <article key={item.slug || item.name} className={`case${item.dark ? " case--dark" : ""}${item.reels.length ? "" : " case--no-reels"}`} data-reveal>
              <div className="case__info">
                <div className="case__brand">
                  <CaseLogo logo={item.logo} name={item.name} />
                  <div>
                    <h3>{href ? <a href={href} className="case__title-link">{item.name}</a> : item.name}</h3>
                    <p>{item.specialty}</p>
                  </div>
                </div>
                <div className="case__stats">
                  {item.stats.map((s, i) => (
                    <div key={i}>
                      <p className="case__num">
                        <span dir="ltr">{s.prefix}<Counter to={s.to} decimals={s.decimals} />{s.suffix}</span>
                        {s.word && ` ${s.word}`}
                      </p>
                      <p>{s.label} {s.sub && <span className="case__sub">{s.sub}</span>}</p>
                    </div>
                  ))}
                </div>
                {item.spots && <p className="case__spots"><span className="pulse-dot" />{item.spots}</p>}
                {href && (
                  <a href={href} className="case__more">
                    {viewLabel} <Icon name="arrow" className="flip-rtl" />
                  </a>
                )}
              </div>
              {item.reels.length > 0 && (
                <div className="case__reels">
                  {item.reels.map((r, i) => <ReelCard key={i} {...r} small zoomGroup={`case-${item.slug || item.name}`} />)}
                </div>
              )}
            </article>
            );
          })}
        </div>

        <div className="mid-cta" data-reveal>
          <div className="mid-cta__text">
            <h2 className="h2"><Accent t={mid.title} /></h2>
            <a href="#contact" className="btn btn--primary btn--lg">{mid.cta}</a>
          </div>
          <div className="mid-cta__stats">
            {mid.stats.map((s) => (
              <div key={s.label} className="stat-card">
                <p className="stat-card__num"><span dir="ltr"><Counter to={s.to} />{s.suffix}</span></p>
                <p>{s.label}</p>
              </div>
            ))}
            <figure className="stat-card stat-card--quote">
              <blockquote>{mid.quote}</blockquote>
              <figcaption>{mid.quoteBy}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
