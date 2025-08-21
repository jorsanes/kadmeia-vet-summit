import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '@/components/ui/Reveal';
import ContentCard from '@/components/content/ContentCard';
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
        <h1 className="text-4xl font-serif mb-8 text-center">{isEN ? 'Blog' : 'Blog'}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {isEN 
            ? 'Insights and perspectives on veterinary technology, AI applications, and industry automation.'
            : 'Perspectivas e ideas sobre tecnología veterinaria, aplicaciones de IA y automatización del sector.'
          }
        </p>
      </Reveal>
      
      <Reveal>
        <img
          src="/images/illustrations/blog-abstract.webp"
          alt="Ilustración abstracta representando ideas y conocimiento"
          className="w-full max-w-4xl mx-auto mb-16 rounded-3xl shadow-elegant"
          width={1200}
          height={800}
          loading="eager"
        />
      </Reveal>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map(post => (
          <ContentCard
            key={post.slug}
            href={isEN ? `/en/blog/${post.slug}` : `/blog/${post.slug}`}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            tags={post.tags}
            cover={post.cover}
            locale={lang}
          />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {isEN ? 'No blog posts available yet.' : 'Aún no hay artículos disponibles.'}
          </p>
        </div>
      )}
    </div>
  );
}