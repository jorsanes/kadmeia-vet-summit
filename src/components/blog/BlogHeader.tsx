import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, RefreshCw } from 'lucide-react';
import { SmartImage } from '@/components/mdx';

interface BlogHeaderProps {
  title: string;
  date: string;
  updatedAt?: string;
  readingTime?: number;
  tags: string[];
  author?: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  cover?: string;
  banner?: string;
  lang: string;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  date,
  updatedAt,
  readingTime,
  tags,
  author,
  cover,
  banner,
  lang
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === "en" ? "en-GB" : "es-ES", {
        day: "2-digit",
        month: "long", 
        year: "numeric",
      });
    } catch { 
      return dateStr; 
    }
  };

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = lang === 'es' ? 200 : 220;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <header className="mb-12">
      {/* Banner Image - Optional and different from cover */}
      {banner && (
        <div className="mb-8 -mx-6 md:mx-0">
          <SmartImage
            src={banner}
            alt={title}
            className="w-full h-24 md:h-32 object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            width={800}
            height={128}
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-6">
        {title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        {/* Date */}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={date}>{formatDate(date)}</time>
        </div>

        {/* Updated Date */}
        {updatedAt && updatedAt !== date && (
          <div className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">
              {lang === 'es' ? 'Actualizado' : 'Updated'}: {formatDate(updatedAt)}
            </span>
          </div>
        )}

        {/* Reading Time */}
        {readingTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {readingTime} {lang === 'es' ? 'min lectura' : 'min read'}
            </span>
          </div>
        )}

        {/* Author */}
        {author && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{author.name}</span>
          </div>
        )}
      </div>

      {/* Author Card */}
      {author && author.avatar && (
        <div className="flex items-center gap-3 p-4 border border-border rounded-lg mb-6">
          <SmartImage
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover"
            width={48}
            height={48}
          />
          <div>
            <div className="font-medium text-foreground">{author.name}</div>
            {author.bio && (
              <div className="text-sm text-muted-foreground">{author.bio}</div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
};