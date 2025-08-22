# KADMEIA Analytics Setup

## 🎯 Plausible Analytics Integration

KADMEIA utiliza **Plausible Analytics** para un seguimiento ligero, compatible con GDPR y sin cookies.

### ✅ Características Implementadas

- **Sin cookies**: No requiere banner de consentimiento
- **GDPR-compliant**: Compatible con regulaciones de privacidad
- **Ligero**: Script de solo 1KB que no afecta al rendimiento
- **Eventos personalizados**: Tracking de CTAs, scroll depth y conversiones

### 📊 Configuración

El script de Plausible se carga automáticamente desde `index.html`:

```html
<script defer data-domain="kadmeia.com" src="https://plausible.io/js/script.js"></script>
```

### 🎯 Eventos Implementados

#### 1. CTA Clicks
- **Ubicaciones**: Blog details, Case details, Footer, Hero
- **Propiedades**: location, type, label
- **UTM**: Parámetros automáticos según contexto

```typescript
trackCTA('blog-detail', 'contact-cta', 'consultation')
```

#### 2. Scroll Depth
- **Umbrales**: 25%, 50%, 75%, 90%
- **Páginas**: Blog posts, Case studies
- **Propiedades**: depth, page, milestone

```typescript
useScrollDepth({
  enableTracking: true,
  pageName: `blog-${slug}`
});
```

#### 3. Navigation Events
- **Back links**: Breadcrumbs, navigation
- **Related content**: Internal link tracking
- **Search**: Query and results tracking

### 🏷️ UTM Parameters

#### Presets Configurados

```typescript
export const UTM_PRESETS = {
  blogToContact: {
    source: 'blog',
    medium: 'cta',
    campaign: 'lead_generation',
    content: 'blog_post'
  },
  caseToContact: {
    source: 'cases',
    medium: 'cta', 
    campaign: 'case_study',
    content: 'case_detail'
  },
  heroToContact: {
    source: 'home',
    medium: 'hero',
    campaign: 'primary_cta',
    content: 'hero_section'
  }
  // ... más presets
};
```

#### Uso en Componentes

```typescript
<TrackedLink
  href="/contacto"
  eventName="CTA Click"
  eventProps={{ location: 'blog-detail', type: 'contact-cta' }}
  utmParams={UTM_PRESETS.blogToContact}
  className="btn-primary"
>
  Hablemos
</TrackedLink>
```

### 📈 Dashboard y Métricas

#### Acceso al Dashboard
- **URL**: https://plausible.io/kadmeia.com
- **Login**: Configurar con cuenta de KADMEIA

#### Métricas Clave Rastreadas

1. **Pageviews**: Páginas más visitadas
2. **Sources**: Origen del tráfico (organic, referral, etc.)
3. **Goals**: Conversiones de CTAs
4. **Custom Events**: 
   - CTA Clicks por ubicación
   - Scroll Depth por contenido
   - Search queries
   - Download events

#### Filtros Recomendados

- **Por idioma**: ES vs EN performance
- **Por tipo de contenido**: Blog vs Cases engagement
- **Por fuente de tráfico**: Organic vs referral conversion
- **Por device**: Mobile vs desktop behavior

### 🔧 Componentes Implementados

#### TrackedLink
Enlace que automáticamente registra clicks y añade UTM:

```typescript
<TrackedLink
  href="/services"
  eventName="Navigation"
  eventProps={{ location: 'header' }}
  utmParams={UTM_PRESETS.serviceToContact}
>
  Servicios
</TrackedLink>
```

#### TrackedButton
Botón con tracking automático:

```typescript
<TrackedButton
  onClick={handleSubmit}
  eventName="Form Submit"
  eventProps={{ type: 'contact' }}
>
  Enviar
</TrackedButton>
```

#### usePlausible Hook
Hook para tracking manual:

```typescript
const { trackEvent, trackCTA, trackScroll } = usePlausible();

// Evento personalizado
trackEvent('Custom Event', {
  property1: 'value1',
  property2: 'value2'
});

// CTA específico
trackCTA('blog-detail', 'newsletter', 'inline-form');
```

#### useScrollDepth Hook
Tracking automático de scroll:

```typescript
const { resetTracking } = useScrollDepth({
  thresholds: [25, 50, 75, 90],
  enableTracking: true,
  pageName: 'about-page'
});
```

### 🎯 Objetivos de Conversión

#### CTAs Principales
- **Contact Form**: Meta de leads
- **Newsletter**: Meta de engagement
- **Service Inquiry**: Meta de sales funnel
- **Case Study Download**: Meta de content performance

#### KPIs Recomendados

1. **Conversion Rate**: CTAs clicked / Page views
2. **Engagement**: Average scroll depth
3. **Content Performance**: Time on page por tipo
4. **Lead Quality**: Form submissions por fuente

### 📱 Implementación por Página

#### Blog Posts
- ✅ Scroll depth tracking
- ✅ CTA tracking (consultation, newsletter)
- ✅ Related content clicks
- ✅ Back navigation

#### Case Studies  
- ✅ Scroll depth tracking
- ✅ Project CTA tracking
- ✅ Back navigation
- ✅ Related cases clicks

#### Home Page
- 🔄 Hero CTA tracking (pendiente)
- 🔄 Service section clicks (pendiente)
- 🔄 Testimonial interactions (pendiente)

#### Contact Page
- 🔄 Form submission tracking (pendiente)
- 🔄 Source attribution (pendiente)

### ⚙️ Configuración Avanzada

#### Variables de Entorno

```bash
# .env
VITE_PLAUSIBLE_DOMAIN=kadmeia.com
VITE_PLAUSIBLE_API_HOST=https://plausible.io
```

#### Analytics Config

```typescript
export const ANALYTICS_CONFIG = {
  domain: 'kadmeia.com',
  enabled: import.meta.env.PROD, // Solo en producción
  scrollThresholds: [25, 50, 75, 90],
  events: {
    CTA_CLICK: 'CTA Click',
    SCROLL_DEPTH: 'Scroll Depth',
    SEARCH: 'Search',
    CONTACT_FORM: 'Contact Form'
  }
};
```

### 🚀 Próximos Pasos

1. **Expandir tracking** a Home y Contact pages
2. **Configurar goals** en Plausible dashboard
3. **Implementar A/B testing** de CTAs
4. **Analytics reporting** automatizado
5. **Heatmaps** con herramientas complementarias

### 📋 Checklist de Verificación

- [x] Script de Plausible cargado
- [x] Eventos de CTA funcionando
- [x] Scroll depth tracking activo
- [x] UTM parameters implementados
- [x] Components analytics creados
- [ ] Dashboard configurado
- [ ] Goals definidos en Plausible
- [ ] Reporting automatizado

### 🎯 Aceptación Cumplida

✅ **Plausible integrado** - Ligero y sin cookies  
✅ **Eventos en CTAs** - Blog y Cases tracked  
✅ **Scroll depth opcional** - Implementado con thresholds  
✅ **UTM en botones clave** - Presets configurados  
✅ **Datos en dashboard** - Listos para visualización  
✅ **Eventos registrados** - Tracking funcional  

---

*Documentación actualizada: Enero 2025*