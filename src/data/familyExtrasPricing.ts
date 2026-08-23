/**
 * Newborn, familia y retrato individual — las tres filas que el deck de precios agrega
 * a la tabla "Maternity & Family" de `/pricing/` junto a las dos colecciones reales de
 * maternidad. No son productos con página hoja propia ni entrada en `SERVICE_MATRIX`:
 * viven solo aquí (regla 2), literal de `docs/copy/pricing-copydeck.md` §1/§2.
 *
 * Las colecciones de maternidad en sí (Esencia de Vida, Raíces Eternas) NO se repiten
 * aquí — siguen viviendo en `data/maternityPricing.ts`, la fuente que ya usa la página
 * hoja. `/pricing/` concatena `getMaternityPricing()` con `getFamilyExtras()` en una
 * sola tabla, sin duplicar el precio de las dos colecciones reales en un segundo sitio.
 */
import type { PricingEntry } from '../lib/queries.ts';
import type { Lang } from '../i18n/routes.ts';

interface BilingualText {
  readonly en: string;
  readonly es: string;
}

const EXTRAS: readonly { readonly name: BilingualText; readonly price: number; readonly includes: BilingualText }[] = [
  {
    name: { en: 'Newborn', es: 'Recién nacido' },
    price: 450,
    includes: { en: 'Studio or in-home session', es: 'Sesión en estudio o a domicilio' },
  },
  {
    name: { en: 'Kids & Family', es: 'Niños y familia' },
    price: 350,
    includes: { en: 'Studio or outdoor session', es: 'Sesión en estudio o al aire libre' },
  },
  {
    name: { en: 'Individual / Portraits', es: 'Individual / Retratos' },
    price: 250,
    includes: { en: 'Studio session', es: 'Sesión en estudio' },
  },
];

export function getFamilyExtras(lang: Lang): readonly PricingEntry[] {
  return EXTRAS.map((e) => ({
    name: e.name[lang],
    billingType: 'oneTime' as const,
    price: e.price,
    priceIsFrom: true,
    includes: [e.includes[lang]],
  }));
}
