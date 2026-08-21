/**
 * Consultas GROQ, una por tipo de documento de `/studio/schemaTypes`, con su tipo de
 * retorno en TypeScript. No incluye el cliente de Sanity todavía — solo la forma de los
 * datos y el texto de la consulta, para que quien conecte el fetch (Astro `getStaticPaths`,
 * endpoints, etc.) tenga el contrato ya tipado.
 */

export type Lang = 'en' | 'es';
export type City = 'wpb' | 'psl';
export type PageType = 'event' | 'subscription' | 'hub' | 'aggregate' | 'about';
export type MatrixStatus = 'active' | 'planned';
export type AdPriority = 'alto' | 'medio' | 'bajo';
export type BillingType = 'oneTime' | 'monthly';
export type Track = 'photo-led' | 'video-led';
export type Tier = 'elopement' | 'essential' | 'full' | 'tradition' | 'luxury';

export interface SanityImage {
  readonly asset: { readonly _ref: string; readonly _type: 'reference' };
  readonly hotspot?: unknown;
}

export interface SanityImageWithAlt extends SanityImage {
  readonly altEN: string;
  readonly altES: string;
}

export interface BusinessLocationDoc {
  readonly _id: string;
  readonly key: City;
  readonly name: string;
  readonly slug: { readonly current: string };
  readonly address: {
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
  readonly geo?: { readonly latitude: number; readonly longitude: number };
  readonly phone: { readonly e164: string; readonly display: string };
  readonly areasServed: readonly string[];
  readonly languages: readonly Lang[];
  readonly schemaId: string;
}

/** Todas las sedes. */
export const businessLocationsQuery = /* groq */ `
*[_type == "businessLocation"] | order(key asc) {
  _id, key, name, slug, address, geo, phone, areasServed, languages, schemaId
}
`;

export interface CityServiceMatrixEntryDoc {
  readonly _id: string;
  readonly city: City;
  readonly service: string;
  readonly status: MatrixStatus;
  readonly adPriority: AdPriority;
  readonly fromPrice: number;
  readonly hubAnchor: string;
  readonly servicePageRef?: { readonly _ref: string };
}

/** Las 9 líneas de servicio de una ciudad, activas y planeadas. */
export const cityServiceMatrixQuery = /* groq */ `
*[_type == "cityServiceMatrix" && city == $city] | order(adPriority asc) {
  _id, city, service, status, adPriority, fromPrice, hubAnchor, servicePageRef
}
`;

export interface PricingEntry {
  readonly name: string;
  readonly tier?: Tier;
  readonly billingType: BillingType;
  readonly track?: Track;
  readonly price: number;
  readonly coverage: string;
  readonly includes: readonly string[];
  readonly appliesTo: { readonly _ref: string };
}

export interface PricingCatalogDoc {
  readonly _id: string;
  readonly entries: readonly PricingEntry[];
}

/** El singleton completo — una sola fuente de verdad para todos los precios (regla 2). */
export const pricingCatalogQuery = /* groq */ `
*[_type == "pricingCatalog"][0] {
  _id, entries
}
`;

export interface ServicePageSection {
  readonly title: string;
  readonly body: string;
  readonly images?: readonly SanityImage[];
}

export interface ServicePageFaq {
  readonly question: string;
  readonly answer: string;
}

export interface ServicePageVideoEmbed {
  readonly url: string;
  readonly platform: 'vimeo' | 'youtube' | 'self-hosted';
  readonly caption?: string;
}

export interface ServicePageDoc {
  readonly _id: string;
  readonly language: Lang;
  readonly city: City;
  readonly service: string;
  readonly pageType: PageType;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly sections: readonly ServicePageSection[];
  readonly faqs: readonly ServicePageFaq[];
  readonly videoEmbeds?: readonly ServicePageVideoEmbed[];
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly images: readonly SanityImageWithAlt[];
  readonly testimonialRefs?: readonly { readonly _ref: string }[];
}

/** Una página de servicio, por idioma + ciudad + servicio (única combinación posible). */
export const servicePageQuery = /* groq */ `
*[_type == "servicePage" && language == $language && city == $city && service == $service][0] {
  _id, language, city, service, pageType, h1, answerParagraph, sections, faqs,
  videoEmbeds, metaTitle, metaDescription, images, testimonialRefs
}
`;

/** Todas las páginas de servicio activas — para `getStaticPaths` y el sitemap. */
export const servicePagesQuery = /* groq */ `
*[_type == "servicePage"] {
  _id, language, city, service, pageType, h1, answerParagraph, sections, faqs,
  videoEmbeds, metaTitle, metaDescription, images, testimonialRefs
}
`;

export interface TestimonialDoc {
  readonly _id: string;
  readonly text: string;
  readonly author: string;
  readonly city: City;
  readonly category: string;
  readonly verified: boolean;
}

/** Solo testimonios verificados (regla 5 de CLAUDE.md), filtrables por categoría/ciudad. */
export const testimonialsQuery = /* groq */ `
*[_type == "testimonial" && verified == true
  && (!defined($city) || city == $city)
  && (!defined($category) || category == $category)
] | order(_createdAt desc) {
  _id, text, author, city, category, verified
}
`;

export interface PostDoc {
  readonly _id: string;
  readonly title: string;
  readonly slug: { readonly current: string };
  readonly publishedAt: string;
  readonly body: unknown;
}

/** Listado de posts, más recientes primero. */
export const postsQuery = /* groq */ `
*[_type == "post"] | order(publishedAt desc) {
  _id, title, slug, publishedAt, body
}
`;

/** Un post por slug. */
export const postQuery = /* groq */ `
*[_type == "post" && slug.current == $slug][0] {
  _id, title, slug, publishedAt, body
}
`;

export interface GalleryItemDoc {
  readonly _id: string;
  readonly image: SanityImage;
  readonly altEN: string;
  readonly altES: string;
  readonly category?: 'weddings' | 'branding' | 'maternity';
  readonly city?: City;
}

/** Elementos de galería, filtrables por categoría (para `/portfolio/[category]/`). */
export const galleryItemsQuery = /* groq */ `
*[_type == "galleryItem" && (!defined($category) || category == $category)] {
  _id, image, altEN, altES, category, city
}
`;
