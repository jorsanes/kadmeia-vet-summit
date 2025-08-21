import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/media/SmartImage';
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
        <h1 className="text-4xl font-serif mb-8">{isEN ? 'Case Studies' : 'Casos de éxito'}</h1>
      </Reveal>
      
      <Reveal>
        <SmartImage
          src="/images/illustrations/cases-collage.webp"
          alt="Mosaico de proyectos y resultados medibles"
          className="w-full max-w-4xl mx-auto mb-8 rounded-2xl"
          width={1200}
          height={800}
        />
      </Reveal>
      
      <div className="grid md:grid-cols-2 gap-6">
        {cases.map(c => (
          <motion.div 
            key={c.slug}
            whileHover={{ y: -2, scale: 1.01 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link
              to={isEN ? `/en/cases/${c.slug}` : `/casos/${c.slug}`}
              className="group block rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full"
            >
              {c.cover && (
                <div className="aspect-video overflow-hidden rounded-xl mb-4">
                  <img 
                    src={c.cover} 
                    alt={c.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy" 
                    width={400}
                    height={225}
                  />
                </div>
              )}
              <h2 className="text-xl font-serif group-hover:text-primary transition-colors duration-200 mb-3 leading-tight">
                {c.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {new Date(c.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {c.excerpt && (
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  {c.excerpt}
                </p>
              )}
              {c.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {c.tags.map(t => (
                    <span key={t} className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}