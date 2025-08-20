# Pull Request - KADMEIA

## 📋 Descripción
<!-- Describe brevemente los cambios realizados -->


## 🔍 Tipo de cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva funcionalidad  
- [ ] 💄 Cambios UI/Styling
- [ ] 📝 Documentación
- [ ] ♻️ Refactoring
- [ ] ⚡ Mejora de performance
- [ ] 🌐 Traducción/i18n
- [ ] 🔒 Seguridad

---

## ♿ Accessibility Checklist

### Keyboard Navigation
- [ ] Tab navigation funciona correctamente
- [ ] Focus visible en elementos interactivos
- [ ] Escape key funciona en modals/dropdowns
- [ ] Skip links implementados donde sea necesario

### Screen Readers
- [ ] Alt text descriptivo en imágenes nuevas
- [ ] ARIA labels en botones sin texto
- [ ] Form labels correctamente asociadas
- [ ] Estructura de headings lógica (H1-H6)

### Visual & Interaction
- [ ] Contraste ≥ 4.5:1 verificado
- [ ] Touch targets ≥ 44x44px
- [ ] No dependencia solo del color para información
- [ ] Tested con screen reader (NVDA/VoiceOver)

---

## ⚡ Performance Checklist

### Images & Assets
- [ ] Nuevas imágenes optimizadas (WebP/AVIF)
- [ ] Loading="lazy" en imágenes no críticas
- [ ] Width/height especificados en imágenes
- [ ] Sprites/iconos optimizados

### Code Performance  
- [ ] Bundle size revisado (`npm run analyze`)
- [ ] Lazy loading implementado donde corresponde
- [ ] No dependencias innecesarias añadidas
- [ ] Tree shaking verificado

### Core Web Vitals
- [ ] LCP < 2.5s mantenido
- [ ] CLS < 0.1 verificado
- [ ] No blocking JavaScript añadido

---

## 🔍 SEO Checklist

### Meta Tags
- [ ] Title tags < 60 chars con keywords
- [ ] Meta descriptions < 160 chars
- [ ] Canonical tags donde corresponde
- [ ] Open Graph/Twitter cards actualizadas

### Content Structure
- [ ] H1 único por página nueva
- [ ] Jerarquía de headers lógica
- [ ] HTML semántico (header, main, section, etc.)
- [ ] Enlaces internos descriptivos

### Technical SEO
- [ ] URLs semánticas
- [ ] Sitemap.xml actualizado si es necesario
- [ ] hreflang correcto para páginas nuevas
- [ ] JSON-LD structured data cuando aplique

---

## 🌐 Internacionalización (i18n)

### Content Translation
- [ ] Textos en ES traducidos
- [ ] Textos en EN traducidos  
- [ ] Keys i18n segunen convención existente
- [ ] Fechas localizadas correctamente

### Routes & Navigation
- [ ] Rutas ES (`/ruta`) funcionan
- [ ] Rutas EN (`/en/route`) funcionan
- [ ] Language switcher preserva contexto
- [ ] hreflang tags correctos

### Testing Both Languages
- [ ] Funcionalidad testada en ES
- [ ] Funcionalidad testada en EN
- [ ] No hardcoded strings en componentes
- [ ] Fallbacks para keys faltantes

---

## 📋 Legal & Compliance

### GDPR & Privacy
- [ ] No nuevos datos PII sin consentimiento
- [ ] Privacy policy actualizada si necesario
- [ ] Cookie usage documentado
- [ ] Formularios con explicit consent

### Company Compliance
- [ ] Información corporativa correcta
- [ ] Enlaces legales funcionan
- [ ] Términos de uso actualizados si aplica
- [ ] No tracking sin consentimiento

---

## 🎨 KADMEIA Brand (5C)

### Copy & Content
- [ ] **Clara**: Directo, sin jerga técnica innecesaria
- [ ] **Científica**: Precisa, datos cuando aporta valor
- [ ] **Cercana**: Empatía con clínico/gestor  
- [ ] **Confiable**: Ética, transparencia, credenciales
- [ ] **Con propósito**: Mejora pacientes/equipos/negocio

### Voice Guidelines
- [ ] Evita "revolucionario", "mágico", superlativos vacíos
- [ ] Mantiene tone profesional pero accesible
- [ ] CTAs coherentes ("Hablemos"/"Let's talk")
- [ ] Mensajes clave: "IA aplicada sin fricción"

### Visual Consistency
- [ ] Colors KADMEIA (Primary #1E2A38, Secondary #B38A3F)
- [ ] Typography (Inter + Playfair Display)  
- [ ] Design system tokens utilizados
- [ ] No hardcoded colors/styles

---

## 🛣️ Routes Testing

### Spanish Routes (Default)
- [ ] `/` - Home
- [ ] `/servicios` - Services
- [ ] `/casos` - Cases
- [ ] `/blog` - Blog
- [ ] `/sobre` - About
- [ ] `/contacto` - Contact
- [ ] `/privacidad` - Privacy
- [ ] `/aviso-legal` - Legal Notice
- [ ] `/cookies` - Cookies Policy

### English Routes
- [ ] `/en` - Home (EN)
- [ ] `/en/services` - Services (EN)
- [ ] `/en/cases` - Cases (EN)  
- [ ] `/en/blog` - Blog (EN)
- [ ] `/en/about` - About (EN)
- [ ] `/en/contact` - Contact (EN)
- [ ] `/en/privacy` - Privacy (EN)
- [ ] `/en/legal` - Legal Notice (EN)
- [ ] `/en/cookies` - Cookies Policy (EN)

### Error Handling
- [ ] `/404` - Not Found page
- [ ] `/500` - Server Error page
- [ ] `/*` - Catch-all redirects to 404

---

## 🧪 Testing Checklist

### Functionality Testing
- [ ] Nuevas features funcionan como esperado
- [ ] No rompe funcionalidad existente
- [ ] Error handling implementado
- [ ] Edge cases considerados

### Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)  
- [ ] Edge (latest)

### Device Testing
- [ ] Desktop (1920x1080, 1366x768)
- [ ] Tablet (iPad, Android)
- [ ] Mobile (iPhone, Android various sizes)
- [ ] Touch interactions work

### Form Testing (if applicable)
- [ ] Client-side validation
- [ ] Server submission (Formspree)
- [ ] Error states handled
- [ ] Success feedback shown

---

## 📸 Screenshots

<!-- Añade capturas de pantalla de los cambios si aplica -->


## 🔗 Enlaces relacionados

<!-- Issues, documentation, external resources -->


## 📝 Notas adicionales

<!-- Información adicional para reviewers -->


---

## ✅ Pre-merge Checklist

- [ ] Código reviewed y approved
- [ ] Tests pasando (CI/CD)
- [ ] No merge conflicts
- [ ] Documentation actualizada
- [ ] Lighthouse scores mantenidos (Perf ≥90, A11y=100, SEO≥95)

---

**Reviewer Guidelines:**
1. **Functionality**: ¿Los cambios funcionan como esperado?
2. **Performance**: ¿Impacto en Core Web Vitals?
3. **Accessibility**: ¿Usable con keyboard y screen readers?
4. **i18n**: ¿Funciona en ambos idiomas?
5. **Brand**: ¿Consistente con guidelines KADMEIA 5C?
6. **SEO**: ¿Meta tags y estructura correctas?
7. **Legal**: ¿Cumple con GDPR y requirements corporativos?