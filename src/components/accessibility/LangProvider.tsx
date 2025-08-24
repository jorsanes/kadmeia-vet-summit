
import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface LangProviderProps {
  children: ReactNode;
}

/**
 * Component that updates the HTML lang attribute based on current route
 */
export function LangProvider({ children }: LangProviderProps) {
  const location = useLocation();
  
  useEffect(() => {
    // Determine language based on pathname
    const isEnglish = location.pathname.startsWith('/en');
    const lang = isEnglish ? 'en' : 'es';
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }, [location.pathname]);

  return <>{children}</>;
}
