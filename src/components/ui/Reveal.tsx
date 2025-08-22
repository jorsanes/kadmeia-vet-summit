import { motion, useReducedMotion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

export default function Reveal({ 
  children, 
  delay = 0, 
  y = 12, 
  once = true,
  className 
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Si prefiere movimiento reducido, mostrar inmediatamente
    if (shouldReduceMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            setHasBeenInView(true);
          }
        } else if (!once && !hasBeenInView) {
          setIsInView(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, hasBeenInView, shouldReduceMotion]);

  // Si prefiere movimiento reducido, renderizar sin animación
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ 
        duration: 0.6, 
        delay: isInView ? delay : 0,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
    >
      {children}
    </motion.div>
  );
}