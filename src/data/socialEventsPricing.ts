/**
 * Eventos sociales — el único paquete genérico del sitio, con estructura de "hora
 * adicional" en vez de tiers de colección (deck de precios §1, nota de línea 99). Sin
 * `coverage` ni `includes`: el nombre del servicio ya dice todo lo que hay que decir,
 * así que `PricingTable.astro` pinta solo dos columnas (Servicio, Precio) para esta
 * tabla — la primera vez que ninguna de las dos columnas opcionales aplica.
 */
import type { PricingEntry } from '../lib/queries.ts';
import type { Lang } from '../i18n/routes.ts';

interface BilingualText {
  readonly en: string;
  readonly es: string;
}

const SERVICES: readonly { readonly name: BilingualText; readonly price: number }[] = [
  { name: { en: 'Photography only', es: 'Solo fotografía' }, price: 200 },
  { name: { en: 'Photo + Video', es: 'Foto + Video' }, price: 400 },
  {
    name: { en: 'Additional hour (photo only)', es: 'Hora adicional (solo foto)' },
    price: 100,
  },
  {
    name: { en: 'Additional hour (photo + video)', es: 'Hora adicional (foto + video)' },
    price: 250,
  },
];

export function getSocialEventsPricing(lang: Lang): readonly PricingEntry[] {
  return SERVICES.map((s) => ({
    name: s.name[lang],
    billingType: 'oneTime' as const,
    price: s.price,
  }));
}
