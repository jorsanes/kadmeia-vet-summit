# QA Checklist - KADMEIA

## 🚀 Performance (Lighthouse)

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)** < 2.5s
- [ ] **FID (First Input Delay)** < 100ms  
- [ ] **CLS (Cumulative Layout Shift)** < 0.1

### Performance Score
- [ ] **Lighthouse Performance** ≥ 90
- [ ] **Time to Interactive** < 3s
- [ ] **Speed Index** < 2s
- [ ] **Total Blocking Time** < 300ms

### Image Optimization
- [ ] Todas las imágenes tienen `loading="lazy"` (excepto críticas)
- [ ] Imágenes críticas con `loading="eager"`
- [ ] Formato WebP/AVIF cuando sea posible
- [ ] Dimensiones width/height especificadas
- [ ] Alt text descriptivo para todas las imágenes

### Bundle Analysis
- [ ] Ejecutar `npm run analyze` para revisar tamaño del bundle
- [ ] No hay dependencias duplicadas
- [ ] Tree shaking funciona correctamente
- [ ] Lazy loading implementado para rutas pesadas

---

## 🔍 SEO (Lighthouse)

### Meta Tags
- [ ] **Title** < 60 caracteres con keyword principal
- [ ] **Meta description** < 160 caracteres
- [ ] **Canonical tags** en todas las páginas
- [ ] **Open Graph** (og:title, og:description, og:image, og:type)
- [ ] **Twitter Cards** configuradas

### Structured Data
- [ ] **JSON-LD Organization** en Home
- [ ] **JSON-LD Article** en Blog/Casos  
- [ ] **Schema markup** validado con Google Rich Results Test

### Technical SEO
- [ ] **Sitemap.xml** generado y actualizado
- [ ] **Robots.txt** configurado
- [ ] **hreflang** para ES/EN implementado
- [ ] URLs semánticas y crawleables
- [ ] **Lighthouse SEO Score** ≥ 95

### Content Structure
- [ ] **H1** único por página con keyword principal
- [ ] Jerarquía de headers (H1 > H2 > H3) lógica
- [ ] **HTML semántico** (header, main, section, article, nav, aside)
- [ ] Enlaces internos descriptivos

---

## ♿ Accessibility (Lighthouse)

### Keyboard Navigation
- [ ] **Tab navigation** funciona en todos los elementos interactivos
- [ ] **Focus visible** en todos los elementos focusables
- [ ] **Skip link** funciona correctamente
- [ ] **Escape key** cierra modals/dropdowns

### Screen Readers
- [ ] **Alt text** descriptivo para imágenes
- [ ] **ARIA labels** en botones sin texto
- [ ] **Form labels** asociadas correctamente
- [ ] **Heading structure** lógica (H1-H6)

### Color & Contrast  
- [ ] **Contrast ratio** ≥ 4.5:1 para texto normal
- [ ] **Contrast ratio** ≥ 3:1 para texto grande
- [ ] Información no depende solo del color
- [ ] **Focus indicators** visibles

### Responsive & Motion
- [ ] **Touch targets** ≥ 44x44px
- [ ] **Viewport meta tag** configurado
- [ ] **prefers-reduced-motion** respetado
- [ ] **Lighthouse Accessibility Score** = 100

---

## 🌐 Internacionalización (i18n)

### Language Support
- [ ] **Español (ES)** - idioma por defecto
- [ ] **Inglés (EN)** - variante completa
- [ ] **Route structure**: `/` (ES) y `/en/` (EN)
- [ ] **Language switcher** funcional

### Content Translation
- [ ] Todos los textos UI traducidos
- [ ] **Blog/Casos MDX** en ambos idiomas
- [ ] **Error pages** (404/500) traducidas
- [ ] **Meta tags** localizadas por idioma

