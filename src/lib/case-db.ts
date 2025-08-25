import { supabase } from '@/integrations/supabase/client';

export interface DbCaseStudy {
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
  client?: string | null;
  sector?: string | null;
  ubicacion?: string | null;
  servicios?: string[] | null;
}

export async function getPublishedDbCases(lang: string = 'es'): Promise<DbCaseStudy[]> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('status', 'published')
      .eq('lang', lang)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching DB case studies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching DB case studies:', error);
    return [];
  }
}

export async function getDbCaseBySlug(slug: string, lang: string = 'es'): Promise<DbCaseStudy | null> {
  try {
    const { data, error } = await supabase
      .from('case_studies')
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
    console.error('Error fetching DB case study:', error);
    return null;
  }
}

// Helper to convert DB case to MDX-like format for compatibility
export function dbCaseToMdxFormat(caseStudy: DbCaseStudy) {
  return {
    path: `/casos/${caseStudy.slug}`,
    slug: caseStudy.slug,
    title: caseStudy.title,
    date: caseStudy.published_at || caseStudy.created_at,
    excerpt: caseStudy.excerpt || '',
    cover: caseStudy.cover_image || '',
    lang: caseStudy.lang as 'es' | 'en',
    tags: caseStudy.tags,
    client: caseStudy.client,
    sector: caseStudy.sector,
    ubicacion: caseStudy.ubicacion,
    servicios: caseStudy.servicios,
    isFromDb: true,
    dbCase: caseStudy,
  };
}