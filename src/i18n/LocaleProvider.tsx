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
    
    // Handle special route mappings for Spanish/English equivalents
    let newPath = currentPath;
    
    if (to === 'en') {
      // Convert Spanish routes to English routes
      if (currentPath === '/') newPath = '/';
      else if (currentPath === '/sobre') newPath = '/about';
      else if (currentPath === '/servicios') newPath = '/services';
      else if (currentPath === '/contacto') newPath = '/contact';
      else if (currentPath === '/privacidad') newPath = '/privacy';
      else if (currentPath === '/aviso-legal') newPath = '/legal';
      else if (currentPath.startsWith('/casos')) newPath = currentPath.replace('/casos', '/cases');
      else newPath = currentPath;
      
      newPath = `/en${newPath}`;
    } else {
      // Convert English routes to Spanish routes  
      if (currentPath === '/about') newPath = '/sobre';
      else if (currentPath === '/services') newPath = '/servicios';
      else if (currentPath === '/contact') newPath = '/contacto';
      else if (currentPath === '/privacy') newPath = '/privacidad';
      else if (currentPath === '/legal') newPath = '/aviso-legal';
      else if (currentPath.startsWith('/cases')) newPath = currentPath.replace('/cases', '/casos');
      else newPath = currentPath || '/';
    }
    
    console.log('Switching locale:', { from: locale, to, currentPath, newPath });
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