# KADMEIA - Consultoría y Tecnología Veterinaria

Sitio web corporativo premium desarrollado con React + Vite, diseñado para consultoría y tecnología en el sector veterinario.

## 🚀 Stack Tecnológico

- **React 18** + **TypeScript** - Desarrollo modular y tipado estricto
- **Vite** - Build tool rápido y optimizado
- **Tailwind CSS** - Sistema de diseño corporativo premium
- **shadcn/ui** - Componentes UI elegantes y customizables
- **Framer Motion** - Microinteracciones sutiles y profesionales
- **React i18next** - Internacionalización ES/EN
- **React Router** - Navegación SPA

## 🎨 Identidad Visual

### Colores Corporativos
- **Primario**: #1E2A38 (Azul Profundo) - Texto, enlaces, acentos
- **Secundario**: #B38A3F (Oro Clásico) - Acentos e íconos sutiles  
- **Fondo**: #F5F1EA (Marfil Claro) - Fondo principal
- **Neutros**: Generados automáticamente con contraste AA/AAA

### Tipografías
- **Inter**: Texto general y navegación
- **Playfair Display**: Titulares y elementos display

### Estilo
- Sobrio, aireado, grid limpio
- Bordes redondeados 12px (radius: 0.75rem)
- Sombras suaves y elegantes
- Microinteracciones discretas

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # shadcn components
├── pages/               # Páginas principales
│   ├── Home.tsx         # Landing con hero y secciones
│   ├── Services.tsx     # 3 servicios principales
│   ├── Cases.tsx        # Casos de éxito
│   ├── Blog.tsx         # Blog corporativo
│   ├── About.tsx        # Sobre nosotros (5 C)
│   └── Contact.tsx      # Formulario de contacto
├── i18n/                # Internacionalización
│   ├── config.ts        # Configuración i18n
│   └── locales/         # Traducciones ES/EN
├── assets/              # Imágenes generadas
└── lib/                 # Utilidades
```

## 🌐 Internacionalización

### Idiomas Soportados
- **Español (ES)** - Idioma por defecto
- **Inglés (EN)** - Mercado europeo

### Gestión de Contenido
- Archivos JSON en `src/i18n/locales/`
- Selector de idioma en header
- URLs limpias (/ para ES, /en para EN)

### Añadir/Editar Traducciones
1. Editar `src/i18n/locales/es.json` y `en.json`
2. Usar claves descriptivas: `"hero.title": "Texto"`
3. Reiniciar servidor para aplicar cambios

## 📝 Gestión de Contenido

### Blog y Casos
Los contenidos están actualmente como datos estáticos en los componentes. Para un CMS real, recomendamos:

1. **MDX Files**: Crear `/content/blog/` y `/content/cases/`
2. **Frontmatter**: Metadatos como title, date, excerpt, cover
3. **Build Process**: Generar páginas estáticas

### Estructura Sugerida de MDX
```yaml
---
title: "Título del post"
date: "2024-03-15"
author: "KADMEIA Team"
excerpt: "Descripción breve"
category: "Tecnología"
tags: ["IA", "Veterinaria"]
cover: "/images/post-cover.jpg"
---

Contenido en Markdown...
```

## 🔧 Comandos de Desarrollo

### Instalación
```bash
npm install
# o
pnpm install
```

### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:5173
```

### Build de Producción
```bash
npm run build
npm run preview  # Preview del build
```

### Linting y Formato
```bash
npm run lint     # ESLint
```

## 📧 Configuración de Contacto

### Variables de Entorno
Crear `.env.local` en la raíz:

```env
VITE_CONTACT_EMAIL=info@kadmeia.com
VITE_FORMSPREE_ID=your_formspree_id
```

### Formulario de Contacto
- Validación en frontend con HTML5 + React
- Consentimiento RGPD obligatorio
- Fallback a Formspree configurado
- Toast notifications para feedback

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio GitHub
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Configurar variables de entorno

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

## 🎯 SEO y Performance

### SEO Implementado
- Meta tags optimizados por página
- Títulos descriptivos (<60 caracteres)
- Meta descriptions (<160 caracteres)
- HTML semántico (header, main, section, article)
- Alt tags en todas las imágenes
- Structured data básico

### Performance
- Lazy loading de imágenes
- Tree shaking automático
- Code splitting por rutas
- Preload de fuentes críticas
- Compresión de assets

### Robots y Sitemap
- `public/robots.txt` configurado
- Sitemap.xml a implementar (recomendamos plugin)

## 🔒 Consideraciones de Seguridad

- No hay datos sensibles en el frontend
- Formularios con validación y sanitización
- HTTPS obligatorio en producción
- Políticas CSP recomendadas

## 📱 Responsividad

Breakpoints de Tailwind:
- **sm**: 640px+ (móvil horizontal)
- **md**: 768px+ (tablet)
- **lg**: 1024px+ (desktop)
- **xl**: 1280px+ (desktop grande)
- **2xl**: 1536px+ (desktop XL)

## 🎨 Customización del Design System

### Colores
Editar `src/index.css` variables CSS:
```css
:root {
  --primary: 210 33% 17%;    /* Azul Profundo */
  --secondary: 40 46% 47%;   /* Oro Clásico */
  --background: 40 29% 93%;  /* Marfil Claro */
}
```

### Componentes
Los componentes shadcn están en `src/components/ui/` y son completamente customizables.

### Tipografías
Configuradas en `tailwind.config.ts`:
```js
fontFamily: {
  'display': ['Playfair Display', 'Georgia', 'serif'],
  'body': ['Inter', 'sans-serif']
}
```

## 📞 Información de Contacto

**Empresa**: KADMEIA  
**Dirección**: Camino de los Malatones, 63 - J3, 28119 Algete, Madrid, España  
**Email**: info@kadmeia.com  
**Sitio**: kadmeia.com  

## 📄 Licencia

© 2024 KADMEIA. Todos los derechos reservados.

---

**Nota**: Este README incluye toda la información necesaria para desarrollo, mantenimiento y despliegue. Para modificaciones del design system o contenido, consultar las secciones correspondientes.
