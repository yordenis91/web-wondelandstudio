/**
 * Puente entre `PageContent` (lo que leen las plantillas) y el documento `servicePage`
 * de Sanity. Lo comparten `migrate-to-sanity.ts` (código → Sanity) y
 * `sync-from-sanity.ts` (Sanity → código), para que las dos direcciones no puedan
 * divergir: lo que una escribe, la otra lo lee tal cual.
 */
import type { Lang } from '../../src/i18n/routes.ts';
import type { PageContent, SectionContent } from '../../src/lib/pageContent.ts';

export interface EventPageDef {
  readonly routeId: string;
  readonly city: 'wpb' | 'psl';
  readonly service: string;
  /** Nombre del export en `src/content/<file>.ts`. */
  readonly exportName: string;
  readonly file: string;
}

export const EVENT_PAGES: readonly EventPageDef[] = [
  { routeId: 'wpb-wedding-photographer', city: 'wpb', service: 'wedding-photographer', exportName: 'WPB_WEDDING_PHOTOGRAPHER', file: 'wpb-wedding-photographer' },
  { routeId: 'wpb-wedding-videographer', city: 'wpb', service: 'wedding-videographer', exportName: 'WPB_WEDDING_VIDEOGRAPHER', file: 'wpb-wedding-videographer' },
  { routeId: 'psl-maternity-photographer', city: 'psl', service: 'maternity-photographer', exportName: 'PSL_MATERNITY_PHOTOGRAPHER', file: 'psl-maternity-photographer' },
];

export function servicePageId(lang: Lang, routeId: string): string {
  return `servicePage.${lang}.${routeId}`;
}

type Json = Record<string, unknown>;

const key = (prefix: string, index: number) => `${prefix}${index}`;

function sectionToDoc(section: SectionContent, prefix: string, index: number): Json {
  if (section.kind === 'steps') {
    return {
      _type: 'stepsSection',
      _key: key(prefix, index),
      heading: section.heading,
      steps: section.steps.map((step, i) => ({ _type: 'step', _key: key('st', i), lead: step.lead, rest: step.rest })),
    };
  }
  return {
    _type: 'proseSection',
    _key: key(prefix, index),
    heading: section.heading,
    body: section.body,
  };
}

function sectionFromDoc(doc: Json): SectionContent {
  if (doc._type === 'stepsSection') {
    return {
      kind: 'steps',
      heading: doc.heading as string,
      steps: (doc.steps as Json[]).map((s) => ({ lead: s.lead as string, rest: s.rest as string })),
    };
  }
  return { kind: 'prose', heading: doc.heading as string, body: doc.body as never };
}

export function eventPageToDoc(def: EventPageDef, lang: Lang, c: PageContent): Json {
  return {
    _id: servicePageId(lang, def.routeId),
    _type: 'servicePage',
    routeId: def.routeId,
    language: lang,
    city: def.city,
    service: def.service,
    pageType: 'event',
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    h1: c.h1,
    answerParagraph: c.answerParagraph,
    sectionsBeforePricing: c.sectionsBeforePricing.map((s, i) => sectionToDoc(s, 'b', i)),
    pricing: {
      heading: c.pricing.heading,
      note: c.pricing.note,
      afterTable: c.pricing.afterTable,
      addOns: c.pricing.addOns,
      ctaLabel: c.pricing.ctaLabel,
      ctaMessage: c.pricing.ctaMessage,
      portfolioLink: c.pricing.portfolioLink,
    },
    sectionsAfterPricing: c.sectionsAfterPricing.map((s, i) => sectionToDoc(s, 'a', i)),
    testimonialsHeading: c.testimonialsHeading,
    faqHeading: c.faqHeading,
    faqs: c.faqs.map((f, i) => ({ _type: 'faq', _key: key('f', i), question: f.question, answer: f.answer })),
    finalCta: c.finalCta,
    breadcrumbs: c.breadcrumbs.map((b, i) => ({ _type: 'crumb', _key: key('c', i), name: b.name, path: b.path })),
    hero: { eyebrow: c.hero.eyebrow, alt: c.hero.alt },
  };
}

/** Quita `null` (Sanity devuelve null por campos vacíos) para que lo opcional vuelva a ser `undefined`. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clean) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Json)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, clean(v)]),
    ) as T;
  }
  return value;
}

export function eventPageFromDoc(doc: Json): PageContent {
  const d = clean(doc) as Json;
  const pricing = d.pricing as Json;
  const portfolioLink = pricing.portfolioLink as { label?: string; href?: string } | undefined;
  const sections = (list: unknown): SectionContent[] =>
    ((list as Json[] | undefined) ?? []).map(sectionFromDoc);

  return {
    metaTitle: d.metaTitle as string,
    metaDescription: d.metaDescription as string,
    h1: d.h1 as string,
    answerParagraph: d.answerParagraph as string,
    sectionsBeforePricing: sections(d.sectionsBeforePricing),
    pricing: {
      heading: pricing.heading as string,
      note: (pricing.note as string | undefined) ?? '',
      afterTable: (pricing.afterTable as PageContent['pricing']['afterTable'] | undefined) ?? [],
      addOns: (pricing.addOns as string | undefined) ?? '',
      ctaLabel: pricing.ctaLabel as string,
      ctaMessage: pricing.ctaMessage as string,
      ...(portfolioLink?.label && portfolioLink.href
        ? { portfolioLink: { label: portfolioLink.label, href: portfolioLink.href } }
        : {}),
    },
    sectionsAfterPricing: sections(d.sectionsAfterPricing),
    testimonialsHeading: d.testimonialsHeading as string,
    faqHeading: d.faqHeading as string,
    faqs: ((d.faqs as Json[]) ?? []).map((f) => ({ question: f.question as string, answer: f.answer as string })),
    finalCta: d.finalCta as PageContent['finalCta'],
    breadcrumbs: ((d.breadcrumbs as Json[]) ?? []).map((b) => ({
      name: b.name as string,
      ...(b.path ? { path: b.path as string } : {}),
    })),
    hero: { eyebrow: (d.hero as Json).eyebrow as string, alt: (d.hero as Json).alt as string },
  };
}

/** Fuente de `src/content/sanity/<routeId>.ts` — generado, no se edita a mano. */
export function generatedContentSource(def: EventPageDef, content: Readonly<Record<Lang, PageContent>>): string {
  return (
    `/**\n * GENERADO por scripts/sync-from-sanity.ts desde servicePage.{en,es}.${def.routeId}.\n` +
    ` * No editar a mano: el cambio se pierde en el próximo sync. Se edita en el Studio.\n */\n` +
    `import type { Lang } from '../../i18n/routes.ts';\nimport type { PageContent } from '../../lib/pageContent.ts';\n\n` +
    `export const CONTENT: Readonly<Record<Lang, PageContent>> = ${JSON.stringify(content, null, 2)};\n`
  );
}
