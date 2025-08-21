import React from "react";
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ContentCard from "@/components/content/ContentCard";
import { loadEntries } from "@/lib/content";
import SmartImage from '@/components/ui/SmartImage';
import Reveal from '@/components/ui/Reveal';

const modules = import.meta.glob("@/content/blog/**/*.{mdx,md}", { eager: true });

export default function Blog() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';

  const posts = loadEntries(modules, "post")
    .filter(post => post.lang === lang)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

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
            <ContentCard
              key={post.slug}
              href={post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`}
              title={post.title}
              date={post.date}
              lang={post.lang}
              excerpt={post.excerpt}
              kicker={post.card?.kicker}
              badges={post.card?.badges}
              highlights={post.card?.highlights?.filter(h => h.label && h.value) as Array<{label: string; value: string}>}
              cta={post.card?.cta}
            />
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
              <Link 
                to={lang === "en" ? "/en/contact" : "/contact"}
                className="btn-primary"
              >
                {lang === "en" ? "Contact us" : "Contactanos"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}