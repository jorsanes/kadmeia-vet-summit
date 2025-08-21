import { ReactNode } from "react";

export default function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        "prose prose-stone max-w-none",
        "prose-headings:font-serif prose-headings:text-slate-900",
        "prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3",
        "prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2",
        "prose-p:text-neutral-800 prose-p:leading-relaxed",
        "prose-ul:my-3 prose-li:my-1",
        "prose-strong:text-slate-900",
        "prose-a:text-sky-800 hover:prose-a:underline",
        "prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-neutral-700",
        "prose-hr:my-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}