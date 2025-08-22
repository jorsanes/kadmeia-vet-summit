import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface SeriesPost {
  slug: string;
  title: string;
  order: number;
  isCurrent?: boolean;
}

interface SeriesNavigationProps {
  seriesName: string;
  posts: SeriesPost[];
  currentSlug: string;
  lang: string;
}

export const SeriesNavigation: React.FC<SeriesNavigationProps> = ({
  seriesName,
  posts,
  currentSlug,
  lang
}) => {
  const isSpanish = lang === 'es';
  const sortedPosts = posts.sort((a, b) => a.order - b.order);
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  return (
    <div className="space-y-6 my-12">
      {/* Series Info */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <List className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary">
                  {isSpanish ? 'Serie' : 'Series'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} {isSpanish ? 'de' : 'of'} {sortedPosts.length}
                </Badge>
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">
                {seriesName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isSpanish 
                  ? 'Esta es una serie de artículos relacionados. Te recomendamos leerlos en orden.'
                  : 'This is a series of related articles. We recommend reading them in order.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Previous Post */}
        {prevPost && (
          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link 
                to={`${isSpanish ? '/blog' : '/en/blog'}/${prevPost.slug}`}
                className="block"
              >
                <div className="flex items-center gap-3">
                  <ChevronLeft className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isSpanish ? 'Anterior' : 'Previous'}
                    </div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                      {prevPost.title}
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Next Post */}
        {nextPost && (
          <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link 
                to={`${isSpanish ? '/blog' : '/en/blog'}/${nextPost.slug}`}
                className="block"
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground mb-1 text-right">
                      {isSpanish ? 'Siguiente' : 'Next'}
                    </div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors truncate text-right">
                      {nextPost.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Series Index */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium text-foreground mb-4">
            {isSpanish ? 'Todos los artículos de la serie' : 'All articles in this series'}
          </h4>
          <ol className="space-y-2">
            {sortedPosts.map((post, index) => (
              <li key={post.slug} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-6">
                  {index + 1}.
                </span>
                {post.slug === currentSlug ? (
                  <span className="font-medium text-primary flex-1">
                    {post.title}
                  </span>
                ) : (
                  <Link 
                    to={`${isSpanish ? '/blog' : '/en/blog'}/${post.slug}`}
                    className="text-sm hover:text-primary transition-colors flex-1"
                  >
                    {post.title}
                  </Link>
                )}
                {post.slug === currentSlug && (
                  <Badge variant="secondary" className="text-xs">
                    {isSpanish ? 'Actual' : 'Current'}
                  </Badge>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};