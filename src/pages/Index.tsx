import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Network, 
  Brain, 
  Workflow, 
  Building2, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle
} from 'lucide-react';
import { PageSeo } from "@/components/seo/PageSeo";
import { OrganizationJsonLd } from "@/components/seo/SeoJsonLd";
import { useLocale } from "@/i18n/LocaleProvider";
import { SmartImage } from "@/components/mdx";
import Reveal from "@/components/ui/Reveal";
import MetricCounter from "@/components/ui/MetricCounter";
import BrandWatermark from "@/components/brand/BrandWatermark";
import { EditableHero } from "@/components/content/EditableHero";
import { EditableContent } from "@/components/content/EditableContent";

import logoLarge from "@/assets/kadmeia-logo-large.png";

const Home = () => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const getLocalizedHref = (path: string) => {
    return locale === 'en' ? `/en${path}` : path;
  };

  const seoTitle = t('seo.home.title');
  const seoDescription = t('seo.home.description');

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      <PageSeo 
        title={seoTitle}
        description={seoDescription}
        ogType="website"
      />
      <OrganizationJsonLd />

      {/* Hero Section */}
      <EditableHero
        defaultTitle={t('hero.title')}
        defaultSubtitle={t('hero.subtitle')}
        defaultCtaPrimary={t('hero.cta_primary')}
        defaultCtaSecondary={t('hero.cta_secondary')}
      />

      {/* What We Do Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <EditableContent
            pageKey="home"
            sectionKey="whatWeDo"
            lang={locale}
            fallbackContent={
              <motion.div 
                className="mx-auto max-w-2xl text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Reveal delay={0.05}>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {t('whatWeDo.title')}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    {t('whatWeDo.subtitle')}
                  </p>
                </Reveal>
              </motion.div>
            }
            renderContent={(content) => (
              <motion.div 
                className="mx-auto max-w-2xl text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <Reveal delay={0.05}>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    {content.subtitle}
                  </p>
                </Reveal>
              </motion.div>
            )}
          />

          <Reveal>
            <EditableContent
              pageKey="home"
              sectionKey="whatWeDo"
              lang={locale}
              fallbackContent={
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Static service cards */}
                  {/* ... keep existing code (static services) */}
                </div>
              }
              renderContent={(content) => (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {content.services?.map((service: any, index: number) => (
                    <Reveal key={index} delay={0.1 + index * 0.05}>
                      <Card className="card-premium h-full">
                        <CardContent className="p-8">
                          <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                            {index === 0 && <Network className="h-6 w-6 text-secondary" />}
                            {index === 1 && <Brain className="h-6 w-6 text-secondary" />}
                            {index === 2 && <Workflow className="h-6 w-6 text-secondary" />}
                          </div>
                          <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                            {service.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Reveal>
                  )) || (
                    // Fallback to static content
                    <>
                      <Reveal delay={0.1}>
                        <Card className="card-premium h-full">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                              <Network className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                              {t('whatWeDo.bridge.title')}
                            </h3>
                            <p className="text-muted-foreground">
                              {t('whatWeDo.bridge.description')}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>

                      <Reveal delay={0.15}>
                        <Card className="card-premium h-full">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                              <Brain className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                              {t('whatWeDo.ai.title')}
                            </h3>
                            <p className="text-muted-foreground">
                              {t('whatWeDo.ai.description')}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>

                      <Reveal delay={0.2}>
                        <Card className="card-premium h-full">
                          <CardContent className="p-8">
                            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl mb-6">
                              <Workflow className="h-6 w-6 text-secondary" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                              {t('whatWeDo.automation.title')}
                            </h3>
                            <p className="text-muted-foreground">
                              {t('whatWeDo.automation.description')}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>
                    </>
                  )}
                </div>
              )}
            />
          </Reveal>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            className="mx-auto max-w-2xl text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t('sectors.title')}
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <Building2 className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.clinics')}
              </h3>
            </motion.div>

            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <TrendingUp className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.distributors')}
              </h3>
            </motion.div>

            <motion.div 
              className="text-center p-8 rounded-2xl bg-background shadow-sm hover:shadow-md transition-shadow"
              variants={fadeInUp}
            >
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {t('sectors.corporate')}
              </h3>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <EditableContent
            pageKey="home"
            sectionKey="results"
            lang={locale}
            fallbackContent={
              <Reveal>
                <div className="mx-auto max-w-2xl text-center mb-16">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-4">
                    {locale === 'en' ? 'Results Achieved' : 'Resultados obtenidos'}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {locale === 'en' 
                      ? 'Real metrics from our consulting and technology implementation projects'
                      : 'Métricas reales de nuestros proyectos de consultoría e implementación tecnológica'
                    }
                  </p>
                </div>
              </Reveal>
            }
            renderContent={(content) => (
              <Reveal>
                <div className="mx-auto max-w-2xl text-center mb-16">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl mb-4">
                    {content.title}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {content.subtitle}
                  </p>
                </div>
              </Reveal>
            )}
          />

          <EditableContent
            pageKey="home"
            sectionKey="results"
            lang={locale}
            fallbackContent={
              <Reveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {/* Static metrics */}
                  {/* ... keep existing code (static metrics) */}
                </div>
              </Reveal>
            }
            renderContent={(content) => (
              <Reveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {content.metrics?.map((metric: any, index: number) => (
                    <Reveal key={index} delay={0.1 + index * 0.05}>
                      <Card className="card-premium text-center">
                        <CardContent className="p-8">
                          <div className="text-4xl font-bold text-primary mb-2">
                            <MetricCounter 
                              value={parseFloat(metric.value)} 
                              suffix={metric.unit} 
                              decimals={metric.value.includes('.') ? 1 : 0} 
                              duration={1.2} 
                            />
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-2">
                            {metric.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {metric.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Reveal>
                  )) || (
                    // Fallback to static content
                    <>
                      <Reveal delay={0.1}>
                        <Card className="card-premium text-center">
                          <CardContent className="p-8">
                            <div className="text-4xl font-bold text-primary mb-2">
                              <MetricCounter value={99.7} suffix="%" decimals={1} duration={1.2} />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                              {locale === 'en' ? 'Success Rate' : 'Tasa de éxito'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'In veterinary AI implementations' : 'En implementaciones de IA veterinaria'}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>

                      <Reveal delay={0.15}>
                        <Card className="card-premium text-center">
                          <CardContent className="p-8">
                            <div className="text-4xl font-bold text-primary mb-2">
                              <MetricCounter value={6.5} suffix={locale === 'en' ? ' weeks' : ' semanas'} decimals={1} duration={1.2} />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                              {locale === 'en' ? 'Average Time' : 'Tiempo promedio'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'From project to measurable results' : 'De proyecto a resultados medibles'}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>

                      <Reveal delay={0.2}>
                        <Card className="card-premium text-center">
                          <CardContent className="p-8">
                            <div className="text-4xl font-bold text-primary mb-2">
                              <MetricCounter value={150} suffix="+" duration={1.2} />
                            </div>
                            <h3 className="font-semibold text-lg text-foreground mb-2">
                              {locale === 'en' ? 'Clinics Transformed' : 'Clínicas transformadas'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'en' ? 'In Spain, Portugal and United Kingdom' : 'En España, Portugal y Reino Unido'}
                            </p>
                          </CardContent>
                        </Card>
                      </Reveal>
                    </>
                  )}
                </div>
              </Reveal>
            )}
          />
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <EditableContent
            pageKey="home"
            sectionKey="cases"
            lang={locale}
            fallbackContent={
              <motion.div 
                className="flex items-center justify-between mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {t('cases.title')}
                  </h2>
                </div>
                <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  <a href={getLocalizedHref(locale === 'en' ? '/cases' : '/casos')}>{t('cases.viewAll')}</a>
                </Button>
              </motion.div>
            }
            renderContent={(content) => (
              <motion.div 
                className="flex items-center justify-between mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {content.title}
                  </h2>
                </div>
                <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  <a href={getLocalizedHref(locale === 'en' ? '/cases' : '/casos')}>{t('cases.viewAll')}</a>
                </Button>
              </motion.div>
            )}
          />

          <EditableContent
            pageKey="home"
            sectionKey="cases"
            lang={locale}
            fallbackContent={
              <Reveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {/* Static cases */}
                  {/* ... keep existing code (static cases) */}
                </div>
              </Reveal>
            }
            renderContent={(content) => (
              <Reveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {content.cases?.map((caseItem: any, index: number) => (
                    <Reveal key={index} delay={index * 0.1}>
                      <Card className="card-premium h-full hover:shadow-elegant transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="text-sm text-secondary font-medium mb-2">
                            {caseItem.sector}
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-4">
                            {caseItem.title}
                          </h3>
                          <div className="text-2xl font-bold text-primary mb-2">
                            <MetricCounter value={caseItem.metric} suffix={caseItem.unit} duration={1.2} />
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success mr-2" />
                            {locale === 'en' ? 'Verified case' : 'Caso verificado'}
                          </div>
                        </CardContent>
                      </Card>
                    </Reveal>
                  )) || (
                    // Fallback to static content
                    <>
                      {(locale === 'en' ? [
                        { title: "Clinical workflow optimization", metric: 40, unit: "% time reduction", sector: "Veterinary clinic" },
                        { title: "AI for diagnostic imaging", metric: 95, unit: "% accuracy", sector: "Clinic network" },
                        { title: "Inventory automation", metric: 30, unit: "% cost savings", sector: "Distributor" }
                      ] : [
                        { title: "Optimización de flujos clínicos", metric: 40, unit: "% reducción tiempo", sector: "Clínica veterinaria" },
                        { title: "IA para diagnóstico por imagen", metric: 95, unit: "% precisión", sector: "Red de clínicas" },
                        { title: "Automatización de inventario", metric: 30, unit: "% ahorro costes", sector: "Distribuidor" }
                      ]).map((caseItem, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                          <Card className="card-premium h-full hover:shadow-elegant transition-shadow duration-300">
                            <CardContent className="p-6">
                              <div className="text-sm text-secondary font-medium mb-2">
                                {caseItem.sector}
                              </div>
                              <h3 className="font-semibold text-lg text-foreground mb-4">
                                {caseItem.title}
                              </h3>
                              <div className="text-2xl font-bold text-primary mb-2">
                                <MetricCounter value={caseItem.metric} suffix={caseItem.unit} duration={1.2} />
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-success mr-2" />
                                {locale === 'en' ? 'Verified case' : 'Caso verificado'}
                              </div>
                            </CardContent>
                          </Card>
                        </Reveal>
                      ))}
                    </>
                  )}
                </div>
              </Reveal>
            )}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <EditableContent
            pageKey="home"
            sectionKey="testimonials"
            lang={locale}
            fallbackContent={
              <motion.div 
                className="mx-auto max-w-2xl text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {t('testimonials.title')}
                </h2>
              </motion.div>
            }
            renderContent={(content) => (
              <motion.div 
                className="mx-auto max-w-2xl text-center mb-16"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {content.title}
                </h2>
              </motion.div>
            )}
          />

          <EditableContent
            pageKey="home"
            sectionKey="testimonials"
            lang={locale}
            fallbackContent={
              <motion.div 
                className="grid grid-cols-1 gap-8 lg:grid-cols-2"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {/* Static testimonials */}
                {/* ... keep existing code (static testimonials) */}
              </motion.div>
            }
            renderContent={(content) => (
              <motion.div 
                className="grid grid-cols-1 gap-8 lg:grid-cols-2"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {content.testimonials?.map((testimonial: any, index: number) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Card className="card-premium h-full">
                      <CardContent className="p-8">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-muted-foreground mb-6 italic">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <div className="font-semibold text-foreground">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.position}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )) || (
                  // Fallback to static content
                  <>
                    {(locale === 'en' ? [
                      {
                        quote: "KADMEIA completely transformed our processes. Their scientific approach combined with practical solutions gave us immediate results.",
                        author: "Dr. María González",
                        position: "Clinical Director VetPlus"
                      },
                      {
                        quote: "The AI implementation was perfect. The team understands both technology and the real needs of veterinary clinics.",
                        author: "Carlos Ruiz",
                        position: "CEO, Mediterranean Veterinary Group"
                      }
                    ] : [
                      {
                        quote: "KADMEIA transformó completamente nuestros procesos. Su enfoque científico combinado con soluciones prácticas nos dio resultados inmediatos.",
                        author: "Dra. María González",
                        position: "Directora Clínica VetPlus"
                      },
                      {
                        quote: "La implementación de IA fue perfecta. El equipo entiende tanto la tecnología como las necesidades reales de las clínicas veterinarias.",
                        author: "Carlos Ruiz",
                        position: "CEO, Grupo Veterinario Mediterráneo"
                      }
                    ]).map((testimonial, index) => (
                      <motion.div key={index} variants={fadeInUp}>
                        <Card className="card-premium h-full">
                          <CardContent className="p-8">
                            <div className="flex mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                              ))}
                            </div>
                            <blockquote className="text-muted-foreground mb-6 italic">
                              "{testimonial.quote}"
                            </blockquote>
                            <div>
                              <div className="font-semibold text-foreground">
                                {testimonial.author}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {testimonial.position}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              className="font-display text-3xl font-semibold tracking-tight sm:text-4xl mb-6"
              variants={fadeInUp}
            >
              {t('finalCta.title')}
            </motion.h2>
            <motion.p 
              className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {t('finalCta.subtitle')}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="btn-secondary text-lg px-8 py-4 h-auto"
              >
                <Link to={getLocalizedHref(locale === 'en' ? '/contact' : '/contacto')} className="gap-2">
                  {t('finalCta.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
