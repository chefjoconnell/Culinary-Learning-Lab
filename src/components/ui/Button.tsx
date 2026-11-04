import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-lg px-5 py-2 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';
const variants: Record<Variant, string> = {
  primary: 'bg-ember-600 text-white hover:bg-ember-500 dark:bg-saffron-400 dark:text-charcoal-900 dark:hover:bg-saffron-500',
  secondary: 'border-2 border-charcoal-700 text-charcoal-900 hover:bg-warm-100 dark:border-steel-300 dark:text-warm-50 dark:hover:bg-charcoal-700',
  ghost: 'text-charcoal-900 hover:bg-warm-200 dark:text-warm-50 dark:hover:bg-charcoal-700',
};

interface Common { variant?: Variant; className?: string; children: ReactNode }
type Props =
  | (Common & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined })
  | (Common & { to: string; href?: undefined })
  | (Common & { href: string; to?: undefined; external?: boolean });

export default function Button(props: Props) {
  const { variant = 'primary', className = '', children } = props;
  const cls = `${base} ${variants[variant]} ${className}`;
  if (props.to !== undefined) return <Link to={props.to} className={cls}>{children}</Link>;
  if (props.href !== undefined) {
    return <a href={props.href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  const { variant: _v, className: _c, children: _ch, to: _t, href: _h, ...rest } = props as any;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
