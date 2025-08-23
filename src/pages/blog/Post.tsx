import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { blogIndex, loadBlogComponent } from "@/lib/content-index";
import { PageSeo, ArticleJsonLd } from "@/lib/seo";
import { enhancedMDXComponents as mdxComponents } from "@/components/mdx";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const locale = (i18n.language as "es" | "en") ?? "es";

  const meta = blogIndex.find((p) => p.slug === slug && p.locale === locale);
  const [MDX, setMDX] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    loadBlogComponent(locale, slug).then((mod) => mounted && setMDX(mod?.default ?? null));
    return () => {
      mounted = false;
    };
  }, [locale, slug]);

  if (!meta) return <div className="container py-12">Post no encontrado.</div>;

  const currentUrl = `https://kadmeia.com${locale === 'en' ? '/en' : ''}/blog/${slug}`;

  return (
    <>
      <PageSeo
        title={`${meta.meta.title} - KADMEIA Blog`}
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
        <article className="blog-prose max-w-4xl mx-auto px-6 py-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-foreground font-serif">{meta.meta.title}</h1>
            <p className="text-sm text-muted-foreground">{meta.meta.date.toLocaleDateString(locale)}</p>
          </header>
          {MDX ? <MDX components={mdxComponents} /> : <p>Cargando contenido…</p>}
        </article>
      </main>
    </>
  );
}