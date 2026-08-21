import { defineField, defineType } from 'sanity';

import { TestimonialPreviewInput } from '../components/TestimonialPreviewInput';

/**
 * `verified` decide si el testimonio puede alimentar `Review`/`AggregateRating` en
 * JSON-LD. Regla 5 de CLAUDE.md: nada de reseñas marcadas sin ser reales y verificables.
 */
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido', default: true },
    { name: 'preview', title: 'Preview' },
  ],
  fields: [
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'text',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      group: 'content',
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
      name: 'category',
      title: 'Categoría',
      description: 'Slug de la línea de servicio, para filtrar (ej. wedding-photographer).',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, 'slug en minúsculas con guiones'),
    }),
    defineField({
      name: 'verified',
      title: 'Verificado',
      description: 'Solo verificados entran en schema.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'preview',
      title: 'Vista previa',
      type: 'string',
      group: 'preview',
      readOnly: true,
      components: { input: TestimonialPreviewInput },
    }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'text', city: 'city', verified: 'verified' },
    prepare({ title, subtitle, city, verified }) {
      return {
        title: `${title}${city ? ` · ${String(city).toUpperCase()}` : ''}`,
        subtitle: `${verified ? '✓ verificado' : '⚠ sin verificar'} — ${subtitle}`,
      };
    },
  },
});
