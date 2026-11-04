import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../app/store/languageContext';
import { canvasUrl } from '../data/content-loader';
import { getLevel } from '../data/lessons';
import type { Lesson } from '../data/types';
import { usePracticeProgress } from '../features/progress/usePracticeProgress';
import { PASS_PERCENT } from '../features/progress/progressStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Tabs from '../components/ui/Tabs';
import Table from '../components/ui/Table';
import LessonSection from '../components/learning/LessonSection';
import KnowledgeCheck from '../components/learning/KnowledgeCheck';
import QuizQuestion from '../components/learning/QuizQuestion';
import ExitTicket from '../components/learning/ExitTicket';
import Calculators from '../components/learning/Calculators';

export default function LevelPage({ level }: { level: 1 | 2 | 3 }) {
  const { unitId } = useParams();
  const { lang, t } = useLanguage();
  const data = getLevel(lang, level);
  const unit = unitId ? data.units.find((u) => u.id === unitId) : undefined;
  if (unitId) {
    return unit ? <UnitView level={level} unit={unit} /> : (
      <div>
        <h1 className="text-3xl font-bold">{t('lesson.notFound')}</h1>
        <p className="mt-4"><Button to={`/level${level}`}>{t('lesson.backToLevel')}</Button></p>
      </div>
    );
  }
  return <Dashboard level={level} />;
}

