import { Icon } from "./Icons";
import { zoomAttrs } from "./zoom";

export type Reel = { img: string; alt: string; views: string; cap?: string; video?: string };

type Props = Reel & {
  small?: boolean;
  decorative?: boolean;
  /** Opens in the lightbox; reels with the same group can be browsed together */
  zoomGroup?: string;
};

// A 9:16 reel tile. When the admin uploaded a video it plays muted on loop, with the image as poster.
export function ReelCard({ img, alt, views, cap, video, small, decorative, zoomGroup }: Props) {
  const zoom = zoomGroup ? zoomAttrs(zoomGroup, { src: img, video, alt, caption: cap }) : {};

  return (
    <figure
      className={`reel-card${small ? " reel-card--sm" : ""}${zoomGroup ? " is-zoomable" : ""}`}
      aria-hidden={decorative || undefined}
      aria-label={zoomGroup && !decorative ? alt : undefined}
      {...zoom}
      tabIndex={zoomGroup && !decorative ? 0 : undefined}
    >
      {video ? (
        <video src={video} poster={img} autoPlay muted loop playsInline preload="metadata" />
      ) : (
        <img src={img} alt={decorative ? "" : alt} loading="lazy" draggable={false} />
      )}
      {zoomGroup && (
        <span className="reel-card__open" aria-hidden="true">
          <Icon name={video ? "play" : "expand"} />
        </span>
      )}
      <figcaption>
        <span className="views"><Icon name="play" />{views}</span>
        {cap && <span className="cap" dir="rtl">{cap}</span>}
      </figcaption>
    </figure>
  );
}
