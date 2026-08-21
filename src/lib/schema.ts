/**
 * Composición del JSON-LD del sitio.
 *
 * Un solo bloque `@graph` por página. Las entidades estables — `Organization`, las dos
 * sedes `PhotographyBusiness`, la `Person` de Lisandra — se declaran completas en un
 * único sitio y en todas las demás páginas se referencian por `@id`. Eso es lo que
 * mantiene un grafo de entidades coherente para Google en vez de N copias divergentes
 * del mismo negocio.
 *
 * Reglas duras que este módulo hace cumplir (docs/PLAN.md §6, CLAUDE.md regla 5):
 *  - **Nunca** se emite `Review` ni `AggregateRating`. No hay función que los construya:
 *    marcar reseñas inexistentes es motivo de acción manual en Google.
 *  - `/pricing/` nunca redeclara un `price`: referencia cada `Service` por `@id`.
 *  - Un dato todavía sin confirmar se omite del grafo. Nunca se emite el literal del
 *    placeholder ni se inventa un valor — un campo ausente es correcto, un campo falso
 *    no. Ver `isPending` en `data/tokens.ts`.
 */
import {
  BUSINESS,
  getAllLocations,
  getLocation,
  type CityKey,
  type Location,
} from '../data/business.ts';
import { isPending, type Pending } from '../data/tokens.ts';
import type { Lang } from '../i18n/routes.ts';

/** Un nodo cualquiera del grafo. */
export type JsonLdNode = Record<string, unknown>;

export interface JsonLdGraph {
  readonly '@context': 'https://schema.org';
  readonly '@graph': readonly JsonLdNode[];
}

/** Referencia a una entidad ya declarada en otro sitio del grafo. */
export function ref(id: string): { readonly '@id': string } {
  return { '@id': id };
}

export function absoluteUrl(path: string): string {
  return `${BUSINESS.siteUrl}${path}`;
}

/**
 * El valor si está confirmado, `undefined` si sigue siendo un placeholder.
 *
 * Deliberadamente no lanza, a diferencia de `requireResolved`: el grafo debe poder
 * construirse mientras haya datos pendientes. Un `PostalAddress` sin `streetAddress`
 * sigue siendo válido en schema.org; uno con `{{WPB_STREET_ADDRESS}}` dentro no lo es,
 * y además rompería `check-tokens` al llegar a `dist/`.
 */
function resolved<T>(value: Pending<T>): T | undefined {
  return isPending(value) ? undefined : (value as T);
}

/** Quita las claves `undefined` para no emitir `"campo": null` en el JSON. */
function compact(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(Object.entries(node).filter(([, v]) => v !== undefined));
}

/* -------------------------------------------------------------------------- */
/* Entidades compartidas — declaradas completas, referenciadas por @id          */
/* -------------------------------------------------------------------------- */

/**
 * `Organization`. Idéntica en todas las páginas del sitio, por eso se referencia
 * siempre por el mismo `@id`.
 */
export function organizationNode(): JsonLdNode {
  return compact({
    '@type': 'Organization',
    '@id': BUSINESS.schemaId,
    name: BUSINESS.legalName,
    url: `${BUSINESS.siteUrl}/`,
    telephone: getLocation('wpb').phone.e164,
    founder: ref(BUSINESS.founderSchemaId),
    sameAs: BUSINESS.social,
  });
}

/** `PostalAddress` de una sede, omitiendo lo que siga sin confirmar. */
function addressNode(location: Location): JsonLdNode {
  return compact({
    '@type': 'PostalAddress',
    streetAddress: resolved(location.address.streetAddress),
    addressLocality: location.address.addressLocality,
    addressRegion: location.address.addressRegion,
    postalCode: resolved(location.address.postalCode),
    addressCountry: location.address.addressCountry,
  });
}

/** `GeoCoordinates`, o `undefined` si las coordenadas siguen pendientes. */
function geoNode(location: Location): JsonLdNode | undefined {
  const latitude = resolved(location.geo.latitude);
  const longitude = resolved(location.geo.longitude);
  if (latitude === undefined || longitude === undefined) return undefined;
  return { '@type': 'GeoCoordinates', latitude, longitude };
}

