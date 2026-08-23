import { defineArrayMember, defineField, defineType } from 'sanity';

import { SeoPreviewInput } from '../components/SeoPreviewInput';
import {
  MAX_WORDS,
  MIN_WORDS,
  WordCountInput,
  countWords,
} from '../components/WordCountInput';

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
      description:
        'Máximo 65 palabras (obligatorio). Por debajo de 60 avisa pero deja guardar: ' +
        'cinco párrafos ya aprobados están en 57-59.',
      type: 'text',
      group: 'content',
      components: { input: WordCountInput },
      /**
       * Dos niveles distintos a propósito:
       *
       * - **Error** por encima de 65. Es la única cifra que fija CLAUDE.md
       *   ("answerParagraph (máx 65 palabras, validado)") y por tanto la regla dura.
       * - **Aviso** por debajo de 60. Es guía editorial —un párrafo corto compite peor
       *   en AI Overviews— pero no puede rechazar el guardado: cinco párrafos ya
       *   aprobados en docs/copy/ caen en 57-59 palabras (about-lisandra EN 58,
       *   city-hubs WPB EN 59 / PSL EN 57 / WPB ES 59 / PSL ES 58). Con un mínimo duro,
       *   ese contenido no se podría cargar en el CMS.
       */
      validation: (Rule) => [
        Rule.required().custom((value: string | undefined) => {
          const count = countWords(value);
          if (count === 0) return true;
          if (count > MAX_WORDS) {
            return `${count} palabras — máximo ${MAX_WORDS}, sobran ${count - MAX_WORDS}`;
          }
          return true;
        }),
        Rule.warning().custom((value: string | undefined) => {
          const count = countWords(value);
          if (count === 0 || count >= MIN_WORDS) return true;
          return `Solo ${count} palabras. Por debajo de ${MIN_WORDS} compite peor en AI Overviews — se puede guardar, pero revísalo.`;
        }),
      ],
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
            /**
             * Portable Text, no texto plano.
             *
             * Los copy decks llevan enlaces dentro de los párrafos ("entra directamente
             * a [video de bodas en West Palm Beach](...)"), y un `text` plano no los
             * puede representar: obligaba a partir el párrafo o a perder el enlace.
             *
             * Deliberadamente pobre: solo párrafos, listas, negrita, cursiva y enlace.
             * Sin encabezados —el H2 de la sección es el campo `title`, y permitir otro
             * aquí rompería la jerarquía de la página— y sin estilos de color, que es
             * decisión de diseño y no de contenido.
             */
            defineField({
              name: 'body',
              title: 'Cuerpo',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'block',
                  styles: [{ title: 'Párrafo', value: 'normal' }],
                  lists: [
                    { title: 'Viñetas', value: 'bullet' },
                    { title: 'Numerada', value: 'number' },
                  ],
                  marks: {
                    decorators: [
                      { title: 'Negrita', value: 'strong' },
                      { title: 'Cursiva', value: 'em' },
                    ],
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'Enlace',
                        fields: [
                          defineField({
                            name: 'href',
                            title: 'Destino',
                            type: 'string',
                            description:
                              'Ruta interna con barra inicial y final (/es/precios/), ancla (#wedding), o URL completa.',
                            /**
                             * Un enlace interno sin barra final acaba en una redirección
                             * o en un 404, porque el sitio se sirve con
                             * `trailingSlash: always`. Ya nos pasó una vez con un enlace
                             * a una página que no existía; esto lo atrapa al guardar en
                             * vez de en producción.
                             */
                            validation: (Rule) =>
                              Rule.required().custom((value?: string) => {
                                if (!value) return 'El enlace necesita un destino';
                                if (/^https?:\/\//.test(value)) return true;
                                if (/^#[a-z0-9-]+$/.test(value)) return true;
                                if (!value.startsWith('/')) {
                                  return 'Una ruta interna empieza por "/" (o usa una URL completa con https://)';
                                }
                                const [path] = value.split('#');
                                if (!path.endsWith('/')) {
                                  return 'Una ruta interna acaba en "/" — el sitio usa trailingSlash: always';
                                }
                                return true;
                              }),
                          }),
                        ],
                      },
                    ],
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'images',
              title: 'Imágenes',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            }),
          ],
          preview: {
            select: { title: 'title', body: 'body' },
            prepare({ title, body }) {
              /* `body` ya no es una cadena: hay que extraer el texto de los bloques para
                 que la lista del Studio siga siendo legible. */
              const text = Array.isArray(body)
                ? body
                    .filter((b: { _type?: string }) => b?._type === 'block')
                    .flatMap((b: { children?: { text?: string }[] }) =>
                      (b.children ?? []).map((c) => c.text ?? ''),
                    )
                    .join('')
                : '';
              return { title, subtitle: text.slice(0, 80) };
            },
          },
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
