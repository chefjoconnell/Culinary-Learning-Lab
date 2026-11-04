import { useLanguage } from '../../app/store/languageContext';
import { canvasUrl } from '../../data/content-loader';

export default function Footer() {
  const { t, lang } = useLanguage();
  const links = [
    ['footer.modules', '/modules'],
    ['footer.assignments', '/assignments'],
    ['footer.quizzes', '/quizzes'],
    ['footer.discussions', '/discussion_topics'],
  ];
  return (
    <footer className="mt-12 bg-charcoal-900 text-warm-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-3">
        <section aria-labelledby="f-canvas">
          <h2 id="f-canvas" className="mb-2 text-lg font-bold text-saffron-400">{t('footer.canvasShortcuts')}</h2>
          <ul className="space-y-1">
            {links.map(([k, p]) => (
              <li key={k}>
                <a className="inline-flex min-h-12 items-center underline underline-offset-2 hover:text-saffron-400" href={canvasUrl(lang, p)} target="_blank" rel="noopener noreferrer">{t(k)}</a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="f-contact">
          <h2 id="f-contact" className="mb-2 text-lg font-bold text-saffron-400">{t('footer.contact')}</h2>
          <p>{t('site.school')}</p>
          <p>{t('site.program')} · {t('site.cip')}</p>
          <p>{t('site.instructor')}</p>
          <p className="mt-2 text-sm text-steel-300">{t('footer.contactText')}</p>
        </section>
        <section aria-labelledby="f-a11y">
          <h2 id="f-a11y" className="mb-2 text-lg font-bold text-saffron-400">{t('footer.accessibilityTitle')}</h2>
          <p className="text-sm">{t('footer.accessibilityText')}</p>
          <p className="mt-2 text-sm font-semibold">{t('footer.practiceNotice')}</p>
        </section>
      </div>
      <p className="border-t border-charcoal-600 py-4 text-center text-sm text-steel-300">{t('site.motto')}</p>
    </footer>
  );
}