function areaServedNodes(location: Location): readonly JsonLdNode[] {
  return location.areasServed.map((name) => ({ '@type': 'City', name }));
}

/**
 * `PhotographyBusiness` de una sede. Es la entidad que sostiene el SEO local: cada
 * `Service` la referencia como `provider` en vez de repetir el NAP.
 */
export function locationNode(city: CityKey): JsonLdNode {
  const location = getLocation(city);
  return compact({
    '@type': 'PhotographyBusiness',
    '@id': location.schemaId,
    name: location.name,
    parentOrganization: ref(BUSINESS.schemaId),
    url: absoluteUrl(`/${location.slug}/`),
    telephone: resolved(location.phone.e164),
    priceRange: '$$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Zelle',
    knowsLanguage: location.languages.map((l) => (l === 'en' ? 'en-US' : 'es-US')),
    address: addressNode(location),
    geo: geoNode(location),
    areaServed: areaServedNodes(location),
  });
}

/**
 * `Person` de Lisandra, completa. Se declara **solo** en `/about-lisandra/`; el resto
 * del sitio la referencia por `@id` (`Organization.founder`, y el `author` de los posts
 * cuando existan). El `@id` tiene que coincidir carácter por carácter — una
 * desalineación aquí no rompe el build pero sí rompe el grafo para Google.
 */
export function personNode(options: {
  readonly jobTitle: string;
  readonly knowsAbout: readonly string[];
  readonly url: string;
}): JsonLdNode {
  return compact({
    '@type': 'Person',
    '@id': BUSINESS.founderSchemaId,
    name: BUSINESS.founder,
    jobTitle: options.jobTitle,
    worksFor: ref(BUSINESS.schemaId),
    knowsLanguage: ['en-US', 'es-US'],
    knowsAbout: options.knowsAbout,
    url: absoluteUrl(options.url),
    sameAs: [BUSINESS.social[0]],
  });
}

/* -------------------------------------------------------------------------- */
/* Nodos propios de cada página                                                */
/* -------------------------------------------------------------------------- */

export interface OfferInput {
  readonly name: string;
  readonly price: number;
  readonly description?: string;
  /** `true` para cuota mensual: emite `priceSpecification` con `unitCode: MON`. */
  readonly monthly?: boolean;
}

/**
 * Un `Offer`. Si es recurrente usa `UnitPriceSpecification` con `unitCode: "MON"` —
 * sin eso, Google lee $1,500/mes como un pago único y la oferta compite mal contra
 * una sesión de $700 en vez de comunicar valor mensual (deck de branding §3).
 */
function offerNode(offer: OfferInput): JsonLdNode {
  if (offer.monthly) {
    return compact({
      '@type': 'Offer',
      name: offer.name,
      description: offer.description,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(offer.price),
        priceCurrency: 'USD',
        unitCode: 'MON',
      },
    });
  }
  return compact({
    '@type': 'Offer',
    name: offer.name,
    price: String(offer.price),
    priceCurrency: 'USD',
    description: offer.description,
  });
}

export interface OfferCatalogInput {
  readonly name: string;
  readonly offers: readonly OfferInput[];
}

function offerCatalogNode(catalog: OfferCatalogInput): JsonLdNode {
  return {
    '@type': 'OfferCatalog',
    name: catalog.name,
    itemListElement: catalog.offers.map(offerNode),
  };
}

export interface ServiceInput {
  /** Ruta canónica de la página, con barras: `/west-palm-beach/wedding-photographer/`. */
  readonly path: string;
  readonly name: string;
  readonly serviceType: string;
  readonly city: CityKey;
  readonly areaServed: string;
  /**
   * Uno o varios catálogos. `subscription` (branding) usa dos en paralelo — sesiones
   * únicas y cuota mensual — y por eso `hasOfferCatalog` puede ser un array.
   */
  readonly catalogs: readonly OfferCatalogInput[];
  /** `@id` del `Service` hermano, para el `isRelatedTo` recíproco. */
  readonly relatedServiceId?: string;
}

