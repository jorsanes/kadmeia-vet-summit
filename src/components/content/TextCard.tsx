import React, { useState } from 'react';
import { SmartLink } from '@/components/navigation/SmartLink';
import { SmartImage } from '@/components/mdx';

type Props = {
  title: string;
  date: string;
  href: string;
  excerpt?: string;
  cta?: string;
  cover?: string;
};

export function TextCard({ title, date, href, excerpt, cta = "Ver más →", cover }: Props) {
  const [isPrefetched, setIsPrefetched] = useState(false);

  const handleMouseEnter = () => {
    if (!isPrefetched) {
      // Prefetch the route
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = href;
      document.head.appendChild(link);
      setIsPrefetched(true);
    }
  };

  return (
    <article 
      role="listitem"
      className="relative rounded-2xl bg-gradient-to-b from-white to-[#f8f5f0] shadow-[0_10px_40px_-15px_rgba(0,0,0,.15)] ring-1 ring-black/5 overflow-hidden transition-all duration-300 hover:shadow-[0_18px_50px_-10px_rgba(0,0,0,.2)] hover:translate-y-[-2px] focus-within:ring-2 focus-within:ring-primary/40"
      onMouseEnter={handleMouseEnter}
    >
      {/* Enhanced overlay link */}
      <SmartLink
        to={href} 
        aria-label={title} 
        className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl" 
      />
      
      {/* Optimized cover image */}
      {cover && (
        <div className="aspect-[4/3] w-full bg-muted overflow-hidden">
          <SmartImage
            src={cover} 
            alt={title}
            className="w-full h-full object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
            width={400}
            height={300}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-serif text-lg text-primary">{title}</h3>
        {excerpt && (
          <p
            className="mt-1 text-sm text-muted-foreground"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        )}
        <p className="mt-1 text-xs text-secondary font-medium">{date}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary">{cta}</span>
      </div>
    </article>
  );
};