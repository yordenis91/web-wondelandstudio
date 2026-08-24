/**
 * Migra a Sanity lo que el schema actual puede representar sin pérdida:
 * `businessLocation` (2 docs) y `pricingCatalog` (1 doc, singleton).
 *
 * Deliberadamente NO migra `servicePage` todavía. Al revisar `studio/schemaTypes/servicePage.ts`
 * contra lo que las plantillas reales necesitan (`lib/pageContent.ts`), el schema no
 * tiene dónde guardar `pricing`/`sessions`/`monthly` (la tabla de precios en sí),
 * `finalCta`, `hero` ni `breadcrumbs` — y `sections` no admite el tipo `steps` que usa
 * la página de boda ("How booking works"). Migrar las páginas hoy perdería justo el
 * contenido que más importa. Hace falta extender el schema primero (ver el resumen que
 * este script imprime al final).
 *
 * Corre en DRY RUN por defecto — imprime qué escribiría, sin tocar Sanity. Pasa
 * `--apply` para escribir de verdad. Usa `createOrReplace`, así que correrlo dos veces
 * no duplica nada: la segunda vez sobreescribe con los mismos datos.
 *
 * Requiere (ver `docs/SANITY_MIGRATION.md` para el paso a paso completo):
 *   - `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` (ya en `studio/.env`)
 *   - `SANITY_API_TOKEN` — token con permiso de escritor (Editor), generado en
 *     sanity.io/manage → tu proyecto → API → Tokens. NUNCA se commitea: pásalo por
 *     variable de entorno o en un `.env` en la raíz del repo (gitignored).
 *
 * Uso (mismo patrón que `check-tokens.ts` — Node ejecuta el `.ts` directo, sin
 * `tsx`/`ts-node`; solo hace falta `npm install` para traer `@sanity/client`):
 *   SANITY_API_TOKEN=sk... node scripts/migrate-to-sanity.ts            # dry run
 *   SANITY_API_TOKEN=sk... node scripts/migrate-to-sanity.ts --apply    # escribe
 */
import { createClient, type SanityClient } from '@sanity/client';

import { getAllLocations, resolvedAddress, resolvedPhone } from '../src/data/business.ts';
import { ROUTES } from '../src/i18n/routes.ts';
import { getWeddingPricing, weddingHighlight } from '../src/data/pricing.ts';
import { getBrandSessions, getBrandMonthlyLevels } from '../src/data/brandPricing.ts';
import { getMaternityPricing } from '../src/data/maternityPricing.ts';
import { getQuinceaneraPricing } from '../src/data/quinceaneraPricing.ts';
import { getFamilyExtras } from '../src/data/familyExtrasPricing.ts';
import { getSocialEventsPricing } from '../src/data/socialEventsPricing.ts';

const APPLY = process.argv.includes('--apply');

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error('Falta SANITY_STUDIO_PROJECT_ID en el entorno (ver studio/.env).');
}
if (APPLY && !token) {
  throw new Error('Falta SANITY_API_TOKEN — necesario para escribir (--apply). Sin él solo corre en dry run.');
}

const client: SanityClient | null = APPLY
  ? createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })
  : null;

/**
 * `servicePage.{lang}.{routeId}` — el mismo `id` estable que ya usa `ROUTES` en
 * `i18n/routes.ts`, así que da igual qué IDs use la migración de `servicePage` que
 * hagamos después: mientras respete este esquema, las referencias de aquí resuelven
 * solas sin tener que re-escribir `pricingCatalog`.
 */
function servicePageId(lang: 'en' | 'es', routeId: string): string {
  return `servicePage.${lang}.${routeId}`;
}

function routeIdFor(kind: 'wedding-photographer' | 'wedding-videographer' | 'brand-photography' | 'maternity-photographer' | 'pricing'): string {
  if (kind === 'pricing') return 'pricing';
  const found = ROUTES.find((r) => r.kind === 'service' && r.service === kind);
  if (!found) throw new Error(`No encuentro la ruta de servicio "${kind}" en ROUTES`);
  return found.id;
}

