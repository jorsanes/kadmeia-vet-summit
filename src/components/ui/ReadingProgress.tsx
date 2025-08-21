import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface ReadingProgressProps {
  target: string;
  className?: string;
}

export default function ReadingProgress({ target, className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Calcular progreso: 0% cuando empieza a entrar, 100% cuando termina de salir
      const scrolled = Math.max(0, -elementTop);
      const totalScrollable = elementHeight - windowHeight;
      const progressPercentage = totalScrollable > 0 
        ? Math.min(100, (scrolled / totalScrollable) * 100)
        : 0;

      setProgress(progressPercentage);
    };

    const handleScroll = () => {
      if (!shouldReduceMotion) {
        requestAnimationFrame(updateProgress);
      }
    };

    // Configuración inicial
    updateProgress();

    // Solo agregar listener si no hay preferencia de movimiento reducido
    if (!shouldReduceMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', updateProgress, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target, shouldReduceMotion]);

  // No mostrar si prefiere movimiento reducido
  if (shouldReduceMotion) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-muted/20 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Progreso de lectura del artículo"
    >
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          transform: shouldReduceMotion ? 'none' : 'translateZ(0)' // Force GPU acceleration
        }}
      />
    </div>
  );
}