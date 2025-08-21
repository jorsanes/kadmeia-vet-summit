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

  const getInitials = (text: string) => {
    return text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card variant="premium" className="h-full hover-lift group">
        <Link
          to={href}
          className="block h-full focus-ring-kadmeia rounded-3xl"
          aria-label={`${locale === 'es' ? 'Leer' : 'Read'} ${title}`}
        >
          <CardContent className="p-5 h-full flex flex-col">
            {/* Image */}
            <div className="mb-4">
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-2xl">
                {cover ? (
                  <img
                    src={cover}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
                    <div className="text-3xl font-bold text-muted-foreground opacity-60">
                      {getInitials(title)}
                    </div>
                  </div>
                )}
              </AspectRatio>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <h3 className="font-display text-xl sm:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3 leading-tight">
                {title}
              </h3>

              {date && (
                <p className="text-xs text-muted-foreground mb-3">
                  {formatDate(date)}
                </p>
              )}

              {excerpt && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {excerpt}
                </p>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="premium" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="muted" size="sm">
                      +{tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}

export default ContentCard;