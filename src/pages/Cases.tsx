import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Reveal from '@/components/ui/Reveal';
import SmartImage from '@/components/media/SmartImage';
import { TextCard } from '@/components/content/TextCard';

const modules = import.meta.glob("@/content/casos/**/*.{mdx,md}", { eager: true });

type Item = {
  slug: string;
  lang: "es" | "en";
  title: string;
  date: string;
  excerpt?: string;
};

function fmt(date: string, lang: "es" | "en") {
  try {
    return new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch { return date; }
}

const items: Item[] = Object.entries(modules).map(([path, mod]) => {
  const meta = (mod as any).meta || {};
  const m = path.match(/\/casos\/(en|es)\/(.+)\.(mdx|md)$/);
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

export default function Cases() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';

  return (
    <div className="container py-12">
      <Helmet>
        <title>{isEN ? 'Case Studies | KADMEIA' : 'Casos de éxito | KADMEIA'}</title>
        <meta name="description" content={isEN ? 'Measured outcomes from our projects.' : 'Resultados medibles de nuestros proyectos.'} />
      </Helmet>
      
      <Reveal y={12}>
        <h1 className="text-4xl font-serif mb-8 text-center">{isEN ? 'Case Studies' : 'Casos de éxito'}</h1>
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {isEN 
            ? 'Real results from our veterinary technology implementations. See how we help clinics achieve measurable improvements.'
            : 'Resultados reales de nuestras implementaciones de tecnología veterinaria. Descubre cómo ayudamos a las clínicas a lograr mejoras medibles.'
          }
        </p>
      </Reveal>
      
      <Reveal>
        <SmartImage
          src="/images/illustrations/cases-collage.webp"
          alt="Mosaico de proyectos y resultados medibles"
          className="w-full max-w-4xl mx-auto mb-16 rounded-3xl shadow-elegant"
          width={1200}
          height={800}
        />
      </Reveal>
      
      <div className="mt-10 grid gap-8 sm:gap-10 lg:gap-12 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {items.filter(it => it.lang === lang).map(it => {
          const href = it.lang === "en" ? `/en/cases/${it.slug}` : `/casos/${it.slug}`;
          return (
            <TextCard
              key={`${it.lang}-${it.slug}`}
              title={it.title}
              date={fmt(it.date, it.lang)}
              excerpt={it.excerpt}
              href={href}
              cta={it.lang === "en" ? "View case →" : "Ver caso →"}
            />
          );
        })}
      </div>
      
      {items.filter(it => it.lang === lang).length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-serif text-foreground mb-3">
              {lang === "en" ? "Content coming soon" : "Pronto añadiremos contenido"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {lang === "en" 
                ? "We're working on bringing you inspiring case studies from our veterinary consulting work."
                : "Estamos trabajando en traerte casos de éxito inspiradores de nuestro trabajo de consultoría veterinaria."}
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