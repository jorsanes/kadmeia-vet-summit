import React from 'react';

export const MDXComponents = {
  h1: (p: any) => <h1 className="text-3xl md:text-4xl font-serif mb-6" {...p} />,
  h2: (p: any) => <h2 className="text-2xl md:text-3xl font-serif mt-10 mb-4" {...p} />,
  h3: (p: any) => <h3 className="text-xl md:text-2xl font-serif mt-8 mb-3" {...p} />,
  p:  (p: any) => <p className="leading-7 text-muted-foreground mb-4" {...p} />,
  ul: (p: any) => <ul className="list-disc pl-6 mb-4 space-y-1" {...p} />,
  ol: (p: any) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...p} />,
  li: (p: any) => <li className="mb-1" {...p} />,
  blockquote: (p:any) => (
    <blockquote className="border-l-4 pl-4 italic text-muted-foreground my-6" {...p} />
  ),
  img: (p:any) => <img className="rounded-xl shadow md:max-w-[90%] my-6" {...p} />,
  a: (p:any) => <a className="underline underline-offset-4 hover:text-primary" {...p} />,
  table: (p:any) => <div className="overflow-x-auto my-6"><table className="min-w-full" {...p} /></div>,
};