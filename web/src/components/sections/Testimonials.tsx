import type { Dictionary } from "@/i18n/get-dictionary";
import { Accent } from "../Accent";
import { Icon } from "../Icons";
import { VideoTestimonial } from "../VideoTestimonial";

const Stars = () => (
  <div className="stars" aria-label="5/5">
    {Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" />)}
  </div>
);

export function Testimonials({ t }: { t: Dictionary["testimonials"] }) {
  return (
    <section className="section section--white" id="testimonials">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="chip" data-reveal>{t.chip}</span>
          <h2 className="h2" data-reveal><Accent t={t.title} /></h2>
        </div>

        <div className="tgrid">
          {t.items.map((item) =>
            item.video ? (
              // data-reveal on a wrapper so the client component's re-renders can't drop "is-in"
              <div key={item.quote} data-reveal>
                <VideoTestimonial img={item.img} video={"videoUrl" in item ? String(item.videoUrl || "") : ""} quote={item.quote} role={item.role} />
              </div>
            ) : (
              <figure key={item.quote} className="tcard" data-reveal>
                <Stars />
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <span className="tcard__avatar" aria-hidden="true">{item.initials}</span>
                  <span><b>{item.name}</b>{item.role}</span>
                </figcaption>
              </figure>
            )
          )}
        </div>
      </div>
    </section>
  );
}