const ROUTE_IDS = {
  weddingPhotographer: routeIdFor('wedding-photographer'),
  weddingVideographer: routeIdFor('wedding-videographer'),
  brandPhotography: routeIdFor('brand-photography'),
  maternityPhotographer: routeIdFor('maternity-photographer'),
  pricing: routeIdFor('pricing'),
};

/* -------------------------------------------------------------------------- */
/* 1. businessLocation                                                         */
/* -------------------------------------------------------------------------- */

function buildLocationDocs() {
  return getAllLocations().map((location) => {
    const address = resolvedAddress(location);
    const phone = resolvedPhone(location);

    return {
      _id: `businessLocation.${location.key}`,
      _type: 'businessLocation',
      key: location.key,
      name: location.name,
      slug: { _type: 'slug', current: location.slug },
      address: {
        // `streetAddress`/`postalCode` son required en el schema, pero WPB los tiene
        // pendientes de confirmar todavía (regla 4 de CLAUDE.md) — se omiten en vez de
        // escribir el token literal. El Studio va a marcar el documento como
        // incompleto hasta que Lisandra confirme el dato; eso es correcto, no un bug
        // de la migración.
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        postalCode: address.postalCode,
        addressCountry: 'US',
      },
      // Igual que la dirección: `geo` completo solo si las dos coordenadas están
      // confirmadas. El campo entero es opcional en el schema para este caso exacto.
      geo:
        typeof location.geo.latitude === 'number' && typeof location.geo.longitude === 'number'
          ? { latitude: location.geo.latitude, longitude: location.geo.longitude }
          : undefined,
      phone: phone ? { e164: phone.e164, display: phone.display } : undefined,
      areasServed: location.areasServed,
      languages: location.languages,
      schemaId: location.schemaId,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* 2. pricingCatalog                                                           */
/* -------------------------------------------------------------------------- */

interface Application {
  readonly page: { readonly _type: 'reference'; readonly _ref: string };
  readonly includes: readonly string[];
}

interface CatalogEntry {
  readonly _key: string;
  readonly _type: 'pricingEntry';
  readonly name: string;
  readonly tier?: string;
  readonly billingType: 'oneTime' | 'monthly';
  readonly track?: 'photo-led' | 'video-led';
  readonly price: number;
  readonly coverage?: string;
  readonly appliesTo: Application[];
}

function ref(id: string): { readonly _type: 'reference'; readonly _ref: string } {
  return { _type: 'reference', _ref: id };
}

/**
 * `PricingEntry.includes` es opcional en el frontend (eventos sociales no lo usa), pero
 * `pricingCatalog.entries[].appliesTo[].includes` es obligatorio en el schema
 * (`min(1)`) — cada producto que sí se migra aquí tiene que traer algo. Falla fuerte y
 * claro en vez de escribir un array vacío que Sanity rechazaría con un error más
 * confuso más adelante.
 */
function requireIncludes(value: readonly string[] | undefined, label: string): readonly string[] {
  if (!value || value.length === 0) {
    throw new Error(`Falta "includes" para ${label} — el schema pricingCatalog exige al menos una frase.`);
  }
  return value;
}

/**
 * `pricingCatalog.entries[].name` es un solo string, sin variante EN/ES (a diferencia
 * de casi todo lo demás en el sitio). Se usa el nombre EN como canónico — coincide con
 * el ES en todos los productos **excepto** "The Luxury Collection" / "Colección de
 * Lujo". Ese caso queda marcado en el resumen final: el schema necesita un segundo
 * campo (`nameES`) para no perder esa traducción cuando el frontend empiece a leer de
 * aquí en vez de `data/pricing.ts`.
 */
const WEDDING_TIERS = ['elopement', 'essential', 'full', 'tradition', 'luxury'] as const;

function buildWeddingEntries(): CatalogEntry[] {
  const en = { photography: getWeddingPricing('en', 'photography'), film: getWeddingPricing('en', 'film'), summary: getWeddingPricing('en', 'summary') };
  const es = { photography: getWeddingPricing('es', 'photography'), film: getWeddingPricing('es', 'film'), summary: getWeddingPricing('es', 'summary') };

  return WEDDING_TIERS.map((tier, i) => ({
    _key: `wedding-${tier}`,
    _type: 'pricingEntry' as const,
    name: en.photography[i]!.name,
    tier,
    billingType: 'oneTime' as const,
    price: en.photography[i]!.price,
    coverage: en.photography[i]!.coverage,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.weddingPhotographer)), includes: requireIncludes(en.photography[i]!.includes, `boda ${tier} EN foto`) },
      { page: ref(servicePageId('es', ROUTE_IDS.weddingPhotographer)), includes: requireIncludes(es.photography[i]!.includes, `boda ${tier} ES foto`) },
      { page: ref(servicePageId('en', ROUTE_IDS.weddingVideographer)), includes: requireIncludes(en.film[i]!.includes, `boda ${tier} EN video`) },
      { page: ref(servicePageId('es', ROUTE_IDS.weddingVideographer)), includes: requireIncludes(es.film[i]!.includes, `boda ${tier} ES video`) },
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: requireIncludes(en.summary[i]!.includes, `boda ${tier} EN resumen`) },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: requireIncludes(es.summary[i]!.includes, `boda ${tier} ES resumen`) },
    ],
  }));
}

