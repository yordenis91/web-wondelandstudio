/**
 * Tipos compartidos del contenido de una página `pageType: event`, con la forma que
 * devolverá `servicePageQuery` de Sanity.
 *
 * `ServicePageTemplate.astro` importaba `PageContent` directamente desde
 * `content/wpb-wedding-photographer.ts` — funcionaba por casualidad estructural mientras
 * solo existía una página, pero atarlo a un archivo de contenido concreto es fragile:
 * cualquier página sin sección `steps` (como `wedding-videographer`) tenía que declarar
 * su propia copia local del tipo en vez de compartir uno. Vive aquí una sola vez y todos
 * los módulos de contenido y la plantilla importan de aquí.
 */
import type { PortableTextBlock } from './richtext.ts';

export interface ProseSectionContent {
  readonly kind: 'prose';
  readonly heading: string;
  readonly note?: string;
  /** Portable Text, la misma forma que devolverá `servicePage.sections[].body`. */
  readonly body: readonly PortableTextBlock[];
}

export interface StepsSectionContent {
  readonly kind: 'steps';
  readonly heading: string;
  readonly steps: readonly { readonly lead: string; readonly rest: string }[];
}

export type SectionContent = ProseSectionContent | StepsSectionContent;

export interface PageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly sectionsBeforePricing: readonly SectionContent[];
  readonly pricing: {
    readonly heading: string;
    readonly note: string;
    readonly afterTable: readonly PortableTextBlock[];
    readonly addOns: string;
    readonly ctaLabel: string;
    readonly ctaMessage: string;
    /** Enlace secundario junto al CTA de WhatsApp, ej. "Ver trabajos recientes". */
    readonly portfolioLink?: { readonly label: string; readonly href: string };
  };
  readonly sectionsAfterPricing: readonly SectionContent[];
  readonly testimonialsHeading: string;
  readonly faqHeading: string;
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}

/**
 * Contenido de una página `pageType: subscription` (branding, deck §4).
 *
 * Comparte `sectionsBeforePricing`/`sectionsAfterPricing`/testimonios/FAQ/CTA final con
 * `PageContent`, pero la sección de precios no es una sola tabla: son dos catálogos en
 * paralelo (sesiones únicas + socio mensual), cada uno con su propio encabezado, nota y
 * texto posterior — de ahí `sessions`/`monthly` en vez de un solo campo `pricing`.
 */
export interface SubscriptionPageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly sectionsBeforePricing: readonly SectionContent[];
  readonly sessions: {
    readonly heading: string;
    readonly note: string;
    readonly afterTable: readonly PortableTextBlock[];
  };
  readonly monthly: {
    readonly heading: string;
    readonly note: string;
    readonly levelLabel: string;
    readonly photoLabel: string;
    readonly videoLabel: string;
    readonly afterTable: readonly PortableTextBlock[];
    readonly ctaLabel: string;
    readonly ctaMessage: string;
    readonly portfolioLink: { readonly label: string; readonly href: string };
  };
  readonly sectionsAfterPricing: readonly SectionContent[];
  readonly testimonialsHeading: string;
  readonly faqHeading: string;
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}

/**
 * Contenido de una tarjeta de `HubPageTemplate` — una línea de `SERVICE_MATRIX`, o
 * varias cuando comparten anclaje (boda en WPB es foto + video, dos entradas de la
 * matriz bajo la misma card).
 *
 * El precio, el `status` y el `href` de cada línea salen siempre de `SERVICE_MATRIX`
 * (`i18n/routes.ts`) — nunca de aquí (regla 2 de CLAUDE.md, extendida a "de dónde sale
 * el precio" además de "dónde vive"). Esta card solo aporta el texto de venta.
 */
export interface ServiceCardContent {
  readonly title: string;
  /** Slugs de `SERVICE_MATRIX` que esta card representa. La card es "activa" si al menos una lo es. */
  readonly services: readonly string[];
  /** Una frase. Solo se usa si la card tiene al menos un servicio activo. */
  readonly description?: string;
  /** Etiquetas "Ver X →", mismo orden que las entradas activas de `services`. */
  readonly linkLabels?: readonly string[];
  /**
   * Cuerpo alternativo para una card 100% `planned` — lleva un enlace en línea (a
   * WhatsApp o al ancla de otra ciudad), por eso es Portable Text y no una frase plana.
   */
  readonly comingSoonBody?: readonly PortableTextBlock[];
}

