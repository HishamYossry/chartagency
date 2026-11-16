import type { Dictionary } from "@/i18n/get-dictionary";

// "November · Only 3 slots left" availability pill
export function Slots({ t, light }: { t: Dictionary["slots"]; light?: boolean }) {
  return (
    <div className={`slots${light ? " slots--light" : ""}`} data-reveal>
      <span className="slots__month">{t.month}</span>
      <span className="slots__text"><span className="pulse-dot" />{t.text}</span>
    </div>
  );
}
