import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import EnhancedProse from '@/components/prose/EnhancedProse';
import { enhancedMDXComponents } from '@/components/prose/MDXComponents';

const modules = import.meta.glob("@/content/blog/**/*.{mdx,md}");

export default function PostDetail() {
  const { slug = '' } = useParams();
  const isEN = useLocation().pathname.startsWith('/en/');
  const lang = isEN ? 'en' : 'es';

  const key = Object.keys(modules).find(p => p.includes(`/blog/${lang}/${slug}.`));
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [meta, setMeta] = React.useState<any>(null);

  React.useEffect(() => {
    if (!key) return;
    (async () => {
      const mod: any = await modules[key]!();
      setComp(() => mod.default);
      setMeta(mod.meta || {});
    })();
  }, [key]);

  if (!key) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-serif mb-4">{isEN ? "Post not found" : "Artículo no encontrado"}</h1>
      <Link to={isEN ? "/en/blog" : "/blog"} className="text-primary hover:underline">
        {isEN ? "Back to blog" : "Volver al blog"}
      </Link>
    </div>
  );
  
  if (!Comp) return <div className="container py-16">Cargando…</div>;

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
        day: "2-digit",
        month: "long", 
        year: "numeric",
      });
    } catch { return date; }
  };

  const title = `${meta?.title || slug} | KADMEIA`;
  const desc = meta?.excerpt ?? (isEN ? 'KADMEIA article' : 'Artículo de KADMEIA');
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kadmeia.com';

  // JSON-LD structured data for BlogPosting
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta?.title || slug,
    "description": meta?.excerpt || desc,
    "author": {
      "@type": "Organization",
      "name": "KADMEIA",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization", 
      "name": "KADMEIA",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/og.png`
      }
    },
    "datePublished": meta?.date,
    "dateModified": meta?.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    ...(meta?.cover && {
      "image": {
        "@type": "ImageObject", 
        "url": meta.cover
      }
    }),
    ...(meta?.tags && {
      "keywords": meta.tags.join(", ")
    })
  };

  return (
    <div className="container max-w-6xl py-12">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {meta?.cover && <meta property="og:image" content={meta.cover} />}
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link 
          to={isEN ? "/en/blog" : "/blog"} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEN ? "Back to blog" : "Volver al blog"}
        </Link>
      </div>

      {/* Header */}
      <article>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-4">
            {meta?.title || slug}
          </h1>
          
          {meta?.date && (
            <p className="text-sm text-muted-foreground mb-4">
              {formatDate(meta.date)}
            </p>
          )}

          {meta?.tags && meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meta.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <MDXProvider components={enhancedMDXComponents}>
            <EnhancedProse>
              <Comp />
            </EnhancedProse>
          </MDXProvider>
        </div>
      </article>
    </div>
  );
}