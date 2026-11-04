import { useId, type ReactNode } from 'react';

interface Props { title: string; objective?: { label: string; text: string }; children: ReactNode; className?: string }

export default function LessonSection({ title, objective, children, className = '' }: Props) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`space-y-4 ${className}`}>
      <h3 id={id} className="text-2xl font-bold">{title}</h3>
      {objective && (
        <p className="rounded-lg border-l-4 border-herb-600 bg-warm-100 p-4 dark:bg-charcoal-700">
          <strong>{objective.label}: </strong>{objective.text}
        </p>
      )}
      {children}
    </section>
  );
}
