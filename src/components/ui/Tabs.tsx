import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem { id: string; label: string; content: ReactNode }

export default function Tabs({ tabs, label }: { tabs: TabItem[]; label: string }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(i - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(tabs.length - 1); }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b-2 border-steel-300 dark:border-charcoal-600">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            id={`${uid}-tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-12 whitespace-nowrap rounded-t-lg px-4 py-2 font-semibold ${
              active === i
                ? 'border-b-4 border-ember-600 bg-warm-100 text-charcoal-900 dark:border-saffron-400 dark:bg-charcoal-700 dark:text-warm-50'
                : 'text-steel-600 hover:bg-warm-100 dark:text-steel-300 dark:hover:bg-charcoal-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${uid}-panel-${t.id}`}
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="fade-in pt-5"
        >
          {active === i && t.content}
        </div>
      ))}
    </div>
  );
}
