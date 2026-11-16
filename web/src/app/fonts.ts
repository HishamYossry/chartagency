import { Alex_Brush, Host_Grotesk, Inter, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

// Latin faces (English page + numbers)
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const hostGrotesk = Host_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-host", display: "swap" });
export const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
export const alexBrush = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-alex", display: "swap" });

// Thmanyah Sans — Arabic body & headings, plus the Arabic reel captions on both pages
export const thmanyahSans = localFont({
  src: [
    { path: "../fonts/thmanyah/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
});

// Thmanyah Serif Display — the Arabic counterpart of the italic serif accent words
export const thmanyahDisplay = localFont({
  src: [
    { path: "../fonts/thmanyah/thmanyahserifdisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahserifdisplay-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/thmanyah/thmanyahserifdisplay-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah-display",
  display: "swap",
});

export const fontVariables = [inter, hostGrotesk, instrumentSerif, alexBrush, thmanyahSans, thmanyahDisplay]
  .map((font) => font.variable)
  .join(" ");
