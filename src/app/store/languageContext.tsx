import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../../data/types';
import { translate } from '../../data/content-loader';

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<LanguageCtx | null>(null);
const KEY = 'rmctc-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    const title = translate(lang, 'site.title');
    document.title = `RMCTC ${title}`;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  }, []);

  const value = useMemo<LanguageCtx>(() => ({ lang, setLang, t: (k) => translate(lang, k) }), [lang, setLang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLanguage(): LanguageCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLanguage must be used inside LanguageProvider');
  return v;
}
