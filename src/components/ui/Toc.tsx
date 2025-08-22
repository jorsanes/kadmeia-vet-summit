import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import GithubSlugger from 'github-slugger';

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
    const slugger = new GithubSlugger();

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      let id = heading.id;
      
      // Si no tiene ID, generar uno usando github-slugger (igual que rehype-slug)
      if (!id) {
        id = slugger.slug(text);
        heading.id = id;
      } else {
        // Reset slugger to match existing IDs if they already exist
        slugger.slug(text, false);
      }

      tocItems.push({
        id,
        text,
        level
      });
    });

    setItems(tocItems);
  }, []);

  // Observar secciones activas y sincronizar con hash de URL
  useEffect(() => {
    if (items.length === 0) return;

    // Sincronizar estado inicial con hash de URL
    const initialHash = window.location.hash.slice(1);
    if (initialHash && items.some(item => item.id === initialHash)) {
      setActiveId(initialHash);
    }

    if (shouldReduceMotion) return;

    const headingElements = items.map(item => document.getElementById(item.id)).filter(Boolean);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Tomar el primer elemento visible
          const activeEntry = visibleEntries[0];
          const newActiveId = activeEntry.target.id;
          setActiveId(newActiveId);
          
          // Actualizar URL solo si es diferente del hash actual
          if (window.location.hash !== `#${newActiveId}`) {
            history.replaceState(null, '', `#${newActiveId}`);
          }
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
    
    // Check if we're already on this hash to avoid unnecessary history updates
    const currentHash = window.location.hash.slice(1);
    if (currentHash === id) {
      return;
    }
    
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
      
      // Actualizar URL solo si no estamos ya en ese hash
      if (window.location.hash !== `#${id}`) {
        history.replaceState(null, '', `#${id}`);
      }
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav 
      className={`sticky top-24 bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 max-h-[60vh] overflow-y-auto ${className}`}
      aria-label="Índice del contenido"
      role="navigation"
    >
      <h2 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-full" />
        {title}
      </h2>
      
      <ul className="space-y-1 text-sm" role="list">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isH3 = item.level === 3;
          
          return (
            <li key={item.id} role="listitem">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`
                  block py-1.5 px-2 rounded-md transition-all duration-200
                  hover:bg-primary/5 hover:text-primary
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${isH3 ? 'ml-4 text-xs' : 'text-sm'}
                  ${isActive 
                    ? 'text-primary bg-primary/10 font-medium border-l-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                aria-current={isActive ? 'location' : undefined}
                aria-describedby={isActive ? `toc-${item.id}-desc` : undefined}
              >
                {item.text}
                {isActive && (
                  <span id={`toc-${item.id}-desc`} className="sr-only">
                    (sección actual)
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}