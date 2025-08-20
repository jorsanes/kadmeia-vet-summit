import React, { ReactNode, useEffect, useRef } from 'react';
import { NewsletterInline } from '@/components/ui/NewsletterInline';

interface BlogPostLayoutProps {
  children: ReactNode;
}

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Find the first h2 element
    const firstH2 = contentRef.current.querySelector('h2');
    
    if (firstH2) {
      // Create newsletter component container
      const newsletterContainer = document.createElement('div');
      
      // Insert newsletter after the first h2
      firstH2.parentNode?.insertBefore(newsletterContainer, firstH2.nextSibling);
      
      // Render the NewsletterInline component
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(newsletterContainer);
        root.render(React.createElement(NewsletterInline));
      });
    }
  }, [children]);

  return (
    <article className="prose prose-lg max-w-4xl mx-auto px-6 py-12">
      <div ref={contentRef}>
        {children}
      </div>
    </article>
  );
};