import { Link } from 'react-router-dom';
import { useLanguage } from '../app/store/languageContext';
import { canvasUrl, getContent } from '../data/content-loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BellRinger from '../components/learning/BellRinger';
import DailyChallenge from '../components/learning/DailyChallenge';

export default function Home() {
  const { lang, t } = useLanguage();
  const h = getContent<any>(lang, 'homepage');
  const bistro = getContent<any>(lang, 'bistro');

  return (
    <div className="space-y-12">
      <section aria-labelledby="hero-h" className="rounded-2xl bg-charcoal-800 p-6 text-warm-50 sm:p-10">
        <p className="font-bold uppercase tracking-widest text-saffron-400">{h.hero.eyebrow}</p>
        <h1 id="hero-h" className="mt-2 text-3xl font-bold sm:text-5xl">{h.hero.title}</h1>
        <figure className="mt-5 max-w-3xl">
          <figcaption className="mb-1 font-semibold text-steel-300">{h.hero.welcomeFrom}</figcaption>
          <blockquote className="text-lg leading-relaxed">{h.hero.welcome}</blockquote>
        </figure>
        <p className="mt-4 font-display text-xl italic text-saffron-400">{t('site.motto')}</p>
      </section>

      <section aria-labelledby="today-h" className="grid gap-4 md:grid-cols-3">
        <h2 id="today-h" className="sr-only">{h.today.title}</h2>
        <div className="panel">
          <h3 className="text-lg font-bold">{h.today.title}</h3>
          <p className="mt-1">{h.today.objective}</p>
        </div>
        <div className="panel">
          <h3 className="text-lg font-bold">{h.today.unitTitle}</h3>
          <p className="mt-1">{h.today.unit}</p>
          <p className="mt-3"><Button to={h.today.unitLink}>{h.today.start}</Button></p>
        </div>
        <div className="panel">
          <h3 className="text-lg font-bold">{h.today.skillTitle}</h3>
          <p className="mt-1">{h.today.skill}</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <BellRinger />
        <DailyChallenge />
      </div>

      <section aria-labelledby="prof-h" className="panel border-l-8 border-l-herb-600">
        <h2 id="prof-h" className="mb-2 text-2xl font-bold">{h.professionalism.title}</h2>
        <ul className="list-disc space-y-1 pl-6">{h.professionalism.items.map((i: string) => <li key={i}>{i}</li>)}</ul>
      </section>

      <section aria-labelledby="lv-h">
        <h2 id="lv-h" className="mb-4 text-2xl font-bold">{h.levels.title}</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => (
            <li key={n}><Card title={h.levels[`level${n}`]} to={`/level${n}`} className="h-full" /></li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="assess-h">
          <h2 id="assess-h" className="mb-2 text-2xl font-bold">{h.assessments.title}</h2>
          <p className="mb-3 text-sm">{h.assessments.note}</p>
          <ul className="space-y-3">
            {h.assessments.items.map((a: any) => (
              <li key={a.title} className="panel">
                <p className="text-sm font-bold text-ember-600 dark:text-saffron-400">{a.date}</p>
                <p className="font-bold">{a.title}</p>
                <p>{a.detail}</p>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="bistro-h">
          <h2 id="bistro-h" className="mb-2 text-2xl font-bold">{h.bistroTeaser.title}</h2>
          <ul className="space-y-3">
            {bistro.announcements.map((a: any) => (
              <li key={a.title} className="panel">
                <p className="font-bold">{a.title}</p>
                <p>{a.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3"><Link className="link inline-flex min-h-12 items-center" to="/bistro">{h.bistroTeaser.more} →</Link></p>
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="cert-h" className="panel">
          <h2 id="cert-h" className="mb-3 text-2xl font-bold">{h.certTeaser.title}</h2>
          <div className="flex flex-wrap gap-3">
            <Button to={h.certTeaser.link}>{h.certTeaser.servsafe}</Button>
            <Button to={h.certTeaser.link} variant="secondary">{h.certTeaser.nocti}</Button>
          </div>
        </section>
        <section aria-labelledby="cv-h" className="panel">
          <h2 id="cv-h" className="mb-1 text-2xl font-bold">{h.canvasShortcuts.title}</h2>
          <p className="mb-3 text-sm">{h.canvasShortcuts.note}</p>
          <ul className="flex flex-wrap gap-2">
            {h.canvasShortcuts.items.map((c: any) => (
              <li key={c.path}>
                <Button href={canvasUrl(lang, c.path)} variant="secondary">{c.label} ↗<span className="sr-only"> ({t('header.newTab')})</span></Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