export function serviceId(path: string): string {
  return `${absoluteUrl(path)}#service`;
}

/**
 * `Service`. El precio sale siempre del catálogo que se le pasa, que a su vez viene de
 * `pricingCatalog` en Sanity — nunca se escribe aquí (regla 2 de CLAUDE.md).
 */
export function serviceNode(input: ServiceInput): JsonLdNode {
  const catalogs = input.catalogs.map(offerCatalogNode);
  return compact({
    '@type': 'Service',
    '@id': serviceId(input.path),
    name: input.name,
    serviceType: input.serviceType,
    provider: ref(getLocation(input.city).schemaId),
    areaServed: { '@type': 'AdministrativeArea', name: input.areaServed },
    hasOfferCatalog: catalogs.length === 1 ? catalogs[0] : catalogs,
    isRelatedTo: input.relatedServiceId ? ref(input.relatedServiceId) : undefined,
  });
}

export interface FaqInput {
  readonly question: string;
  readonly answer: string;
}

/**
 * `FAQPage`. Toma solo las primeras preguntas de la página — dos `FAQPage` con las
 * mismas preguntas en el mismo dominio hacen que Google descarte una, así que cada
 * página aporta las suyas y nunca se repiten entre hermanas (deck de video §3).
 */
export function faqNode(path: string, faqs: readonly FaqInput[], limit = 3): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.slice(0, limit).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export interface BreadcrumbInput {
  readonly name: string;
  /** La última miga no lleva `item`: es la página actual. */
  readonly path?: string;
}

export function breadcrumbNode(items: readonly BreadcrumbInput[]): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) =>
      compact({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.path ? absoluteUrl(item.path) : undefined,
      }),
    ),
  };
}

export interface VideoInput {
  readonly name: string;
  readonly description: string;
  readonly thumbnailUrl: string;
  readonly uploadDate: string;
  readonly contentUrl: string;
}

/**
 * `VideoObject` — solo para vídeo autoalojado. Si vive en Vimeo o YouTube, la
 * plataforma ya lo declara y repetirlo aquí sobra (deck de video §3).
 */
export function videoNode(video: VideoInput): JsonLdNode {
  return { '@type': 'VideoObject', ...video };
}

/* -------------------------------------------------------------------------- */
/* Composición por tipo de página                                              */
/* -------------------------------------------------------------------------- */

function graph(nodes: readonly (JsonLdNode | undefined)[]): JsonLdGraph {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter((n): n is JsonLdNode => n !== undefined),
  };
}

/**
 * Las entidades que van en toda página: la organización y las dos sedes.
 *
 * Se emiten completas en cada página a propósito. La alternativa —declararlas en una
 * sola URL y referenciarlas desde el resto— obliga a Google a haber rastreado esa URL
 * primero para resolver la referencia, y no hay garantía de orden de rastreo. Repetir
 * la definición es la práctica que recomienda schema.org para grafos por página: el
 * `@id` idéntico es lo que las reconcilia como la misma entidad.
 */
function baseNodes(): readonly JsonLdNode[] {
  return [organizationNode(), ...getAllLocations().map((l) => locationNode(l.key))];
}

export interface ServicePageGraphInput {
  readonly service: ServiceInput;
  readonly faqs: readonly FaqInput[];
  readonly breadcrumbs: readonly BreadcrumbInput[];
  readonly videos?: readonly VideoInput[];
}

/** `pageType: event` y `pageType: subscription` — la página hoja de un servicio. */
export function servicePageGraph(input: ServicePageGraphInput): JsonLdGraph {
  return graph([
    ...baseNodes(),
    serviceNode(input.service),
    faqNode(input.service.path, input.faqs),
    breadcrumbNode(input.breadcrumbs),
    ...(input.videos ?? []).map(videoNode),
  ]);
}

export interface HubPageGraphInput {
  readonly city: CityKey;
  /** Solo los `Service` con página real: un `Service` sin `url` resoluble es penalizable. */
  readonly activeServicePaths: readonly string[];
  readonly faqs: readonly FaqInput[];
  readonly breadcrumbs: readonly BreadcrumbInput[];
}

