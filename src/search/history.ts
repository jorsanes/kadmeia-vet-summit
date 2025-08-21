// src/search/history.ts
const KEY = 'kadmeia.search.recent';
const MAX = 10;

export function getRecentQueries(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecentQuery(q: string) {
  const query = (q || '').trim();
  if (!query) return;
  const prev = getRecentQueries().filter(x => x.toLowerCase() !== query.toLowerCase());
  const next = [query, ...prev].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
}