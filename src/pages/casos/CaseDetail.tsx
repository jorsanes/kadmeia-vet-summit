import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { getCaseWithMDXBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import EnhancedProse from "@/components/prose/EnhancedProse";
import { enhancedMDXComponents } from "@/components/prose/MDXComponents";
import Reveal from "@/components/ui/Reveal";

export default function CaseDetail() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isEN = location.pathname.startsWith("/en/");
  const lang = (isEN ? "en" : "es") as "en" | "es";

  const caseData = getCaseWithMDXBySlug(lang, slug);

  if (!caseData) {
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
  const MDXComponent = caseData.mdx;

  return (
    <>
      <Helmet>
        <title>{`${caseData.title} - KADMEIA`}</title>
        <meta name="description" content={caseData.excerpt || `Caso de éxito: ${caseData.title}`} />
        <meta property="og:title" content={`${caseData.title} - KADMEIA`} />
        <meta property="og:description" content={caseData.excerpt || `Caso de éxito: ${caseData.title}`} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        {caseData.cover && <meta property="og:image" content={caseData.cover} />}
        <link rel="canonical" href={currentUrl} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": caseData.title,
            "description": caseData.excerpt || `Caso de éxito: ${caseData.title}`,
            "datePublished": typeof caseData.date === 'string' ? caseData.date : caseData.date.toISOString(),
            "url": currentUrl,
            "author": {
              "@type": "Organization",
              "name": "KADMEIA"
            },
            "publisher": {
              "@type": "Organization", 
              "name": "KADMEIA",
              "logo": {
                "@type": "ImageObject",
                "url": "https://kadmeia.com/og.png"
              }
            },
            ...(caseData.cover && {
              "image": {
                "@type": "ImageObject",
                "url": caseData.cover
              }
            })
          })}
        </script>
      </Helmet>

      <article className="container py-12">
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

        {/* Header del caso */}
        <header className="mb-12 max-w-4xl mx-auto">
          <Reveal y={16}>
            {caseData.tags && caseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {caseData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              {caseData.title}
            </h1>
            
            {caseData.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {caseData.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={typeof caseData.date === 'string' ? caseData.date : caseData.date.toISOString()}>
                  {(typeof caseData.date === 'string' ? new Date(caseData.date) : caseData.date).toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </Reveal>
        </header>

        {/* Contenido principal */}
        <Reveal>
          <div className="max-w-5xl mx-auto">
            {MDXComponent && (
              <EnhancedProse>
                <MDXProvider components={enhancedMDXComponents}>
                  <MDXComponent />
                </MDXProvider>
              </EnhancedProse>
            )}
          </div>
        </Reveal>

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
      </article>
    </>
  );
}