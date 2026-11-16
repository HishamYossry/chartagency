import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { CaseStudyDetail } from "@/lib/content";
import { Accent } from "../Accent";
import { CaseLogo } from "../CaseLogo";
import { Counter } from "../Counter";
import { Icon } from "../Icons";
import { ReelCard } from "../ReelCard";
import { RichText } from "../RichText";
import { zoomAttrs } from "../zoom";

type Props = { c: CaseStudyDetail; t: Dictionary["caseDetail"]; locale: Locale };

export function CaseStudyView({ c, t, locale }: Props) {
  const home = `/${locale}/`;
  const story = [
    { label: t.challenge, text: c.challenge },
    { label: t.solution, text: c.solution },
    { label: t.results, text: c.results },
  ].filter((s) => s.text.trim());

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="cs-hero">
        <div className="container">
          <a href={`${home}#cases`} className="cs-back" data-reveal>
            <Icon name="arrow" className="flip-back" /> {t.back}
          </a>

          <div className="cs-hero__head">
            {c.specialty && <span className="chip" data-reveal>{c.specialty}</span>}
            <h1 className="cs-title" data-reveal>{c.headline || c.name}</h1>
            {c.summary && <p className="cs-lead" data-reveal>{c.summary}</p>}
          </div>

          <dl className="cs-facts" data-reveal>
            <div className="cs-facts__client">
              <CaseLogo logo={c.logo} name={c.name} />
              <div>
                <dt>{t.client}</dt>
                <dd>{c.name}</dd>
              </div>
            </div>
            {c.location && <div><dt>{t.location}</dt><dd>{c.location}</dd></div>}
            {c.duration && <div><dt>{t.duration}</dt><dd>{c.duration}</dd></div>}
            {c.services.length > 0 && (
              <div className="cs-facts__services">
                <dt>{t.services}</dt>
                <dd>{c.services.map((s) => <span key={s} className="tag-pill">{s}</span>)}</dd>
              </div>
            )}
          </dl>

          {c.cover ? (
            <div data-reveal>
              <figure className="cs-cover is-zoomable" {...zoomAttrs("case-cover", { src: c.cover, alt: c.name })} aria-label={c.name}>
                <img src={c.cover} alt={c.name} />
              </figure>
            </div>
          ) : (
            c.reels.length > 0 && (
              <div className={`cs-reels cs-reels--hero cs-reels--n${Math.min(c.reels.length, 5)}`} data-reveal>
                {c.reels.slice(0, 5).map((r, i) => <ReelCard key={i} {...r} zoomGroup="case-reels" />)}
              </div>
            )
          )}
        </div>
      </section>

      {/* ---------- Results in numbers ---------- */}
      {c.stats.length > 0 && (
        <section className="section section--white cs-section">
          <div className="container">
            <div className="section-head section-head--center">
              <h2 className="h2" data-reveal>{t.resultsTitle}</h2>
            </div>
            <div className={`cs-stats cs-stats--n${Math.min(c.stats.length, 3)}${c.dark ? " cs-stats--dark" : ""}`}>
              {c.stats.map((s, i) => (
                <div key={i} className="cs-stat" data-reveal>
                  <p className="cs-stat__num">
                    <span dir="ltr">{s.prefix}<Counter to={s.to} decimals={s.decimals} />{s.suffix}</span>
                    {s.word && <span className="cs-stat__word"> {s.word}</span>}
                  </p>
                  <p className="cs-stat__label">{s.label}</p>
                  {s.sub && <p className="cs-stat__sub">{s.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- The story ---------- */}
      {story.length > 0 && (
        <section className="section cs-section">
          <div className="container cs-story">
            <span className="chip" data-reveal>{t.storyChip}</span>
            {story.map((s, i) => (
              <article key={s.label} className="cs-story__block" data-reveal>
                <header>
                  <span className="cs-story__n">0{i + 1}</span>
                  <h2>{s.label}</h2>
                </header>
                <RichText text={s.text} className="cs-prose" />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Reels gallery (when the hero shows a cover instead) ---------- */}
      {c.cover && c.reels.length > 0 && (
        <section className="section section--white cs-section">
          <div className="container">
            <div className="section-head section-head--center">
              <h2 className="h2" data-reveal>{t.reelsTitle}</h2>
            </div>
            <div className="cs-reels cs-reels--grid">
              {c.reels.map((r, i) => <div key={i} data-reveal><ReelCard {...r} zoomGroup="case-reels" /></div>)}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Quote ---------- */}
      {c.quote && (
        <section className="section cs-section cs-section--tight">
          <div className="container">
            <figure className="cs-quote" data-reveal>
              <blockquote>{c.quote}</blockquote>
              {c.quoteBy && <figcaption>{c.quoteBy}</figcaption>}
            </figure>
          </div>
        </section>
      )}

      {/* ---------- Next case + call to action ---------- */}
      <section className="section cs-section">
        <div className={`container cs-end${c.next ? "" : " cs-end--single"}`}>
          {c.next && (
            <a href={`/${locale}/case-studies/${c.next.slug}/`} className="cs-next" data-reveal>
              <span className="cs-next__label">{t.nextCase}</span>
              <span className="cs-next__client">
                <CaseLogo logo={c.next.logo} name={c.next.name} />
                <span>
                  <b>{c.next.name}</b>
                  <small>{c.next.specialty}</small>
                </span>
              </span>
              {c.next.headline && <span className="cs-next__headline">{c.next.headline}</span>}
              <span className="cs-next__arrow"><Icon name="arrow" className="flip-rtl" /></span>
            </a>
          )}
          <div className="cs-cta" data-reveal>
            <h2 className="h2"><Accent t={t.ctaTitle} /></h2>
            <a href="#contact" className="btn btn--primary btn--lg">{t.cta}</a>
          </div>
        </div>
      </section>
    </>
  );
}
