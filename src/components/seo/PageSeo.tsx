import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLocale } from '@/i18n/LocaleProvider';

interface PageSeoProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export function PageSeo({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = "https://kadmeia.com/og-image.jpg",
  ogType = 'website'
}: PageSeoProps) {
  const location = useLocation();
  const { locale } = useLocale();
  
  const baseUrl = "https://kadmeia.com";
  const currentUrl = `${baseUrl}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;
  
  // Generate alternate URLs
  const basePath = location.pathname.replace(/^\/en/, '') || '/';
  const esUrl = `${baseUrl}${basePath}`;
  const enUrl = `${baseUrl}/en${basePath}`;

  // Ensure title is ≤60 chars and description ≤160 chars
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const truncatedDesc = description.length > 160 ? `${description.substring(0, 157)}...` : description;

  return (
    <Helmet>
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang */}
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={esUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:site_name" content="KADMEIA" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Language */}
      <html lang={locale} />
    </Helmet>
  );
}