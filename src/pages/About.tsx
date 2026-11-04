import { useLanguage } from '../app/store/languageContext';
import { getContent } from '../data/content-loader';

export default function About() {
  const { lang, t } = useLanguage();
  const a = getContent<any>(lang, 'about');
  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{a.title}</h1>
        <p className="font-semibold">{a.school}</p>
        <p className="text-lg">{a.intro}</p>
        <p className="font-display text-xl italic text-ember-600 dark:text-saffron-400">{t('site.motto')}</p>
      </header>
      <section aria-labelledby="ph-h">
        <h2 id="ph-h" className="mb-2 text-2xl font-bold">{a.philosophyTitle}</h2>
        <ul className="list-disc space-y-1 pl-6">{a.philosophy.map((p: string) => <li key={p}>{p}</li>)}</ul>
      </section>
      <section aria-labelledby="how-h">
        <h2 id="how-h" className="mb-2 text-2xl font-bold">{a.howTitle}</h2>
        <ol className="list-decimal space-y-1 pl-6">{a.how.map((p: string) => <li key={p}>{p}</li>)}</ol>
      </section>
      <section aria-labelledby="lim-h" className="panel">
        <h2 id="lim-h" className="mb-2 text-2xl font-bold">{a.limitsTitle}</h2>
        <p>{a.limits}</p>
      </section>
    </div>
  );
}
