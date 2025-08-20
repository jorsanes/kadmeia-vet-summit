import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * SEO base:
 * - canonical dinámico según host actual
 * - hreflang ES/EN manteniendo la ruta
 * - noindex en dominios de preview (*.lovable.app)
 * - OG por defecto
 */
export default function SeoBase() {
  const { pathname, search } = useLocation();
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://kadmeia.com";

  const canonical = `${origin}${pathname}${search}`;
  const isPreview =
    typeof window !== "undefined" &&
    /\.lovable\.app$/.test(window.location.hostname);

  // Alternates ES/EN
  const enPath = pathname.startsWith("/en")
    ? pathname
    : `/en${pathname === "/" ? "" : pathname}`;
  const esPath = pathname.startsWith("/en")
    ? pathname.replace(/^\/en/, "") || "/"
    : pathname;

  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="es" href={`${origin}${esPath}`} />
      <link rel="alternate" hrefLang="en" href={`${origin}${enPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${origin}${esPath}`} />
      {isPreview && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:image" content="/og.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
