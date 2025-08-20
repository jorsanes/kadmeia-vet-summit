// src/lib/mdx.ts
import type { ComponentType } from "react";

export type Frontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  excerpt?: string;
  cover?: string;
  lang: "es" | "en";
  tags?: string[];
  draft?: boolean;
};

export type MdxModule = {
  default: ComponentType;
  frontmatter: Frontmatter;
};

export type Entry = Frontmatter & {
  path: string;
  slug: string;
  Component: ComponentType;
};

// Globs tipados (MDX con frontmatter)
export const blogModules = import.meta.glob<MdxModule>("/src/content/blog/**/*.mdx", {
  eager: true,
});
export const casesModules = import.meta.glob<MdxModule>("/src/content/casos/**/*.mdx", {
  eager: true,
});

function toEntry([modPath, mod]: [string, MdxModule]): Entry {
  const slug = modPath.split("/").pop()!.replace(/\.mdx$/, "");
  return {
    path: modPath,
    slug,
    Component: mod.default,
    ...mod.frontmatter,
  };
}

export function listEntries(mods: Record<string, MdxModule>): Entry[] {
  return Object.entries(mods)
    .map(toEntry)
    .filter((e) => !e.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
