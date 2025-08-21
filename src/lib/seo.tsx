import * as React from "react";
import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  locale?: "es" | "en";
};

export function PageSeo({ title, description, url, image, type = "website" }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

export function ArticleJsonLd(input: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  description?: string;
  url?: string;
  image?: string;
  authorName?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    description: input.description,
    image: input.image,
    url: input.url,
    author: { "@type": "Person", name: input.authorName ?? "KADMEIA" },
    publisher: { "@type": "Organization", name: "KADMEIA" },
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}