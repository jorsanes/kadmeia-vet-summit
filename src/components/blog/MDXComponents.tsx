import React from 'react';
import { NewsletterInline } from '@/components/ui/NewsletterInline';

// Custom components for MDX
export const MDXComponents = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="font-display text-4xl font-bold text-foreground mb-8 leading-tight" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => {
    const isFirstH2 = React.useMemo(() => {
      // This will be true for the first h2 after page load
      return true; // We'll handle the newsletter insertion differently
    }, []);

    return (
      <>
        <h2 className="font-display text-2xl font-semibold text-foreground mt-12 mb-6 leading-tight" {...props} />
        {isFirstH2 && <NewsletterInlineWrapper />}
      </>
    );
  },
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="font-display text-xl font-semibold text-foreground mt-8 mb-4" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-muted-foreground leading-relaxed mb-6" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-6 ml-4" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-secondary bg-secondary/5 p-6 my-8 italic text-foreground" {...props} />
  ),
  strong: (props: React.HTMLProps<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: (props: React.HTMLProps<HTMLAnchorElement>) => (
    <a className="text-primary hover:underline font-medium" {...props} />
  ),
  code: (props: React.HTMLProps<HTMLElement>) => (
    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props} />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => (
    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6" {...props} />
  ),
};

// Wrapper component to handle the newsletter insertion logic
const NewsletterInlineWrapper: React.FC = () => {
  const [shouldShow, setShouldShow] = React.useState(false);
  
  React.useEffect(() => {
    // Add a small delay to ensure this is the first h2
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldShow) return null;
  
  return <NewsletterInline />;
};