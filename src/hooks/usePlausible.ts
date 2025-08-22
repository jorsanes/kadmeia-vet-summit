import { useCallback } from 'react';

interface PlausibleEventProps {
  [key: string]: string | number | boolean;
}

interface PlausibleGoalProps {
  revenue?: {
    currency: string;
    amount: number;
  };
}

/**
 * Hook for Plausible Analytics tracking
 * Provides lightweight, GDPR-compliant analytics without cookies
 */
export function usePlausible() {
  const trackEvent = useCallback((
    eventName: string, 
    props?: PlausibleEventProps,
    options?: PlausibleGoalProps
  ) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(eventName, { props, ...options });
    }
  }, []);

  const trackPageview = useCallback((url?: string) => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview', { u: url });
    }
  }, []);

  // Predefined event tracking functions
  const trackCTA = useCallback((location: string, type: string, label?: string) => {
    trackEvent('CTA Click', {
      location,
      type,
      label: label || 'Unknown'
    });
  }, [trackEvent]);

  const trackScroll = useCallback((depth: number, page: string) => {
    trackEvent('Scroll Depth', {
      depth,
      page,
      milestone: depth >= 75 ? 'High' : depth >= 50 ? 'Medium' : 'Low'
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, source: string) => {
    trackEvent('Download', {
      file: fileName,
      source
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, results: number) => {
    trackEvent('Search', {
      query,
      results,
      hasResults: results > 0
    });
  }, [trackEvent]);

  const trackContact = useCallback((formType: string, source: string) => {
    trackEvent('Contact Form', {
      type: formType,
      source
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageview,
    trackCTA,
    trackScroll,
    trackDownload,
    trackSearch,
    trackContact
  };
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    plausible?: (event: string, options?: any) => void;
  }
}