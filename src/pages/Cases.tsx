import React from "react";
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContentCard from "@/components/content/ContentCard";
import { loadEntries } from "@/lib/content";
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';

const modules = import.meta.glob("@/content/casos/**/*.{mdx,md}", { eager: true });

export default function Cases() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';

  const items = loadEntries(modules, "case")
    .filter(item => item.lang === lang)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

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
      
      <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {items.length > 0 ? (
          items.map(item => (
            <ContentCard
              key={item.slug}
              href={item.lang === "en" ? `/en/cases/${item.slug}` : `/casos/${item.slug}`}
              title={item.title}
              date={item.date}
              lang={item.lang}
              excerpt={item.excerpt}
              kicker={item.card?.kicker}
              badges={item.card?.badges}
              highlights={item.card?.highlights?.filter(h => h.label && h.value) as Array<{label: string; value: string}>}
              cta={item.card?.cta}
            />
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
              <Link 
                to={lang === "en" ? "/en/contact" : "/contact"}
                className="btn-primary"
              >
                {lang === "en" ? "Contact us" : "Contactanos"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}