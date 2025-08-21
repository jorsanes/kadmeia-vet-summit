import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/media/SmartImage';
import ContentCard from '@/components/content/ContentCard';
import { getAllCases } from '@/lib/content';

export default function Cases() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';
  const cases = getAllCases(lang as any);

  return (
    <div className="container py-12">
      <Helmet>
        <title>{isEN ? 'Case Studies | KADMEIA' : 'Casos de éxito | KADMEIA'}</title>
        <meta name="description" content={isEN ? 'Measured outcomes from our projects.' : 'Resultados medibles de nuestros proyectos.'} />
      </Helmet>
      
      <Reveal y={12}>
        <h1 className="text-4xl font-serif mb-8 text-center">{isEN ? 'Case Studies' : 'Casos de éxito'}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {isEN 
            ? 'Real results from our veterinary technology implementations. See how we help clinics achieve measurable improvements.'
            : 'Resultados reales de nuestras implementaciones de tecnología veterinaria. Descubre cómo ayudamos a las clínicas a lograr mejoras medibles.'
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cases.map(caseItem => (
          <ContentCard
            key={caseItem.slug}
            href={isEN ? `/en/cases/${caseItem.slug}` : `/casos/${caseItem.slug}`}
            title={caseItem.title}
            excerpt={caseItem.excerpt}
            date={caseItem.date}
            tags={caseItem.tags}
            cover={caseItem.cover}
            locale={lang}
          />
        ))}
      </div>
      
      {cases.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {isEN ? 'No case studies available yet.' : 'Aún no hay casos de éxito disponibles.'}
          </p>
        </div>
      )}
    </div>
  );
}