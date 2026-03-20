import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('jv_lang') || 'hi';
  });

  // Sync HTML lang attribute and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('jv_lang', lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState(prev => prev === 'hi' ? 'en' : 'hi');
  }, []);

  const isHindi = lang === 'hi';

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isHindi }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be inside LanguageProvider');
  return ctx;
}
