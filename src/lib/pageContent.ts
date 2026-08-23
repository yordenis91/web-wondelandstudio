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
