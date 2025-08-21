export type Locale = 'es' | 'en';

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  type: 'page' | 'post' | 'case';
  date?: string;       // ISO
  tags?: string[];
  lang: Locale;
};