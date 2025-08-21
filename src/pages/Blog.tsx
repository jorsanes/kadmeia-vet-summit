import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllPosts } from '@/lib/content';

export default function Blog() {
  const isEN = useLocation().pathname.startsWith('/en');
  const lang = isEN ? 'en' : 'es';
  const posts = getAllPosts(lang as any);

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-serif mb-8">{isEN ? 'Blog' : 'Blog'}</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map(p => (
          <Link
            key={p.slug}
            to={isEN ? `/en/blog/${p.slug}` : `/blog/${p.slug}`}
            className="group rounded-2xl border p-5 hover:shadow-lg transition"
          >
            {p.cover && <img src={p.cover} alt="" className="rounded-xl mb-4" loading="lazy" />}
            <h2 className="text-2xl font-serif group-hover:underline">{p.title}</h2>
            <p className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString()}</p>
            {p.excerpt && <p className="mt-2 text-muted-foreground">{p.excerpt}</p>}
            {p.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags!.map(t => <span key={t} className="text-xs bg-muted rounded px-2 py-1">{t}</span>)}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}