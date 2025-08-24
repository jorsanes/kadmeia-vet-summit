import * as React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { blogIndex, loadBlogComponent } from "@/lib/content-index";
import { getBlogPost } from "@/lib/mdx";
import { getDbPostBySlug } from "@/lib/blog-db";
import { TiptapRenderer } from "@/components/blog/TiptapRenderer";
import { PageSeo, ArticleJsonLd } from "@/lib/seo";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const { i18n } = useTranslation();
  const locale = (i18n.language as "es" | "en") ?? "es";

  const [dbPost, setDbPost] = React.useState<any>(null);
  const [MDX, setMDX] = React.useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    
    const loadPost = async () => {
      // First try database
      const dbPostData = await getDbPostBySlug(slug, locale);
      if (mounted && dbPostData) {
        setDbPost(dbPostData);
        setLoading(false);
        return;
      }
      
      // Then try MDX
      const mod = await loadBlogComponent(locale, slug);
      if (mounted) {
        setMDX(mod?.default ?? null);
        setLoading(false);
      }
    };
    
    loadPost();
    
    return () => {
      mounted = false;
    };
  }, [locale, slug]);

  // If loading, show loading state
  if (loading) {
    return <div className="container py-12">Cargando...</div>;
  }

  // If database post exists, render it
  if (dbPost) {
    const currentUrl = `https://kadmeia.com${locale === 'en' ? '/en' : ''}/blog/${slug}`;
    
    return (
      <>
        <PageSeo
          title={`${dbPost.title} - KADMEIA Blog`}
          description={dbPost.excerpt || ''}
          url={currentUrl}
          type="article"
          image={dbPost.cover_image || ''}
          locale={locale}
        />
        <ArticleJsonLd
          headline={dbPost.title}
          description={dbPost.excerpt || ''}
          datePublished={dbPost.published_at || dbPost.created_at}
          url={currentUrl}
          image={dbPost.cover_image || ''}
        />
        <main className="container py-12">
          <article className="blog-prose max-w-4xl mx-auto px-6 py-12">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-foreground font-serif">{dbPost.title}</h1>
              <p className="text-sm text-muted-foreground">
                {new Date(dbPost.published_at || dbPost.created_at).toLocaleDateString(locale)}
              </p>
              {dbPost.cover_image && (
                <img 
                  src={dbPost.cover_image} 
                  alt={dbPost.title}
                  className="w-full h-64 object-cover rounded-lg mt-6"
                />
              )}
            </header>
            <TiptapRenderer content={dbPost.content} />
          </article>
        </main>
      </>
    );
  }

  const meta = blogIndex.find((p) => p.slug === slug && p.locale === locale);

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