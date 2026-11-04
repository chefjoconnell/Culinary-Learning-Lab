import { useEffect, useRef, useState } from 'react';
import type { Question } from '../../data/types';
import { useLanguage } from '../../app/store/languageContext';
import { scoreAnswers, percent } from '../../data/quizzes';
import { progressStore } from '../../features/progress/progressStore';
import QuizQuestion from './QuizQuestion';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

interface Props { questions: Question[]; lessonId?: string }

export default function KnowledgeCheck({ questions, lessonId }: Props) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempt, setAttempt] = useState(0);
  const saved = useRef(-1);

  const answered = Object.keys(answers).length;
  const done = answered === questions.length && questions.length > 0;
  const score = scoreAnswers(questions, answers);

  useEffect(() => {
    if (done && saved.current !== attempt) {
      saved.current = attempt;
      if (lessonId) progressStore.recordResult(lessonId, score, questions.length);
    }
  }, [done, attempt, lessonId, score, questions.length]);

  return (
    <div className="space-y-4">
      <ProgressBar value={answered} max={questions.length} label={`${t('quiz.answeredProgress')}`} valueText={`${answered}/${questions.length}`} />
      {questions.map((q, i) => (
        <QuizQuestion
          key={`${attempt}-${q.id}`}
          question={q}
          number={i + 1}
          total={questions.length}
          onAnswered={(_c, choice) => setAnswers((a) => ({ ...a, [q.id]: choice }))}
        />
      ))}
      <div role="status" aria-live="polite">
        {done && (
          <div className="panel fade-in border-2 border-herb-600">
            <h4 className="text-xl font-bold">{t('quiz.complete')}</h4>
            <p className="text-lg">
              {t('quiz.yourScore')}: <strong>{score} / {questions.length}</strong> ({percent(score, questions.length)}%)
            </p>
            <p>{percent(score, questions.length) >= 80 ? t('quiz.excellent') : t('quiz.review')}</p>
            {lessonId && <p className="text-sm">{t('quiz.saved')}</p>}
            <div className="mt-3">
              <Button variant="secondary" onClick={() => { setAnswers({}); setAttempt((a) => a + 1); }}>{t('quiz.tryAgain')}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
