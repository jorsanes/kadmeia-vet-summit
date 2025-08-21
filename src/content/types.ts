export type Locale = 'es' | 'en';

export type BaseDoc = {
  slug: string;
  title: string;
  date: string;          // ISO
  excerpt?: string;
  cover?: string;
  lang: Locale;
  tags?: string[];
  draft?: boolean;
};

export type Post = BaseDoc & { kind: 'post' };
export type CaseStudy = BaseDoc & { kind: 'case' };

export type MDXModule = {
  default: React.ComponentType<any>;
  frontmatter?: Partial<BaseDoc>;
};