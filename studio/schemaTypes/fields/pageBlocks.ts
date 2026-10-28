import { defineArrayMember, defineField } from 'sanity';

import { portableBodyField } from './portableBody';

const GROUP = 'content';

/** Secciones de texto de una página: prosa (H2 + párrafos) o pasos numerados. */
export function sectionsField(name: string, title: string, hiddenFor: (pageType?: string) => boolean) {
  return defineField({
    name,
    title,
    type: 'array',
    group: GROUP,
    hidden: ({ document }) => hiddenFor(document?.pageType as string | undefined),
    of: [
      defineArrayMember({
        type: 'object',
        name: 'proseSection',
        title: 'Sección de texto',
        fields: [
          defineField({ name: 'heading', title: 'Título (H2)', type: 'string', validation: (Rule) => Rule.required() }),
          portableBodyField('body', 'Cuerpo', { required: true }),
        ],
        preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Texto' }) },
      }),
      defineArrayMember({
        type: 'object',
        name: 'stepsSection',
        title: 'Pasos numerados',
        fields: [
          defineField({ name: 'heading', title: 'Título (H2)', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({
            name: 'steps',
            title: 'Pasos',
            type: 'array',
            validation: (Rule) => Rule.required().min(1),
            of: [
              defineArrayMember({
                type: 'object',
                name: 'step',
                fields: [
                  defineField({ name: 'lead', title: 'Inicio (en negrita)', type: 'string', validation: (Rule) => Rule.required() }),
                  defineField({ name: 'rest', title: 'Resto de la frase', type: 'text', rows: 2, validation: (Rule) => Rule.required() }),
                ],
                preview: { select: { title: 'lead', subtitle: 'rest' } },
              }),
            ],
          }),
        ],
        preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title, subtitle: 'Pasos' }) },
      }),
    ],
  });
}

/** CTA de cierre, idéntico en todas las páginas. */
export const finalCtaField = defineField({
  name: 'finalCta',
  title: 'CTA final',
  type: 'object',
  group: GROUP,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'heading', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Texto', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: 'label', title: 'Texto del botón', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'message',
      title: 'Mensaje de WhatsApp prellenado',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const breadcrumbsField = defineField({
  name: 'breadcrumbs',
  title: 'Migas de pan',
  description: 'La última no lleva ruta (es la página actual).',
  type: 'array',
  group: GROUP,
  of: [
    defineArrayMember({
      type: 'object',
      name: 'crumb',
      fields: [
        defineField({ name: 'name', title: 'Texto', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'path', title: 'Ruta', type: 'string', description: 'Ej. /west-palm-beach/ (vacío en la última)' }),
      ],
      preview: { select: { title: 'name', subtitle: 'path' } },
    }),
  ],
  validation: (Rule) => Rule.required().min(2),
});

export const heroField = defineField({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  group: GROUP,
  fields: [
    defineField({ name: 'eyebrow', title: 'Texto sobre el H1', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alt', title: 'Alt de la imagen', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'image',
      title: 'Imagen',
      description: 'Opcional hasta que lleguen las fotos; mientras tanto el sitio usa el placeholder.',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
});
