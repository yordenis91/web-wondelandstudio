import { defineField, defineType } from 'sanity';

/** Blog / trabajos recientes. Sin cambios de v1 (PLAN.md §4). */
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicada',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', date: 'publishedAt' },
    prepare({ title, date }) {
      return { title, subtitle: date ? new Date(date).toLocaleDateString('es-US') : 'sin publicar' };
    },
  },
});
