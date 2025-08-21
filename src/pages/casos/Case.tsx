import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { caseIndex, loadCaseComponent } from "@/lib/content-index";
import mdxComponents from "@/components/mdx/mdx-components";

export default function CaseView() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const locale = (i18n.language as "es" | "en") ?? "es";

  const meta = caseIndex.find((c) => c.slug === slug && c.locale === locale);
  const [MDX, setMDX] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    loadCaseComponent(locale, slug).then((mod) => mounted && setMDX(mod?.default ?? null));
    return () => {
      mounted = false;
    };
  }, [locale, slug]);

  if (!meta) return <div className="container py-12">Caso no encontrado.</div>;

  return (
    <main className="container py-12">
      <article className="prose prose-neutral max-w-none">
        <header className="mb-6">
          <h1>{meta.meta.title}</h1>
          <p className="text-sm opacity-70">{meta.meta.date.toLocaleDateString(locale)}</p>
        </header>
        {MDX ? <MDX components={mdxComponents} /> : <p>Cargando contenido…</p>}
      </article>
    </main>
  );
}