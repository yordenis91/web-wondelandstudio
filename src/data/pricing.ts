/**
 * Fuente única de precios, en la forma exacta que devolverá `pricingCatalog` de Sanity.
 *
 * Regla 2 de CLAUDE.md: los precios viven en un único documento y jamás se escriben en
 * un componente o en contenido. Sanity todavía no está conectado, así que la fuente
 * vive aquí de momento — pero vive **una sola vez**: la tabla visible, el JSON-LD y
 * `/pricing/` leen todos de aquí. Cuando el cliente de Sanity entre, este módulo se
 * sustituye por el fetch y nada más cambia, porque el tipo ya es el de la consulta.
 *
 * Los importes son números, no cadenas con `$`: el formato de moneda lo pone la vista
 * según el idioma, y el JSON-LD necesita el número desnudo.
 */
import type { PricingEntry, Tier } from '../lib/queries.ts';
import type { Lang } from '../i18n/routes.ts';

/**
 * Una colección con sus dos caras de idioma. El nombre no siempre se comparte —en
 * español "The Luxury Collection" es "Colección de Lujo"— así que el par se declara
 * junto y no se traduce al vuelo.
 */
interface Collection {
  readonly tier: Tier;
  readonly price: number;
  readonly name: Readonly<Record<Lang, string>>;
  readonly coverage: Readonly<Record<Lang, string>>;
  readonly includes: Readonly<Record<Lang, string>>;
}

/**
 * Colecciones de boda. Texto tomado literal de
 * `docs/copy/wpb-wedding-photographer-copydeck.md` §"Wedding collections and pricing"
 * y de su equivalente español.
 */
const WEDDING_COLLECTIONS: readonly Collection[] = [
  {
    tier: 'elopement',
    price: 1200,
    name: { en: 'Elopement / Civil', es: 'Elopement / Civil' },
    coverage: { en: '3 hours', es: '3 horas' },
    includes: { en: 'Photography only', es: 'Solo fotografía' },
  },
  {
    tier: 'essential',
    price: 1850,
    name: { en: 'The Essential Story', es: 'The Essential Story' },
    coverage: { en: '6 hours', es: '6 horas' },
    includes: {
      en: 'Photography + short film (music clip)',
      es: 'Fotografía + video corto (music clip)',
    },
  },
  {
    tier: 'full',
    price: 2950,
    name: { en: 'The Full Experience', es: 'The Full Experience' },
    coverage: { en: '8 hours', es: '8 horas' },
    includes: {
      en: 'Photography + cinematic film with vows + drone + vertical reel',
      es: 'Fotografía + video cine con votos + drone + reel',
    },
  },
  {
    tier: 'tradition',
    price: 3800,
    name: { en: 'The Tradition', es: 'The Tradition' },
    coverage: { en: '8 hours', es: '8 horas' },
    includes: {
      en: 'Everything above + second photographer + printed album',
      es: 'Todo lo anterior + segundo fotógrafo + álbum impreso',
    },
  },
  {
    tier: 'luxury',
    price: 5500,
    name: { en: 'The Luxury Collection', es: 'Colección de Lujo' },
    coverage: { en: '10 hours', es: '10 horas' },
    includes: {
      en: 'Photography + extended film + premium album',
      es: 'Fotografía + video extendido + álbum premium',
    },
  },
];

/** La colección que el copy deck marca como la más elegida, por idioma. */
export function weddingHighlight(lang: Lang): string {
  return WEDDING_COLLECTIONS.find((c) => c.tier === 'essential')!.name[lang];
}

/**
 * Las colecciones de boda en la forma de `pricingCatalog`, resueltas a un idioma.
 *
 * `appliesTo` queda vacío mientras el CMS no esté conectado: aquí no hay documentos de
 * Sanity a los que referenciar. El campo ya es un array —las mismas colecciones salen en
 * fotógrafo, videógrafo y `/pricing/`, en sus dos idiomas— así que al conectar Sanity se
 * rellena sin cambiar el tipo.
 */
export function getWeddingPricing(lang: Lang): readonly PricingEntry[] {
  return WEDDING_COLLECTIONS.map((collection) => ({
    name: collection.name[lang],
    tier: collection.tier,
    billingType: 'oneTime' as const,
    price: collection.price,
    coverage: collection.coverage[lang],
    includes: [collection.includes[lang]],
    appliesTo: [],
  }));
}

/** Las mismas colecciones en la forma que consume el JSON-LD. */
export function getWeddingOffers(
  lang: Lang,
): readonly { name: string; price: number; description: string }[] {
  return WEDDING_COLLECTIONS.map((collection) => ({
    name: collection.name[lang],
    price: collection.price,
    description: `${collection.coverage[lang]}, ${collection.includes[lang].toLowerCase()}`,
  }));
}
