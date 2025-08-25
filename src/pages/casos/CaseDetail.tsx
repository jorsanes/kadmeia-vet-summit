import React from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { getCaseBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import { CaseArticleLayout, enhancedMDXComponents, SmartImage } from "@/components/mdx";
import CaseHero from "@/components/cases/CaseHero";
import { CaseMeta } from "@/content/schemas";
import Reveal from "@/components/ui/Reveal";
import ReadingProgress from "@/components/ui/ReadingProgress";
import Toc from "@/components/ui/Toc";
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PrevNextNavigation } from '@/components/ui/PrevNextNavigation';
import { getRelatedContent, getPrevNextItems, generateBreadcrumbs } from '@/lib/navigation';
import { usePlausible } from '@/hooks/usePlausible';
import { useScrollDepth } from '@/hooks/useScrollDepth';
import { TrackedLink } from '@/components/analytics/TrackedComponents';
import { UTM_PRESETS } from '@/lib/analytics';
import { getHreflangUrl, getRelatedByTags } from '@/lib/hreflang';
import { getAllCasesMeta } from '@/lib/content';
import ErrorBoundary from '@/components/ErrorBoundary';
import { FrontmatterHider } from '@/components/mdx/FrontmatterHider';
import { KpiGrid, type Kpi } from "@/components/cases/KpiGrid";
import { Testimonial } from "@/components/cases/Testimonial";
import { getDbCaseBySlug, DbCaseStudy } from '@/lib/case-db';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';
import "@/styles/case-prose.css";

const formatDateSafe = (iso?: string | Date, lang: 'es'|'en' = 'es') => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { year:'numeric', month:'long', day:'numeric' });
};

