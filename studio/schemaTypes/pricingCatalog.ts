import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Singleton (regla 2 de CLAUDE.md): un único documento `pricingCatalog` en todo el
 * dataset. La estructura del Studio (ver structure/index.ts) le quita el botón de
 * "crear nuevo" para que no se pueda duplicar por accidente. Nunca hardcodear un precio
 * en un componente o en contenido — todo entra aquí.
 *
 * `billingType` y `track` los introdujo el deck de branding (PLAN.md §4): una sesión de
 * pago único más dos catálogos de mensualidad en paralelo (photo-led / video-led).
 */
export const pricingCatalog = defineType({
  name: 'pricingCatalog',
  title: 'Catálogo de precios',
  type: 'document',
  fields: [
    defineField({
      name: 'entries',
      title: 'Colecciones',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pricingEntry',
          fields: [
            defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'tier',
              title: 'Tier',
              description: 'Para pageType: event. Deja vacío si no aplica (ej. subscription).',
              type: 'string',
              options: {
                list: [
                  { title: 'Elopement', value: 'elopement' },
                  { title: 'Essential', value: 'essential' },
                  { title: 'Full', value: 'full' },
                  { title: 'Tradition', value: 'tradition' },
                  { title: 'Luxury', value: 'luxury' },
                ],
              },
            }),
            defineField({
              name: 'billingType',
              title: 'Tipo de cobro',
              type: 'string',
              options: {
                list: [
                  { title: 'Pago único', value: 'oneTime' },
                  { title: 'Mensual', value: 'monthly' },
                ],
              },
              initialValue: 'oneTime',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'track',
              title: 'Track (catálogos paralelos)',
              description: 'Solo para billingType: monthly con más de un catálogo paralelo.',
              type: 'string',
              options: {
                list: [
                  { title: 'Photo-led', value: 'photo-led' },
                  { title: 'Video-led', value: 'video-led' },
                ],
              },
            }),
            defineField({
              name: 'price',
              title: 'Precio (USD)',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: 'coverage',
              title: 'Cobertura',
              description: 'Ej. "8 horas", "1 sesión / mes"',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'includes',
              title: 'Incluye',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required().min(1),
            }),
            /**
             * Array, no referencia única.
             *
             * Una misma colección aparece en varias páginas a la vez: las colecciones de
             * boda salen en `/west-palm-beach/wedding-photographer/`, en
             * `/west-palm-beach/wedding-videographer/` y en `/pricing/`, y además en las
             * dos caras de idioma de cada una. Con una referencia única había que
             * duplicar la entrada por página — que es exactamente el bug de precios
             * contradictorios que la regla 2 de CLAUDE.md existe para evitar.
             *
             * `unique()` impide listar dos veces la misma página por accidente.
             */
            defineField({
              name: 'appliesTo',
              title: 'Páginas donde aparece',
              description:
                'Todas las páginas que muestran esta colección, incluidas las dos caras de idioma.',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'servicePage' }] })],
              validation: (Rule) => Rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: { title: 'name', tier: 'tier', price: 'price', billingType: 'billingType' },
            prepare({ title, tier, price, billingType }) {
              const suffix = billingType === 'monthly' ? '/mes' : '';
              return {
                title,
                subtitle: `${tier ? `${tier} · ` : ''}$${price}${suffix}`,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Catálogo de precios' };
    },
  },
});
