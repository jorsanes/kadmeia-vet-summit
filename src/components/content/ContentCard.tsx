import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

type ContentCardProps = {
  href: string;
  title: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
  cover?: string;
  locale?: 'es' | 'en';
};

export function ContentCard({
  href,
  title,
  excerpt,
  date,
  tags,
  cover,
  locale = 'es'
}: ContentCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link 
        to={href} 
        aria-label={`${locale === 'es' ? 'Abrir' : 'Open'} ${title}`} 
        className="group block h-full focus-ring-kadmeia rounded-3xl"
      >
        <div className="overflow-hidden rounded-3xl shadow-elegant bg-card h-full flex flex-col transition-all duration-300 group-hover:shadow-lg">
          {cover ? (
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={cover}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-gradient-to-b from-muted/50 to-background" />
          )}

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-display text-xl sm:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
              {title}
            </h3>
            
            {date && (
              <p className="mt-1 text-xs text-muted-foreground mb-3">
                {formatDate(date)}
              </p>
            )}
            
            {excerpt && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                {excerpt}
              </p>
            )}
            
            {tags && tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map(t => (
                  <Badge key={t} variant="secondary" size="sm">
                    {t}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="muted" size="sm">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="mt-auto text-sm text-primary/80 group-hover:text-primary transition-colors duration-200">
              {locale === 'es' ? 'Ver caso →' : 'View case →'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ContentCard;