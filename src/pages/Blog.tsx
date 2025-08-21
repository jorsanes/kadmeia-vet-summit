import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { getAllPosts } from '@/lib/content';

export default function Blog() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';
  const posts = getAllPosts(lang as any);

  return (
    <div className="container py-12">
      <Helmet>
        <title>{isEN ? 'Blog | KADMEIA' : 'Blog | KADMEIA'}</title>
        <meta name="description" content={isEN ? 'Insights on veterinary AI and automation.' : 'Ideas sobre IA y automatización veterinaria.'} />
      </Helmet>
      <Reveal y={12}>
        <h1 className="text-4xl font-serif mb-8">{isEN ? 'Blog' : 'Blog'}</h1>
      </Reveal>
      
      <Reveal>
        <img
          src="/images/illustrations/blog-abstract.webp"
          alt="Ilustración abstracta representando ideas y conocimiento"
          className="w-full max-w-4xl mx-auto mb-8 rounded-2xl"
          width={1200}
          height={800}
          loading="eager"
        />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(p => (
          <motion.div 
            key={p.slug}
            whileHover={{ y: -2, scale: 1.01 }} 
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Link
              to={isEN ? `/en/blog/${p.slug}` : `/blog/${p.slug}`}
              className="group block p-5 h-full"
            >
              {p.cover && (
                <div className="aspect-video overflow-hidden rounded-xl mb-4">
                  <img 
                    src={p.cover} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy" 
                  />
                </div>
              )}
              <h2 className="text-2xl font-serif group-hover:text-primary transition-colors duration-200 mb-2">{p.title}</h2>
              <p className="text-sm text-muted-foreground mb-3">{new Date(p.date).toLocaleDateString()}</p>
              {p.excerpt && <p className="text-muted-foreground leading-relaxed mb-3">{p.excerpt}</p>}
              {p.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {p.tags!.map(t => (
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