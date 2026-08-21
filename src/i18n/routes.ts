/**
 * Mapa central de rutas EN ↔ ES.
 *
 * Las rutas en español son slugs en español, no el slug inglés colgado de `/es/`. Cada
 * entrada declara sus dos caras a la vez, así que la reciprocidad de `hreflang`
 * (regla 6 de CLAUDE.md) es estructural: no se puede declarar una cara sin la otra.
 *
 * Dos fuentes de verdad, como fija docs/PLAN.md §3.1:
 *  - `ROUTES` — solo lo que existe como página. Alimenta sitemap, hreflang y navegación.
 *  - `SERVICE_MATRIX` — las líneas de servicio por ciudad, existan o no como página.
 *    Alimenta los hubs, que muestran también lo `planned` sin enlazarlo.
 */
import { z } from 'zod';

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const CITIES = ['wpb', 'psl'] as const;
export type City = (typeof CITIES)[number];

/** Qué es la página. No confundir con `servicePage.pageType` de Sanity. */
export const ROUTE_KINDS = ['home', 'hub', 'service', 'pricing', 'about', 'portfolio'] as const;
export type RouteKind = (typeof ROUTE_KINDS)[number];

/** Un segmento es un slug (`wedding-photographer`) o un parámetro (`[category]`). */
const SEGMENT = '([a-z0-9-]+|\\[[a-z]+\\])';

const pathEn = z
  .string()
  .regex(
    new RegExp(`^/(${SEGMENT}/)*$`),
    'ruta EN inválida: minúsculas, con barra inicial y final',
  )
  .refine((value) => !value.startsWith('/es/'), 'una ruta EN nunca cuelga de /es/');

const pathEs = z
  .string()
  .regex(
    new RegExp(`^/es/(${SEGMENT}/)*$`),
    'ruta ES inválida: debe empezar por /es/ y acabar en barra',
  );

export const RouteSchema = z
  .object({
    /** Identificador estable, independiente del idioma. */
    id: z.string().regex(/^[a-z0-9-]+$/),
    en: pathEn,
    es: pathEs,
    kind: z.enum(ROUTE_KINDS),
    city: z.enum(CITIES).nullable(),
    /** Slug de la línea de servicio, para cruzar con `SERVICE_MATRIX`. */
    service: z.string().regex(/^[a-z0-9-]+$/).nullable(),
    /** Ruta dinámica: `/portfolio/[category]/` no es una URL, es un patrón. */
    dynamic: z.boolean().default(false),
  })
  .strict()
  .refine((r) => (r.kind === 'service' ? r.city !== null && r.service !== null : true), {
    message: 'una ruta de servicio necesita city y service',
  })
  .refine((r) => r.dynamic === (r.en.includes('[') || r.es.includes('[')), {
    message: 'dynamic debe coincidir con la presencia de un parámetro [param] en la ruta',
  });

export type Route = z.output<typeof RouteSchema>;

const RAW_ROUTES = [
  { id: 'home', en: '/', es: '/es/', kind: 'home', city: null, service: null },

  {
    id: 'hub-wpb',
    en: '/west-palm-beach/',
    es: '/es/west-palm-beach/',
    kind: 'hub',
    city: 'wpb',
    service: null,
  },
  {
    id: 'wpb-wedding-photographer',
    en: '/west-palm-beach/wedding-photographer/',
    es: '/es/west-palm-beach/fotografo-de-bodas/',
    kind: 'service',
    city: 'wpb',
    service: 'wedding-photographer',
  },
  {
    id: 'wpb-wedding-videographer',
    en: '/west-palm-beach/wedding-videographer/',
    es: '/es/west-palm-beach/videografo-de-bodas/',
    kind: 'service',
    city: 'wpb',
    service: 'wedding-videographer',
  },
  {
    id: 'wpb-brand-photography',
    en: '/west-palm-beach/brand-photography/',
    es: '/es/west-palm-beach/fotografia-de-marca/',
    kind: 'service',
    city: 'wpb',
    service: 'brand-photography',
  },

  {
    id: 'hub-psl',
    en: '/port-st-lucie/',
    es: '/es/port-st-lucie/',
    kind: 'hub',
    city: 'psl',
    service: null,
  },
  {
    id: 'psl-maternity-photographer',
    en: '/port-st-lucie/maternity-photographer/',
    es: '/es/port-st-lucie/fotografo-de-embarazo/',
    kind: 'service',
    city: 'psl',
    service: 'maternity-photographer',
  },

  { id: 'pricing', en: '/pricing/', es: '/es/precios/', kind: 'pricing', city: null, service: null },
  {
    id: 'about-lisandra',
    en: '/about-lisandra/',
    es: '/es/sobre-lisandra/',
    kind: 'about',
    city: null,
    service: null,
  },
  {
    id: 'portfolio-category',
    en: '/portfolio/[category]/',
    es: '/es/portafolio/[categoria]/',
    kind: 'portfolio',
    city: null,
    service: null,
    dynamic: true,
  },
] as const;

