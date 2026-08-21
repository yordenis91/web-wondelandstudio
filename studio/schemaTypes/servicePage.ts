import { defineArrayMember, defineField, defineType } from 'sanity';

import { SeoPreviewInput } from '../components/SeoPreviewInput';
import { WordCountInput } from '../components/WordCountInput';

/**
 * Una por combinación servicio+ciudad+idioma (CLAUDE.md, modelo de contenido).
 * `pageType` trae los cinco valores validados en PLAN.md §2: cada uno decide qué
 * componente de precio renderiza la página (o ninguno, en `about`/`hub`/`aggregate`).
 */
export const servicePage = defineType({
  name: 'servicePage',
  title: 'Página de servicio',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'preview', title: 'Preview' },
  ],
  fields: [
    defineField({
      name: 'language',
      title: 'Idioma',
      type: 'string',
      group: 'content',
      options: { list: [{ title: 'English', value: 'en' }, { title: 'Español', value: 'es' }] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'West Palm Beach', value: 'wpb' },
          { title: 'Port St. Lucie', value: 'psl' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Servicio',
      description: 'Slug de la línea de servicio, ej. wedding-photographer',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, 'slug en minúsculas con guiones'),
    }),
    defineField({
      name: 'pageType',
      title: 'Tipo de página',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Event (tiers fijos)', value: 'event' },
          { title: 'Subscription (mensual)', value: 'subscription' },
          { title: 'Hub (resumen de ciudad)', value: 'hub' },
          { title: 'Aggregate (/pricing/)', value: 'aggregate' },
          { title: 'About (sin precio)', value: 'about' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'h1',
      title: 'H1',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answerParagraph',
      title: 'Párrafo-respuesta',
      description: 'Debe ser 60-65 palabras. Rechaza el guardado si excede.',
      type: 'text',
      group: 'content',
      components: { input: WordCountInput },
      validation: (Rule) =>
        Rule.required().custom((value: string | undefined) => {
          const count = (value ?? '').trim().split(/\s+/).filter(Boolean).length;
          if (count === 0) return true;
          if (count < 60) return `Solo ${count} palabras — mínimo 60`;
          if (count > 65) return `${count} palabras — máximo 65, sobran ${count - 65}`;
          return true;
        }),
    }),
    defineField({
      name: 'sections',
      title: 'Secciones',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'body', title: 'Cuerpo', type: 'text', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'images',
              title: 'Imágenes',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Mínimo 4 preguntas.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({ name: 'question', title: 'Pregunta', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'answer', title: 'Respuesta', type: 'text', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'question', subtitle: 'answer' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(4),
    }),
    defineField({
      name: 'videoEmbeds',
      title: 'Videos embebidos',
      description: 'Opcional — solo si el pageType admite video (deck de video WPB).',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'videoEmbed',
          fields: [
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'platform',
              title: 'Plataforma',
              type: 'string',
              options: { list: ['vimeo', 'youtube', 'self-hosted'] },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'caption', title: 'Descripción', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Imágenes',
      description: 'Alt text EN y ES obligatorios en cada imagen.',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'altEN', title: 'Alt (EN)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'altES', title: 'Alt (ES)', type: 'string', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'testimonialRefs',
      title: 'Testimonios',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'seoPreview',
      title: 'Vista previa',
      type: 'string',
      group: 'preview',
      readOnly: true,
      components: { input: SeoPreviewInput },
    }),
  ],
  preview: {
    select: {
      h1: 'h1',
      language: 'language',
      city: 'city',
      service: 'service',
      media: 'images.0',
    },
    prepare({ h1, language, city, service, media }) {
      return {
        title: h1 || service,
        subtitle: `${(language ?? '').toUpperCase()} · ${(city ?? '').toUpperCase()} · ${service ?? ''}`,
        media,
      };
    },
  },
});
