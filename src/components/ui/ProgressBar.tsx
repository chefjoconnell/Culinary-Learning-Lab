import { useId } from 'react';

interface Props { value: number; max?: number; label: string; valueText?: string }

export default function ProgressBar({ value, max = 100, label, valueText }: Props) {
  const id = useId();
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  const text = valueText ?? `${pct}%`;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold">
        <span id={id}>{label}</span>
        <span>{text}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={text}
        className="h-3 w-full overflow-hidden rounded-full border border-steel-400 bg-warm-200 dark:bg-charcoal-700"
      >
        <div className="h-full bg-herb-600 transition-[width] dark:bg-herb-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
