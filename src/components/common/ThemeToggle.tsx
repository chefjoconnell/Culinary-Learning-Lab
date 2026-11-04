import { useEffect, useState } from 'react';
import { useLanguage } from '../../app/store/languageContext';

export default function ThemeToggle() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('rmctc-theme', dark ? 'dark' : 'light'); } catch { /* ignore */ }
  }, [dark]);
  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="min-h-12 rounded-lg border-2 border-steel-300 px-3 font-semibold text-warm-50 hover:bg-charcoal-600"
    >
      <span aria-hidden="true">{dark ? '☀ ' : '☾ '}</span>
      {dark ? t('header.themeToLight') : t('header.themeToDark')}
    </button>
  );
}
