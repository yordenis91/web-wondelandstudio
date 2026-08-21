import { defineField, defineType } from 'sanity';

/** Imagen con alt EN y ES obligatorios, categoría y ciudad. Sin cambios de v1 (PLAN.md §4). */
export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Elemento de galería',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altEN',
      title: 'Alt (EN)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altES',
      title: 'Alt (ES)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Bodas', value: 'weddings' },
          { title: 'Marca', value: 'branding' },
          { title: 'Maternidad', value: 'maternity' },
        ],
      },
    }),
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
    }),
  ],
  preview: {
    select: { media: 'image', title: 'altEN', category: 'category', city: 'city' },
    prepare({ media, title, category, city }) {
      return {
        title,
        subtitle: [category, city].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
