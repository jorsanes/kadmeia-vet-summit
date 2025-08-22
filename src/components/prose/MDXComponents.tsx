import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SmartLink } from '@/components/navigation/SmartLink';
import { ExternalLink, Info, AlertTriangle, CheckCircle } from 'lucide-react';

// Enhanced heading components with automatic ID generation
const HeadingWithId = ({ 
  level, 
  children, 
  className = "",
  ...props
}: { 
  level: 1 | 2 | 3 | 4 | 5 | 6; 
  children?: React.ReactNode; 
  className?: string;
} & React.HTMLProps<HTMLHeadingElement>) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const text = typeof children === 'string' ? children : '';
  const id = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
  
  return React.createElement(Tag, { 
    id, 
    className: `scroll-mt-20 ${className}`,
    ...props
  }, children);
};

// Custom components for enhanced MDX rendering
export const enhancedMDXComponents = {
  // Headings with auto-generated IDs for anchor links
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={1} {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={2} {...props} />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={3} {...props} />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={4} {...props} />
  ),
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={5} {...props} />
  ),
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId level={6} {...props} />
  ),

  // Enhanced images
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img 
      {...props}
      className="w-full h-auto rounded-xl shadow-lg my-8"
      loading="lazy"
      decoding="async"
    />
  ),

  // Enhanced links with external link indicators
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http') && !href.includes('kadmeia.com');
    const isInternal = href?.startsWith('#');
    
    if (isInternal) {
      return (
        <a 
          href={href} 
          className="text-primary hover:underline font-medium decoration-2 underline-offset-2 scroll-smooth"
          {...props}
        >
          {children}
        </a>
      );
    }
    
    return (
      <SmartLink
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary hover:underline font-medium decoration-2 underline-offset-2 inline-flex items-center gap-1"
        {...props}
      >
        {children}
        {isExternal && <ExternalLink className="h-3 w-3 opacity-70" />}
      </SmartLink>
    );
  },

  // Enhanced code blocks
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre 
      className="bg-muted border border-border rounded-lg p-4 overflow-x-auto text-sm my-6 font-mono"
      {...props} 
    />
  ),

  // Inline code
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code 
      className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground before:content-none after:content-none"
      {...props} 
    />
  ),

  // Enhanced tables
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border-collapse border border-border rounded-lg" {...props} />
    </div>
  ),
  
  th: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <th className="bg-muted text-left text-sm font-semibold text-foreground py-3 px-4 border-b border-border" {...props} />
  ),
  
  td: (props: React.HTMLProps<HTMLTableCellElement>) => (
    <td className="py-3 px-4 text-sm text-muted-foreground border-b border-border" {...props} />
  ),

  // Custom components
  Callout: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'success' | 'error'; children: React.ReactNode }) => {
    const icons = {
      info: <Info className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      error: <AlertTriangle className="h-4 w-4" />
    };

    const variants = {
      info: 'border-blue-200 bg-blue-50 text-blue-900',
      warning: 'border-amber-200 bg-amber-50 text-amber-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      error: 'border-red-200 bg-red-50 text-red-900'
    };

    return (
      <Alert className={`my-6 ${variants[type]}`}>
        <div className="flex items-start gap-3">
          {icons[type]}
          <AlertDescription className="text-sm leading-relaxed">
            {children}
          </AlertDescription>
        </div>
      </Alert>
    );
  },

  Tag: ({ children }: { children: React.ReactNode }) => (
    <Badge variant="secondary" className="mx-1 bg-secondary/50 text-secondary-foreground">
      {children}
    </Badge>
  ),

  CTA: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <div className="my-8 text-center">
      <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
        <SmartLink href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </SmartLink>
      </Button>
    </div>
  )
};

export default enhancedMDXComponents;