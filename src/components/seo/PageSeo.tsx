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
  url?: string; // Opcional: si se proporciona, no usa useLocation
}

export function PageSeo({
  title,
  description,
  canonical,
  noindex = false,
  ogImage = "/og.png",
  ogType = 'website',
  url
}: PageSeoProps) {
  // Solo usar useLocation si no se proporciona URL explícita
  let location: { pathname: string; search?: string } | undefined;
  try {
    location = url ? { pathname: url, search: '' } : useLocation();
  } catch (error) {
    // Si useLocation falla (fuera del Router), usar URL por defecto
    location = { pathname: '/', search: '' };
  }
  
  const { locale } = useLocale();

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://kadmeia.com";

  const currentUrl = url || `${origin}${location.pathname}${location.search || ""}`;
  const canonicalUrl = canonical || currentUrl;

  // Alternates ES/EN manteniendo la ruta
  const basePath = location.pathname.replace(/^\/en/, '') || '/';
  const esUrl = `${origin}${basePath}`;
  const enUrl = `${origin}/en${basePath === '/' ? '' : basePath}`;

  // Longitud segura
  const truncatedTitle = title.length > 60 ? `${title.slice(0,57)}...` : title;
  const truncatedDesc = description.length > 160 ? `${description.slice(0,157)}...` : description;

  const isPreview =
    typeof window !== "undefined" &&
    /\.lovable\.app$/.test(window.location.hostname);

  // Twitter handle opcional via env (p.ej. VITE_TWITTER_SITE=@kadmeia)
  const twitterSite = import.meta.env.VITE_TWITTER_SITE as string | undefined;

  const absoluteOg = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`;

  return (
    <Helmet>
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <meta name="robots" content={noindex || isPreview ? "noindex,nofollow" : "index,follow"} />

      <link rel="canonical" href={canonicalUrl} />

      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={esUrl} />

      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={absoluteOg} />
      <meta property="og:locale" content={locale === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:site_name" content="KADMEIA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={absoluteOg} />
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}

      <html lang={locale} />
    </Helmet>
  );
}
