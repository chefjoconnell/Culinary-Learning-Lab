import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './app/App';
import { LanguageProvider } from './app/store/languageContext';
import './index.css';

// HashRouter keeps deep links working on GitHub Pages (static hosting) and inside Canvas links.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
