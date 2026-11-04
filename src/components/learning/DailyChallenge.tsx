import { useEffect, useState } from 'react';
import { useLanguage } from '../../app/store/languageContext';
import { getContent } from '../../data/content-loader';
import type { Question } from '../../data/types';
import { progressStore } from '../../features/progress/progressStore';
import QuizQuestion from './QuizQuestion';
import Button from '../ui/Button';

const DURATION = 120;
type Phase = 'idle' | 'running' | 'done';

export default function DailyChallenge() {
  const { lang, t } = useLanguage();
  const c = getContent<any>(lang, 'homepage').challenge;
  const questions: Question[] = c.questions;

  const [phase, setPhase] = useState<Phase>('idle');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [left, setLeft] = useState(DURATION);
  const [timeUp, setTimeUp] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && left <= 0) { setTimeUp(true); finish(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, phase]);

  function finish() {
    setPhase('done');
    progressStore.recordChallenge();
  }
  function start() {
    setPhase('running'); setIndex(0); setScore(0); setAnswered(false); setLeft(DURATION); setTimeUp(false); setRun((r) => r + 1);
  }
  function next() {
    if (index + 1 >= questions.length) finish();
    else { setIndex(index + 1); setAnswered(false); }
  }

  const mm = `${Math.floor(Math.max(left, 0) / 60)}:${String(Math.max(left, 0) % 60).padStart(2, '0')}`;
  const q = questions[index];

  return (
    <section aria-labelledby="chal-h" className="space-y-3">
      <h2 id="chal-h" className="text-2xl font-bold">⏱ {c.title}</h2>
      {phase === 'idle' && (
        <>
          <p>{c.intro}</p>
          <Button onClick={start}>{c.start}</Button>
        </>
      )}
      {phase === 'running' && (
        <>
          <p className="font-semibold" aria-hidden="true">{c.timeLeft}: <span className="font-mono text-lg">{mm}</span></p>
          <span className="sr-only">{c.timeLeft}: {mm}</span>
          <QuizQuestion
            key={`${run}-${q.id}`}
            question={q}
            number={index + 1}
            total={questions.length}
            onAnswered={(ok) => { setAnswered(true); if (ok) setScore((s) => s + 1); }}
          />
          {answered && <Button onClick={next}>{index + 1 >= questions.length ? c.finish : c.next}</Button>}
        </>
      )}
      <div role="status" aria-live="polite">
        {phase === 'done' && (
          <div className="panel fade-in border-2 border-herb-600">
            {timeUp && <p className="font-bold">{c.timeUp}</p>}
            <p className="text-lg font-bold">{c.result.replace('{score}', String(score)).replace('{total}', String(questions.length))}</p>
            <p className="text-sm">{c.pointsNote}</p>
            <div className="mt-3"><Button variant="secondary" onClick={start}>{c.again}</Button></div>
          </div>
        )}
      </div>
    </section>
  );
}
