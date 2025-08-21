import React from "react";
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllCasesMeta } from "@/lib/content";
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';
import { TextCard } from '@/components/content/TextCard';

export default function Cases() {
  let isEN = false;
  try {
    isEN = useLocation().pathname.startsWith('/en');
  } catch (error) {
    // Default to Spanish when outside Router context
    isEN = false;
  }
  const lang = isEN ? 'en' : 'es';

  const cases = getAllCasesMeta().filter(c => c.lang === lang);

  return (
    <div className="container py-12">
      <Helmet>
        <title>{isEN ? 'Case Studies | KADMEIA' : 'Casos de Éxito | KADMEIA'}</title>
        <meta name="description" content={isEN ? 'Explore our veterinary consulting success stories and AI implementations.' : 'Explora nuestros casos de éxito en consultoría veterinaria e implementaciones de IA.'} />
      </Helmet>
      
      <Reveal y={12}>
        <h1 className="text-4xl font-serif mb-8 text-center">
          {isEN ? 'Case Studies' : 'Casos de Éxito'}
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {isEN 
            ? 'Real implementations of veterinary AI, process automation, and consulting solutions with measurable impact.'
            : 'Implementaciones reales de IA veterinaria, automatización de procesos y soluciones de consultoría con impacto medible.'
          }
        </p>
      </Reveal>
      
      <Reveal>
        <SmartImage
          src="/images/illustrations/cases-collage.webp"
          alt="Mosaico de proyectos y resultados medibles"
          className="w-full max-w-4xl mx-auto mb-16 rounded-3xl shadow-elegant"
          width={1200}
          height={800}
        />
      </Reveal>
      
      <Reveal>
        <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {cases.length > 0 ? (
            cases.map((caseItem, index) => (
              <Reveal key={caseItem.slug} delay={index * 0.1}>
                <TextCard
                  title={caseItem.title}
                  date={new Date(caseItem.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}
                  href={caseItem.lang === "en" ? `/en/cases/${caseItem.slug}` : `/casos/${caseItem.slug}`}
                  excerpt={caseItem.excerpt}
                  cover={caseItem.cover}
                  cta={lang === "en" ? "View case →" : "Ver caso →"}
                />
              </Reveal>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-serif text-foreground mb-3">
                  {lang === "en" ? "Content coming soon" : "Pronto añadiremos contenido"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {lang === "en" 
                    ? "We're working on bringing you inspiring case studies from our veterinary consulting work."
                    : "Estamos trabajando en traerte casos de éxito inspiradores de nuestro trabajo de consultoría veterinaria."}
                </p>
                <a 
                  href={lang === "en" ? "/en/contact" : "/contact"}
                  className="btn-primary"
                >
                  {lang === "en" ? "Contact us" : "Contactanos"}
                </a>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}