import type { Dictionary } from "@/i18n/get-dictionary";
import type { Mockup } from "@/lib/content";
import { Icon } from "../Icons";

type Mock = Dictionary["services"]["mock"];
const reel = (n: string) => `/assets/img/reels/${n}.jpg`;

function ContentScreen({ m }: { m: Mock["content"] }) {
  return (
    <div className="phone__screen phone__screen--app">
      <div className="app-top"><span>←</span><span>☰</span></div>
      <div className="app-hero">
        <img src={reel("doctor-smiling")} alt="" loading="lazy" />
        <div><b>{m.heroTitle}</b><span>{m.heroSub}</span><i>{m.watch}</i></div>
      </div>
      <div className="app-row"><b>{m.stories}</b><span className="new">{m.isNew}</span></div>
      <div className="app-grid">
        {["dentist", "eye-exam", "lab", "microneedling"].map((n, i) => (
          <span key={n}><img src={reel(n)} alt="" loading="lazy" />{i < 2 && <i><Icon name="play" /></i>}</span>
        ))}
      </div>
    </div>
  );
}

function AdScreen({ m }: { m: Mock["ad"] }) {
  return (
    <div className="phone__screen phone__screen--app">
      <div className="post-head">
        <span className="post-avatar"><img src="/assets/img/clients/medical/dr-alyaa.png" alt="" /></span>
        <div><b dir="ltr">{m.handle}</b><span>{m.sponsored}</span></div>
        <span>•••</span>
      </div>
      <div className="post-img">
        <img src={reel("facial-peel")} alt="" loading="lazy" />
        <span className="post-offer">{m.offer}</span>
      </div>
      <div className="post-cta"><span>{m.book}</span><Icon name="arrow" /></div>
      <div className="post-actions"><Icon name="heart" /><Icon name="comment" /><Icon name="share" /></div>
      <p className="post-likes"><b>{m.likes}</b></p>
    </div>
  );
}

function BookingScreen({ m }: { m: Mock["booking"] }) {
  return (
    <div className="phone__screen phone__screen--app">
      <div className="book-hero"><img src="/assets/img/photos/dental-office.jpg" alt="" loading="lazy" /><b>{m.title}</b></div>
      <p className="book-label">{m.dayLabel}</p>
      <div className="book-days">
        {m.days.map((day, i) => <span key={day.n} className={i === 1 ? "on" : undefined}>{day.d}<b>{day.n}</b></span>)}
      </div>
      <p className="book-label">{m.timeLabel}</p>
      <div className="book-times">
        {m.times.map((time, i) => <span key={time} className={i === 1 ? "on" : undefined}>{time}</span>)}
      </div>
      <div className="book-btn">{m.confirm}</div>
    </div>
  );
}

function MapsScreen({ m }: { m: Mock["maps"] }) {
  return (
    <div className="phone__screen phone__screen--app">
      <div className="search-bar"><b>G</b>{m.query}</div>
      <div className="map">
        <span className="pin pin--main">1</span>
        <span className="pin" style={{ "--x": "22%", "--y": "62%" } as React.CSSProperties} />
        <span className="pin" style={{ "--x": "75%", "--y": "30%" } as React.CSSProperties} />
        <span className="pin" style={{ "--x": "68%", "--y": "72%" } as React.CSSProperties} />
      </div>
      <div className="listing listing--top">
        <b>{m.yours}</b>
        <span><Icon name="star" />{m.rating}</span>
        <span className="open">{m.open}</span>
        <div className="listing__btns">{m.buttons.map((b) => <i key={b}>{b}</i>)}</div>
      </div>
      <div className="listing"><b>{m.other}</b><span><Icon name="star" />{m.otherRating}</span></div>
    </div>
  );
}

function ChatScreen({ m }: { m: Mock["chat"] }) {
  return (
    <div className="phone__screen phone__screen--app phone__screen--chat">
      <div className="chat-head">
        <span className="post-avatar"><img src="/assets/img/clients/medical/damanhour-eye-center.png" alt="" /></span>
        <div><b>{m.name}</b><span>{m.status}</span></div>
      </div>
      <div className="chat-body" dir="rtl">
        {m.messages.map((msg) => <p key={msg.text} className={`msg ${msg.out ? "out" : "in"}`}>{msg.text}</p>)}
      </div>
    </div>
  );
}

const MOCKUP_ORDER: Mockup[] = ["content", "ad", "booking", "maps", "chat"];

export function Services({ t }: { t: Dictionary["services"] }) {
  const m = t.mock;
  const screens: Record<Mockup, React.ReactNode> = {
    content: <ContentScreen m={m.content} />,
    ad: <AdScreen m={m.ad} />,
    booking: <BookingScreen m={m.booking} />,
    maps: <MapsScreen m={m.maps} />,
    chat: <ChatScreen m={m.chat} />,
  };
  // The admin picks a phone mockup per service; bundled content falls back to the original order
  const mockupOf = (item: (typeof t.items)[number], i: number): Mockup =>
    ("mockup" in item && MOCKUP_ORDER.includes(item.mockup as Mockup) ? item.mockup : MOCKUP_ORDER[i % MOCKUP_ORDER.length]) as Mockup;

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <span className="chip" data-reveal>{t.chip}</span>
            <h2 className="h2" data-reveal>{t.title}</h2>
          </div>
          <a href="#cases" className="btn btn--blue" data-reveal>{t.cta}</a>
        </div>

        <div className="stack">
          {t.items.map((item, i) => {
            const mockup = mockupOf(item, i);
            return (
            <article key={item.title} className="svc" style={{ "--i": i } as React.CSSProperties}>
              <div className="svc__visual" aria-hidden="true">
                <div className="phone phone--light">{screens[mockup]}</div>
                {mockup === "ad" && <div className="leads-pill"><span className="pulse-dot" />{m.ad.leads}</div>}
              </div>
              <div className="svc__body">
                <span className="chip chip--gray">{item.chip}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul className="ticks">
                  {item.ticks.map((tick) => <li key={tick}><Icon name="check" />{tick}</li>)}
                </ul>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
