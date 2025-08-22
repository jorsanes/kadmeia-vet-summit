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

// Case-specific schema with premium consulting fields
export const CaseMeta = BaseContentSchema.extend({
  // Client information
  client: z.string().min(1),
  sector: z.string().min(1),
  ubicacion: z.string().min(1),
  servicios: z.array(z.string()).min(1),
  
  // Highlights and KPIs
  highlights: z.array(z.object({
    label: z.string(),
    value: z.string()
  })).optional(),
  
  kpis: z.array(z.object({
    label: z.string(), 
    value: z.string(),
    description: z.string().optional()
  })).optional(),
  
  // Testimonial
  testimonial: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    avatar: z.string().optional()
  }).optional(),
  
  // Media galleries
  gallery: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional()
  })).optional(),
  
  // Timeline for case study progression
  timeline: z.array(z.object({
    phase: z.string(),
    duration: z.string(),
    description: z.string(),
    deliverables: z.array(z.string()).optional()
  })).optional(),
  
  // Legacy fields for backwards compatibility
  duration: z.string().optional(),
  clinics: z.number().optional(),
});

export type CaseMeta = z.infer<typeof CaseMeta>;