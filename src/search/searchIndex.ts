import type { Locale, SearchItem } from './types';
import { getAllPosts, getAllCases } from '@/lib/content';

function staticPages(lang: Locale): SearchItem[] {
  if (lang === 'en') {
    return [
      { id:'en-home',  title:'Home',            url:'/en',           type:'page', lang, subtitle:'Landing' },
      { id:'en-svc',   title:'Services',        url:'/en/services',  type:'page', lang },
      { id:'en-cases', title:'Case Studies',    url:'/en/cases',     type:'page', lang },
      { id:'en-blog',  title:'Blog',            url:'/en/blog',      type:'page', lang },
      { id:'en-about', title:'About',           url:'/en/about',     type:'page', lang },
      { id:'en-ctc',   title:'Contact',         url:'/en/contact',   type:'page', lang },
    ];
  }
  return [
    { id:'es-home',  title:'Inicio',      url:'/',            type:'page', lang, subtitle:'Portada' },
   { id:'es-svc',   title:'Servicios',   url:'/servicios',   type:'page', lang },
   { id:'es-cases', title:'Casos',       url:'/casos',       type:'page', lang, subtitle:'Casos de éxito' },
   { id:'es-blog',  title:'Blog',        url:'/blog',        type:'page', lang },
   { id:'es-about', title:'Sobre',       url:'/sobre',       type:'page', lang },
   { id:'es-ctc',   title:'Contacto',    url:'/contacto',    type:'page', lang },
  ];
}

export function buildSearchIndex(lang: Locale): SearchItem[] {
  const pages = staticPages(lang);
  const posts = getAllPosts(lang).map(p => ({
    id: `${lang}-post-${p.slug}`,
    title: p.title,
    subtitle: p.excerpt,
    url: lang === 'en' ? `/en/blog/${p.slug}` : `/blog/${p.slug}`,
    type: 'post' as const,
    date: p.date,
    tags: p.tags,
    lang,
  }));
  const cases = getAllCases(lang).map(c => ({
    id: `${lang}-case-${c.slug}`,
    title: c.title,
    subtitle: c.excerpt,
    url: lang === 'en' ? `/en/cases/${c.slug}` : `/casos/${c.slug}`,
    type: 'case' as const,
    date: c.date,
    tags: c.tags,
    lang,
  }));
  return [...pages, ...posts, ...cases];
}