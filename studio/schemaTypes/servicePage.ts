import { defineArrayMember, defineField, defineType } from 'sanity';

import { SeoPreviewInput } from '../components/SeoPreviewInput';
import { breadcrumbsField, finalCtaField, heroField, sectionsField } from './fields/pageBlocks';
import { portableBodyField } from './fields/portableBody';
import {
  MAX_WORDS,
  MIN_WORDS,
  WordCountInput,
  countWords,
} from '../components/WordCountInput';

/** Solo `event` y `subscription` tienen secciones de texto antes/después del precio. */
const hasNoSections = (pageType?: string) => pageType !== 'event' && pageType !== 'subscription';

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
    sectionsField('sectionsBeforePricing', 'Secciones antes del precio', hasNoSections),
    sectionsField('sectionsAfterPricing', 'Secciones después del precio', hasNoSections),
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
      name: 'testimonialsHeading',
      title: 'Título de testimonios',
      type: 'string',
      group: 'content',
      hidden: ({ document }) => hasNoSections(document?.pageType as string | undefined),
    }),
    defineField({ name: 'faqHeading', title: 'Título de FAQ', type: 'string', group: 'content', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'pricing',
      title: 'Bloque de precios',
      description: 'La tabla sale de “Catálogo de precios”; aquí solo el texto que la rodea.',
      type: 'object',
      group: 'content',
      hidden: ({ document }) => document?.pageType !== 'event',
      fields: [
        defineField({ name: 'heading', title: 'Título (H2)', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'note', title: 'Nota bajo el título', type: 'text', rows: 2 }),
        portableBodyField('afterTable', 'Texto después de la tabla'),
        defineField({ name: 'addOns', title: 'Extras', type: 'text', rows: 2 }),
        defineField({ name: 'ctaLabel', title: 'Texto del botón', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'ctaMessage', title: 'Mensaje de WhatsApp prellenado', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'portfolioLink',
          title: 'Enlace secundario (opcional)',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Texto', type: 'string' }),
            defineField({ name: 'href', title: 'Destino', type: 'string' }),
          ],
        }),
      ],
    }),
    finalCtaField,
    breadcrumbsField,
    heroField,
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
      media: 'hero.image',
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
