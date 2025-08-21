import { z } from "zod";

export const ContentCardSchema = z.object({
  kicker: z.string().optional(),                 // p.ej. "Clínica veterinaria" o "Análisis"
  badges: z.array(z.string()).optional(),        // tags visibles en tarjeta
  highlights: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .max(3)
    .optional(),                                 // KPIs: hasta 3
  cta: z.string().optional(),                    // CTA personalizado
});

export const BaseContentSchema = z.object({
  title: z.string().min(3),
  date: z.preprocess((v) => new Date(String(v)), z.date()),
  excerpt: z.string().optional(),
  cover: z.string().optional(),
  lang: z.enum(["es", "en"]),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
  slug: z.string().optional(),                   // nos ayuda en loaders
  card: ContentCardSchema.optional(),            // <-- NUEVO
});

export type BaseContentMeta = z.infer<typeof BaseContentSchema>;
export type ContentCardMeta = z.infer<typeof ContentCardSchema>;

// Legacy aliases for backwards compatibility
export const BaseMeta = BaseContentSchema;
export type BaseMeta = BaseContentMeta;

export const BlogMeta = BaseContentSchema.extend({});
export type BlogMeta = z.infer<typeof BlogMeta>;

export const CaseMeta = BaseContentSchema.extend({});
export type CaseMeta = z.infer<typeof CaseMeta>;