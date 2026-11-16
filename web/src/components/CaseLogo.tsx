// Client logo tile; shows the first letter when no logo was uploaded.
export function CaseLogo({ logo, name, large }: { logo: string; name: string; large?: boolean }) {
  return (
    <span className={`case__logo${large ? " case__logo--lg" : ""}`}>
      {logo ? <img src={logo} alt="" loading="lazy" /> : <b aria-hidden="true">{name.trim().charAt(0)}</b>}
    </span>
  );
}
