import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import EnhancedProse from '@/components/prose/EnhancedProse';
import { enhancedMDXComponents } from '@/components/mdx';
import ReadingProgress from '@/components/ui/ReadingProgress';
import Toc from '@/components/ui/Toc';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { SeriesNavigation } from '@/components/blog/SeriesNavigation';

const modules = import.meta.glob("@/content/blog/**/*.{mdx,md}");
const allModules = import.meta.glob("@/content/blog/**/*.{mdx,md}", { eager: true });

export default function PostDetail() {
  const { slug = '' } = useParams();
  const isEN = useLocation().pathname.startsWith('/en/');
  const lang = isEN ? 'en' : 'es';

  const key = Object.keys(modules).find(p => p.includes(`/blog/${lang}/${slug}.`));
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [meta, setMeta] = React.useState<any>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]);
  const [seriesPosts, setSeriesPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!key) return;
    (async () => {
      const mod: any = await modules[key]!();
      setComp(() => mod.default);
      const postMeta = mod.meta || {};
      setMeta(postMeta);

      // Get all posts for related articles and series
      const allPosts = Object.entries(allModules)
        .map(([path, module]: [string, any]) => {
          const slug = path.split('/').pop()?.replace(/\.(mdx|md)$/, '') || '';
          const postLang = path.includes(`/blog/en/`) ? 'en' : 'es';
          return {
            slug,
            lang: postLang,
            path,
            ...module.meta
          };
        })
        .filter(post => post.lang === lang);

      // Find related posts by tag intersection
      if (postMeta.tags) {
        const related = allPosts
          .filter(post => {
            if (post.slug === slug) return false;
            const intersection = post.tags?.filter((tag: string) => 
              postMeta.tags.includes(tag)
            ) || [];
            return intersection.length > 0;
          })
          .sort((a, b) => {
            const aIntersection = a.tags?.filter((tag: string) => 
              postMeta.tags.includes(tag)
            )?.length || 0;
            const bIntersection = b.tags?.filter((tag: string) => 
              postMeta.tags.includes(tag)
            )?.length || 0;
            return bIntersection - aIntersection;
          })
          .slice(0, 3);
        
        setRelatedPosts(related);
      }

      // Find series posts
      if (postMeta.series) {
        const seriesArticles = allPosts
          .filter(post => post.series === postMeta.series)
          .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
        
        setSeriesPosts(seriesArticles);
      }
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

  // Calculate reading time if not provided
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = lang === 'es' ? 200 : 220;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // QA Check for mandatory fields
  const missingFields = [];
  if (!meta?.title) missingFields.push('title');
  if (!meta?.excerpt) missingFields.push('excerpt');
  if (!meta?.cover) missingFields.push('cover');
  if (!meta?.tags || meta.tags.length === 0) missingFields.push('tags');
  
  const showQAWarning = missingFields.length > 0 && process.env.NODE_ENV === 'development';

  const title = `${meta?.title || slug} | KADMEIA`;
  const desc = meta?.excerpt ?? (isEN ? 'KADMEIA article' : 'Artículo de KADMEIA');
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kadmeia.com';
  
  // Generate hreflang URLs
  const baseUrl = url.replace(/\/(en\/)?blog\/.*$/, '');
  const esUrl = `${baseUrl}/blog/${slug}`;
  const enUrl = `${baseUrl}/en/blog/${slug}`;
  
  // OG Image with fallback to generated version
  const ogImage = meta?.cover 
    ? (meta.cover.startsWith('http') ? meta.cover : `${siteUrl}${meta.cover}`)
    : `${siteUrl}/og/blog/${slug}-${lang}.png`;

  // JSON-LD structured data for BlogPosting
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta?.title || slug,
    "description": meta?.excerpt || desc,
    "author": meta?.author ? {
      "@type": "Person",
      "name": meta.author.name,
      ...(meta.author.bio && { "description": meta.author.bio })
    } : {
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
    "dateModified": meta?.updatedAt || meta?.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "image": {
      "@type": "ImageObject", 
      "url": ogImage,
      "width": 1200,
      "height": 630
    },
    ...(meta?.tags && {
      "keywords": meta.tags.join(", ")
    }),
    ...(meta?.readingTime && {
      "timeRequired": `PT${meta.readingTime}M`
    })
  };

  return (
    <>
      <ReadingProgress target="#article-root" />
      
      <div className="container max-w-7xl py-12">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={desc} />
          
          {/* Hreflang links */}
          <link rel="alternate" hrefLang="es" href={esUrl} />
          <link rel="alternate" hrefLang="en" href={enUrl} />
          <link rel="alternate" hrefLang="x-default" href={esUrl} />
          
          {/* Open Graph */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={desc} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:locale" content={lang === "es" ? "es_ES" : "en_GB"} />
          <meta property="og:site_name" content="KADMEIA" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={desc} />
          <meta name="twitter:image" content={ogImage} />
          
          <link rel="canonical" href={url} />
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>

        {/* QA Warning for Development */}
        {showQAWarning && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 font-medium">⚠️ QA Warning: Missing mandatory fields:</p>
            <ul className="text-yellow-700 text-sm mt-1">
              {missingFields.map(field => (
                <li key={field}>• {field}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
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

            <article id="article-root">
              {/* Enhanced Header */}
              <BlogHeader
                title={meta?.title || slug}
                date={meta?.date || ''}
                updatedAt={meta?.updatedAt}
                readingTime={meta?.readingTime}
                tags={meta?.tags || []}
                author={meta?.author}
                cover={meta?.cover}
                lang={lang}
              />

              {/* Series Navigation */}
              {meta?.series && seriesPosts.length > 1 && (
                <SeriesNavigation
                  seriesName={meta.series}
                  posts={seriesPosts.map(post => ({
                    slug: post.slug,
                    title: post.title,
                    order: post.seriesOrder || 0
                  }))}
                  currentSlug={slug}
                  lang={lang}
                />
              )}

              {/* Content */}
              <div className="max-w-none">
                <MDXProvider components={enhancedMDXComponents}>
                  <EnhancedProse>
                    <Comp />
                  </EnhancedProse>
                </MDXProvider>
              </div>

              {/* CTA Block */}
              <BlogCTA lang={lang} type="mixed" />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <RelatedPosts
                  posts={relatedPosts}
                  lang={lang}
                  currentSlug={slug}
                />
              )}
            </article>
          </div>

          {/* Sidebar con TOC */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Toc title={isEN ? "Table of Contents" : "Índice"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}