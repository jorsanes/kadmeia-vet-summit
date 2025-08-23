import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SmartImage } from '@/components/mdx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';

interface ContentCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  cover?: string;
  tags?: string[];
  readingTime?: number;
  type: 'blog' | 'case';
  lang: 'es' | 'en';
  kicker?: string;
  badges?: string[];
  highlights?: { label: string; value: string }[];
  cta?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  excerpt,
  date,
  slug,
  cover,
  tags = [],
  readingTime,
  type,
  lang,
  kicker,
  badges,
  highlights,
  cta
}) => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  
  const basePath = lang === 'es' 
    ? (type === 'blog' ? '/blog' : '/casos')
    : (type === 'blog' ? '/en/blog' : '/en/casos');
  
  const href = `${basePath}/${slug}`;

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

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch { 
      return dateStr; 
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
      onMouseEnter={handleMouseEnter}
    >
      <Link to={href} className="block h-full">
        {cover && (
          <div className="relative overflow-hidden aspect-[4/3]">
            <SmartImage
              src={cover}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              width={400}
              height={300}
            />
            {kicker && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-primary">
                  {kicker}
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardContent className="p-6 flex flex-col h-full">
          {/* Tags or Badges */}
          {(badges || tags) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {(badges || tags.slice(0, 2)).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h3 className="font-serif text-xl leading-tight text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          
          {/* Highlights/KPIs */}
          {highlights && highlights.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-primary/5 rounded-lg">
              {highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="font-bold text-primary text-sm">{highlight.value}</div>
                  <div className="text-xs text-muted-foreground">{highlight.label}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
            <time dateTime={date}>
              {formatDate(date)}
            </time>
            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readingTime} min</span>
              </div>
            )}
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              {cta || (lang === 'es' ? 'Leer más' : 'Read more')}
            </span>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};