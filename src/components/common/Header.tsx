import { Link } from 'react-router-dom';
import { useLanguage } from '../../app/store/languageContext';
import { canvasUrl } from '../../data/content-loader';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import Navigation from './Navigation';

export default function Header() {
  const { t, lang } = useLanguage();
  return (
    <header className="bg-charcoal-900 text-warm-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-saffron-400 text-2xl text-charcoal-900">🍳</span>
          <span>
            <span className="block text-sm font-bold uppercase tracking-widest text-saffron-400">{t('site.schoolShort')}</span>
            <span className="block font-display text-xl font-bold leading-tight sm:text-2xl">{t('site.title')}</span>
            <span className="hidden text-sm text-steel-300 sm:block">{t('site.program')}</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={canvasUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center rounded-lg bg-ember-600 px-4 font-bold text-white hover:bg-ember-500"
          >
            <span aria-hidden="true">← </span>{t('header.backToCanvas')}
            <span className="sr-only"> ({t('header.newTab')})</span>
          </a>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
      <Navigation />
    </header>
  );
}
