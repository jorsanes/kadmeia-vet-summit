import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/mdx';

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  date: string;
  tags: string[];
  readingTime?: number;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  lang: string;
  currentSlug: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  lang,
  currentSlug
}) => {
  const isSpanish = lang === 'es';
  
  // Filter out current post and limit to 3
  const filteredPosts = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (filteredPosts.length === 0) return null;

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
    <section className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif text-foreground">
          {isSpanish ? 'Artículos relacionados' : 'Related articles'}
        </h2>
        <Link 
          to={isSpanish ? '/blog' : '/en/blog'}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {isSpanish ? 'Ver todos' : 'View all'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="group hover:shadow-lg transition-shadow">
            <Link to={`${isSpanish ? '/blog' : '/en/blog'}/${post.slug}`}>
              {post.cover && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <SmartImage
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    width={400}
                    height={200}
                  />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};