/**
 * Categorías de portfolio. Se mapean aparte porque `/portfolio/[category]/` es un
 * patrón: el par EN↔ES se resuelve por categoría, no por ruta.
 */
export const PORTFOLIO_CATEGORIES = [
  { id: 'weddings', en: 'weddings', es: 'bodas' },
  { id: 'branding', en: 'branding', es: 'marca' },
  { id: 'maternity', en: 'maternity', es: 'maternidad' },
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

/**
 * Matriz servicio × ciudad. `active` tiene página; `planned` existe comercialmente pero
 * todavía no tiene URL, así que el hub la muestra sin enlace (docs/PLAN.md §3.2).
 * Un deck nunca enlaza a una entrada `planned`: enlaza al ancla del hub.
 */
export const MatrixEntrySchema = z
  .object({
    city: z.enum(CITIES),
    service: z.string().regex(/^[a-z0-9-]+$/),
    status: z.enum(['active', 'planned']),
    adPriority: z.enum(['alto', 'medio', 'bajo']),
    /** Para el "desde $X" del hub, que se muestra aunque no haya página. */
    fromPrice: z.number().int().positive(),
    /** Ancla del hub que sustituye al enlace mientras la entrada sea `planned`. */
    hubAnchor: z.string().regex(/^#[a-z0-9-]+$/),
    /** `id` de `ROUTES`, obligatorio si y solo si `status: active`. */
    routeId: z.string().nullable(),
  })
  .strict()
  .refine((e) => (e.status === 'active') === (e.routeId !== null), {
    message: 'status active exige routeId, y planned exige routeId null',
  });

export type MatrixEntry = z.output<typeof MatrixEntrySchema>;

const RAW_MATRIX = [
  { city: 'wpb', service: 'wedding-photographer', status: 'active', adPriority: 'alto', fromPrice: 1200, hubAnchor: '#wedding', routeId: 'wpb-wedding-photographer' },
  { city: 'wpb', service: 'wedding-videographer', status: 'active', adPriority: 'alto', fromPrice: 1200, hubAnchor: '#wedding', routeId: 'wpb-wedding-videographer' },
  { city: 'wpb', service: 'brand-photography', status: 'active', adPriority: 'alto', fromPrice: 700, hubAnchor: '#branding', routeId: 'wpb-brand-photography' },
  { city: 'wpb', service: 'video-production', status: 'planned', adPriority: 'medio', fromPrice: 550, hubAnchor: '#video-production', routeId: null },
  { city: 'wpb', service: 'quinceanera-photographer', status: 'planned', adPriority: 'medio', fromPrice: 1500, hubAnchor: '#quinceanera', routeId: null },
  { city: 'wpb', service: 'maternity-photographer', status: 'planned', adPriority: 'medio', fromPrice: 350, hubAnchor: '#maternity', routeId: null },

  { city: 'psl', service: 'maternity-photographer', status: 'active', adPriority: 'alto', fromPrice: 500, hubAnchor: '#maternity', routeId: 'psl-maternity-photographer' },
  { city: 'psl', service: 'quinceanera-photographer', status: 'planned', adPriority: 'alto', fromPrice: 1500, hubAnchor: '#quinceanera', routeId: null },
  { city: 'psl', service: 'wedding-photographer', status: 'planned', adPriority: 'medio', fromPrice: 1200, hubAnchor: '#wedding', routeId: null },
] as const;

/** Los errores de Zod se leen mal en la salida del build; esto los deja en una línea. */
function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  · [${issue.path.join('.')}] ${issue.message}`)
    .join('\n');
}

function buildRoutes(): readonly Route[] {
  const parsed = z.array(RouteSchema).safeParse(RAW_ROUTES);
  if (!parsed.success) {
    throw new Error(`Mapa de rutas inválido:\n${formatIssues(parsed.error)}`);
  }
  const routes = parsed.data;

  const seen = new Map<string, string>();
  for (const route of routes) {
    for (const path of [route.en, route.es]) {
      const owner = seen.get(path);
      if (owner) {
        throw new Error(`Ruta duplicada ${path}: la declaran "${owner}" y "${route.id}"`);
      }
      seen.set(path, route.id);
    }
  }
  return routes;
}

function buildMatrix(): readonly MatrixEntry[] {
  const parsed = z.array(MatrixEntrySchema).safeParse(RAW_MATRIX);
  if (!parsed.success) {
    throw new Error(`Matriz de servicios inválida:\n${formatIssues(parsed.error)}`);
  }
  const entries = parsed.data;
  const ids = new Set(ROUTES.map((r) => r.id));

  for (const entry of entries) {
    if (entry.routeId !== null && !ids.has(entry.routeId)) {
      throw new Error(`La matriz ${entry.city}/${entry.service} apunta a una ruta inexistente: ${entry.routeId}`);
    }
  }
  return entries;
}

/** Validado al importar el módulo: un mapa inválido rompe el build, no el sitio. */
export const ROUTES: readonly Route[] = buildRoutes();
export const SERVICE_MATRIX: readonly MatrixEntry[] = buildMatrix();

const BY_PATH = new Map<string, Route>();
for (const route of ROUTES) {
  BY_PATH.set(route.en, route);
  BY_PATH.set(route.es, route);
}

/** Normaliza a la forma canónica: barra inicial y final, sin query ni hash. */
export function normalizePath(path: string): string {
  const clean = path.split('#')[0]!.split('?')[0]!;
  const withLead = clean.startsWith('/') ? clean : `/${clean}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

export function getLang(path: string): Lang {
  return normalizePath(path).startsWith('/es/') || normalizePath(path) === '/es/' ? 'es' : 'en';
}

export function getRoute(path: string): Route | undefined {
  return BY_PATH.get(normalizePath(path));
}

/**
 * La contraparte de `path` en `lang`. `undefined` si la ruta no está en el mapa — el
 * llamador decide si eso es un fallo de build o una página sin par.
 *
 * Resuelve también las categorías de portfolio, que son un patrón y no una ruta fija.
 */
export function getAlternate(path: string, lang: Lang): string | undefined {
  const normalized = normalizePath(path);

  const route = BY_PATH.get(normalized);
  if (route) return lang === 'en' ? route.en : route.es;

  const category = matchPortfolio(normalized);
  if (category) {
    return lang === 'en'
      ? `/portfolio/${category.en}/`
      : `/es/portafolio/${category.es}/`;
  }

  return undefined;
}

function matchPortfolio(normalized: string): PortfolioCategory | undefined {
  const en = normalized.match(/^\/portfolio\/([a-z0-9-]+)\/$/);
  if (en) return PORTFOLIO_CATEGORIES.find((c) => c.en === en[1]);

  const es = normalized.match(/^\/es\/portafolio\/([a-z0-9-]+)\/$/);
  if (es) return PORTFOLIO_CATEGORIES.find((c) => c.es === es[1]);

  return undefined;
}

export interface RouteUrls {
  readonly id: string;
  readonly en: string;
  readonly es: string;
  readonly kind: RouteKind;
}

/**
 * Todas las URLs reales del sitio, con su par de idioma resuelto. Los patrones
 * dinámicos se expanden (una entrada por categoría de portfolio), así que lo que
 * devuelve es directamente lo que va al sitemap y lo que recorre `hreflang.test.ts`.
 */
export function getAllRoutes(): readonly RouteUrls[] {
  const out: RouteUrls[] = [];

  for (const route of ROUTES) {
    if (!route.dynamic) {
      out.push({ id: route.id, en: route.en, es: route.es, kind: route.kind });
      continue;
    }
    if (route.kind === 'portfolio') {
      for (const category of PORTFOLIO_CATEGORIES) {
        out.push({
          id: `${route.id}-${category.id}`,
          en: `/portfolio/${category.en}/`,
          es: `/es/portafolio/${category.es}/`,
          kind: route.kind,
        });
      }
    }
  }

  return out;
}

/**
 * Las líneas de servicio de una ciudad, activas y planeadas, ordenadas por prioridad
 * publicitaria. Es lo que renderiza el hub — a diferencia de `getAllRoutes()`, que solo
 * ve lo que tiene página.
 */
export function getServiceMatrix(city: City): readonly MatrixEntry[] {
  const weight = { alto: 0, medio: 1, bajo: 2 } as const;
  return SERVICE_MATRIX.filter((entry) => entry.city === city).slice().sort((a, b) => {
    if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
    return weight[a.adPriority] - weight[b.adPriority];
  });
}

/** La URL de una entrada de matriz: su página si es `active`, el ancla del hub si no. */
export function getMatrixHref(entry: MatrixEntry, lang: Lang): string {
  if (entry.routeId === null) {
    const hub = ROUTES.find((r) => r.kind === 'hub' && r.city === entry.city)!;
    return `${lang === 'en' ? hub.en : hub.es}${entry.hubAnchor}`;
  }
  const route = ROUTES.find((r) => r.id === entry.routeId)!;
  return lang === 'en' ? route.en : route.es;
}
