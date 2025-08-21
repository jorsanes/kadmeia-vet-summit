import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";

export function CaseArticleLayout({ children }: { children: ReactNode }) {
  return (
    <article className="prose prose-zinc max-w-none leading-relaxed
                        prose-headings:font-serif prose-headings:text-slate-900
                        prose-h2:mt-10 prose-h2:text-3xl prose-h2:tracking-tight
                        prose-h3:mt-8 prose-h3:text-2xl
                        prose-p:mt-4 prose-p:text-slate-700
                        prose-li:my-1
                        prose-a:text-sky-700 hover:prose-a:text-sky-800
                        prose-strong:text-slate-900
                        prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:text-slate-700
                        prose-img:rounded-xl">
      {children}
    </article>
  );
}

// Componentes MDX simples y neutrales (sin <Link> de react-router)
export function Callout({ type = "info", title, children }: { type?: "info" | "success" | "warning"; title?: string; children: ReactNode }) {
  const styles = {
    info: "bg-sky-50 border-sky-200",
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
  }[type];
  return (
    <div className={`my-6 rounded-xl border px-4 py-3 ${styles}`}>
      {title && <div className="mb-1 font-medium text-slate-900">{title}</div>}
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

export function Divider() {
  return <hr className="my-10 border-slate-200" />;
}

export function ButtonLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="inline-block rounded-xl bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-slate-800">
      {children}
    </a>
  );
}

// Mapa de elementos MDX -> clases Tailwind tipográficas
export const mdxComponents = {
  h2: (props: any) => <h2 {...props} />,
  h3: (props: any) => <h3 {...props} />,
  a: (props: any) => <a {...props} />,
  Callout,
  Metric,
  MetricGrid,
  Divider,
  ButtonLink,
};