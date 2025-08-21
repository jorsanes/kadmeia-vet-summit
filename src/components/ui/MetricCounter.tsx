import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MetricCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function MetricCounter({ 
  value, 
  suffix = "%", 
  duration = 1.2, 
  decimals = 0,
  className = ""
}: MetricCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const hasAnimatedRef = useRef(false);

  const formatValue = (val: number) => {
    return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  };

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    
    // Easing function (ease-out)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = value * easeOutQuart;
    
    setDisplayValue(currentValue);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
      setIsAnimating(false);
      hasAnimatedRef.current = true;
    }
  };

  const startAnimation = () => {
    if (shouldReduceMotion || hasAnimatedRef.current) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = undefined;
    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    // Usar IntersectionObserver para iniciar la animación cuando sea visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`metric-${value}-${suffix}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      observer.disconnect();
    };
  }, [value, duration, shouldReduceMotion]);

  return (
    <span 
      id={`metric-${value}-${suffix}`}
      className={className}
      aria-label={`${formatValue(value)}${suffix}`}
    >
      {formatValue(displayValue)}{suffix}
    </span>
  );
}