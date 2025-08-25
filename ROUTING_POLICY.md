# KADMEIA - Routing Policy

## Language-based Routing Convention

### Spanish Content (Default)
- **Base path**: `/` 
- **Examples**: `/`, `/blog`, `/casos`, `/contacto`, `/privacy`
- All Spanish content should use root-level paths without language prefix

### English Content
- **Base path**: `/en/`
- **Examples**: `/en/`, `/en/blog`, `/en/cases`, `/en/contact`, `/en/privacy`
- All English content MUST be under the `/en/` prefix
- No English content should exist at root level paths

### Implementation Guidelines

1. **Link Generation**: Always use `getLocalizedHref()` from `src/lib/navigation.ts` for internal links
2. **Route Components**: English routes should be mounted under `/en/*` in routing configuration  
3. **SEO**: Each page should have proper `hreflang` tags pointing to equivalent content in other languages
4. **Redirects**: Consider redirecting any orphaned English content to proper `/en/` paths

### Content Mapping
- `/blog` ↔ `/en/blog`
- `/casos` ↔ `/en/cases` 
- `/contacto` ↔ `/en/contact`
- `/privacy` ↔ `/en/privacy`
- `/legal` ↔ `/en/legal`
- `/cookies` ↔ `/en/cookies`

### Exceptions
- Admin routes: `/admin/*` (no localization needed)
- API endpoints: `/api/*` (no localization needed)
- Static assets: remain at root level

---
*Last updated: December 2024*