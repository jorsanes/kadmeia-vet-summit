import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { blogIndex } from "@/lib/content-index";
import { getAllPostsMeta } from "@/lib/content";
import { SmartImage } from '@/components/mdx';
import Reveal from '@/components/ui/Reveal';
import { ContentCard } from '@/components/content/EnhancedContentCard';
import TagFilter from '@/components/content/TagFilter';

export default function Blog() {
  let isEN = false;
  try {
    isEN = useLocation().pathname.startsWith('/en');
  } catch (error) {
    // Default to Spanish when outside Router context
    isEN = false;
  }
  const lang = isEN ? 'en' : 'es';
  
  // Usar el índice, pero con fallback a lib/content si está vacío
  const allPosts = useMemo(() => {
    let indexPosts = blogIndex.filter(p => p.locale === lang);
    
    // Si el índice está vacío, usar fallback de lib/content
    if (indexPosts.length === 0) {
      if (import.meta.env.DEV) {
        console.warn('📋 Blog index empty, using fallback from lib/content');
      }
      
      try {
        const fallbackPosts = getAllPostsMeta().filter(p => p.lang === lang);
        // Convertir formato de fallback al formato del índice
        indexPosts = fallbackPosts.map(post => ({
          slug: post.slug,
          locale: post.lang,
          meta: {
            title: post.title,
            date: new Date(post.date),
            excerpt: post.excerpt || '',
            cover: post.cover || '',
            tags: post.tags || [],
          },
          path: `/src/content/blog/${post.lang}/${post.slug}.mdx`
        }));
      } catch (error) {
        console.error('Error loading fallback posts:', error);
      }
    }
    
    if (import.meta.env.DEV) {
      console.log('📋 Blog posts loaded:', {
        total: indexPosts.length,
        lang,
        posts: indexPosts.map(p => p.slug),
        source: blogIndex.length > 0 ? 'index' : 'fallback'
      });
    }
    
    return indexPosts;
  }, [lang]);
  
  // Estado para filtros
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extraer tags únicos
  const availableTags = useMemo(() => {
    const allTags = allPosts.flatMap(post => post.meta.tags || []);
    return [...new Set(allTags)].sort();
  }, [allPosts]);
  
  // Filtrar posts
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return allPosts;
    return allPosts.filter(post => 
      selectedTags.some(tag => post.meta.tags?.includes(tag))
    );
  }, [allPosts, selectedTags]);

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
        <SmartImage
          src="/images/illustrations/blog-abstract.webp"
          alt="Ilustración abstracta representando ideas y conocimiento"
          className="w-full max-w-4xl mx-auto mb-16 rounded-3xl shadow-elegant"
          width={1200}
          height={800}
          loading="eager"
        />
      </Reveal>
      
      <TagFilter 
        availableTags={availableTags}
        selectedTags={selectedTags}
        onChange={setSelectedTags}
      />
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedTags.join(',')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Reveal>
            <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <Reveal key={`${post.slug}-${selectedTags.join(',')}`} delay={index * 0.1}>
                    <ContentCard
                      title={post.meta.title}
                      date={post.meta.date.toISOString()}
                      slug={post.slug}
                      excerpt={post.meta.excerpt}
                      cover={post.meta.cover}
                      tags={post.meta.tags}
                      type="blog"
                      lang={lang}
                      cta={lang === "en" ? "Read article →" : "Leer artículo →"}
                    />
                  </Reveal>
                ))
              ) : selectedTags.length > 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-serif text-foreground mb-3">
                      {lang === "en" ? "No articles found" : "No se encontraron artículos"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {lang === "en" 
                        ? "Try removing some filters or browse all articles."
                        : "Prueba quitando algunos filtros o navega por todos los artículos."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-serif text-foreground mb-3">
                      {lang === "en" ? "Content coming soon" : "Pronto añadiremos contenido"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {lang === "en" 
                        ? "We're preparing insightful articles about veterinary AI, consulting, and industry trends."
                        : "Estamos preparando artículos perspicaces sobre IA veterinaria, consultoría y tendencias del sector."}
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}