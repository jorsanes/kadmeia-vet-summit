import { Helmet } from 'react-helmet-async';

interface OrganizationJsonLdProps {
  url?: string;
}

export function OrganizationJsonLd({ url = "https://kadmeia.com" }: OrganizationJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KADMEIA",
    url,
    logo: `${url}/kadmeia-logo-large.png`,
    description: "Consultoría y tecnología veterinaria que une evidencia, claridad e impacto",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Camino de los Malatones, 63 - J3",
      addressLocality: "Algete",
      addressRegion: "Madrid",
      postalCode: "28119",
      addressCountry: "ES"
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@kadmeia.com",
      contactType: "customer service"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  tags?: string[];
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = "KADMEIA",
  image,
  tags = []
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author
    },
    publisher: {
      "@type": "Organization",
      name: "KADMEIA",
      logo: {
        "@type": "ImageObject",
        url: "https://kadmeia.com/kadmeia-logo-large.png"
      }
    },
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image
      }
    }),
    ...(tags.length > 0 && { keywords: tags.join(", ") })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}