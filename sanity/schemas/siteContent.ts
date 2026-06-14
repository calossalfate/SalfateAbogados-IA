import { defineField, defineType } from "sanity";

const iconOptions = [
  { title: "Edificio", value: "Building2" },
  { title: "Documento", value: "FileText" },
  { title: "Alerta", value: "AlertTriangle" },
  { title: "Voto", value: "Vote" },
  { title: "Calculadora", value: "Calculator" },
  { title: "Escudo", value: "Shield" },
  { title: "Usuarios", value: "Users" },
  { title: "Balanza", value: "Scale" },
  { title: "Maletín", value: "Briefcase" },
  { title: "Casa", value: "Home" },
  { title: "Agua", value: "Droplets" },
  { title: "Búsqueda", value: "FileSearch" },
];

export const siteContent = defineType({
  name: "siteContent",
  title: "Contenido del sitio",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contacto" },
    { name: "seo", title: "SEO" },
    { name: "theme", title: "Apariencia" },
    { name: "hero", title: "Inicio / Hero" },
    { name: "areas", title: "Especialidades" },
    { name: "faq", title: "FAQ" },
    { name: "forms", title: "Formulario" },
    { name: "chat", title: "Chat" },
    { name: "footer", title: "Pie de página" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Nombre del estudio",
      type: "string",
      group: "general",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "contact",
      title: "Datos de contacto",
      type: "object",
      group: "contact",
      fields: [
        { name: "email", title: "Correo", type: "string" },
        { name: "phone", title: "Teléfono (solo números, ej. 56991545512)", type: "string" },
        { name: "phoneDisplay", title: "Teléfono visible", type: "string" },
        { name: "whatsappNumber", title: "WhatsApp (solo números)", type: "string" },
        { name: "coverage", title: "Cobertura", type: "string" },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        { name: "title", title: "Título (pestaña Google)", type: "string" },
        { name: "description", title: "Descripción", type: "text", rows: 3 },
        { name: "keywords", title: "Palabras clave", type: "array", of: [{ type: "string" }] },
      ],
    }),
    defineField({
      name: "theme",
      title: "Tema de colores",
      type: "string",
      group: "theme",
      options: {
        list: [
          { title: "Clásico dorado", value: "classic" },
          { title: "Azul corporativo", value: "corporate-blue" },
          { title: "Conservador", value: "conservative" },
        ],
        layout: "radio",
      },
      initialValue: "classic",
    }),
    defineField({
      name: "hero",
      title: "Sección principal",
      type: "object",
      group: "hero",
      fields: [
        { name: "badge", title: "Etiqueta superior", type: "string" },
        { name: "title", title: "Título principal", type: "text", rows: 2 },
        { name: "subtitle", title: "Subtítulo", type: "text", rows: 3 },
        { name: "ctaPrimary", title: "Botón principal", type: "string" },
        { name: "ctaSecondary", title: "Botón secundario", type: "string" },
        { name: "panelTitle", title: "Título panel lateral", type: "string" },
        { name: "panelStatus", title: "Estado panel", type: "string" },
        { name: "panelDisclaimer", title: "Aviso panel", type: "text", rows: 2 },
        {
          name: "indicators",
          title: "Indicadores del panel",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "practiceAreas",
      title: "Especialidades",
      type: "object",
      group: "areas",
      fields: [
        { name: "eyebrow", title: "Etiqueta", type: "string" },
        { name: "title", title: "Título", type: "string" },
        { name: "subtitle", title: "Párrafo 1", type: "text", rows: 3 },
        { name: "subtitle2", title: "Párrafo 2", type: "text", rows: 3 },
        { name: "cta", title: "Texto botón", type: "string" },
        {
          name: "areas",
          title: "Áreas",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "icon",
                  title: "Ícono",
                  type: "string",
                  options: { list: iconOptions },
                },
                { name: "title", title: "Título", type: "string" },
                { name: "description", title: "Descripción", type: "text", rows: 3 },
              ],
              preview: {
                select: { title: "title", subtitle: "description" },
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "Preguntas frecuentes",
      type: "object",
      group: "faq",
      fields: [
        { name: "title", title: "Título sección", type: "string" },
        { name: "subtitle", title: "Subtítulo", type: "string" },
        {
          name: "items",
          title: "Preguntas",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "question", title: "Pregunta", type: "string" },
                { name: "answer", title: "Respuesta", type: "text", rows: 4 },
              ],
              preview: { select: { title: "question" } },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "contactSection",
      title: "Sección contacto",
      type: "object",
      group: "forms",
      fields: [
        { name: "title", title: "Título", type: "string" },
        { name: "description", title: "Descripción", type: "text", rows: 3 },
        {
          name: "caseTypes",
          title: "Tipos de caso (formulario)",
          type: "array",
          of: [{ type: "string" }],
        },
        { name: "successMessage", title: "Mensaje de éxito", type: "string" },
        { name: "errorMessage", title: "Mensaje de error", type: "string" },
      ],
    }),
    defineField({
      name: "strongCta",
      title: "Llamado a la acción",
      type: "object",
      group: "general",
      fields: [
        { name: "title", title: "Título", type: "text", rows: 2 },
        { name: "subtitle", title: "Subtítulo", type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "chat",
      title: "Chat flotante",
      type: "object",
      group: "chat",
      fields: [
        { name: "assistantName", title: "Nombre del asistente", type: "string" },
        { name: "subtitle", title: "Subtítulo", type: "string" },
        {
          name: "teaserMessages",
          title: "Notificaciones proactivas",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "welcomeQuickReplies",
          title: "Botones rápidos iniciales",
          type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "footer",
      title: "Pie de página",
      type: "object",
      group: "footer",
      fields: [
        { name: "tagline", title: "Descripción", type: "text", rows: 2 },
        { name: "disclaimer", title: "Aviso legal", type: "string" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contenido del sitio web" };
    },
  },
});
