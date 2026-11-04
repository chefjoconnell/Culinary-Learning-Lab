import { useState } from 'react';
import { useLanguage } from '../../app/store/languageContext';
import { getContent } from '../../data/content-loader';
import { dailyIndex } from '../../data/quizzes';
import type { Question } from '../../data/types';
import { progressStore } from '../../features/progress/progressStore';
import QuizQuestion from './QuizQuestion';

export default function BellRinger() {
  const { lang } = useLanguage();
  const c = getContent<any>(lang, 'homepage').bellRinger;
  const qs: Question[] = c.questions;
  const q = qs[dailyIndex(qs.length)];
  const [done, setDone] = useState(false);
  return (
    <section aria-labelledby="bell-h" className="space-y-3">
      <h2 id="bell-h" className="text-2xl font-bold">🔔 {c.title}</h2>
      <p>{c.intro}</p>
      <QuizQuestion key={`${lang}-${q.id}`} question={q} onAnswered={() => { setDone(true); progressStore.recordBellRinger(); }} />
      <p role="status" className="font-semibold text-herb-600 dark:text-herb-400">{done ? `✓ ${c.done}` : ''}</p>
    </section>
  );
}
