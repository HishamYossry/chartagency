"use client";

import { useEffect } from "react";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { LOCALE_STORAGE_KEY } from "@/components/LangSwitcher";

// Picks the visitor's saved language, else the browser language, else English.
export default function LocaleRedirect() {
  useEffect(() => {
    let locale: Locale = defaultLocale;
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved && isLocale(saved)) locale = saved;
      else if (navigator.languages.some((lang) => lang.toLowerCase().startsWith("ar"))) locale = "ar";
    } catch {
      // storage blocked — fall back to browser language / default
    }
    window.location.replace(`/${locale}/${window.location.hash}`);
  }, []);

  return null;
}
