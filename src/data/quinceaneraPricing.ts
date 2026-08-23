/**
 * Precios de quinceañera, para la sección "Quinceañeras" de `/pricing/`.
 *
 * No hay página hoja de quinceañera todavía (`SERVICE_MATRIX` la marca `planned` en las
 * dos ciudades — ver `i18n/routes.ts`), así que este archivo es la única fuente de
 * verdad de estos cuatro precios (regla 2 de CLAUDE.md), tomados literal de
 * `docs/copy/pricing-copydeck.md` §1/§2. Cuando exista la página hoja, sus precios
 * deberán leer de aquí (o de la entrada equivalente en `pricingCatalog` una vez
 * conectado Sanity) en vez de declararse de nuevo.
 */
import type { PricingEntry } from '../lib/queries.ts';
import type { Lang } from '../i18n/routes.ts';

interface BilingualText {
  readonly en: string;
  readonly es: string;
}

const COLLECTIONS: readonly {
  readonly name: BilingualText;
  readonly price: number;
  readonly coverage: BilingualText;
  readonly includes: BilingualText;
}[] = [
  {
    name: { en: 'Momento Real', es: 'Momento Real' },
    price: 950,
    coverage: { en: '4h event', es: 'Evento de 4h' },
    includes: { en: 'Photography only', es: 'Solo fotografía' },
  },
  {
    name: { en: 'Quince de Ensueño', es: 'Quince de Ensueño' },
    price: 1500,
    coverage: { en: 'Pre-session + 6h event', es: 'Pre-sesión + evento de 6h' },
    includes: { en: 'Photography + short film', es: 'Fotografía + video corto' },
  },
  {
    name: { en: 'Experiencia Real', es: 'Experiencia Real' },
    price: 2300,
    coverage: { en: 'Pre-session + 8h event', es: 'Pre-sesión + evento de 8h' },
    includes: {
      en: 'Photography + cinematic film + drone + reel',
      es: 'Fotografía + video cine + drone + reel',
    },
  },
  {
    name: { en: 'Colección Realeza', es: 'Colección Realeza' },
    price: 3200,
    coverage: { en: 'Pre-session + 10h event', es: 'Pre-sesión + evento de 10h' },
    includes: {
      en: 'Photography + film + album + second photographer',
      es: 'Fotografía + video + álbum + segundo fotógrafo',
    },
  },
];

export function getQuinceaneraPricing(lang: Lang): readonly PricingEntry[] {
  return COLLECTIONS.map((c) => ({
    name: c.name[lang],
    billingType: 'oneTime' as const,
    price: c.price,
    coverage: c.coverage[lang],
    includes: [c.includes[lang]],
  }));
}
