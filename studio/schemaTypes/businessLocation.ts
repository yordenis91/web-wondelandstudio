import { defineField, defineType } from 'sanity';

/**
 * Copia editorial del NAP por sede, para referencia del equipo dentro del Studio.
 *
 * Regla 3 de CLAUDE.md: el NAP que se renderiza en el sitio sale de `src/data/business.ts`,
 * nunca de aquí a mano en una plantilla. Este documento no alimenta el build directamente;
 * sirve para que Sanity tenga registrada la misma fuente de verdad (mismos nombres de
 * campo que `Location` en business.ts) y detectar divergencias entre código y CMS.
 */
export const businessLocation = defineType({
  name: 'businessLocation',
  title: 'Ubicación del negocio',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
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
      name: 'name',
      title: 'Nombre de la ficha',
      description: 'Distinto del nombre legal del negocio, ej. "Wonderlands Studio — West Palm Beach".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug de ciudad (URL en inglés)',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'object',
      fields: [
        defineField({ name: 'streetAddress', title: 'Calle y número', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'addressLocality', title: 'Ciudad', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'addressRegion', title: 'Estado', type: 'string', initialValue: 'FL', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postalCode', title: 'Código postal', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'addressCountry', title: 'País', type: 'string', initialValue: 'US', validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'geo',
      title: 'Coordenadas',
      type: 'object',
      fields: [
        defineField({ name: 'latitude', title: 'Latitud', type: 'number', validation: (Rule) => Rule.required() }),
        defineField({ name: 'longitude', title: 'Longitud', type: 'number', validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'object',
      fields: [
        defineField({
          name: 'e164',
          title: 'Formato internacional (JSON-LD)',
          description: 'Ej. +15612603245',
          type: 'string',
          validation: (Rule) => Rule.required().regex(/^\+[0-9]{8,15}$/, 'formato E.164'),
        }),
        defineField({
          name: 'display',
          title: 'Formato visible en pantalla',
          description: 'Ej. (561) 260-3245',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'areasServed',
      title: 'Áreas servidas',
      description: 'Zonas que esta sede cubre sin cargo de desplazamiento.',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'languages',
      title: 'Idiomas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: [{ title: 'English', value: 'en' }, { title: 'Español', value: 'es' }] },
      initialValue: ['en', 'es'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'schemaId',
      title: '@id de JSON-LD',
      description: 'Ej. https://wonderlandsstudio.com/west-palm-beach/#location',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'address.addressLocality' },
  },
});
