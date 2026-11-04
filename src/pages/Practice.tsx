import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../app/store/languageContext';
import { getAllLessons } from '../data/lessons';
import { usePracticeProgress } from '../features/progress/usePracticeProgress';
import Button from '../components/ui/Button';

export default function Practice() {
  const { lang, t } = useLanguage();
  const p = usePracticeProgress();
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState('');
  const goalId = useId();
  const lessons = Object.fromEntries(getAllLessons(lang).map(({ level, lesson }) => [lesson.id, { level, lesson }]));
  const recent = Object.entries(p.state.results).sort((a, b) => b[1].date.localeCompare(a[1].date));

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">{t('practice.title')}</h1>
      <section role="note" aria-labelledby="pn-h" className="rounded-lg border-4 border-saffron-500 bg-saffron-400/20 p-4">
        <h2 id="pn-h" className="text-xl font-bold">⚠ {t('practice.notice')}</h2>
        <p>{t('practice.noticeBody')}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="panel"><p className="text-sm font-bold uppercase">{t('practice.streak')}</p><p className="text-4xl font-bold">🔥 {p.streak} <span className="text-lg">{p.streak === 1 ? t('practice.day') : t('practice.days')}</span></p></div>
        <div className="panel"><p className="text-sm font-bold uppercase">{t('practice.checks')}</p><p className="text-4xl font-bold">{p.checksCompleted}</p></div>
      </div>

      <section aria-labelledby="rec-h">
        <h2 id="rec-h" className="mb-3 text-2xl font-bold">{t('practice.recent')}</h2>
        {recent.length === 0 ? <p>{t('practice.none')}</p> : (
          <ul className="space-y-2">
            {recent.map(([id, r]) => {
              const l = lessons[id];
              if (!l) return null;
              return (
                <li key={id} className="panel flex flex-wrap items-center justify-between gap-2">
                  <Link className="link inline-flex min-h-12 items-center font-semibold" to={`/level${l.level}/${id}`}>{l.lesson.unit} – {l.lesson.title}</Link>
                  <span>{t('practice.last')}: {r.lastPct}% · {t('practice.best')}: {r.bestPct}% · {r.attempts} {t('practice.attempts')}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="rv-h">
        <h2 id="rv-h" className="mb-3 text-2xl font-bold">{t('practice.review')}</h2>
        {p.review.length === 0 ? <p>{t('practice.reviewNone')}</p> : (
          <>
            <p>{t('practice.reviewText')}</p>
            <ul className="list-disc pl-6">
              {p.review.map((id) => lessons[id] && <li key={id}><Link className="link" to={`/level${lessons[id].level}/${id}`}>{lessons[id].lesson.unit} – {lessons[id].lesson.title}</Link></li>)}
            </ul>
          </>
        )}
      </section>

      <section aria-labelledby="bd-h">
        <h2 id="bd-h" className="text-2xl font-bold">{t('practice.badges')}</h2>
        <p className="mb-3 text-sm">{t('practice.badgesNote')}</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {p.badges.map((b) => (
            <li key={b.id} className={`panel ${b.isEarned ? 'border-2 border-herb-600' : 'opacity-90'}`}>
              <p className="text-lg font-bold">
                <span aria-hidden="true">{b.isEarned ? '🏅 ' : '🔒 '}</span>{t(`badges.${b.id}.name`)}
              </p>
              <p className="text-sm font-bold">{b.isEarned ? `✓ ${t('practice.earned')}` : b.available ? t('practice.locked') : `${t('practice.locked')} · ${t('lesson.comingSoon')}`}</p>
              <p className="text-sm">{t('practice.howTo')}: {t(`badges.${b.id}.how`)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="goal-h" className="panel">
        <h2 id="goal-h" className="mb-1 text-2xl font-bold">{t('practice.goal')}</h2>
        <label htmlFor={goalId} className="mb-1 block text-sm">{t('practice.goalHelp')}</label>
        <input id={goalId} type="text" maxLength={200} value={p.state.goal} onChange={(e) => p.setGoal(e.target.value)} placeholder={t('practice.goalPlaceholder')} className="min-h-12 w-full rounded-lg border-2 border-steel-400 bg-white px-3 text-charcoal-900" />
      </section>

      <section aria-labelledby="rs-h" className="space-y-3">
        <h2 id="rs-h" className="sr-only">{t('practice.reset')}</h2>
        {!confirming ? (
          <Button variant="secondary" onClick={() => { setConfirming(true); setMsg(''); }}>{t('practice.reset')}</Button>
        ) : (
          <div role="alertdialog" aria-label={t('practice.reset')} className="panel space-y-3 border-2 border-ember-600">
            <p className="font-semibold">{t('practice.resetConfirm')}</p>
            <div className="flex gap-3">
              <Button onClick={() => { p.reset(); setConfirming(false); setMsg(t('practice.resetDone')); }}>{t('practice.resetYes')}</Button>
              <Button variant="secondary" onClick={() => setConfirming(false)}>{t('practice.resetNo')}</Button>
            </div>
          </div>
        )}
        <p role="status" className="font-semibold">{msg}</p>
      </section>
    </div>
  );
}
