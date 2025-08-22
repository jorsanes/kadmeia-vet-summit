import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that updates the HTML lang attribute based on current route
 */
export function LangProvider() {
  const location = useLocation();
  
  useEffect(() => {
    // Determine language based on pathname
    const isEnglish = location.pathname.startsWith('/en');
    const lang = isEnglish ? 'en' : 'es';
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }, [location.pathname]);

  return null; // This component only manages the lang attribute
}