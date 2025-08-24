import { supabase } from '@/integrations/supabase/client';

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  cover_image?: string | null;
  lang: string;
  tags: string[];
  status: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPublishedDbPosts(lang: string = 'es'): Promise<DbBlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('lang', lang)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching DB blog posts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching DB blog posts:', error);
    return [];
  }
}

export async function getDbPostBySlug(slug: string, lang: string = 'es'): Promise<DbBlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching DB blog post:', error);
    return null;
  }
}

// Helper to convert DB post to MDX-like format for compatibility
export function dbPostToMdxFormat(post: DbBlogPost) {
  return {
    path: `/blog/${post.slug}`,
    slug: post.slug,
    title: post.title,
    date: post.published_at || post.created_at,
    excerpt: post.excerpt || '',
    cover: post.cover_image || '',
    lang: post.lang as 'es' | 'en',
    tags: post.tags,
    isFromDb: true,
    dbPost: post,
  };
}