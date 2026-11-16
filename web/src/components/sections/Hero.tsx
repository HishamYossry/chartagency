import type { Dictionary } from "@/i18n/get-dictionary";
import { Accent } from "../Accent";
import { Counter } from "../Counter";
import { Icon } from "../Icons";
import { LogoMarquee } from "../LogoMarquee";
import { PhoneSlideshow } from "../PhoneSlideshow";
import { ReelsSlider } from "../ReelsSlider";
import { Slots } from "../Slots";

type Props = { t: Dictionary["hero"]; slots: Dictionary["slots"]; clients: Dictionary["clients"]; phoneImages: string[] };

export function Hero({ t, slots, clients, phoneImages }: Props) {
  return (
    <section className="hero">
      <div className="container hero__content">
        <Slots t={slots} />
        <h1 className="hero__title" data-reveal><Accent t={t.title} /></h1>
        <p className="hero__lead" data-reveal>{t.lead}</p>
        <div data-reveal><a href="#contact" className="btn btn--primary btn--lg">{t.cta}</a></div>
      </div>

      {/* Reels strip with the phone in the middle */}
      <div className="reels-stage" data-reveal>
        <ReelsSlider reels={t.reels} />

        <div className="phone phone--hero" aria-hidden="true">
          <div className="phone__screen">
            <PhoneSlideshow images={phoneImages} />
            <div className="phone__ui">
              <div className="phone__island" />
              <p className="phone__tabs">{t.phone.following} <span>|</span> <b>{t.phone.forYou}</b></p>
              <div className="phone__side">
                <span className="phone__avatar"><Icon name="chart" /></span>
                <span><Icon name="heart" />3.5k</span>
                <span><Icon name="comment" />250</span>
                <span><Icon name="share" />98</span>
              </div>
              <div className="phone__meta">
                <b dir="ltr">{t.phone.handle}</b>
                <p dir="rtl">{t.phone.caption}</p>
                <p className="phone__song">{t.phone.sound}</p>
              </div>
              <div className="phone__bar"><i /><i /><i className="plus" /><i /><i /></div>
            </div>
          </div>
          <div className="glass glass--a"><b dir="ltr"><Counter to={t.glassA.to} />{t.glassA.suffix}</b><span>{t.glassA.label}</span></div>
          <div className="glass glass--b"><b dir="ltr"><Counter to={t.glassB.to} />{t.glassB.suffix}</b><span>{t.glassB.label}</span></div>
        </div>
      </div>

      <div className="container">
        <p className="trust" data-reveal>{t.trust}</p>
      </div>
      <LogoMarquee clients={clients} />
    </section>
  );
}
