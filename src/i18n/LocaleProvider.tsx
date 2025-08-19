import React, { createContext, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LocaleContextType {
  locale: 'es' | 'en';
  switchLocale: (to: 'es' | 'en') => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'es',
  switchLocale: () => {},
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const locale = location.pathname.startsWith('/en') ? 'en' : 'es';
  
  const switchLocale = (to: 'es' | 'en') => {
    const currentPath = location.pathname.replace(/^\/en/, '');
    const newPath = to === 'en' ? `/en${currentPath || '/'}` : (currentPath || '/');
    navigate(newPath, { replace: true });
  };

  // Sync i18n language with URL-based locale
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}