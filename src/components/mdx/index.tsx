import React from 'react';
import { NewsletterInline } from '@/components/ui/NewsletterInline';
import { cn } from '@/lib/utils';

// =============================================================================
// SmartImage Component (Unified from /ui version - most complete)
// =============================================================================

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Si true: eager + fetchPriority=high */
  priority?: boolean;
  /** Hint de layout responsive (mejora LCP/CLS) */
  sizes?: string;
  className?: string;
  /** Caption para figure */
  caption?: string;
  /** Bordes redondeados */
  rounded?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  className,
  caption,
  rounded = false,
  ...props
}) => {
  const imageElement = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      sizes={sizes}
      {...(priority && { fetchPriority: 'high' as const })}
      className={cn(
        rounded && 'rounded-2xl',
        className
      )}
      {...props}
    />
  );

  if (caption) {
    return (
      <figure className="not-prose">
        {imageElement}
        <figcaption className="mt-2 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      </figure>
    );
  }

  return imageElement;
};

// =============================================================================
// Enhanced MDX Components (unified from multiple sources)
// =============================================================================

// Helper for generating heading IDs
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
};

const HeadingWithId: React.FC<React.HTMLProps<HTMLHeadingElement> & { level: 1 | 2 | 3 | 4 | 5 | 6 }> = ({ 
  level, 
  children, 
  className,
  ...props 
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const id = typeof children === 'string' ? generateId(children) : undefined;
  
  return React.createElement(Component, {
    id,
    className,
    ...props
  }, children);
};

// Custom MDX components with enhanced styling
export const mdxComponents = {
  // Images
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { width, height, ...restProps } = props;
    return (
      <SmartImage 
        {...restProps} 
        src={props.src || ''} 
        alt={props.alt || ''} 
        width={typeof width === 'string' ? parseInt(width) || undefined : width}
        height={typeof height === 'string' ? parseInt(height) || undefined : height}
        rounded 
        className="w-full h-auto" 
      />
    );
  },

  // Headings with auto-generated IDs
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId 
      level={1} 
      className="font-serif text-4xl font-bold text-foreground mb-8 leading-tight" 
      {...props} 
    />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => {
    const isFirstH2 = React.useMemo(() => true, []); // Simplified logic
    
    return (
      <>
        <HeadingWithId 
          level={2} 
          className="font-serif text-2xl font-semibold text-foreground mt-12 mb-6 leading-tight" 
          {...props} 
        />
        {isFirstH2 && <NewsletterInlineWrapper />}
      </>
    );
  },
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId 
      level={3} 
      className="font-serif text-xl font-semibold text-foreground mt-8 mb-4" 
      {...props} 
    />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId 
      level={4} 
      className="font-serif text-lg font-semibold text-foreground mt-6 mb-3" 
      {...props} 
    />
  ),
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId 
      level={5} 
      className="font-serif text-base font-semibold text-foreground mt-4 mb-2" 
      {...props} 
    />
  ),
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <HeadingWithId 
      level={6} 
      className="font-serif text-sm font-semibold text-foreground mt-4 mb-2" 
      {...props} 
    />
  ),

  // Text elements
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-muted-foreground leading-relaxed mb-6" {...props} />
  ),
  
  // Links
  a: (props: React.HTMLProps<HTMLAnchorElement>) => {
    const isExternal = typeof props.href === 'string' && /^https?:\/\//.test(props.href);
    const rel = props.rel ?? (isExternal ? 'noopener noreferrer' : undefined);
    const target = props.target ?? (isExternal ? '_blank' : undefined);
    
    return (
      <a 
        className="text-primary hover:underline font-medium" 
        rel={rel} 
        target={target} 
        {...props} 
      />
    );
  },

  // Lists
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-6 ml-4" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),

  // Code
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props} />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre 
      className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6" 
      tabIndex={0} 
      {...props} 
    />
  ),

  // Blockquotes
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-secondary bg-secondary/5 p-6 my-8 italic text-foreground" {...props} />
  ),

  // Emphasis
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: React.HTMLProps<HTMLElement>) => (
    <em className="italic" {...props} />
  ),

  // Tables
  table: (props: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-border rounded-lg" {...props} />
    </div>
  ),
  th: (props: React.HTMLProps<HTMLTableHeaderCellElement>) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props} />
  ),
  td: (props: React.HTMLProps<HTMLTableDataCellElement>) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),

  // Horizontal rule
  hr: (props: React.HTMLProps<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
};

// =============================================================================
// Case-specific Components
// =============================================================================

interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ 
  type = 'info', 
  title, 
  children 
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={cn('p-4 rounded-lg border-l-4 my-6', styles[type])}>
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div>{children}</div>
    </div>
  );
};

interface MetricProps {
  value: string | number;
  label: string;
}

export const Metric: React.FC<MetricProps> = ({ value, label }) => (
  <div className="text-center p-4">
    <div className="text-3xl font-bold text-primary mb-2">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export const MetricGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8 p-6 bg-muted/30 rounded-xl">
    {children}
  </div>
);

export const Divider: React.FC = () => (
  <hr className="my-12 border-border" />
);

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ 
  href, 
  children, 
  variant = 'primary' 
}) => {
  const isExternal = /^https?:\/\//.test(href);
  const styles = variant === 'primary' 
    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80';

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors',
        styles
      )}
    >
      {children}
    </a>
  );
};

// =============================================================================
// Layout Components
// =============================================================================

export const Prose: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="prose prose-neutral max-w-none prose-h2:mt-10 prose-img:rounded-xl prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
    {children}
  </div>
);

export const CaseArticleLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <article className="prose prose-slate max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-li:marker:text-neutral-400">
    {children}
  </article>
);

// =============================================================================
// Case shortcodes imports
// =============================================================================

import { BeforeAfter, Timeline, Gallery, Quote } from '@/components/cases/CaseShortcodes';

// =============================================================================
// Enhanced components with all features + case shortcodes
// =============================================================================

export const enhancedMDXComponents = {
  ...mdxComponents,
  // Case-specific components
  Callout,
  Metric,
  MetricGrid, 
  Divider,
  ButtonLink,
  // New case shortcodes
  BeforeAfter,
  Timeline,
  Gallery,
  Quote,
};

// Wrapper component to handle the newsletter insertion logic
const NewsletterInlineWrapper: React.FC = () => {
  const [shouldShow, setShouldShow] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldShow) return null;
  
  return <NewsletterInline />;
};

// Add debugging in development
if (import.meta.env.DEV) {
  console.log('🔧 Enhanced MDX Components loaded:', {
    hasButtonLink: !!enhancedMDXComponents.ButtonLink,
    hasCallout: !!enhancedMDXComponents.Callout,
    hasMetric: !!enhancedMDXComponents.Metric,
    totalComponents: Object.keys(enhancedMDXComponents).length
  });
}

// Default export for convenience
export default enhancedMDXComponents;