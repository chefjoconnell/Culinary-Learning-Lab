import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLanguage } from './store/languageContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Home from '../pages/Home';
import Level1 from '../pages/Level1';
import Level2 from '../pages/Level2';
import Level3 from '../pages/Level3';
import Certifications from '../pages/Certifications';
import Bistro from '../pages/Bistro';
import About from '../pages/About';
import Practice from '../pages/Practice';

export default function App() {
  const { t } = useLanguage();
  const main = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (first.current) { first.current = false; return; }
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); main.current?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-saffron-400 focus:px-4 focus:py-3 focus:font-bold focus:text-charcoal-900"
      >
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 focus:outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/level1/:unitId?" element={<Level1 />} />
          <Route path="/level2/:unitId?" element={<Level2 />} />
          <Route path="/level3/:unitId?" element={<Level3 />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/bistro" element={<Bistro />} />
          <Route path="/about" element={<About />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
