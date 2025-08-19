import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HrefLangLinks = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Remove existing hreflang links
    const existingLinks = document.querySelectorAll('link[rel="alternate"]');
    existingLinks.forEach(link => link.remove());
    
    // Get the current path without /en prefix
    const basePath = location.pathname.replace(/^\/en/, '') || '/';
    
    // Create new hreflang links
    const esLink = document.createElement('link');
    esLink.rel = 'alternate';
    esLink.hreflang = 'es';
    esLink.href = `${window.location.origin}${basePath}`;
    
    const enLink = document.createElement('link');
    enLink.rel = 'alternate';
    enLink.hreflang = 'en';
    enLink.href = `${window.location.origin}/en${basePath}`;
    
    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = `${window.location.origin}${basePath}`;
    
    document.head.appendChild(esLink);
    document.head.appendChild(enLink);
    document.head.appendChild(xDefaultLink);
    
    return () => {
      // Cleanup on unmount
      const links = document.querySelectorAll('link[rel="alternate"]');
      links.forEach(link => link.remove());
    };
  }, [location.pathname]);
  
  return null;
};

export default HrefLangLinks;