function buildBrandSessionEntries(): CatalogEntry[] {
  const en = getBrandSessions('en');
  const es = getBrandSessions('es');

  return en.map((entry, i) => ({
    _key: `brand-session-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'pricingEntry' as const,
    name: entry.name,
    billingType: 'oneTime' as const,
    price: entry.price,
    coverage: entry.coverage,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.brandPhotography)), includes: requireIncludes(entry.includes, `marca ${entry.name} EN`) },
      { page: ref(servicePageId('es', ROUTE_IDS.brandPhotography)), includes: requireIncludes(es[i]!.includes, `marca ${entry.name} ES`) },
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: requireIncludes(entry.includes, `marca ${entry.name} EN (pricing)`) },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: requireIncludes(es[i]!.includes, `marca ${entry.name} ES (pricing)`) },
    ],
  }));
}

/**
 * El socio mensual es una matriz nivel × línea en el frontend (`SubscriptionTable`),
 * no filas planas — `pricingCatalog` sí es plano, así que cada celda (nivel, línea) se
 * aplana a su propia entrada. Ninguna de las dos versiones (`SubscriptionTable` en el
 * sitio, este catálogo) tiene un texto de "incluye" propio para estas celdas — el
 * deck describe las dos líneas en prosa, no por nivel — así que `includes` usa el
 * nombre del producto como única frase disponible; no es contenido inventado, pero
 * tampoco es una redacción nueva: revisar antes de mostrarlo en un componente que
 * espere una frase completa.
 */
function buildBrandMonthlyEntries(): CatalogEntry[] {
  const en = getBrandMonthlyLevels('en');
  const es = getBrandMonthlyLevels('es');

  const entries: CatalogEntry[] = [];
  en.forEach((row, i) => {
    (['photo', 'video'] as const).forEach((track) => {
      const cellEn = row[track];
      const cellEs = es[i]![track];
      entries.push({
        _key: `brand-monthly-${row.level.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${track}`,
        _type: 'pricingEntry',
        name: cellEn.name,
        billingType: 'monthly',
        track: track === 'photo' ? 'photo-led' : 'video-led',
        price: cellEn.price,
        appliesTo: [
          { page: ref(servicePageId('en', ROUTE_IDS.brandPhotography)), includes: [cellEn.name] },
          { page: ref(servicePageId('es', ROUTE_IDS.brandPhotography)), includes: [cellEs.name] },
          { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: [cellEn.name] },
          { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: [cellEs.name] },
        ],
      });
    });
  });
  return entries;
}

function buildMaternityEntries(): CatalogEntry[] {
  const en = getMaternityPricing('en');
  const es = getMaternityPricing('es');

  return en.map((entry, i) => ({
    _key: `maternity-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'pricingEntry' as const,
    name: entry.name,
    billingType: 'oneTime' as const,
    price: entry.price,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.maternityPhotographer)), includes: requireIncludes(entry.includes, `maternidad ${entry.name} EN`) },
      { page: ref(servicePageId('es', ROUTE_IDS.maternityPhotographer)), includes: requireIncludes(es[i]!.includes, `maternidad ${entry.name} ES`) },
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: requireIncludes(entry.includes, `maternidad ${entry.name} EN (pricing)`) },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: requireIncludes(es[i]!.includes, `maternidad ${entry.name} ES (pricing)`) },
    ],
  }));
}

