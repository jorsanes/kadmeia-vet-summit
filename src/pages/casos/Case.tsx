import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { caseIndex, loadCaseComponent } from "@/lib/content-index";
import { PageSeo, ArticleJsonLd } from "@/lib/seo";
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

  const currentUrl = `https://kadmeia.com${locale === 'en' ? '/en' : ''}/casos/${slug}`;

  return (
    <>
      <PageSeo
        title={`${meta.meta.title} - KADMEIA Casos`}
        description={meta.meta.excerpt}
        url={currentUrl}
        type="article"
        image={meta.meta.cover}
        locale={locale}
      />
      <ArticleJsonLd
        headline={meta.meta.title}
        description={meta.meta.excerpt}
        datePublished={meta.meta.date.toISOString()}
        url={currentUrl}
        image={meta.meta.cover}
      />
      <main className="container py-12">
      <article className="prose prose-neutral max-w-none">
        <header className="mb-6">
          <h1>{meta.meta.title}</h1>
          <p className="text-sm opacity-70">{meta.meta.date.toLocaleDateString(locale)}</p>
        </header>
        {MDX ? <MDX components={mdxComponents} /> : <p>Cargando contenido…</p>}
      </article>
    </main>
    </>
  );
}