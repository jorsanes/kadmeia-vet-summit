import { ComponentProps } from "react";

export const MdxProse = ({ children }: ComponentProps<"article">) => (
  <article className="prose prose-slate max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-li:marker:text-neutral-400">
    {children}
  </article>
);