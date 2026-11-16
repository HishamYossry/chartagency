import type { Metadata } from "next";
import LocaleRedirect from "./LocaleRedirect";

export const metadata: Metadata = {
  title: "Chart Agency",
  robots: { index: false },
};

export default function RootPage() {
  return (
    <>
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/en/" />
      </noscript>
      <LocaleRedirect />
    </>
  );
}
