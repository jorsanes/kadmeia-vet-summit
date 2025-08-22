import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/mdx';
import { MapPin, Building2, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseMeta } from '@/content/schemas';

interface CaseHeroProps {
  meta: CaseMeta;
  className?: string;
}

export const CaseHero: React.FC<CaseHeroProps> = ({ meta, className }) => {
  const {
    title,
    client,
    sector,
    ubicacion,
    servicios,
    highlights,
    kpis,
    cover,
    date,
    excerpt
  } = meta;

  return (
    <section className={cn("relative py-16 overflow-hidden", className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Client info header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{client}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{ubicacion}</span>
                </div>
                {date && (
                  <>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(date).getFullYear()}</span>
                    </div>
                  </>
                )}
              </div>
              
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {sector}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                {title}
              </h1>
              
              {excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Servicios implementados
              </h3>
              <div className="flex flex-wrap gap-2">
                {servicios.map((servicio, index) => (
                  <Badge key={index} variant="outline" className="bg-white/50">
                    {servicio}
                  </Badge>
                ))}
              </div>
            </div>

            {/* KPIs Grid */}
            {(kpis || highlights) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Resultados destacados
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Show KPIs first */}
                  {kpis?.map((kpi, index) => (
                    <div key={`kpi-${index}`} className="text-center p-4 bg-white/60 rounded-xl border border-border/50">
                      <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                        {kpi.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {kpi.label}
                      </div>
                      {kpi.description && (
                        <div className="text-xs text-muted-foreground/80 mt-1">
                          {kpi.description}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Then show highlights if no KPIs or as additional */}
                  {highlights?.slice(0, 3 - (kpis?.length || 0)).map((highlight, index) => (
                    <div key={`highlight-${index}`} className="text-center p-4 bg-white/60 rounded-xl border border-border/50">
                      <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                        {highlight.value}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {highlight.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          {cover && (
            <div className="relative">
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-muted">
                <SmartImage
                  src={cover}
                  alt={`Caso de estudio: ${title}`}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover w-full h-full"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm" />
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 rounded-full blur-md" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CaseHero;