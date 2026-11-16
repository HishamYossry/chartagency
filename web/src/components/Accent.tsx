export type AccentText = { before: string; accent: string; after: string };

// Heading text with one highlighted word (italic serif in English, Thmanyah Serif Display in Arabic).
export function Accent({ t }: { t: AccentText }) {
  return (
    <>
      {t.before} <em className="serif">{t.accent}</em>
      {t.after && ` ${t.after}`}
    </>
  );
}
