import React from "react";
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllPostsMeta } from "@/lib/content";
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';

export default function Blog() {
  let isEN = false;
  try {
    isEN = useLocation().pathname.startsWith('/en');
  } catch (error) {
    // Default to Spanish when outside Router context
    isEN = false;
  }
  const lang = isEN ? 'en' : 'es';

  const posts = getAllPostsMeta().filter(p => p.lang === lang);

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
      
      <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {posts.length > 0 ? (
          posts.map(post => (
            <article key={post.slug} className="rounded-3xl shadow-sm bg-gradient-to-b from-[#faf7f3] to-white border border-neutral-100 overflow-hidden">
              <div className="h-40 bg-gradient-to-b from-white to-neutral-50" />
              <div className="p-5">
                <h3 className="text-xl font-serif leading-tight">
                  <a href={post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </a>
                </h3>
                {post.excerpt && <p className="mt-2 text-neutral-600">{post.excerpt}</p>}
                <div className="mt-3 text-sm text-neutral-500">
                  {new Date(post.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}
                </div>
                <div className="mt-4">
                  <a 
                    href={post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`}
                    className="text-primary-700 hover:underline"
                  >
                    {lang === "en" ? "Read article →" : "Leer artículo →"}
                  </a>
                </div>
              </div>
            </article>
          ))
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
    </div>
  );
}