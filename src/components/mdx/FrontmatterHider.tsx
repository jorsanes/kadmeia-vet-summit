import { useEffect } from 'react';

export function FrontmatterHider() {
  useEffect(() => {
    // Buscar y ocultar párrafos que contengan frontmatter después del DOM se renderiza
    const timer = setTimeout(() => {
      const articles = document.querySelectorAll('article.case-prose, article.prose');
      
      articles.forEach(article => {
        const firstParagraph = article.querySelector('p:first-of-type');
        if (firstParagraph) {
          const text = firstParagraph.textContent || '';
          
          // Lista de keys de frontmatter comunes
          const frontmatterKeys = [
            'title:', 'date:', 'excerpt:', 'cover:', 'lang:', 'tags:', 
            'client:', 'sector:', 'ubicacion:', 'servicios:', 'duration:', 
            'clinics:', 'kpis:', 'testimonial:', 'draft:'
          ];
          
          // Si el párrafo contiene frontmatter keys y es muy largo, ocultarlo
          const containsFrontmatter = frontmatterKeys.some(key => text.includes(key));
          const isVeryLong = text.length > 300;
          
          if (containsFrontmatter && isVeryLong) {
            (firstParagraph as HTMLElement).style.display = 'none';
          }
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}