import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import EnhancedProse from '@/components/prose/EnhancedProse';
import { enhancedMDXComponents } from '@/components/mdx';
import ReadingProgress from '@/components/ui/ReadingProgress';
import Toc from '@/components/ui/Toc';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrevNextNavigation } from '@/components/ui/PrevNextNavigation';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogCTA } from '@/components/blog/BlogCTA';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { SeriesNavigation } from '@/components/blog/SeriesNavigation';
import { getRelatedContent, getPrevNextItems, generateBreadcrumbs } from '@/lib/navigation';
import { usePlausible } from '@/hooks/usePlausible';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { UTM_PRESETS } from '@/lib/analytics';
import { getHreflangUrl, getRelatedByTags } from '@/lib/hreflang';
import { getAllPostsMeta } from '@/lib/content';
import ErrorBoundary from '@/components/ErrorBoundary';

const modules = import.meta.glob("@/content/blog/**/*.{mdx,md}");
const allModules = import.meta.glob("@/content/blog/**/*.{mdx,md}", { eager: true });

export default function PostDetail() {
  const { slug = '' } = useParams();
  const isEN = useLocation().pathname.startsWith('/en/');
  const lang = isEN ? 'en' : 'es';
  const { trackCTA } = usePlausible();
  
  // Track scroll depth for engagement metrics
  useScrollDepth({
    enableTracking: true,
    pageName: `blog-${slug}`
  });

  const key = Object.keys(modules).find(p => p.includes(`/blog/${lang}/${slug}.`));
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [meta, setMeta] = React.useState<any>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]);
  const [seriesPosts, setSeriesPosts] = React.useState<any[]>([]);
  const [prevNext, setPrevNext] = React.useState<{ prev?: any; next?: any }>({});

  React.useEffect(() => {
    if (!key) return;
    (async () => {
      const mod: any = await modules[key]!();
      setComp(() => mod.default);
      const postMeta = mod.meta || {};
      setMeta(postMeta);

      // Find related posts using the new navigation utility
      if (postMeta.tags) {
        const related = getRelatedContent('blog', slug, postMeta.tags, lang, 3);
        setRelatedPosts(related);
      }

      // Get prev/next navigation
      const navigation = getPrevNextItems('blog', slug, lang);
      setPrevNext(navigation);

      // Find series posts using existing logic
      if (postMeta.series) {
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
      <Link 
        to={isEN ? "/en/blog" : "/blog"} 
        className="text-primary hover:underline"
        onClick={() => trackCTA('blog-detail', 'back-to-blog', 'not-found')}
      >
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
  
  const showQAWarning = missingFields.length > 0 && import.meta.env.DEV;

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

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs('blog', lang, slug, meta?.title);

  // Calculate hreflang URLs
  const currentUrl = url;
  const alternateUrl = `${siteUrl}${getHreflangUrl(slug, lang, 'blog')}`;

  return (
    <ErrorBoundary>
      <ReadingProgress target="#article-root" />
      
      <div className="container max-w-7xl py-12">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={desc} />
          <link rel="canonical" href={currentUrl} />
          <link rel="alternate" hrefLang={lang} href={currentUrl} />
          <link rel="alternate" hrefLang={lang === 'es' ? 'en' : 'es'} href={alternateUrl} />
          <link rel="alternate" hrefLang="x-default" href={lang === 'es' ? currentUrl : alternateUrl} />
          
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
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbs} />
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
                <MDXProvider components={{
                  ...enhancedMDXComponents,
                  // Disable NewsletterInline in blog content to prevent intermediate CTAs
                  NewsletterInline: () => null,
                  // Suppress first H1 to avoid duplication with BlogHeader
                  h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => {
                    const [isFirstH1, setIsFirstH1] = React.useState(true);
                    React.useEffect(() => {
                      if (isFirstH1) {
                        setIsFirstH1(false);
                        return;
                      }
                    }, [isFirstH1]);
                    
                    if (isFirstH1) return null;
                    return enhancedMDXComponents.h1({ children, ...props });
                  }
                }}>
                  <EnhancedProse>
                    <Comp />
                  </EnhancedProse>
                </MDXProvider>
              </div>

              {/* Prev/Next Navigation */}
              <PrevNextNavigation
                prev={prevNext.prev}
                next={prevNext.next}
                lang={lang}
                type="blog"
              />

              {/* CTA Block */}
              <BlogCTA 
                lang={lang} 
                type="mixed" 
                source="blog-detail" 
                utmParams={UTM_PRESETS.blogToContact}
              />

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
    </ErrorBoundary>
  );
}