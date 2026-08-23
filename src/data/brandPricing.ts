/**
 * Fuente única de precios de `/west-palm-beach/brand-photography/`, en la forma que
 * devolverá `pricingCatalog` de Sanity (regla 2 de CLAUDE.md — ver la nota equivalente
 * en `data/pricing.ts`).
 *
 * A diferencia de boda, esta página tiene **dos catálogos en paralelo**, no una
 * escalera de tiers: sesiones únicas (`billingType: 'oneTime'`) y un socio de
 * contenido mensual con dos líneas (`track: 'photo-led' | 'video-led'`), documentado en
 * `docs/copy/wpb-brand-photography-copydeck.md` §4.
 */
import type { PricingEntry } from '../lib/queries.ts';
import type { OfferInput } from '../lib/schema.ts';
import type { Lang } from '../i18n/routes.ts';

interface BilingualText {
  readonly en: string;
  readonly es: string;
}

/**
 * Sesiones únicas. El deck las presenta en tres columnas (Sesión / Inversión / Qué
 * incluye), sin columna de cobertura — se reparte el texto de "qué incluye" del deck en
 * `coverage` (la cláusula de duración) + `includes` (el resto), en la misma frontera de
 * coma que ya trae el deck, sin añadir ni quitar palabras, para poder reusar
 * `PricingTable.astro` en vez de maquetar una tabla nueva de tres columnas.
 */
const SESSIONS: readonly {
  readonly name: BilingualText;
  readonly price: number;
  readonly coverage: BilingualText;
  readonly includes: { readonly en: readonly string[]; readonly es: readonly string[] };
  readonly offerDescription: BilingualText;
}[] = [
  {
    name: { en: 'Impulso Visual (Entry)', es: 'Impulso Visual (Entrada)' },
    price: 700,
    coverage: { en: 'Half-day session', es: 'Medio día de sesión' },
    includes: {
      en: ['up to 2 locations', 'edited gallery'],
      es: ['hasta 2 locaciones', 'galería editada'],
    },
    offerDescription: {
      en: 'Half-day branding session, up to 2 locations',
      es: 'Sesión de marca de medio día, hasta 2 locaciones',
    },
  },
  {
    name: { en: 'La Autoridad (Executive)', es: 'La Autoridad (Ejecutiva)' },
    price: 3500,
    coverage: { en: 'Full-day', es: 'Día completo' },
    includes: {
      en: ['multiple looks', 'headshots + lifestyle + venue detail', 'priority turnaround'],
      es: ['varios looks', 'headshots + lifestyle + detalle del local', 'entrega prioritaria'],
    },
    offerDescription: {
      en: 'Full-day executive brand session, headshots and lifestyle',
      es: 'Sesión de marca ejecutiva de día completo, headshots y lifestyle',
    },
  },
];

export function getBrandSessions(lang: Lang): readonly PricingEntry[] {
  return SESSIONS.map((s) => ({
    name: s.name[lang],
    billingType: 'oneTime' as const,
    price: s.price,
    coverage: s.coverage[lang],
    includes: s.includes[lang],
  }));
}

export function getBrandSessionOffers(lang: Lang): readonly OfferInput[] {
  return SESSIONS.map((s) => ({
    name: s.name[lang],
    price: s.price,
    description: s.offerDescription[lang],
  }));
}

/**
 * El socio de contenido mensual: una matriz de nivel × línea, no una lista plana — el
 * deck la dibuja como tabla de dos columnas (foto / video) por eso `SubscriptionTable`
 * existe en vez de forzarla en `PricingTable`. El nivel "Partnership" es el que el deck
 * marca en negrita en las tres celdas de su fila: el punto dulce entre las dos líneas.
 */
interface MonthlyCell {
  readonly name: BilingualText;
  readonly price: number;
  /** Para "Cinematic Legacy — $3,200+/mo": el precio es de arranque, no cerrado. */
  readonly priceSuffix?: string;
  readonly offerDescription?: BilingualText;
}

const MONTHLY_LEVELS: readonly {
  readonly level: BilingualText;
  readonly highlight: boolean;
  readonly photo: MonthlyCell;
  readonly video: MonthlyCell;
}[] = [
  {
    level: { en: 'Entry', es: 'Entrada' },
    highlight: false,
    photo: { name: { en: 'Social Content', es: 'Contenido Social' }, price: 500 },
    video: { name: { en: 'Social Content', es: 'Contenido Social' }, price: 500 },
  },
  {
    level: { en: 'Partnership', es: 'Alianza' },
    highlight: true,
    photo: {
      name: { en: 'El Socio de Crecimiento', es: 'El Socio de Crecimiento' },
      price: 1500,
    },
    video: { name: { en: 'Brand Partner', es: 'Brand Partner' }, price: 1350 },
  },
  {
    level: { en: 'Top tier', es: 'Nivel superior' },
    highlight: false,
    photo: { name: { en: 'La Autoridad', es: 'La Autoridad' }, price: 3500 },
    video: {
      name: { en: 'Cinematic Legacy', es: 'Cinematic Legacy' },
      price: 3200,
      priceSuffix: '+',
    },
  },
];

export interface MonthlyLevelRow {
  readonly level: string;
  readonly highlight: boolean;
  readonly photo: { readonly name: string; readonly price: number; readonly priceSuffix?: string };
  readonly video: { readonly name: string; readonly price: number; readonly priceSuffix?: string };
}

export function getBrandMonthlyLevels(lang: Lang): readonly MonthlyLevelRow[] {
  return MONTHLY_LEVELS.map((l) => ({
    level: l.level[lang],
    highlight: l.highlight,
    photo: {
      name: l.photo.name[lang],
      price: l.photo.price,
      priceSuffix: l.photo.priceSuffix,
    },
    video: {
      name: l.video.name[lang],
      price: l.video.price,
      priceSuffix: l.video.priceSuffix,
    },
  }));
}

/**
 * Ofertas mensuales para el `@graph`. Deliberadamente **tres, no seis**: el catálogo de
 * ejemplo del deck (§3) y su propio checklist ("`unitCode: 'MON'` presente en los tres
 * `Offer` de partnership") listan Social Content una sola vez —es el mismo producto en
 * las dos líneas, no dos ofertas— y dejan fuera el nivel superior, cuyo precio "+"
 * abierto (Cinematic Legacy) y cuyo nombre duplicado con la sesión única del mismo
 * precio (La Autoridad, $3,500) no encajan limpio en un `Offer` de schema.org. El nivel
 * superior sigue visible en la tabla HTML — solo no entra al grafo.
 */
export function getBrandMonthlyOffers(lang: Lang): readonly OfferInput[] {
  const entry = MONTHLY_LEVELS[0]!;
  const partnership = MONTHLY_LEVELS[1]!;
  const photoLabel = lang === 'en' ? '(photo-led)' : '(enfoque en foto)';
  const videoLabel = lang === 'en' ? '(video-led)' : '(enfoque en video)';
  return [
    { name: entry.photo.name[lang], price: entry.photo.price, monthly: true },
    {
      name: `${partnership.photo.name[lang]} ${photoLabel}`,
      price: partnership.photo.price,
      monthly: true,
    },
    {
      name: `${partnership.video.name[lang]} ${videoLabel}`,
      price: partnership.video.price,
      monthly: true,
    },
  ];
}
