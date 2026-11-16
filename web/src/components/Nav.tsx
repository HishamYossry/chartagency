"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LangSwitcher } from "./LangSwitcher";

type Props = {
  locale: Locale;
  t: Dictionary["nav"];
  lang: Dictionary["lang"];
  /** On sub-pages: the home page URL, so section links become "/en/#mission". Empty on the home page. */
  base?: string;
  /** Current page path after the locale (e.g. "case-studies/x/"), so the language switch stays on it. */
  path?: string;
};

export function Nav({ locale, t, lang, base = "", path = "" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section in view (home page only)
  useEffect(() => {
    if (base) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    t.links.forEach(({ href }) => {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [t.links, base]);

  const switcher = { locale, path, label: lang.label, text: lang.switchTo, short: lang.short };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="nav__inner container">
        <a href={base || "#top"} className="nav__logo" aria-label={t.homeLabel}>
          <img src="/assets/img/logo-dark.png" alt="Chart Marketing Agency" width={112} height={40} />
        </a>
        <nav className="nav__links" aria-label="Primary">
          {t.links.map((link) => (
            <a key={link.href} href={base + link.href} className={active === link.href ? "is-active" : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <LangSwitcher {...switcher} />
          <a href="#contact" className="btn btn--primary btn--sm nav__cta">{t.cta}</a>
          <button
            className="nav__toggle"
            aria-label={t.openMenu}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="mobile-menu" id="mobileMenu">
        {t.links.map((link) => (
          <a key={link.href} href={base + link.href} onClick={() => setOpen(false)}>{link.label}</a>
        ))}
        <a href="#contact" className="btn btn--primary" onClick={() => setOpen(false)}>{t.ctaLong}</a>
      </div>
    </header>
  );
}
