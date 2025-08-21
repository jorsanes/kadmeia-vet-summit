import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
      <h1 className="text-4xl font-serif mb-8">{isEN ? 'Case Studies' : 'Casos de éxito'}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {cases.map(c => (
          <Link
            key={c.slug}
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
        ))}
      </div>
    </div>
  );
}