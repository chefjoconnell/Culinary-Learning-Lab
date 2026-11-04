import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  to?: string;
  eyebrow?: string;
  headingLevel?: 2 | 3;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Card with a single stretched link when `to` is provided (one tab stop, whole card clickable). */
export default function Card({ title, to, eyebrow, headingLevel = 3, children, footer, className = '' }: Props) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className={`panel relative flex flex-col gap-2 transition-shadow focus-within:ring-2 focus-within:ring-saffron-500 ${to ? 'hover:shadow-md' : ''} ${className}`}>
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-ember-600 dark:text-saffron-400">{eyebrow}</p>}
      <H className="text-xl font-bold">
        {to ? <Link to={to} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4">{title}</Link> : title}
      </H>
      {children && <div className="text-steel-600 dark:text-steel-300">{children}</div>}
      {footer && <div className="relative mt-auto pt-2">{footer}</div>}
    </article>
  );
}
