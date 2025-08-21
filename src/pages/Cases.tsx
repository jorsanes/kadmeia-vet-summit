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
              className="group rounded-2xl border p-5 hover:shadow-lg transition"
            >
              {c.cover && <img src={c.cover} alt="" className="rounded-xl mb-4" loading="lazy" />}
              <h2 className="text-2xl font-serif group-hover:underline">{c.title}</h2>
              <p className="text-sm text-muted-foreground">{new Date(c.date).toLocaleDateString()}</p>
              {c.excerpt && <p className="mt-2 text-muted-foreground">{c.excerpt}</p>}
              {c.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags!.map(t => <span key={t} className="text-xs bg-muted rounded px-2 py-1">{t}</span>)}
                </div>
              ) : null}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}