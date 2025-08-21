import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  className?: string;
  title?: string;
}

export default function Toc({ className = "", title = "Índice" }: TocProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const shouldReduceMotion = useReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extraer headings del contenido
  useEffect(() => {
    const headings = document.querySelectorAll('article h2, article h3');
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      let id = heading.id;
      
      // Generar ID si no existe
      if (!id) {
        id = `heading-${index}-${heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'untitled'}`;
        heading.id = id;
      }

      tocItems.push({
        id,
        text: heading.textContent || '',
        level
      });
    });

    setItems(tocItems);
  }, []);

  // Observar secciones activas
  useEffect(() => {
    if (items.length === 0 || shouldReduceMotion) return;

    const headingElements = items.map(item => document.getElementById(item.id)).filter(Boolean);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Tomar el primer elemento visible
          const activeEntry = visibleEntries[0];
          setActiveId(activeEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0% -70% 0%', // Activar cuando esté en el tercio superior
        threshold: 0
      }
    );

    headingElements.forEach(element => {
      if (element) observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items, shouldReduceMotion]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Espacio para header fijo
      
      if (shouldReduceMotion) {
        // Scroll inmediato si prefiere movimiento reducido
        window.scrollTo(0, offsetTop);
      } else {
        // Scroll suave
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
      
      // Actualizar URL
      history.replaceState(null, '', `#${id}`);
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav 
      className={`sticky top-24 bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 max-h-[60vh] overflow-y-auto ${className}`}
      aria-label="Índice del contenido"
    >
      <h2 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        {title}
      </h2>
      
      <ul className="space-y-1 text-sm">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isH3 = item.level === 3;
          
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  block py-1.5 px-2 rounded-md transition-all duration-200
                  hover:bg-primary/5 hover:text-primary
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1
                  ${isH3 ? 'ml-4 text-xs' : 'text-sm'}
                  ${isActive 
                    ? 'text-primary bg-primary/10 font-medium border-l-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-current={isActive ? 'location' : undefined}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}