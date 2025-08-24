import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { blogIndex, loadBlogComponent } from "@/lib/content-index";
import { getBlogPost } from "@/lib/mdx";
import { PageSeo, ArticleJsonLd } from "@/lib/seo";

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

  if (!meta) {
    // Try fallback with getBlogPost from lib/mdx
    const fallbackPost = getBlogPost(slug, locale);
    if (!fallbackPost) {
      return <div className="container py-12">Post no encontrado.</div>;
    }
    // Convert fallback to expected format
    const fallbackMeta = {
      slug: fallbackPost.slug,
      locale,
      meta: {
        title: fallbackPost.title,
        excerpt: fallbackPost.excerpt,
        date: new Date(fallbackPost.date),
        cover: fallbackPost.cover,
        tags: fallbackPost.tags
      }
    };
    return renderPost(fallbackMeta, fallbackPost.Component);
  }

  function renderPost(metaData: any, Component?: React.ComponentType) {
    const currentUrl = `https://kadmeia.com${locale === 'en' ? '/en' : ''}/blog/${slug}`;

    return (
      <>
        <PageSeo
          title={`${metaData.meta.title} - KADMEIA Blog`}
          description={metaData.meta.excerpt}
          url={currentUrl}
          type="article"
          image={metaData.meta.cover}
          locale={locale}
        />
        <ArticleJsonLd
          headline={metaData.meta.title}
          description={metaData.meta.excerpt}
          datePublished={metaData.meta.date.toISOString()}
          url={currentUrl}
          image={metaData.meta.cover}
        />
        <main className="container py-12">
          <article className="blog-prose max-w-4xl mx-auto px-6 py-12">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground font-serif">{metaData.meta.title}</h1>
              <p className="text-sm text-muted-foreground">{metaData.meta.date.toLocaleDateString(locale)}</p>
            </header>
            {Component ? <Component /> : 
             MDX ? <MDX /> : 
             <p>Cargando contenido…</p>}
          </article>
        </main>
      </>
    );
  }

  return renderPost(meta);
}