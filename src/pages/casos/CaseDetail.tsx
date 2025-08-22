import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { getCaseBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import { CaseArticleLayout, enhancedMDXComponents } from "@/components/mdx";
import CaseHero from "@/components/cases/CaseHero";
import { CaseMeta } from "@/content/schemas";
import Reveal from "@/components/ui/Reveal";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Toc from "@/components/ui/Toc";

export default function CaseDetail() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isEN = location.pathname.startsWith("/en/");
  const lang = (isEN ? "en" : "es");

  const entry = getCaseBySlug(lang as any, slug);

  if (!entry) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-serif mb-4">
            {lang === "en" ? "Case not found" : "Caso no encontrado"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {lang === "en" 
              ? "The case study you're looking for doesn't exist."
              : "El caso de estudio que buscas no existe."}
          </p>
          <Button onClick={() => navigate(lang === "en" ? "/en/cases" : "/casos")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {lang === "en" ? "Back to cases" : "Volver a casos"}
          </Button>
        </div>
      </div>
    );
  }

  const currentUrl = `https://kadmeia.com${lang === 'en' ? '/en' : ''}/casos/${slug}`;
  const siteUrl = 'https://kadmeia.com';
  
  // Generate hreflang URLs
  const esUrl = `${siteUrl}/casos/${slug}`;
  const enUrl = `${siteUrl}/en/cases/${slug}`;
  
  const MDXComponent = entry.mod.default;
  const rawMeta = entry.meta;
  
  // Validate and enhance meta with CaseMeta schema
  const metaValidation = CaseMeta.safeParse(rawMeta);
  const metaData = metaValidation.success ? metaValidation.data : rawMeta;
  
  // OG Image with fallback to generated version
  const ogImage = metaData.cover 
    ? (metaData.cover.startsWith('http') ? metaData.cover : `${siteUrl}${metaData.cover}`)
    : `${siteUrl}/og/cases/${slug}-${lang}.png`;
  
  // QA Warning for missing critical fields
  const missingFields: string[] = [];
  if (!(metaData as any).client) missingFields.push('client');
  if (!(metaData as any).sector) missingFields.push('sector'); 
  if (!(metaData as any).ubicacion) missingFields.push('ubicacion');
  if (!(metaData as any).servicios?.length) missingFields.push('servicios');
  
  const title = metaData.title || slug;

  return (
    <>
      <ReadingProgress target="#article-root" />
      
      <Helmet>
        <title>{`${title} - KADMEIA`}</title>
        <meta name="description" content={metaData.excerpt || `Caso de éxito: ${title}`} />
        
        {/* Hreflang links */}
        <link rel="alternate" hrefLang="es" href={esUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={esUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${title} - KADMEIA`} />
        <meta property="og:description" content={metaData.excerpt || `Caso de éxito: ${title}`} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={lang === "es" ? "es_ES" : "en_GB"} />
        <meta property="og:site_name" content="KADMEIA" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} - KADMEIA`} />
        <meta name="twitter:description" content={metaData.excerpt || `Caso de éxito: ${title}`} />
        <meta name="twitter:image" content={ogImage} />
        
        <link rel="canonical" href={currentUrl} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": metaData.excerpt || `Caso de éxito: ${title}`,
            "datePublished": metaData.date,
            "url": currentUrl,
            "image": {
              "@type": "ImageObject",
              "url": ogImage,
              "width": 1200,
              "height": 630
            },
            "author": {
              "@type": "Organization",
              "name": "KADMEIA"
            },
            "publisher": {
              "@type": "Organization", 
              "name": "KADMEIA",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/og.png`
              }
            }
          })}
        </script>
      </Helmet>

      <div className="container max-w-7xl py-12">
        {/* QA Warning for missing fields */}
        {missingFields.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>⚠️ QA Warning:</strong> Faltan campos críticos en el frontmatter: {missingFields.join(', ')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Header con navegación */}
            <Reveal y={12}>
              <Button 
                variant="ghost" 
                onClick={() => navigate(lang === "en" ? "/en/cases" : "/casos")}
                className="mb-8 hover:bg-primary/5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {lang === "en" ? "Back to cases" : "Volver a casos"}
              </Button>
            </Reveal>

            {/* Case Hero Section */}
            {(metaData as any).client && (metaData as any).sector && (metaData as any).ubicacion && (metaData as any).servicios?.length ? (
              <Reveal y={16}>
                <CaseHero meta={metaData as CaseMeta} className="mb-12" />
              </Reveal>
            ) : (
              // Fallback to original header if missing critical fields
              <article id="article-root">
                <header className="mb-12">
                  <Reveal y={16}>
                    {metaData.tags && Array.isArray(metaData.tags) && metaData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {metaData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
                      {title}
                    </h1>
                    
                    {metaData.excerpt && (
                      <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                        {metaData.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={metaData.date ? new Date(metaData.date).toISOString() : undefined}>
                          {metaData.date ? new Date(metaData.date).toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Sin fecha'}
                        </time>
                      </div>
                    </div>
                  </Reveal>
                </header>
              </article>
            )}

            {/* Contenido principal */}
            <article id="article-root">
              <Reveal>
                <div className="max-w-none">
                  {MDXComponent && (
                    <MDXProvider components={enhancedMDXComponents}>
                      <CaseArticleLayout>
                        <MDXComponent />
                      </CaseArticleLayout>
                    </MDXProvider>
                  )}
                </div>
              </Reveal>
            </article>

            {/* Footer CTA */}
            <Reveal y={16} delay={0.3}>
              <div className="mt-16 max-w-2xl mx-auto text-center p-8 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl">
                <h2 className="text-2xl font-serif mb-4">
                  {lang === "en" ? "Ready for your transformation?" : "¿Listo para tu transformación?"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {lang === "en" 
                    ? "Let's discuss how we can help you achieve similar results."
                    : "Hablemos de cómo podemos ayudarte a conseguir resultados similares."}
                </p>
                <Button 
                  onClick={() => navigate(lang === "en" ? "/en/contact" : "/contact")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {lang === "en" ? "Get in touch" : "Hablemos"}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Sidebar con TOC */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Toc title={lang === "en" ? "Table of Contents" : "Índice"} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}