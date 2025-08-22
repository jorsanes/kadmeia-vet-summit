import { getAllPostsMeta, getAllCasesMeta } from './content';

export interface RelatedContentItem {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  date: string;
  tags: string[];
  readingTime?: number;
}

export interface NavigationItem {
  slug: string;
  title: string;
  date: string;
}

/**
 * Get related content based on tag intersection
 * @param kind - 'blog' or 'cases'
 * @param currentSlug - Current item slug to exclude
 * @param currentTags - Tags to find related content
 * @param lang - Language filter
 * @param limit - Maximum number of items to return (default: 3)
 * @returns Array of related content items
 */
export function getRelatedContent(
  kind: 'blog' | 'cases',
  currentSlug: string,
  currentTags: string[],
  lang: 'es' | 'en',
  limit: number = 3
): RelatedContentItem[] {
  try {
    const allItems = kind === 'blog' 
      ? getAllPostsMeta().filter(item => item.lang === lang)
      : getAllCasesMeta().filter(item => item.lang === lang);

    if (!allItems || allItems.length === 0) {
      return [];
    }

    // Filter out current item and calculate tag intersections
    const candidatesWithScore = allItems
      .filter(item => item.slug !== currentSlug)
      .map(item => {
        const intersection = item.tags?.filter(tag => 
          currentTags.includes(tag)
        ) || [];
        
        return {
          ...item,
          score: intersection.length,
          sharedTags: intersection
        };
      })
      .filter(item => item.score > 0) // Only items with shared tags
      .sort((a, b) => {
        // Sort by score (shared tags), then by date (newest first)
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit);

    return candidatesWithScore.map(item => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt || '',
      cover: item.cover || undefined,
      date: item.date,
      tags: item.tags || [],
      readingTime: undefined // Reading time not available in BaseMeta
    }));
  } catch (error) {
    console.error('Error getting related content:', error);
    return [];
  }
}

/**
 * Get previous and next items based on date
 * @param kind - 'blog' or 'cases'
 * @param currentSlug - Current item slug
 * @param lang - Language filter
 * @returns Object with prev and next items
 */
export function getPrevNextItems(
  kind: 'blog' | 'cases',
  currentSlug: string,
  lang: 'es' | 'en'
): { prev?: NavigationItem; next?: NavigationItem } {
  try {
    const allItems = kind === 'blog' 
      ? getAllPostsMeta().filter(item => item.lang === lang)
      : getAllCasesMeta().filter(item => item.lang === lang);

    if (!allItems || allItems.length === 0) {
      return {};
    }

    // Sort by date (newest first)
    const sortedItems = allItems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Find current item index
    const currentIndex = sortedItems.findIndex(item => item.slug === currentSlug);
    
    if (currentIndex === -1) {
      return {};
    }

    const prev = currentIndex > 0 ? {
      slug: sortedItems[currentIndex - 1].slug,
      title: sortedItems[currentIndex - 1].title,
      date: sortedItems[currentIndex - 1].date
    } : undefined;

    const next = currentIndex < sortedItems.length - 1 ? {
      slug: sortedItems[currentIndex + 1].slug,
      title: sortedItems[currentIndex + 1].title,
      date: sortedItems[currentIndex + 1].date
    } : undefined;

    return { prev, next };
  } catch (error) {
    console.error('Error getting prev/next items:', error);
    return {};
  }
}

/**
 * Generate breadcrumb items for a given route
 * @param type - 'blog' | 'cases' | 'page'
 * @param lang - Language
 * @param slug - Current item slug (optional)
 * @param title - Current item title (optional)
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
  type: 'blog' | 'cases' | 'page',
  lang: 'es' | 'en',
  slug?: string,
  title?: string
): Array<{ label: string; href?: string }> {
  const isSpanish = lang === 'es';
  const homeLabel = isSpanish ? 'Inicio' : 'Home';
  const homePath = isSpanish ? '/' : '/en';

  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: homeLabel, href: homePath }
  ];

  if (type === 'blog') {
    const blogLabel = 'Blog';
    const blogPath = isSpanish ? '/blog' : '/en/blog';
    breadcrumbs.push({ label: blogLabel, href: blogPath });
    
    if (slug && title) {
      breadcrumbs.push({ label: title });
    }
  } else if (type === 'cases') {
    const casesLabel = isSpanish ? 'Casos de Éxito' : 'Case Studies';
    const casesPath = isSpanish ? '/casos' : '/en/cases';
    breadcrumbs.push({ label: casesLabel, href: casesPath });
    
    if (slug && title) {
      breadcrumbs.push({ label: title });
    }
  }

  return breadcrumbs;
}