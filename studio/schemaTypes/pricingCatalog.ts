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
            defineField({ name: 'name', title: 'Nombre (EN)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'nameEs', title: 'Nombre (ES)', type: 'string', validation: (Rule) => Rule.required() }),
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
              description:
                'Ej. "8 horas", "1 sesión / mes". Opcional: un tier de un solo producto ' +
                '(ej. maternidad) no siempre tiene una noción de duración que valga la pena ' +
                'destacar en su propia columna.',
              type: 'string',
            }),
            /**
             * `appliesTo` es un array de `{ page, includes }`, no una sola lista de
             * páginas con un `includes` compartido.
             *
             * Precio, nombre y cobertura sí son un solo número para todas las páginas
             * que muestran esta colección — eso es lo que la regla 2 exige. Pero el
             * texto de "qué incluye" cambia de redacción según qué vende la página: la
             * misma colección de $1,850 dice "Photography + short film" en la página de
             * fotografía y "Short film, 3–5 min, music clip" en la de video —
             * verificado carácter por carácter contra los dos copy decks de boda,
             * mismo precio, mismo tier, frase distinta.
             *
             * Con un `includes` único a nivel de colección, esa diferencia de
             * redacción solo se podía resolver duplicando la colección entera —
             * mismo precio escrito dos veces, el bug exacto que esta regla existe
             * para evitar. Con el override por página, el precio sigue en un solo
             * lugar y cada página redacta su propia frase.
             */
            defineField({
              name: 'appliesTo',
              title: 'Páginas donde aparece',
              description:
                'Una entrada por página que muestra esta colección (incluidas las dos caras de idioma), cada una con su propia redacción de "qué incluye".',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'application',
                  fields: [
                    defineField({
                      name: 'page',
                      title: 'Página',
                      type: 'reference',
                      to: [{ type: 'servicePage' }],
                      /**
                       * Débil a propósito: `pricingCatalog` se migra antes de que
                       * `servicePage` exista (ver migrate-to-sanity.ts), así que esta
                       * referencia apunta hacia adelante a un documento que todavía no
                       * está creado. Una referencia fuerte (el default) hace que Sanity
                       * rechace la escritura entera si el destino no existe; una débil
                       * se guarda igual y se resuelve sola en cuanto el documento
                       * aparezca — sin eso, el migrate:apply falla en pricingCatalog.
                       */
                      weak: true,
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'includes',
                      title: 'Incluye (redacción de esta página)',
                      type: 'array',
                      of: [{ type: 'string' }],
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: { title: 'page.h1', subtitle: 'page.language' },
                  },
                }),
              ],
              validation: (Rule) =>
                Rule.required()
                  .min(1)
                  .custom((apps: { page?: { _ref?: string } }[] | undefined) => {
                    if (!apps) return true;
                    const refs = apps.map((a) => a.page?._ref).filter(Boolean);
                    const dupes = refs.length !== new Set(refs).size;
                    return dupes ? 'La misma página está listada dos veces' : true;
                  }),
            }),
          ],
          preview: {
            select: { title: 'name', nameEs: 'nameEs', tier: 'tier', price: 'price', billingType: 'billingType' },
            prepare({ title, nameEs, tier, price, billingType }) {
              const suffix = billingType === 'monthly' ? '/mes' : '';
              return {
                title,
                subtitle: `${nameEs && nameEs !== title ? `${nameEs} · ` : ''}${tier ? `${tier} · ` : ''}$${price}${suffix}`,
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
