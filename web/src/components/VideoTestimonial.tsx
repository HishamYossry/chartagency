import { Icon } from "./Icons";
import { zoomAttrs } from "./zoom";

type Props = { img: string; video?: string; quote: string; role: string };

// Video review card: clicking opens the video (or the poster, if no video yet) in the lightbox.
export function VideoTestimonial({ img, video, quote, role }: Props) {
  return (
    <figure
      className="tcard tcard--video is-zoomable"
      {...zoomAttrs("testimonials", { src: img, video, caption: `${quote} — ${role}` })}
      aria-label={quote}
    >
      <img src={img} alt="" loading="lazy" />
      <span className="tcard__play" aria-hidden="true"><Icon name="play" /></span>
      <figcaption><b>{quote}</b><span>{role}</span></figcaption>
    </figure>
  );
}
