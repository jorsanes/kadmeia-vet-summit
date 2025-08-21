import React from "react";

export const MDXComponents = {
  h2: (props: any) => <h2 {...props} className="mt-8 mb-3 text-2xl font-serif text-slate-900" />,
  h3: (props: any) => <h3 {...props} className="mt-6 mb-2 text-xl font-serif text-slate-900" />,
  p:  (props: any) => <p  {...props} className="leading-relaxed text-neutral-800" />,
  a:  (props: any) => <a  {...props} className="text-sky-800 hover:underline" />,
  ul: (props: any) => <ul {...props} className="list-disc pl-6 my-3" />,
  ol: (props: any) => <ol {...props} className="list-decimal pl-6 my-3" />,
  blockquote: (props: any) => <blockquote {...props} className="border-l-4 pl-4 text-neutral-700" />,
};