/** Contenido de una página `pageType: hub` (deck de hubs de ciudad, §7). */
export interface HubPageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly servicesHeading: string;
  readonly cards: readonly ServiceCardContent[];
  readonly venuesHeading: string;
  readonly venuesBody: readonly PortableTextBlock[];
  readonly studioHeading: string;
  readonly studioIntro: string;
  readonly directionsLabel: string;
  readonly faqHeading: string;
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}

/**
 * Contenido de `/pricing/` (`pageType: aggregate`, deck §5). Es la única página que
 * compone las cuatro secciones de precio del sitio en un documento — boda y
 * quinceañera en escalera de tiers, maternidad y eventos sociales como listas simples,
 * marca con las dos tablas de `SubscriptionPageContent`. No hay un solo campo `pricing`
 * como en las páginas hoja: cada sección tiene su propio encabezado y enlace.
 */
export interface AggregatePageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly howToReadHeading: string;
  readonly howToReadBody: string;
  readonly weddings: { readonly heading: string; readonly linkLabel: string; readonly linkHref: string };
  readonly quinceaneras: {
    readonly heading: string;
    readonly note: string;
    readonly linkLabel: string;
    readonly linkHref: string;
  };
  readonly maternityFamily: { readonly heading: string };
  readonly socialEvents: { readonly heading: string };
  readonly branding: {
    readonly heading: string;
    readonly sessionsHeading: string;
    readonly monthlyHeading: string;
    readonly monthlyNote: string;
    readonly levelLabel: string;
    readonly photoLabel: string;
    readonly videoLabel: string;
    readonly linkLabel: string;
    readonly linkHref: string;
  };
  readonly alwaysIncludedHeading: string;
  readonly alwaysIncludedBody: string;
  readonly paymentHeading: string;
  readonly paymentBody: string;
  readonly faqHeading: string;
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}

/**
 * Contenido de `/portfolio/[category]/` (`pageType: portfolio`). La más liviana de
 * todas: es una galería, no vende un servicio concreto, así que no lleva FAQ ni tabla
 * de precios — solo el texto que sostiene la página mientras las fotos son un
 * placeholder (ver `content/portfolio.ts`) y el CTA final, igual que el resto del sitio.
 */
export interface PortfolioPageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}

/**
 * Contenido de `/about-lisandra/` (`pageType: about`, deck §4). El más liviano de los
 * cinco: sin `PricingTable`, `SubscriptionTable` ni `ServiceCard` — solo texto,
 * reusando `AnswerBlock` y `FAQ` que ya existen. Confirma que no todo `pageType` nuevo
 * implica trabajo de modelo de precios.
 *
 * La sección "Behind the camera" del deck (`[Foto o breve galería — Lisandra
 * trabajando]`) se omite del contenido: no hay fotos reales todavía, y es una sección
 * 100% dependiente de imagen sin ningún texto propio que renderizar sin ellas — mismo
 * principio que ya aplica a "Trabajos recientes" en los hubs y a los testimonios sin
 * verificar.
 */
export interface AboutPageContent {
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly h1: string;
  readonly answerParagraph: string;
  readonly howSheWorksHeading: string;
  readonly howSheWorksBody: readonly PortableTextBlock[];
  readonly bilingualHeading: string;
  readonly bilingualBody: readonly PortableTextBlock[];
  readonly specialtiesHeading: string;
  readonly specialties: readonly {
    readonly title: string;
    readonly description: string;
    readonly linkLabel: string;
    readonly linkHref: string;
  }[];
  readonly studioHeading: string;
  readonly studioBody: readonly PortableTextBlock[];
  readonly faqHeading: string;
  readonly faqs: readonly { readonly question: string; readonly answer: string }[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly label: string;
    readonly message: string;
  };
  readonly breadcrumbs: readonly { readonly name: string; readonly path?: string }[];
  readonly hero: { readonly eyebrow: string; readonly alt: string };
}
