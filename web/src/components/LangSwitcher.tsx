"use client";

import type { Locale } from "@/i18n/config";

export const LOCALE_STORAGE_KEY = "chart-locale";

type Props = {
  locale: Locale;
  /** Page path after the locale, e.g. "case-studies/x/" — empty for the home page */
  path?: string;
  label: string;
  text: string;
  short: string;
  className?: string;
};

// Links to the same page in the other language and remembers the choice for "/".
export function LangSwitcher({ locale, path = "", label, text, short, className = "" }: Props) {
  const target: Locale = locale === "en" ? "ar" : "en";
  const href = `/${target}/${path}`;

  const remember = () => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, target);
    } catch {
      // storage blocked — the link still works
    }
  };

  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      className={`lang-switch ${className}`}
      aria-label={label}
      onClick={(e) => {
        remember();
        // keep the visitor at the same section when switching
        if (window.location.hash) {
          e.preventDefault();
          window.location.href = `${href}${window.location.hash}`;
        }
      }}
    >
      <span className="lang-switch__globe" aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      </span>
      <span className="lang-switch__full">{text}</span>
      <span className="lang-switch__short">{short}</span>
    </a>
  );
}
