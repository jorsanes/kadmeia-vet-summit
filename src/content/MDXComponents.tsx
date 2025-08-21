import React from "react";

export const Prose: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="prose prose-neutral max-w-none prose-h2:mt-10 prose-img:rounded-xl prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground">
    {children}
  </div>
);

export const mdxComponents = {};