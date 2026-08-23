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
 *
 * `includes` tiene **dos ángulos**, no uno. El precio y la cobertura de "The Full
 * Experience" son el mismo número en la página de fotografía y en la de video — eso es
 * lo que la regla 2 exige que viva en un solo lugar — pero la frase de "qué incluye" no
 * es la misma texto: la página de fotografía la redacta con foco en la foto
 * ("Photography + cinematic film with vows..."), la de video con foco en el film
 * ("Cinematic film with real vows..."). Es la misma colección descrita desde dos
 * ángulos de venta, comprobado carácter por carácter contra los dos copy decks.
 */
interface Collection {
  readonly tier: Tier;
  readonly price: number;
  readonly name: Readonly<Record<Lang, string>>;
  readonly coverage: Readonly<Record<Lang, string>>;
  readonly includes: {
    readonly photography: Readonly<Record<Lang, string>>;
    readonly film: Readonly<Record<Lang, string>>;
  };
}

/** Qué página está pidiendo el catálogo — decide qué redacción de `includes` usar. */
export type PricingAngle = 'photography' | 'film';

/**
 * Colecciones de boda. Precio, nombre y cobertura tomados literal de
 * `docs/copy/wpb-wedding-photographer-copydeck.md` §"Wedding collections and pricing"
 * (idéntico en `wpb-wedding-videographer-copydeck.md`, es la misma tabla). El texto de
 * `includes.film` sale del segundo deck, `includes.photography` del primero.
 */
const WEDDING_COLLECTIONS: readonly Collection[] = [
  {
    tier: 'elopement',
    price: 1200,
    name: { en: 'Elopement / Civil', es: 'Elopement / Civil' },
    coverage: { en: '3 hours', es: '3 horas' },
    includes: {
      photography: { en: 'Photography only', es: 'Solo fotografía' },
      film: { en: 'Photography only', es: 'Solo fotografía' },
    },
  },
  {
    tier: 'essential',
    price: 1850,
    name: { en: 'The Essential Story', es: 'The Essential Story' },
    coverage: { en: '6 hours', es: '6 horas' },
    includes: {
      photography: {
        en: 'Photography + short film (music clip)',
        es: 'Fotografía + video corto (music clip)',
      },
      film: {
        en: 'Short film, 3–5 min, music clip',
        es: 'Video corto de 3 a 5 min, music clip',
      },
    },
  },
  {
    tier: 'full',
    price: 2950,
    name: { en: 'The Full Experience', es: 'The Full Experience' },
    coverage: { en: '8 hours', es: '8 horas' },
    includes: {
      photography: {
        en: 'Photography + cinematic film with vows + drone + vertical reel',
        es: 'Fotografía + video cine con votos + drone + reel',
      },
      film: {
        en: 'Cinematic film with real vows + drone + vertical reel',
        es: 'Video cine con votos reales + drone + reel vertical',
      },
    },
  },
  {
    tier: 'tradition',
    price: 3800,
    name: { en: 'The Tradition', es: 'The Tradition' },
    coverage: { en: '8 hours', es: '8 horas' },
    includes: {
      photography: {
        en: 'Everything above + second photographer + printed album',
        es: 'Todo lo anterior + segundo fotógrafo + álbum impreso',
      },
      film: {
        en: 'Same film, plus second photographer and printed album',
        es: 'El mismo video, más segundo fotógrafo y álbum impreso',
      },
    },
  },
  {
    tier: 'luxury',
    price: 5500,
    name: { en: 'The Luxury Collection', es: 'Colección de Lujo' },
    coverage: { en: '10 hours', es: '10 horas' },
    includes: {
      photography: {
        en: 'Photography + extended film + premium album',
        es: 'Fotografía + video extendido + álbum premium',
      },
      film: {
        en: 'Extended feature film + premium album',
        es: 'Película extendida + álbum premium',
      },
    },
  },
];

/** La colección que el copy deck marca como la más elegida, por idioma. */
export function weddingHighlight(lang: Lang): string {
  return WEDDING_COLLECTIONS.find((c) => c.tier === 'essential')!.name[lang];
}

/**
 * Las colecciones de boda ya resueltas a un idioma y a un ángulo de venta — la misma
 * forma que producirá `resolvePricingEntry()` una vez conectado Sanity.
 */
export function getWeddingPricing(
  lang: Lang,
  angle: PricingAngle,
): readonly PricingEntry[] {
  return WEDDING_COLLECTIONS.map((collection) => ({
    name: collection.name[lang],
    tier: collection.tier,
    billingType: 'oneTime' as const,
    price: collection.price,
    coverage: collection.coverage[lang],
    includes: [collection.includes[angle][lang]],
  }));
}

/** Las mismas colecciones en la forma que consume el JSON-LD. */
export function getWeddingOffers(
  lang: Lang,
  angle: PricingAngle,
): readonly { name: string; price: number; description: string }[] {
  return WEDDING_COLLECTIONS.map((collection) => ({
    name: collection.name[lang],
    price: collection.price,
    description: `${collection.coverage[lang]}, ${collection.includes[angle][lang].toLowerCase()}`,
  }));
}
