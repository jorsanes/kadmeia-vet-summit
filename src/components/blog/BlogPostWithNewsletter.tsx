import React from 'react';
import { NewsletterInline } from '@/components/ui/NewsletterInline';

interface BlogPostWithNewsletterProps {
  children: React.ReactNode;
}

export const BlogPostWithNewsletter: React.FC<BlogPostWithNewsletterProps> = ({ children }) => {
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement(content)) return content;
    
    if (content.type === 'div' && content.props.children) {
      const processedChildren = React.Children.map(content.props.children, (child, index) => {
        if (React.isValidElement(child) && child.type === 'h2' && index === 0) {
          // This is the first h2, add newsletter after it
          return (
            <>
              {child}
              <NewsletterInline />
            </>
          );
        }
        return child;
      });
      
      return React.cloneElement(content, {}, processedChildren);
    }
    
    return content;
  };

  return (
    <article className="prose prose-lg max-w-4xl mx-auto px-6 py-12">
      {processContent(children)}
    </article>
  );
};