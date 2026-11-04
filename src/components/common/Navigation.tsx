import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../app/store/languageContext';

const LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/level1', key: 'nav.level1' },
  { to: '/level2', key: 'nav.level2' },
  { to: '/level3', key: 'nav.level3' },
  { to: '/certifications', key: 'nav.certifications' },
  { to: '/bistro', key: 'nav.bistro' },
  { to: '/about', key: 'nav.about' },
  { to: '/practice', key: 'nav.practice' },
];

export default function Navigation() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); }
  };

  return (
    <nav aria-label={t('nav.label')} className="bg-charcoal-800 text-warm-50" onKeyDown={onKeyDown}>
      <div className="mx-auto max-w-6xl px-4">
        <button
          ref={btn}
          type="button"
          aria-expanded={open}
          aria-controls="main-nav-list"
          onClick={() => setOpen((o) => !o)}
          className="my-1 min-h-12 rounded-lg border-2 border-steel-400 px-4 font-semibold md:hidden"
        >
          <span aria-hidden="true">{open ? '✕ ' : '☰ '}</span>
          {open ? t('nav.menuClose') : t('nav.menuOpen')}
        </button>
        <ul id="main-nav-list" className={`${open ? 'flex' : 'hidden'} flex-col gap-1 pb-3 md:flex md:flex-row md:flex-wrap md:pb-0`}>
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex min-h-12 items-center rounded-lg px-4 font-semibold hover:bg-charcoal-600 ${isActive ? 'border-b-4 border-saffron-400 bg-charcoal-700' : 'border-b-4 border-transparent'}`
                }
              >
                {t(l.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
