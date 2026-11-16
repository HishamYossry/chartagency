import type { Dictionary } from "@/i18n/get-dictionary";
import type { SiteImages } from "@/lib/content";
import { Accent } from "../Accent";
import { Icon, type IconName } from "../Icons";
import { zoomAttrs } from "../zoom";

// 5×3 grid of app tiles; null = empty tile
const APPS: ({ cls: string; icon: IconName | "google" } | null)[] = [
  null, { cls: "ic-ig", icon: "ig" }, null, null, { cls: "ic-sc", icon: "snap" },
  null, null, { cls: "ic-tt", icon: "tiktok" }, null, { cls: "ic-fb", icon: "fb" },
  null, { cls: "ic-g", icon: "google" }, null, { cls: "ic-yt", icon: "yt" }, null,
];

const PILL_ICONS = ["◉", "◎", "✦"];

export function Why({ t, images }: { t: Dictionary["why"]; images: SiteImages }) {
  return (
    <section className="section" id="why">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="chip" data-reveal>{t.chip}</span>
          <h2 className="h2" data-reveal><Accent t={t.title} /></h2>
        </div>

        <div className="why">
          <article className="why__card" data-reveal>
            <div className="why__visual why__visual--apps" aria-hidden="true">
              {APPS.map((app, i) =>
                app ? (
                  <span key={i} className={`app ${app.cls}`}>
                    {app.icon === "google" ? <b>G</b> : <Icon name={app.icon} />}
                  </span>
                ) : (
                  <span key={i} />
                )
              )}
            </div>
            <h3>{t.platform.title}</h3>
            <p>{t.platform.text}</p>
          </article>

          <article className="why__card" data-reveal>
            <div className="why__visual why__visual--photo is-zoomable" {...zoomAttrs("why-photos", { src: images.whySquad, alt: t.squad.alt })} aria-label={t.squad.alt}>
              <img src={images.whySquad} alt={t.squad.alt} loading="lazy" />
              <span className="why__tag">{t.squad.tag}</span>
            </div>
            <h3>{t.squad.title}</h3>
            <p>{t.squad.text}</p>
          </article>

          <article className="why__photo is-zoomable" data-reveal {...zoomAttrs("why-photos", { src: images.whyPhoto, alt: t.photo.alt })} aria-label={t.photo.alt}>
            <img src={images.whyPhoto} alt={t.photo.alt} loading="lazy" />
            <div className="why__photo-body">
              <h3>{t.photo.title}</h3>
              <p>{t.photo.text}</p>
              <a href="#contact" className="btn btn--white btn--block">{t.photo.cta}</a>
            </div>
          </article>

          <article className="why__card" data-reveal>
            <div className="why__visual why__visual--pills" aria-hidden="true">
              {t.growth.pills.map((pill, i) => (
                <span key={pill} className="growth-pill"><i>{PILL_ICONS[i]}</i>{pill}</span>
              ))}
            </div>
            <h3>{t.growth.title}</h3>
            <p>{t.growth.text}</p>
          </article>

          <article className="why__card" data-reveal>
            <div className="why__visual why__visual--chart" aria-hidden="true">
              <svg viewBox="0 0 300 150" className="line-chart">
                <g className="line-chart__guides">
                  <line x1="40" y1="130" x2="40" y2="118" /><line x1="113" y1="130" x2="113" y2="82" />
                  <line x1="186" y1="130" x2="186" y2="66" /><line x1="259" y1="130" x2="259" y2="18" />
                </g>
                <path className="line-chart__line" pathLength={1} d="M40 118 C70 108 90 86 113 82 S160 72 186 66 S235 40 259 18" />
                <circle cx="40" cy="118" r="4" /><circle cx="113" cy="82" r="4" /><circle cx="186" cy="66" r="4" /><circle cx="259" cy="18" r="4" />
                {t.analytics.weeks.map((w, i) => <text key={w} x={40 + i * 73} y="146">{w}</text>)}
              </svg>
            </div>
            <h3>{t.analytics.title}</h3>
            <p>{t.analytics.text}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
