import type { Lang } from './types';

const modules = import.meta.glob('../content/*/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

export const LANGS: Lang[] = ['en', 'es'];

/** Load a content file (e.g. "level1") for a language. Falls back to English. */
export function getContent<T = any>(lang: Lang, name: string): T {
  const found = modules[`../content/${lang}/${name}.json`] ?? modules[`../content/en/${name}.json`];
  if (!found) throw new Error(`Missing content file: ${lang}/${name}.json`);
  return found as T;
}

export function lookup(obj: unknown, path: string): unknown {
  return path.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Dotted-path lookup in common.json, falling back to English, then to the key itself. */
export function translate(lang: Lang, key: string): string {
  const v = lookup(getContent(lang, 'common'), key) ?? lookup(getContent('en', 'common'), key);
  return typeof v === 'string' ? v : key;
}

export function canvasUrl(lang: Lang, path = ''): string {
  const base = (getContent<any>(lang, 'common').canvas.baseUrl as string).replace(/\/$/, '');
  return `${base}${path}`;
}
