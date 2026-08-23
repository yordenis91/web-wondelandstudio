/**
 * Fuente única de precios de `/port-st-lucie/maternity-photographer/` (regla 2 de
 * CLAUDE.md — ver la nota equivalente en `data/pricing.ts`).
 *
 * A diferencia de boda, esta tabla no tiene una columna de "cobertura": el deck
 * (`docs/copy/psl-maternity-photographer-copydeck.md` §1) la describe en tres columnas
 * (Colección / Inversión / Incluye), sin duración por medio. Forzar un split de texto
 * en una cobertura inventada, como se hizo con las sesiones de branding, habría sido
 * artificial aquí — por eso `PricingEntry.coverage` es opcional (`lib/queries.ts`) y
 * `PricingTable.astro` omite la columna entera cuando ninguna fila la trae.
 */
import type { PricingEntry } from '../lib/queries.ts';
import type { OfferInput } from '../lib/schema.ts';
import type { Lang } from '../i18n/routes.ts';

interface BilingualText {
  readonly en: string;
  readonly es: string;
}

const COLLECTIONS: readonly {
  readonly name: BilingualText;
  readonly price: number;
  readonly includes: { readonly en: readonly string[]; readonly es: readonly string[] };
  readonly offerDescription: BilingualText;
}[] = [
  {
    name: { en: 'Esencia de Vida', es: 'Esencia de Vida' },
    price: 500,
    includes: {
      en: ['Editorial maternity photography session', 'wardrobe guidance', 'private gallery'],
      es: ['Sesión editorial de fotografía de embarazo', 'guía de vestuario', 'galería privada'],
    },
    offerDescription: { en: 'Editorial maternity photography session', es: 'Sesión editorial de fotografía de embarazo' },
  },
  {
    name: { en: 'Raíces Eternas', es: 'Raíces Eternas' },
    price: 1450,
    includes: {
      en: ['Maternity session', 'cinematic video', 'follow-up newborn session'],
      es: ['Sesión de embarazo', 'video cinematográfico', 'sesión de seguimiento con el recién nacido'],
    },
    offerDescription: {
      en: 'Maternity session plus cinematic video and a follow-up newborn session',
      es: 'Sesión de embarazo más video cinematográfico y una sesión de seguimiento con el recién nacido',
    },
  },
];

export function getMaternityPricing(lang: Lang): readonly PricingEntry[] {
  return COLLECTIONS.map((c) => ({
    name: c.name[lang],
    billingType: 'oneTime' as const,
    price: c.price,
    includes: c.includes[lang],
  }));
}

export function getMaternityOffers(lang: Lang): readonly OfferInput[] {
  return COLLECTIONS.map((c) => ({
    name: c.name[lang],
    price: c.price,
    description: c.offerDescription[lang],
  }));
}
