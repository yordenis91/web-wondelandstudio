import { defineField, defineType } from 'sanity';

/**
 * Documento nuevo introducido por los decks de hub (PLAN.md §3.1 y §4) — no es
 * `servicePage`. Las 9 líneas de servicio × 2 ciudades, existan o no todavía como
 * página. Alimenta el hub desde el día uno del CMS y decide qué aparece en sitemap y
 * JSON-LD (`status: active` únicamente — PLAN.md §3.2 y §6).
 */
export const cityServiceMatrix = defineType({
  name: 'cityServiceMatrix',
  title: 'Matriz servicio × ciudad',
  type: 'document',
  fields: [
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
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
      title: 'Línea de servicio',
      description: 'Slug del servicio, ej. wedding-photographer',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, 'slug en minúsculas con guiones'),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Activo (tiene página)', value: 'active' },
          { title: 'Planeado (solo informativo en el hub)', value: 'planned' },
        ],
      },
      initialValue: 'planned',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'adPriority',
      title: 'Prioridad publicitaria',
      type: 'string',
      options: {
        list: [
          { title: 'Alto', value: 'alto' },
          { title: 'Medio', value: 'medio' },
          { title: 'Bajo', value: 'bajo' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fromPrice',
      title: 'Precio "desde $X"',
      description: 'Se muestra en el hub aunque el estado sea planned.',
      type: 'number',
      validation: (Rule) => Rule.required().positive().integer(),
    }),
    defineField({
      name: 'hubAnchor',
      title: 'Ancla del hub',
      description: 'Ej. #wedding — a donde enlaza mientras status sea planned.',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^#[a-z0-9-]+$/, 'debe empezar por # y usar minúsculas'),
    }),
    defineField({
      name: 'servicePageRef',
      title: 'Página de servicio',
      description: 'Obligatoria si y solo si status es active.',
      type: 'reference',
      to: [{ type: 'servicePage' }],
      hidden: ({ document }) => document?.status !== 'active',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const status = (context.document as { status?: string } | undefined)?.status;
          if (status === 'active' && !value) return 'servicePageRef es obligatorio cuando status es active';
          if (status === 'planned' && value) return 'servicePageRef debe estar vacío cuando status es planned';
          return true;
        }),
    }),
  ],
  preview: {
    select: { city: 'city', service: 'service', status: 'status' },
    prepare({ city, service, status }) {
      return {
        title: `${city?.toUpperCase()} · ${service}`,
        subtitle: status === 'active' ? 'Activo' : 'Planeado',
      };
    },
  },
});
