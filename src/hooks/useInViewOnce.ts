import { useEffect, useRef, useState } from 'react';

export function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { rootMargin: '0px 0px -10% 0px', ...options });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, options]);

  return { ref, inView };
}