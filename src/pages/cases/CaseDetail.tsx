import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Prose, enhancedMDXComponents } from '@/components/mdx';
import Reveal from '@/components/ui/Reveal';
import { supabase } from '@/integrations/supabase/client';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';

const modules = import.meta.glob("@/content/casos/**/*.{mdx,md}");

export default function CaseDetail() {
  const { slug = '' } = useParams();
  const isEN = useLocation().pathname.startsWith('/en/');
  const lang = isEN ? 'en' : 'es';

  const [supabaseCase, setSupabaseCase] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [useMDX, setUseMDX] = React.useState(false);

  const key = Object.keys(modules).find(p => p.includes(`/casos/${lang}/${slug}.`));
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  // @ts-ignore
  const [meta, setMeta] = React.useState<any>(null);

  // Intentar cargar desde Supabase primero
  React.useEffect(() => {
    const loadCase = async () => {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .eq('slug', slug)
          .eq('lang', lang)
          .eq('status', 'published')
          .single();

        if (data && !error) {
          setSupabaseCase(data);
          setUseMDX(false);
        } else {
          // Fallback a MDX
          setUseMDX(true);
        }
      } catch (error) {
        console.error('Error loading case from Supabase:', error);
        setUseMDX(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCase();
  }, [slug, lang]);

  // Cargar MDX si es necesario
  React.useEffect(() => {
    if (!useMDX || !key) return;
    (async () => {
      const mod: any = await modules[key]!();
      setComp(() => mod.default);
      setMeta(mod.meta || {});
    })();
  }, [key, useMDX]);

  if (isLoading) return <div className="container py-16">Cargando…</div>;

  if (!supabaseCase && !key) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-serif mb-4">Caso no encontrado</h1>
      <Link to={isEN ? "/en/cases" : "/casos"} className="text-primary hover:underline">
        {isEN ? "Back to cases" : "Volver a casos de éxito"}
      </Link>
    </div>
  );
  
  if (useMDX && !Comp) return <div className="container py-16">Cargando…</div>;

  // Usar datos de Supabase o MDX según corresponda
  const caseData = supabaseCase || meta;
  const title = `${caseData?.title || slug} | KADMEIA`;
  const desc = caseData?.excerpt ?? 'Caso de éxito KADMEIA';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kadmeia.com';

  // JSON-LD structured data for case study
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseData?.title || slug,
    "description": caseData?.excerpt || desc,
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
    "datePublished": caseData?.published_at || caseData?.date,
    "dateModified": caseData?.updated_at || caseData?.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "articleSection": "Case Study",
    ...((caseData?.cover_image || caseData?.cover) && {
      "image": {
        "@type": "ImageObject",
        "url": caseData.cover_image || caseData.cover
      }
    }),
    ...(caseData?.tags && {
      "keywords": caseData.tags.join(", ")
    })
  };

  // Extract key metrics and info for the card layout
  const keyMetrics = [
    { label: '60% reducción', description: 'en tiempo de diagnóstico', icon: '⏱️' },
    { label: '95% satisfacción', description: 'del equipo veterinario', icon: '👥' },
    { label: '247% ROI', description: 'en el primer año', icon: '💰' },
    { label: '4 meses', description: 'tiempo de implementación', icon: '📅' }
  ];

  const technologies = caseData?.tags || ['IA', 'Radiología', 'Automatización'];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {(caseData?.cover_image || caseData?.cover) && <meta property="og:image" content={caseData.cover_image || caseData.cover} />}
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Header Section */}
      <section className="bg-gradient-hero py-24 relative overflow-hidden">
        <div className="container max-w-7xl">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="mb-8"
          >
            <Link 
              to={isEN ? "/en/cases" : "/casos"} 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {isEN ? "Back to cases" : "Volver a casos"}
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <div className="mb-6">
                <Badge variant="secondary" className="mb-4">
                  Clínica veterinaria
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-6">
                  {caseData?.title || slug}
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">8 semanas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">3 clínicas</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="outline" className="bg-background/50">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-premium backdrop-blur-sm bg-background/80">
                <CardContent className="p-8">
                  <h3 className="text-xl font-serif text-foreground mb-6">
                    🎯 Resultados obtenidos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {keyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground text-sm">
                            {metric.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Challenge */}
            <Reveal>
              <Card className="card-premium h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif text-foreground mb-4">
                    Desafío
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Los veterinarios perdían 2-3 horas diarias en tareas administrativas, afectando la calidad de atención y generando burnout en el equipo.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            {/* Solution */}
            <Reveal delay={0.1}>
              <Card className="card-premium h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif text-foreground mb-4">
                    Solución
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos un sistema de IA para automatizar historiales, recordatorios y seguimientos, integrándolo con su software existente.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            {/* Results */}
            <Reveal delay={0.2}>
              <Card className="card-premium h-full bg-gradient-subtle">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif text-foreground mb-4">
                    Impacto
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">40% menos tiempo administrativo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">95% satisfacción del equipo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">ROI recuperado en 4 meses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          {/* Testimonial */}
          <Reveal delay={0.3}>
            <Card className="card-premium mt-12">
              <CardContent className="p-8 text-center">
                <blockquote className="text-lg italic text-muted-foreground mb-6">
                  "KADMEIA no solo nos dio tecnología, nos devolvió el tiempo para hacer lo que realmente amamos: cuidar animales."
                </blockquote>
                <div className="text-foreground font-semibold">
                  Dra. Carmen Ruiz
                </div>
                <div className="text-sm text-muted-foreground">
                  Directora VetLife Madrid
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Detailed Content */}
          <div className="mt-16">
            {supabaseCase ? (
              <TiptapRenderer 
                content={supabaseCase.content} 
                className="prose prose-lg max-w-none"
              />
            ) : (
              <MDXProvider components={enhancedMDXComponents}>
                <Prose>
                  <Comp />
                </Prose>
              </MDXProvider>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}