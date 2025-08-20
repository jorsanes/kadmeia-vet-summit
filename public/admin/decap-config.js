(function () {
  const config = {
    backend: {
      name: "github",
      repo: "jorsanes/kadmeia-vet-summit",
      branch: "main",
      base_url: "https://kadmeia-oauth.vercel.app",
      auth_endpoint: "api/auth",
    },
    site_url: "https://www.kadmeia.com",
    display_url: "https://www.kadmeia.com",

    media_folder: "public/images/uploads",
    public_folder: "/images/uploads",

    publish_mode: "editorial_workflow",
    editor: { preview: false },

    slug: {
      encoding: "unicode",
      clean_accents: true,
      sanitize_replacement: "-",
    },

    collections: [
      // BLOG ES
      {
        name: "blog_es",
        label: "Blog (ES)",
        folder: "src/content/blog/es",
        create: true,
        slug: "{{slug}}",
        extension: "mdx",
        format: "frontmatter",
        sortable_fields: ["date", "title"],
        view_filters: [{ label: "Borradores", field: "draft", pattern: true }],
        fields: [
          { label: "Título", name: "title", widget: "string" },
          { label: "Fecha", name: "date", widget: "datetime", format: "YYYY-MM-DD", time_format: false },
          { label: "Extracto", name: "excerpt", widget: "text", required: false },
          { label: "Imagen de portada", name: "cover", widget: "image", required: false },
          { label: "Idioma", name: "lang", widget: "hidden", default: "es" },
          { label: "Etiquetas", name: "tags", widget: "list", required: false },
          { label: "Borrador", name: "draft", widget: "boolean", default: false },
          { label: "Contenido (MDX)", name: "body", widget: "markdown" },
        ],
      },

      // BLOG EN
      {
        name: "blog_en",
        label: "Blog (EN)",
        folder: "src/content/blog/en",
        create: true,
        slug: "{{slug}}",
        extension: "mdx",
        format: "frontmatter",
        sortable_fields: ["date", "title"],
        view_filters: [{ label: "Drafts", field: "draft", pattern: true }],
        fields: [
          { label: "Title", name: "title", widget: "string" },
          { label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", time_format: false },
          { label: "Excerpt", name: "excerpt", widget: "text", required: false },
          { label: "Cover", name: "cover", widget: "image", required: false },
          { label: "Lang", name: "lang", widget: "hidden", default: "en" },
          { label: "Tags", name: "tags", widget: "list", required: false },
          { label: "Draft", name: "draft", widget: "boolean", default: false },
          { label: "Content (MDX)", name: "body", widget: "markdown" },
        ],
      },

      // CASOS ES
      {
        name: "cases_es",
        label: "Casos (ES)",
        folder: "src/content/casos/es",
        create: true,
        slug: "{{slug}}",
        extension: "mdx",
        format: "frontmatter",
        sortable_fields: ["date", "title"],
        view_filters: [{ label: "Borradores", field: "draft", pattern: true }],
        fields: [
          { label: "Título", name: "title", widget: "string" },
          { label: "Fecha", name: "date", widget: "datetime", format: "YYYY-MM-DD", time_format: false },
          { label: "Extracto", name: "excerpt", widget: "text", required: false },
          { label: "Portada", name: "cover", widget: "image", required: false },
          { label: "Idioma", name: "lang", widget: "hidden", default: "es" },
          { label: "Etiquetas", name: "tags", widget: "list", required: false },
          { label: "Borrador", name: "draft", widget: "boolean", default: false },
          { label: "Contenido (MDX)", name: "body", widget: "markdown" },
        ],
      },

      // CASES EN
      {
        name: "cases_en",
        label: "Cases (EN)",
        folder: "src/content/casos/en",
        create: true,
        slug: "{{slug}}",
        extension: "mdx",
        format: "frontmatter",
        sortable_fields: ["date", "title"],
        view_filters: [{ label: "Drafts", field: "draft", pattern: true }],
        fields: [
          { label: "Title", name: "title", widget: "string" },
          { label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", time_format: false },
          { label: "Excerpt", name: "excerpt", widget: "text", required: false },
          { label: "Cover", name: "cover", widget: "image", required: false },
          { label: "Lang", name: "lang", widget: "hidden", default: "en" },
          { label: "Tags", name: "tags", widget: "list", required: false },
          { label: "Draft", name: "draft", widget: "boolean", default: false },
          { label: "Content (MDX)", name: "body", widget: "markdown" },
        ],
      },
    ],
  };

  // Inicializa Decap con config en JS
  if (window.CMS && typeof window.CMS.init === "function") {
    window.CMS.init({ config });
    console.log("%cDecap CMS inicializado vía Manual Init", "color:#1E2A38");
  } else {
    console.error("Decap CMS no cargó todavía.");
  }
})();
