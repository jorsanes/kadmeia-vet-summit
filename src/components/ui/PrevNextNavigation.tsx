import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface NavigationItem {
  slug: string;
  title: string;
  date: string;
}

interface PrevNextNavigationProps {
  prev?: NavigationItem;
  next?: NavigationItem;
  lang: string;
  type: 'blog' | 'cases';
}

export const PrevNextNavigation: React.FC<PrevNextNavigationProps> = ({
  prev,
  next,
  lang,
  type
}) => {
  const isSpanish = lang === 'es';
  const basePath = isSpanish 
    ? (type === 'blog' ? '/blog' : '/casos')
    : (type === 'blog' ? '/en/blog' : '/en/cases');

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

  if (!prev && !next) return null;

  return (
    <nav 
      className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12"
      aria-label={isSpanish ? "Navegación entre artículos" : "Article navigation"}
    >
      {/* Previous */}
      <div className="md:col-span-1">
        {prev ? (
          <Card className="group hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4">
              <Link 
                to={`${basePath}/${prev.slug}`}
                className="block h-full"
              >
                <div className="flex items-start gap-3 h-full">
                  <ChevronLeft className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isSpanish ? 'Anterior' : 'Previous'}
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {prev.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={prev.date}>
                        {formatDate(prev.date)}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div /> // Empty div to maintain grid layout
        )}
      </div>

      {/* Next */}
      <div className="md:col-span-1">
        {next && (
          <Card className="group hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4">
              <Link 
                to={`${basePath}/${next.slug}`}
                className="block h-full"
              >
                <div className="flex items-start gap-3 h-full">
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      {isSpanish ? 'Siguiente' : 'Next'}
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {next.title}
                    </h3>
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={next.date}>
                        {formatDate(next.date)}
                      </time>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </nav>
  );
};