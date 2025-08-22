/**
 * Analytics utilities for KADMEIA
 * Handles UTM parameters, event tracking, and analytics configuration
 */

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/**
 * Generate UTM parameters for tracking
 */
export function generateUTMParams(params: UTMParams): string {
  const searchParams = new URLSearchParams();
  
  if (params.source) searchParams.append('utm_source', params.source);
  if (params.medium) searchParams.append('utm_medium', params.medium);
  if (params.campaign) searchParams.append('utm_campaign', params.campaign);
  if (params.term) searchParams.append('utm_term', params.term);
  if (params.content) searchParams.append('utm_content', params.content);
  
  const utmString = searchParams.toString();
  return utmString ? `?${utmString}` : '';
}

/**
 * Add UTM parameters to a URL
 */
export function addUTMToUrl(baseUrl: string, params: UTMParams): string {
  const utmParams = generateUTMParams(params);
  
  if (!utmParams) return baseUrl;
  
  const separator = baseUrl.includes('?') ? '&' : '';
  return `${baseUrl}${separator}${utmParams.slice(1)}`; // Remove leading ?
}

/**
 * Predefined UTM configurations for common use cases
 */
export const UTM_PRESETS = {
  // Blog CTAs
  blogToContact: {
    source: 'blog',
    medium: 'cta',
    campaign: 'lead_generation',
    content: 'blog_post'
  },
  
  // Case study CTAs
  caseToContact: {
    source: 'cases',
    medium: 'cta',
    campaign: 'case_study',
    content: 'case_detail'
  },
  
  // Home page CTAs
  heroToContact: {
    source: 'home',
    medium: 'hero',
    campaign: 'primary_cta',
    content: 'hero_section'
  },
  
  // Service page CTAs
  serviceToContact: {
    source: 'services',
    medium: 'cta',
    campaign: 'service_inquiry',
    content: 'services_page'
  },
  
  // Footer CTAs
  footerToContact: {
    source: 'footer',
    medium: 'link',
    campaign: 'footer_navigation',
    content: 'footer_cta'
  },
  
  // Related content
  relatedContent: {
    source: 'related',
    medium: 'internal_link',
    campaign: 'content_discovery',
    content: 'related_posts'
  }
} as const;

/**
 * Extract UTM parameters from current URL
 */
export function getUTMFromUrl(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined
  };
}

/**
 * Analytics configuration
 */
export const ANALYTICS_CONFIG = {
  // Plausible domain (set in environment)
  domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'kadmeia.com',
  
  // API endpoint (for custom events)
  apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
  
  // Enable tracking in production only
  enabled: import.meta.env.PROD,
  
  // Scroll depth thresholds
  scrollThresholds: [25, 50, 75, 90],
  
  // Event categories
  events: {
    CTA_CLICK: 'CTA Click',
    SCROLL_DEPTH: 'Scroll Depth',
    DOWNLOAD: 'Download',
    SEARCH: 'Search',
    CONTACT_FORM: 'Contact Form',
    NEWSLETTER: 'Newsletter',
    OUTBOUND_LINK: 'Outbound Link'
  }
} as const;