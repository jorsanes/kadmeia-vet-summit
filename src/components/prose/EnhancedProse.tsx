import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EnhancedProseProps {
  children: ReactNode;
  className?: string;
}

export default function EnhancedProse({ children, className }: EnhancedProseProps) {
  return (
    <div
      className={cn([
        // Base prose styles
        "prose prose-lg max-w-none",
        
        // Typography
        "prose-headings:font-serif prose-headings:text-foreground prose-headings:tracking-tight",
        "prose-h1:text-4xl prose-h1:leading-tight prose-h1:mb-8 prose-h1:mt-0",
        "prose-h2:text-3xl prose-h2:leading-tight prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-primary",
        "prose-h3:text-2xl prose-h3:leading-tight prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary",
        "prose-h4:text-xl prose-h4:leading-snug prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-foreground",
        "prose-h5:text-lg prose-h5:leading-snug prose-h5:mt-6 prose-h5:mb-2 prose-h5:text-foreground",
        "prose-h6:text-base prose-h6:leading-snug prose-h6:mt-4 prose-h6:mb-2 prose-h6:text-foreground",
        
        // Paragraph and text
        "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base",
        "prose-lead:text-xl prose-lead:text-foreground prose-lead:leading-relaxed prose-lead:mb-8",
        
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
        "prose-a:decoration-2 prose-a:underline-offset-2",
        
        // Lists
        "prose-ul:my-6 prose-ul:text-muted-foreground",
        "prose-ol:my-6 prose-ol:text-muted-foreground", 
        "prose-li:my-2 prose-li:leading-relaxed",
        "prose-li:marker:text-secondary prose-li:marker:font-medium",
        
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:bg-secondary/5",
        "prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:my-8",
        "prose-blockquote:text-foreground prose-blockquote:italic prose-blockquote:rounded-r-lg",
        
        // Code
        "prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm",
        "prose-code:font-mono prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg",
        "prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:text-sm prose-pre:my-6",
        
        // Tables
        "prose-table:my-8 prose-table:border-collapse prose-table:w-full",
        "prose-thead:border-b prose-thead:border-border",
        "prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-foreground",
        "prose-th:py-3 prose-th:px-4 prose-th:border-b prose-th:border-border",
        "prose-td:py-3 prose-td:px-4 prose-td:text-sm prose-td:text-muted-foreground",
        "prose-td:border-b prose-td:border-border",
        "prose-tr:border-b prose-tr:border-border",
        
        // Images
        "prose-img:rounded-xl prose-img:my-8 prose-img:shadow-lg",
        "prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:text-center",
        "prose-figcaption:mt-3 prose-figcaption:italic",
        
        // Horizontal rule
        "prose-hr:border-border prose-hr:my-12",
        
        // Strong and emphasis
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:text-foreground prose-em:italic",
        
        className,
      ])}
    >
      {children}
    </div>
  );
}