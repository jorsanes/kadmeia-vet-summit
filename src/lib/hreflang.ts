import { BaseMeta } from '@/lib/content';

/**
 * Generate equivalent URL for the opposite language
 */
export function getHreflangUrl(
  currentSlug: string,
  currentLang: 'es' | 'en',
  type: 'blog' | 'cases'
): string {
  const targetLang = currentLang === 'es' ? 'en' : 'es';
  const basePath = type === 'blog' ? 'blog' : (type === 'cases' ? 'cases' : 'casos');
  
  if (targetLang === 'en') {
    return `/en/${basePath}/${currentSlug}`;
  } else {
    const spanishPath = type === 'cases' ? 'casos' : 'blog';
    return `/${spanishPath}/${currentSlug}`;
  }
}

/**
 * Get related content by intersecting tags
 */
export function getRelatedByTags(
  allMeta: BaseMeta[],
  currentSlug: string,
  currentLang: 'es' | 'en',
  currentTags: string[] = [],
  limit = 3
): BaseMeta[] {
  if (!currentTags.length) return [];

  return allMeta
    .filter(item => 
      item.lang === currentLang && 
      item.slug !== currentSlug &&
      item.tags?.some(tag => currentTags.includes(tag))
    )
    .map(item => ({
      ...item,
      // Calculate relevance score based on tag overlap
      relevanceScore: item.tags?.filter(tag => currentTags.includes(tag)).length || 0
    }))
    .sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore)
    .slice(0, limit);
}