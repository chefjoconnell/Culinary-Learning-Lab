import { useId, useState } from 'react';
import type { Question } from '../../data/types';
import { useLanguage } from '../../app/store/languageContext';
import Button from '../ui/Button';

interface Props {
  question: Question;
  number?: number;
  total?: number;
  onAnswered?: (correct: boolean, choice: string) => void;
}

export default function QuizQuestion({ question, number, total, onAnswered }: Props) {
  const { t } = useLanguage();
  const uid = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);

  const correct = selected === question.correct;
  const correctText = question.options.find((o) => o.id === question.correct)?.text;

  const check = () => {
    if (!selected) { setHint(true); return; }
    setHint(false);
    setChecked(true);
    onAnswered?.(selected === question.correct, selected);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!checked) check(); }} className="panel">
      <fieldset aria-describedby={`${uid}-fb`}>
        <legend className="mb-3 text-lg font-semibold">
          {number !== undefined && (
            <span className="mr-2 text-sm font-bold uppercase text-ember-600 dark:text-saffron-400">
              {t('quiz.question')} {number}{total ? ` ${t('quiz.of')} ${total}` : ''}
            </span>
          )}
          <span className="block">{question.stem}</span>
        </legend>
        <div className="space-y-2">
          {question.options.map((o) => {
            const isSel = selected === o.id;
            const isRight = checked && o.id === question.correct;
            const isWrong = checked && isSel && !isRight;
            return (
              <label
                key={o.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2 ${
                  isRight ? 'border-herb-600 bg-herb-400/20' : isWrong ? 'border-ember-600 bg-ember-400/20' : isSel ? 'border-charcoal-700 dark:border-saffron-400' : 'border-steel-300 dark:border-charcoal-600'
                }`}
              >
                <input
                  type="radio"
                  name={`${uid}-q`}
                  value={o.id}
                  checked={isSel}
                  disabled={checked}
                  onChange={() => { setSelected(o.id); setHint(false); }}
                  className="h-5 w-5 accent-ember-600"
                />
                <span className="flex-1">{o.text}</span>
                {isRight && <span aria-hidden="true" className="font-bold text-herb-600 dark:text-herb-400">✓</span>}
                {isWrong && <span aria-hidden="true" className="font-bold text-ember-600 dark:text-ember-400">✗</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
      {!checked && (
        <div className="mt-4">
          <Button type="submit">{t('quiz.checkAnswer')}</Button>
        </div>
      )}
      <div id={`${uid}-fb`} role="status" aria-live="polite" className="mt-3">
        {hint && !checked && <p className="font-semibold text-ember-600 dark:text-ember-400">{t('quiz.chooseFirst')}</p>}
        {checked && (
          <div className="fade-in rounded-lg border-2 border-steel-400 bg-warm-50 p-3 dark:bg-charcoal-900">
            <p className={`font-bold ${correct ? 'text-herb-600 dark:text-herb-400' : 'text-ember-600 dark:text-ember-400'}`}>
              <span aria-hidden="true">{correct ? '✓ ' : '✗ '}</span>
              {correct ? t('quiz.correct') : t('quiz.incorrect')}
            </p>
            {!correct && <p><strong>{t('quiz.correctAnswerWas')}</strong> {correctText}</p>}
            <p><strong>{t('quiz.explanation')}:</strong> {question.explanation}</p>
          </div>
        )}
      </div>
    </form>
  );
}
