import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import { getCaseBySlug } from '@/lib/content';
import MDXComponents from '@/components/mdx/MDXComponents';

export default function CaseDetail() {
  const { slug = '' } = useParams();
  const isEN = useLocation().pathname.startsWith('/en/');
  const lang = isEN ? 'en' : 'es';

  const data = getCaseBySlug(lang as any, slug);
  if (!data) return <div className="container py-20">Caso no encontrado.</div>;

  const { meta, mod } = data;
  const MDX = mod.default;

  const title = `${meta.title} | KADMEIA`;
  const desc = meta.excerpt ?? 'Caso de éxito KADMEIA';
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="container max-w-3xl py-12">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {meta.cover && <meta property="og:image" content={meta.cover} />}
        <link rel="canonical" href={url} />
      </Helmet>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-serif mb-2">{meta.title}</h1>
          <p className="text-sm text-muted-foreground">{new Date(meta.date).toLocaleDateString()}</p>
        </header>

        <MDXProvider components={MDXComponents}>
          <MDX />
        </MDXProvider>
      </article>
    </div>
  );
}