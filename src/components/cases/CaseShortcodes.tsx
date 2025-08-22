import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/mdx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Quote as QuoteIcon, Calendar, CheckCircle } from 'lucide-react';

// =============================================================================
// BeforeAfter Component
// =============================================================================

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const BeforeAfter: React.FC<BeforeAfterProps> = ({ 
  before, 
  after, 
  beforeLabel = "Antes",
  afterLabel = "Después",
  className 
}) => {
  return (
    <div className={cn("my-8 space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              {beforeLabel}
            </Badge>
          </div>
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800 leading-relaxed">
              {before}
            </p>
          </div>
        </div>

        {/* After */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
              {afterLabel}
            </Badge>
          </div>
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-800 leading-relaxed">
              {after}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Timeline Component
// =============================================================================

interface TimelineItem {
  phase: string;
  duration: string;
  description: string;
  deliverables?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={cn("my-8", className)}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-primary/20" />
        
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="flex-shrink-0 relative">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {item.phase}
                    </h3>
                    <Badge variant="secondary" className="w-fit">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.duration}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.deliverables && item.deliverables.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Entregables:
                      </h4>
                      <ul className="space-y-1">
                        {item.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Gallery Component with Lightbox
// =============================================================================

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const Gallery: React.FC<GalleryProps> = ({ 
  images, 
  columns = 3, 
  className 
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    } else {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  };

  return (
    <div className={cn("my-8", className)}>
      <div className={cn("grid gap-4", gridCols[columns])}>
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div 
                className="group cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="aspect-square relative overflow-hidden rounded-xl bg-muted">
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {image.caption}
                  </p>
                )}
              </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
              <div className="relative w-full h-full flex items-center justify-center bg-black/90">
                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 z-10 text-white hover:bg-white/20"
                      onClick={() => navigateImage('prev')}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 z-10 text-white hover:bg-white/20"
                      onClick={() => navigateImage('next')}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
                
                {/* Image */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  <SmartImage
                    src={selectedImage !== null ? images[selectedImage].src : image.src}
                    alt={selectedImage !== null ? images[selectedImage].alt : image.alt}
                    className="max-w-full max-h-full object-contain"
                    priority
                  />
                </div>
                
                {/* Caption */}
                {selectedImage !== null && images[selectedImage].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                    <p className="text-center text-sm">
                      {images[selectedImage].caption}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// Quote Component
// =============================================================================

interface QuoteProps {
  children: React.ReactNode;
  author: string;
  role: string;
  avatar?: string;
  className?: string;
}

const Quote: React.FC<QuoteProps> = ({ 
  children, 
  author, 
  role, 
  avatar, 
  className 
}) => {
  return (
    <div className={cn("my-8", className)}>
      <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-border/50">
        {/* Quote icon */}
        <QuoteIcon className="w-8 h-8 text-primary/40 mb-4" />
        
        {/* Quote text */}
        <blockquote className="text-lg text-foreground leading-relaxed mb-6 italic">
          {children}
        </blockquote>
        
        {/* Author info */}
        <div className="flex items-center gap-4">
          {avatar && (
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <SmartImage
                src={avatar}
                alt={`${author} profile`}
                className="w-full h-full object-cover"
                sizes="48px"
              />
            </div>
          )}
          <div>
            <div className="font-semibold text-foreground">
              {author}
            </div>
            <div className="text-sm text-muted-foreground">
              {role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export all components individually
export { BeforeAfter, Timeline, Gallery, Quote };