### Technical i18n
- [ ] **hreflang** tags correctos
- [ ] **lang attribute** en HTML
- [ ] **Date formats** localizados (DD/MM/YYYY vs MMM DD, YYYY)
- [ ] **RTL support** considerado (si aplicable)

---

## 📋 Legal & Compliance

### GDPR Compliance
- [ ] **Cookie consent** implementado
- [ ] **Privacy policy** accesible y actualizada
- [ ] **Legal notice** completo
- [ ] **Data processing consent** en formularios

### Form Compliance  
- [ ] **Explicit consent** checkbox required
- [ ] **Data usage** claramente explicado
- [ ] **Privacy policy link** visible
- [ ] **Right to withdraw** consent mencionado

### Company Information
- [ ] **Razón social**: KADMEIA SLU
- [ ] **CIF**: ES-B821932926
- [ ] **Dirección** completa en footer/contacto
- [ ] **Email corporativo**: info@kadmeia.com

---

## 📝 Forms & UX

### Contact Form
- [ ] **Validation** client-side y server-side
- [ ] **Error messages** claros y útiles
- [ ] **Success feedback** visible
- [ ] **Required fields** marcados con *

### Form Processing
- [ ] **Formspree integration** funcional
- [ ] **VITE_FORMSPREE_ID** configurado
- [ ] **Fallback error handling** implementado
- [ ] **No PII storage** en localStorage

### User Experience
- [ ] **Loading states** en formularios
- [ ] **Toast notifications** para feedback
- [ ] **Form reset** después de envío exitoso
- [ ] **Accessible error handling**

---

## 🎨 KADMEIA Brand (5C)

### Voice & Tone
- [ ] **Clara** (directo, sin jerga)
- [ ] **Científica** (precisa, con datos cuando aporte valor)
- [ ] **Cercana** (empatía con clínico/gestor)
- [ ] **Confiable** (ética, transparencia, credenciales)
- [ ] **Con propósito** (mejora de pacientes, equipos y negocio)

### Content Quality
- [ ] No usar "revolucionario", "mágico", superlativos vacíos
- [ ] **Mensajes clave** coherentes: "IA aplicada sin fricción"
- [ ] **CTAs** consistentes: "Hablemos" / "Let's talk"
- [ ] **Tone** profesional pero accesible

### Visual Consistency
- [ ] **Primary color**: #1E2A38 (Azul Profundo)
- [ ] **Secondary color**: #B38A3F (Oro Clásico) 
- [ ] **Background**: #F5F1EA (Marfil Claro)
- [ ] **Typography**: Inter (body) + Playfair Display (headers)

---

## ✅ Pre-Production Checklist

### All Languages Testing
- [ ] **Spanish routes** (`/`, `/servicios`, `/casos`, etc.)
- [ ] **English routes** (`/en`, `/en/services`, `/en/cases`, etc.)
- [ ] **Language switching** preserves current page
- [ ] **404 pages** work in both languages

### Cross-Browser Testing
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)  
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

### Device Testing
- [ ] **Desktop** (1920x1080, 1366x768)
- [ ] **Tablet** (iPad, Android tablet)
- [ ] **Mobile** (iPhone, Android, various sizes)
- [ ] **Touch interactions** work properly

### Final Checks
- [ ] **All links** functional (internal and external)
- [ ] **Contact form** sends to correct email
- [ ] **Social links** point to correct profiles
- [ ] **Analytics** tracking implemented (if applicable)

---

## 🔧 Development Tools

```bash
# Performance Analysis
npm run analyze          # Bundle size visualization
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality  
npm run lint            # ESLint check
npm run type-check      # TypeScript validation

# Testing
npm run test            # Unit tests (if implemented)
```

## 📊 Lighthouse Thresholds

| Metric | Target |
|--------|--------|
| **Performance** | ≥ 90 |
| **Accessibility** | = 100 |
| **Best Practices** | ≥ 95 |
| **SEO** | ≥ 95 |

---

*Actualizado: Enero 2025 - Versión 1.0*