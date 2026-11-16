import type { Dictionary } from "@/i18n/get-dictionary";
import type { SiteImages } from "@/lib/content";
import { Accent } from "../Accent";
import { Counter } from "../Counter";
import { Icon } from "../Icons";
import { WeeksBar } from "../WeeksBar";
import { zoomAttrs } from "../zoom";

export function Process({ t, images }: { t: Dictionary["process"]; images: SiteImages }) {
  const visuals = [
    <div key="call" className="pstep__visual pstep__visual--call">
      <span className="call-avatar"><img src={images.callAvatar} alt="" loading="lazy" /></span>
      <span className="call-avatar call-avatar--chart"><Icon name="chart" /></span>
      <span className="call-time">00:24:16</span>
    </div>,
    <div key="rec" className="pstep__visual pstep__visual--img is-zoomable" {...zoomAttrs("process-photo", { src: images.contentDay, alt: t.steps[1]?.title })}>
      <img src={images.contentDay} alt="" loading="lazy" />
      <span className="rec">{t.rec}</span>
    </div>,
    <div key="edit" className="pstep__visual pstep__visual--edit" dir="ltr">
      <div className="timeline"><i style={{ "--w": "30%" } as React.CSSProperties} /><i style={{ "--w": "20%" } as React.CSSProperties} /><i style={{ "--w": "35%" } as React.CSSProperties} /></div>
      <div className="timeline timeline--b"><i style={{ "--w": "45%" } as React.CSSProperties} /><i style={{ "--w": "40%" } as React.CSSProperties} /></div>
      <span className="playhead" />
    </div>,
    <div key="approve" className="pstep__visual pstep__visual--approve">
      <span className="approve"><Icon name="check" />{t.approved}</span>
      <span className="approve approve--live"><span className="pulse-dot" />{t.live}</span>
    </div>,
  ];

  return (
    <section className="section" id="process">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="chip" data-reveal>{t.chip}</span>
          <h2 className="h2" data-reveal>{t.title.before}<br /><em className="serif">{t.title.accent}</em></h2>
        </div>

        <WeeksBar weeks={t.weeks} />

        <ol className="process">
          {t.steps.map((step, i) => (
            <li key={step.title} className="pstep" data-reveal>
              <span className="pstep__n">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {visuals[i] ?? null}
            </li>
          ))}
        </ol>

        <div className="process__stats" data-reveal>
          {t.stats.map((s) => (
            <div key={s.label}><b dir="ltr"><Counter to={s.to} />{s.suffix}</b><span>{s.label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
