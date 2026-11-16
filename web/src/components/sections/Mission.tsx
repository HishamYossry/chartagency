import type { Dictionary } from "@/i18n/get-dictionary";
import { Counter } from "../Counter";
import { Icon } from "../Icons";
import { MissionTitle } from "../MissionTitle";
import { zoomAttrs } from "../zoom";

const ORBIT = [
  { cls: "ic-ig", icon: "ig" },
  { cls: "ic-tt", icon: "tiktok" },
  { cls: "ic-yt", icon: "yt" },
  { cls: "ic-fb", icon: "fb" },
] as const;

export function Mission({ t, photo }: { t: Dictionary["mission"]; photo: string }) {
  return (
    <section className="section" id="mission">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="chip" data-reveal>{t.chip}</span>
          <MissionTitle t={t.title} />
        </div>

        <div className="bento">
          <article className="bento__ceo" data-reveal>
            <p className="bento__eyebrow">{t.ceo.eyebrow}</p>
            <h3>{t.ceo.title}</h3>
            <p>{t.ceo.text}</p>
            <div className="bento__sign">
              <p className="signature">{t.ceo.signature}</p>
              <p className="bento__role">{t.ceo.role}</p>
            </div>
          </article>

          <figure className="bento__photo is-zoomable" data-reveal {...zoomAttrs("mission-photo", { src: photo, alt: t.photoAlt })} aria-label={t.photoAlt}>
            <img src={photo} alt={t.photoAlt} loading="lazy" />
            <span className="bento__badge"><Icon name="chart" /></span>
          </figure>

          <div className="bento__stats">
            <article className="bento__big" data-reveal>
              <h3><span dir="ltr"><Counter to={t.big.to} decimals={t.big.decimals} />{t.big.suffix}</span> {t.big.word}</h3>
              <p>{t.big.text}</p>
              <div className="orbit" aria-hidden="true">
                <svg className="orbit__ring" viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M10 200 A190 190 0 0 1 390 200" fill="none" /></svg>
                {ORBIT.map((o, i) => (
                  <span key={o.icon} className={`orbit__icon orbit__icon--${i + 1} ${o.cls}`}><Icon name={o.icon} /></span>
                ))}
              </div>
            </article>
            <article className="bento__small" data-reveal>
              <p className="bento__num"><span dir="ltr"><Counter to={t.retention.to} />%</span><Icon name="star" className="ic-star" /></p>
              <p>{t.retention.label}</p>
            </article>
            <article className="bento__small" data-reveal>
              <p className="bento__num"><span dir="ltr">+<Counter to={t.engagement.to} />%</span><Icon name="up" className="ic-up" /></p>
              <p>{t.engagement.label}</p>
            </article>
          </div>
        </div>

        <figure className="quote-strip" data-reveal>
          <blockquote>{t.quote.text}</blockquote>
          <figcaption><b>{t.quote.name}</b> · {t.quote.role}</figcaption>
        </figure>
      </div>
    </section>
  );
}
