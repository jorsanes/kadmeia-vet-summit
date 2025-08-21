import { z } from "zod";

export const BaseMeta = z.object({
  title: z.string().min(3),
  date: z.preprocess((v) => new Date(String(v)), z.date()),
  excerpt: z.string().optional(),
  cover: z.string().optional(),
  lang: z.enum(["es", "en"]),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
});
export type BaseMeta = z.infer<typeof BaseMeta>;

export const BlogMeta = BaseMeta.extend({});
export type BlogMeta = z.infer<typeof BlogMeta>;

export const CaseMeta = BaseMeta.extend({});
export type CaseMeta = z.infer<typeof CaseMeta>;