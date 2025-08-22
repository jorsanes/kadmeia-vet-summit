import React, { useEffect, useRef } from 'react';
import { ReactNode } from 'react';

interface FilteredMDXContentProps {
  children: ReactNode;
}

export function FilteredMDXContent({ children }: FilteredMDXContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Eliminar párrafos que contengan frontmatter después del renderizado
    if (contentRef.current) {
      const firstParagraph = contentRef.current.querySelector('p:first-of-type');
      if (firstParagraph) {
        const text = firstParagraph.textContent || '';
        // Verificar si contiene keys de frontmatter
        const frontmatterKeys = ['title:', 'date:', 'excerpt:', 'cover:', 'lang:', 'tags:', 'client:', 'sector:', 'ubicacion:', 'servicios:', 'duration:', 'clinics:', 'kpis:', 'testimonial:', 'draft:'];
        const containsFrontmatter = frontmatterKeys.some(key => text.includes(key));
        
        if (containsFrontmatter || text.length > 500) {
          (firstParagraph as HTMLElement).style.display = 'none';
        }
      }
    }
  }, [children]);
  
  return (
    <div ref={contentRef}>
      {children}
    </div>
  );
}