function Dashboard({ level }: { level: 1 | 2 | 3 }) {
  const { lang, t } = useLanguage();
  const data = getLevel(lang, level);
  const { state } = usePracticeProgress();
  const firstOpen = data.units.find((u) => (state.results[u.id]?.bestPct ?? 0) < PASS_PERCENT) ?? data.units[0];
  const [selected, setSelected] = useState<string | null>(null);
  const current = data.units.find((u) => u.id === (selected ?? firstOpen.id)) ?? firstOpen;
  const practiced = data.units.filter((u) => state.results[u.id]).length;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">{data.title}</h1>
        <p className="max-w-3xl text-lg">{data.overview}</p>
        <div className="max-w-xl">
          <ProgressBar value={practiced} max={data.units.length} label={t('lesson.progress')} valueText={`${practiced}/${data.units.length} ${t('lesson.unitsDone')}`} />
        </div>
      </header>

      <section aria-labelledby="cur-h" className="panel space-y-3">
        <h2 id="cur-h" className="text-2xl font-bold">{t('lesson.start')}</h2>
        <div>
          <label htmlFor="unit-select" className="mb-1 block font-semibold">{t('lesson.unitsAvailable')}</label>
          <select
            id="unit-select"
            value={current.id}
            onChange={(e) => setSelected(e.target.value)}
            className="min-h-12 w-full max-w-xl rounded-lg border-2 border-steel-400 bg-white px-3 text-charcoal-900"
          >
            {data.units.map((u) => <option key={u.id} value={u.id}>{u.unit} – {u.title}</option>)}
          </select>
        </div>
        <p><strong>{t('lesson.objective')}:</strong> {current.objective}</p>
        <Button to={`/level${level}/${current.id}`}>{t('lesson.start')}: {current.unit}</Button>
      </section>

      <section aria-labelledby="units-h">
        <h2 id="units-h" className="mb-4 text-2xl font-bold">{t('lesson.unitsAvailable')}</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {data.units.map((u) => {
            const r = state.results[u.id];
            return (
              <li key={u.id}>
                <Card title={`${u.unit} – ${u.title}`} to={`/level${level}/${u.id}`} eyebrow={r ? `${t('lesson.completed')} · ${t('lesson.bestScore')}: ${r.bestPct}%` : t('lesson.notStarted')} className="h-full">
                  <p>{u.summary}</p>
                  <p className="mt-2 text-sm"><strong>{t('lesson.objective')}:</strong> {u.objective}</p>
                  <div className="mt-3"><ProgressBar value={r?.bestPct ?? 0} label={t('lesson.bestScore')} /></div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="path-h" className="panel">
          <h2 id="path-h" className="mb-2 text-2xl font-bold">{t('lesson.pathway')}</h2>
          <ol className="list-decimal space-y-1 pl-6">{data.pathway.map((p) => <li key={p}>{p}</li>)}</ol>
        </section>
        <section aria-labelledby="next-h" className="panel">
          <h2 id="next-h" className="mb-2 text-2xl font-bold">{t('lesson.nextSteps')}</h2>
          <ul className="list-disc space-y-1 pl-6">{data.nextSteps.map((p) => <li key={p}>{p}</li>)}</ul>
          <p className="mt-4"><Button href={canvasUrl(lang, data.canvasPath)} variant="secondary">{t('lesson.openCanvas')} ↗</Button></p>
        </section>
      </div>

      <section aria-labelledby="plan-h">
        <h2 id="plan-h" className="mb-3 text-2xl font-bold">{t('lesson.unitsPlanned')}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {data.plannedUnits.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-steel-400 px-4 py-3">
              <span>{p.title}</span>
              <span className="rounded bg-steel-300 px-2 py-0.5 text-xs font-bold text-charcoal-900">{t('lesson.comingSoon')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function UnitView({ level, unit }: { level: 1 | 2 | 3; unit: Lesson }) {
  const { lang, t } = useLanguage();
  const tabs = [
    {
      id: 'learn',
      label: t('lesson.learn'),
      content: (
        <div className="space-y-8">
          <LessonSection title={t('lesson.miniLesson')} objective={{ label: t('lesson.objective'), text: unit.objective }}>
            {unit.miniLesson.map((p, i) => <p key={i} className="max-w-3xl text-lg leading-relaxed">{p}</p>)}
          </LessonSection>
          <LessonSection title={t('lesson.keyTerms')}>
            <dl className="grid gap-3 sm:grid-cols-2">
              {unit.definitions.map((d) => (
                <div key={d.term} className="panel">
                  <dt className="font-bold">{d.term}</dt>
                  <dd>{d.text}</dd>
                </div>
              ))}
            </dl>
          </LessonSection>
        </div>
      ),
    },
    {
      id: 'reference',
      label: t('lesson.reference'),
      content: <LessonSection title={t('lesson.reference')}><Table {...unit.table} /></LessonSection>,
    },
    ...(unit.calculator ? [{ id: 'calc', label: t('lesson.calculator'), content: <LessonSection title={t('calc.title')}><Calculators /></LessonSection> }] : []),
    ...(unit.scenarios
      ? [{
          id: 'scenarios',
          label: t('lesson.scenarios'),
          content: (
            <LessonSection title={t('lesson.scenarios')}>
              {unit.scenarios.map((s, i) => (
                <article key={s.id} className="space-y-3">
                  <h4 className="text-xl font-bold">{t('lesson.scenarioLabel')} {i + 1}: {s.title}</h4>
                  <p className="rounded-lg border-l-4 border-saffron-500 bg-warm-100 p-4 dark:bg-charcoal-700">{s.situation}</p>
                  {s.questions.map((q) => <QuizQuestion key={`${lang}-${q.id}`} question={q} />)}
                </article>
              ))}
            </LessonSection>
          ),
        }]
      : []),
    {
      id: 'practice',
      label: t('lesson.practice'),
      content: <LessonSection title={t('lesson.practice')}><KnowledgeCheck key={`${lang}-${unit.id}`} questions={unit.knowledgeCheck} lessonId={unit.id} /></LessonSection>,
    },
    { id: 'exit', label: t('lesson.exit'), content: <ExitTicket prompt={unit.exitTicket.prompt} reflection={unit.reflection} /> },
  ];

  return (
    <article className="space-y-6">
      <p><Link className="link inline-flex min-h-12 items-center" to={`/level${level}`}>← {t('lesson.backToLevel')}</Link></p>
      <header className="space-y-2">
        <p className="font-bold uppercase tracking-wide text-ember-600 dark:text-saffron-400">{t('nav.level' + level)} · {unit.unit}</p>
        <h1 className="text-4xl font-bold">{unit.title}</h1>
        <p className="text-lg">{unit.summary}</p>
        <p className="text-sm"><strong>{t('lesson.alignment')}:</strong> {unit.cip}</p>
        {unit.status === 'demo' && <p role="note" className="rounded-lg border-2 border-saffron-500 bg-saffron-400/20 p-3 text-sm font-semibold">⚠ {t('lesson.demo')}</p>}
        <p><Button href={canvasUrl(lang, unit.canvasPath)} variant="secondary">{t('lesson.openCanvas')} ↗<span className="sr-only"> ({t('header.newTab')})</span></Button></p>
      </header>
      <Tabs tabs={tabs} label={t('lesson.tabsLabel')} />
    </article>
  );
}
