type Client = { img: string; name: string };

// CSS-animated logo strip; the list is rendered twice so the loop is seamless.
export function LogoMarquee({ clients }: { clients: Client[] }) {
  return (
    <div className="marquee logos">
      <div className="marquee__track" style={{ "--marquee-duration": `${clients.length * 5}s` } as React.CSSProperties}>
        {clients.map((c) => <img key={c.img} src={c.img} alt={c.name} loading="lazy" />)}
        {clients.map((c) => <img key={`${c.img}-copy`} src={c.img} alt="" aria-hidden="true" loading="lazy" />)}
      </div>
    </div>
  );
}
