import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '@/components/ui/Reveal';
import { TextCard } from '@/components/content/TextCard';

const modules = import.meta.glob("@/content/blog/**/*.{mdx,md}", { eager: true });

type BlogPost = {
  slug: string;
  lang: "es" | "en";
  title: string;
  date: string;
  excerpt?: string;
};

function formatDate(date: string, lang: "es" | "en") {
  try {
    return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch { return date; }
}

const blogPosts: BlogPost[] = Object.entries(modules).map(([path, mod]) => {
  const meta = (mod as any).meta || {};
  const m = path.match(/\/blog\/(en|es)\/(.+)\.(mdx|md)$/);
  const lang = (m?.[1] ?? "es") as "es" | "en";
  const slug = m?.[2] ?? "";
  return {
    slug,
    lang,
    title: meta.title ?? slug,
    date: meta.date ?? "",
    excerpt: meta.excerpt ?? "",
  };
}).sort((a,b)=> (b.date?.localeCompare(a.date)));

export default function Blog() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';

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
      
      <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {blogPosts.filter(post => post.lang === lang).map(post => {
          const href = post.lang === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`;
          return (
            <TextCard
              key={`${post.lang}-${post.slug}`}
              title={post.title}
              date={formatDate(post.date, post.lang)}
              excerpt={post.excerpt}
              href={href}
              cta={isEN ? "Read article →" : "Leer artículo →"}
            />
          );
        })}
      </div>
      
      {blogPosts.filter(post => post.lang === lang).length === 0 && (
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
  );
}