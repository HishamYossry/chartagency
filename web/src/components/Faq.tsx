"use client";

import { useState } from "react";

type Item = { q: string; a: string };

export function Faq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          // data-reveal sits on a wrapper whose className never changes, so React re-renders can't drop "is-in"
          <div key={item.q} data-reveal>
            <div className={`faq__item${isOpen ? " is-open" : ""}`}>
              <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                {item.q}
                <span className="faq__icon" aria-hidden="true" />
              </button>
              <div className="faq__a">
                <div><p>{item.a}</p></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