export default function CaseDetail() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isEN = location.pathname.startsWith("/en/");
  const lang = (isEN ? "en" : "es");
  const { trackCTA } = usePlausible();
  
  // State for data sources
  const [dbCase, setDbCase] = React.useState<DbCaseStudy | null>(null);
  const [MDX, setMDX] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Referencias y estado para KPIs y testimoniales
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [kpis, setKpis] = React.useState<Kpi[]>([]);
  const [testimonial, setTestimonial] = React.useState<{quote?: string; author?: string; role?: string}>({});
  
  // Track scroll depth for engagement metrics
  useScrollDepth({
    enableTracking: true,
    pageName: `case-${slug}`
  });

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Try to fetch from Supabase first
      const dbData = await getDbCaseBySlug(slug, lang);
      if (dbData) {
        setDbCase(dbData);
        setLoading(false);
        return;
      }
      
      // Fallback to MDX
      const entry = getCaseBySlug(lang as any, slug);
      if (entry) {
        setMDX(entry);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!dbCase && !MDX) {
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

  // Determine the primary data source
  const caseData = dbCase || (MDX ? MDX.meta : null);
  const rawMeta = caseData;
  
  // Validate and enhance meta with CaseMeta schema
  const metaValidation = CaseMeta.safeParse(rawMeta);
  const metaData = metaValidation.success ? metaValidation.data : rawMeta;
  
  // Generate URLs and assets
  const currentUrl = `https://kadmeia.com${lang === 'en' ? '/en' : ''}/casos/${slug}`;
  const siteUrl = 'https://kadmeia.com';
  const alternateUrl = `${siteUrl}${getHreflangUrl(slug, lang, 'cases')}`;
  const MDXComponent = MDX?.mod?.default;
  
  // OG Image with fallback to generated version
  const ogImage = metaData.cover 
    ? (metaData.cover.startsWith('http') ? metaData.cover : `${siteUrl}${metaData.cover}`)
    : `${siteUrl}/og/cases/${slug}-${lang}.png`;
  
  // Get related cases using new logic
  const relatedCases = React.useMemo(() => {
    if (metaData.tags) {
      const allCases = getAllCasesMeta();
      return getRelatedByTags(allCases, slug, lang, metaData.tags, 3);
    }
    return [];
  }, [slug, metaData.tags, lang]);

  const prevNext = React.useMemo(() => {
    return getPrevNextItems('cases', slug, lang);
  }, [slug, lang]);
  
  // QA Warning for missing critical fields
  const missingFields: string[] = [];
  if (!(metaData as any).client) missingFields.push('client');
  if (!(metaData as any).sector) missingFields.push('sector'); 
  if (!(metaData as any).ubicacion) missingFields.push('ubicacion');
  if (!(metaData as any).servicios?.length) missingFields.push('servicios');
  
  const title = metaData?.title ?? '';
  const dateStr = formatDateSafe(metaData?.date, lang);

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs('cases', lang, slug, title);

  // Show KPIs and testimonial from frontmatter only
  React.useEffect(() => {
    const fm: any = metaData || {};
    const arr: Kpi[] = fm.kpis || [];
    
    if (Array.isArray(arr) && arr.length > 0 && arr[0]?.label && arr[0]?.value) {
      setKpis(arr);
    }
    
    if (fm.testimonial && fm.testimonial.quote) {
      setTestimonial(fm.testimonial);
    }
  }, [metaData]);

  return (
    <ErrorBoundary>
      <FrontmatterHider />
      <ReadingProgress target="#article-root" />
      
      <Helmet>
        <title>{`${title} - KADMEIA`}</title>
        <meta name="description" content={metaData.excerpt || `Caso de éxito: ${title}`} />
        
        {/* Hreflang links */}
        <link rel="alternate" hrefLang={lang} href={currentUrl} />
        <link rel="alternate" hrefLang={lang === 'es' ? 'en' : 'es'} href={alternateUrl} />
        <link rel="alternate" hrefLang="x-default" href={lang === 'es' ? currentUrl : alternateUrl} />
        
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
        {/* QA Warning for missing fields - only show in development */}
        {import.meta.env.DEV && missingFields.length > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>⚠️ QA Warning:</strong> Faltan campos críticos en el frontmatter: {missingFields.join(', ')}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            {/* Case Header - Always show simple header with title and date */}
            <header className="mb-8">
              <Reveal y={16}>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(lang === "en" ? "/en/cases" : "/casos")}
                  className="mb-8 hover:bg-primary/5"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {lang === "en" ? "Back to cases" : "Volver a casos"}
                </Button>
                
                {metaData.tags && Array.isArray(metaData.tags) && metaData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {metaData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {title && <h1 className="text-4xl font-serif font-semibold tracking-tight mb-3">{title}</h1>}
                {dateStr && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={typeof metaData.date === 'string' ? metaData.date : metaData.date?.toISOString()}>{dateStr}</time>
                  </div>
                )}
              </Reveal>
            </header>

            {/* KPIs from frontmatter */}
            {Boolean(kpis.length) && <KpiGrid items={kpis} className="mb-8" />}

            {/* Testimonial from frontmatter */}
            {(testimonial?.quote) && (
              <div className="mb-8">
                <Testimonial 
                  quote={testimonial.quote} 
                  author={testimonial.author} 
                  role={testimonial.role} 
                />
              </div>
            )}

            {/* Contenido principal */}
            <article ref={contentRef} className="case-prose" id="article-root">
              <Reveal>
                <div className="max-w-none">
                  {dbCase ? (
                    <TiptapRenderer 
                      content={dbCase.content} 
                      className="prose prose-lg max-w-none"
                    />
                  ) : MDXComponent ? (
                    <MDXProvider components={enhancedMDXComponents}>
                      <CaseArticleLayout>
                        <MDXComponent />
                      </CaseArticleLayout>
                    </MDXProvider>
                  ) : null}
                </div>
              </Reveal>
            </article>

            {/* Prev/Next Navigation */}
            <PrevNextNavigation
              prev={prevNext.prev}
              next={prevNext.next}
              lang={lang}
              type="cases"
            />

            {/* Related Cases */}
            {relatedCases.length > 0 && (
              <Reveal y={16} delay={0.2}>
                <div className="mt-16 pt-8 border-t border-border">
                  <h2 className="text-2xl font-serif text-foreground mb-8">
                    {lang === "en" ? 'Related Case Studies' : 'Casos Relacionados'}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {relatedCases.map((relatedCase) => (
                      <Card key={relatedCase.slug} className="group hover:shadow-lg transition-shadow">
                        <Link to={`${lang === 'es' ? '/casos' : '/en/cases'}/${relatedCase.slug}`}>
                          {relatedCase.cover && (
                            <div className="relative overflow-hidden rounded-t-lg">
                              <SmartImage
                                src={relatedCase.cover}
                                alt={relatedCase.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                width={400}
                                height={200}
                              />
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {relatedCase.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Title */}
                              <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                                {relatedCase.title}
                              </h3>

                              {/* Excerpt */}
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {relatedCase.excerpt}
                              </p>

                              {/* Meta */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                                <time dateTime={relatedCase.date}>
                                  {new Date(relatedCase.date).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </time>
                              </div>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

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
    </ErrorBoundary>
  );
}