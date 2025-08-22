import { useEffect, useRef } from 'react';
import { usePlausible } from './usePlausible';

interface ScrollDepthOptions {
  thresholds?: number[];
  enableTracking?: boolean;
  pageName?: string;
}

/**
 * Hook to track scroll depth milestones
 * Useful for measuring content engagement
 */
export function useScrollDepth({
  thresholds = [25, 50, 75, 90],
  enableTracking = true,
  pageName = 'unknown'
}: ScrollDepthOptions = {}) {
  const { trackScroll } = usePlausible();
  const trackedMilestones = useRef<Set<number>>(new Set());
  const isTracking = useRef(enableTracking);

  useEffect(() => {
    isTracking.current = enableTracking;
    
    if (!enableTracking) return;

    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Check thresholds
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedMilestones.current.has(threshold)) {
          trackedMilestones.current.add(threshold);
          trackScroll(threshold, pageName);
        }
      });
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      // Reset tracked milestones when component unmounts
      trackedMilestones.current.clear();
    };
  }, [trackScroll, thresholds, enableTracking, pageName]);

  // Return function to manually reset tracking
  const resetTracking = () => {
    trackedMilestones.current.clear();
  };

  return { resetTracking };
}