/**
 * `pageType: hub`. `makesOffer` lista **solo** las líneas `active`; las `planned` se
 * muestran en el HTML sin enlace, pero jamás entran al grafo (docs/PLAN.md §6).
 */
export function hubPageGraph(input: HubPageGraphInput): JsonLdGraph {
  const location = locationNode(input.city);
  const withOffers: JsonLdNode = {
    ...location,
    makesOffer: {
      '@type': 'ItemList',
      itemListElement: input.activeServicePaths.map((path, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: ref(serviceId(path)),
      })),
    },
  };

  const others = getAllLocations()
    .filter((l) => l.key !== input.city)
    .map((l) => locationNode(l.key));

  return graph([
    organizationNode(),
    withOffers,
    ...others,
    faqNode(`/${getLocation(input.city).slug}/`, input.faqs),
    breadcrumbNode(input.breadcrumbs),
  ]);
}

export interface AggregatePageGraphInput {
  readonly path: string;
  readonly name: string;
  /** Rutas de las páginas hoja cuyos precios se muestran aquí. */
  readonly servicePaths: readonly string[];
  readonly faqs: readonly FaqInput[];
  readonly breadcrumbs: readonly BreadcrumbInput[];
}

/**
 * `pageType: aggregate` — `/pricing/`.
 *
 * Regla dura: esta página **nunca** declara su propio `hasOfferCatalog`. Referencia
 * cada `Service` por `@id` en `WebPage.about[]`. Si redeclarara los precios, una
 * actualización habría que hacerla en dos sitios — que es exactamente el bug de precios
 * contradictorios que el proyecto existe para arreglar.
 */
export function aggregatePageGraph(input: AggregatePageGraphInput): JsonLdGraph {
  return graph([
    ...baseNodes(),
    {
      '@type': 'WebPage',
      '@id': `${absoluteUrl(input.path)}#page`,
      name: input.name,
      about: input.servicePaths.map((path) => ref(serviceId(path))),
      mainEntity: ref(`${absoluteUrl(input.path)}#faq`),
    },
    faqNode(input.path, input.faqs),
    breadcrumbNode(input.breadcrumbs),
  ]);
}

export interface AboutPageGraphInput {
  readonly path: string;
  readonly jobTitle: string;
  readonly knowsAbout: readonly string[];
  readonly faqs: readonly FaqInput[];
  readonly breadcrumbs: readonly BreadcrumbInput[];
}

/** `pageType: about` — la única página que declara la `Person` completa. */
export function aboutPageGraph(input: AboutPageGraphInput): JsonLdGraph {
  return graph([
    ...baseNodes(),
    personNode({
      jobTitle: input.jobTitle,
      knowsAbout: input.knowsAbout,
      url: input.path,
    }),
    faqNode(input.path, input.faqs),
    breadcrumbNode(input.breadcrumbs),
  ]);
}

export interface HomePageGraphInput {
  readonly lang: Lang;
  readonly breadcrumbs?: readonly BreadcrumbInput[];
}

/** La home: entidades base y poco más — no vende un servicio concreto. */
export function homePageGraph(input: HomePageGraphInput): JsonLdGraph {
  const path = input.lang === 'en' ? '/' : '/es/';
  return graph([
    ...baseNodes(),
    {
      '@type': 'WebSite',
      '@id': `${absoluteUrl(path)}#website`,
      name: BUSINESS.legalName,
      url: absoluteUrl(path),
      publisher: ref(BUSINESS.schemaId),
      inLanguage: input.lang === 'en' ? 'en-US' : 'es-US',
    },
    input.breadcrumbs ? breadcrumbNode(input.breadcrumbs) : undefined,
  ]);
}

/**
 * Serializa el grafo para incrustarlo en un `<script type="application/ld+json">`.
 *
 * Escapa `<` como `<`: sin eso, un `</script>` dentro de cualquier texto de
 * contenido (una FAQ, una descripción) cerraría la etiqueta antes de tiempo y rompería
 * la página. Es válido en JSON y los parsers lo leen igual.
 */
export function serializeJsonLd(value: JsonLdGraph): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