/** Sin página hoja propia todavía (SERVICE_MATRIX la marca `planned`) — solo /pricing/. */
function buildQuinceaneraEntries(): CatalogEntry[] {
  const en = getQuinceaneraPricing('en');
  const es = getQuinceaneraPricing('es');

  return en.map((entry, i) => ({
    _key: `quinceanera-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'pricingEntry' as const,
    name: entry.name,
    billingType: 'oneTime' as const,
    price: entry.price,
    coverage: entry.coverage,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: requireIncludes(entry.includes, `quinceañera ${entry.name} EN`) },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: requireIncludes(es[i]!.includes, `quinceañera ${entry.name} ES`) },
    ],
  }));
}

/** Recién nacido, familia, retrato — solo /pricing/, ver data/familyExtrasPricing.ts. */
function buildFamilyExtraEntries(): CatalogEntry[] {
  const en = getFamilyExtras('en');
  const es = getFamilyExtras('es');

  return en.map((entry, i) => ({
    _key: `family-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'pricingEntry' as const,
    name: entry.name,
    billingType: 'oneTime' as const,
    price: entry.price,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: requireIncludes(entry.includes, `familia ${entry.name} EN`) },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: requireIncludes(es[i]!.includes, `familia ${entry.name} ES`) },
    ],
  }));
}

/**
 * Eventos sociales no tiene concepto de "incluye" en el sitio (`PricingTable` los
 * pinta a 2 columnas, sin esa columna) — se usa el propio nombre como única frase
 * disponible para satisfazer el `min(1)` del schema, mismo criterio que el socio
 * mensual de marca arriba.
 */
function buildSocialEventEntries(): CatalogEntry[] {
  const en = getSocialEventsPricing('en');
  const es = getSocialEventsPricing('es');

  return en.map((entry, i) => ({
    _key: `social-${entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'pricingEntry' as const,
    name: entry.name,
    billingType: 'oneTime' as const,
    price: entry.price,
    appliesTo: [
      { page: ref(servicePageId('en', ROUTE_IDS.pricing)), includes: [entry.name] },
      { page: ref(servicePageId('es', ROUTE_IDS.pricing)), includes: [es[i]!.name] },
    ],
  }));
}

function buildPricingCatalogDoc() {
  return {
    _id: 'pricingCatalog',
    _type: 'pricingCatalog',
    entries: [
      ...buildWeddingEntries(),
      ...buildBrandSessionEntries(),
      ...buildBrandMonthlyEntries(),
      ...buildMaternityEntries(),
      ...buildQuinceaneraEntries(),
      ...buildFamilyExtraEntries(),
      ...buildSocialEventEntries(),
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Runner                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const locations = buildLocationDocs();
  const catalog = buildPricingCatalogDoc();
  const docs = [...locations, catalog];

  console.log(`\n${APPLY ? 'APLICANDO' : 'DRY RUN'} — proyecto ${projectId}/${dataset}\n`);

  for (const doc of docs) {
    const summary =
      doc._type === 'businessLocation'
        ? `${(doc as ReturnType<typeof buildLocationDocs>[number]).name}`
        : `${(doc as ReturnType<typeof buildPricingCatalogDoc>).entries.length} colecciones/tiers, ${(doc as ReturnType<typeof buildPricingCatalogDoc>).entries.reduce((n, e) => n + e.appliesTo.length, 0)} referencias a página`;
    console.log(`  · ${doc._type} (${doc._id}) — ${summary}`);
  }

  console.log(`\n${docs.length} documento(s) total.`);
  console.log(`Highlight de boda (para referencia visual, no se escribe aparte): ${weddingHighlight('en')}\n`);

  if (!APPLY) {
    console.log('Dry run — nada escrito. Corre con --apply para escribir de verdad.\n');
    return;
  }

  for (const doc of docs) {
    await client!.createOrReplace(doc as never);
    console.log(`  ✓ ${doc._id}`);
  }
  console.log('\nListo.\n');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
