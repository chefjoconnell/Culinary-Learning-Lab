import { useId } from 'react';
import { useLanguage } from '../../app/store/languageContext';
import LessonSection from './LessonSection';

export default function ExitTicket({ prompt, reflection }: { prompt: string; reflection: string }) {
  const { t } = useLanguage();
  const a = useId();
  const b = useId();
  return (
    <LessonSection title={t('lesson.exit')}>
      <div className="space-y-4">
        <div>
          <label htmlFor={a} className="mb-1 block text-lg font-semibold">{prompt}</label>
          <textarea id={a} rows={4} placeholder={t('lesson.exitPlaceholder')} className="w-full rounded-lg border-2 border-steel-400 bg-white p-3 text-charcoal-900" />
        </div>
        <div>
          <label htmlFor={b} className="mb-1 block text-lg font-semibold">{t('lesson.reflection')}: {reflection}</label>
          <textarea id={b} rows={3} placeholder={t('lesson.exitPlaceholder')} className="w-full rounded-lg border-2 border-steel-400 bg-white p-3 text-charcoal-900" />
        </div>
        <p className="text-sm text-steel-600 dark:text-steel-300">{t('lesson.exitNote')}</p>
      </div>
    </LessonSection>
  );
}
