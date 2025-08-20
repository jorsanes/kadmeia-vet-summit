import { Helmet } from "react-helmet-async";

export default function StructuredData() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KADMEIA",
    "url": "https://kadmeia.com",
    "logo": "https://kadmeia.com/og.png",
    "sameAs": [
      "https://www.linkedin.com/company/kadmeia"
    ]
  };

  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KADMEIA",
    "url": "https://kadmeia.com",
    "inLanguage": "es-ES",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kadmeia.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(org)}</script>
      <script type="application/ld+json">{JSON.stringify(site)}</script>
    </Helmet>
  );
}
