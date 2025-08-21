import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPostsMeta } from "@/lib/content";
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';
import { TextCard } from '@/components/content/TextCard';
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
  
  const allPosts = getAllPostsMeta().filter(p => p.lang === lang);
  
  // Estado para filtros
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extraer tags únicos
  const availableTags = useMemo(() => {
    const allTags = allPosts.flatMap(post => post.tags || []);
    return [...new Set(allTags)].sort();
  }, [allPosts]);
  
  // Filtrar posts
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return allPosts;
    return allPosts.filter(post => 
      selectedTags.some(tag => post.tags?.includes(tag))
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
                    <TextCard
                      title={post.title}
                      date={new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}
                      href={post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`}
                      excerpt={post.excerpt}
                      cover={post.cover}
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