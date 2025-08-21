import { useMemo } from 'react';
import Fuse from 'fuse.js';
import type { SearchItem, Locale } from './types';
import { buildSearchIndex } from './searchIndex';

export function useSearchIndex(lang: Locale) {
  const items = useMemo(() => buildSearchIndex(lang), [lang]);
  const fuse = useMemo(() => {
    return new Fuse<SearchItem>(items, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'subtitle', weight: 0.3 },
        { name: 'tags', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      includeScore: true,
      useExtendedSearch: true,
    });
  }, [items]);
  return { items, fuse };
}