import { useLanguage } from '../../app/store/languageContext';
import type { Lang } from '../../data/types';

const OPTIONS: { code: Lang; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
];

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div role="group" aria-label={t('header.language')} className="inline-flex overflow-hidden rounded-lg border-2 border-steel-300">
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          lang={o.code}
          aria-pressed={lang === o.code}
          aria-label={o.name}
          onClick={() => setLang(o.code)}
          className={`min-h-12 min-w-12 px-3 font-bold ${lang === o.code ? 'bg-saffron-400 text-charcoal-900' : 'bg-transparent text-warm-50 hover:bg-charcoal-600'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
