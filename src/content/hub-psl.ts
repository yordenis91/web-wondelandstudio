/**
 * Contenido de `/port-st-lucie/` y su par español.
 *
 * Texto literal de `docs/copy/city-hubs-copydeck.md` §3 (EN) y §5 (ES). Mismo patrón que
 * `content/hub-wpb.ts`, invertido: aquí lo `active` en Fase 1 es solo maternidad.
 *
 * Misma desviación deliberada que en `content/psl-maternity-photographer.ts`: el
 * párrafo-respuesta y el CTA final del deck terminan en `{{PSL_PHONE_772}}`, el teléfono
 * propio de PSL todavía sin confirmar por Lisandra. Regla 4 de CLAUDE.md — un token sin
 * resolver que llegue a `dist/` aborta el build. El párrafo cierra sin ese teléfono y el
 * CTA usa el WhatsApp del negocio, compartido entre las dos sedes y ya confirmado.
 */
import { paragraph, paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { HubPageContent } from '../lib/pageContent.ts';
import { getWhatsAppLink } from '../data/business.ts';

const EN: HubPageContent = {
  metaTitle: 'Photographer in Port St. Lucie, FL | Wonderlands Studio',
  metaDescription:
    'Quinceañera, maternity and wedding photography and video in Port St. Lucie. Bilingual studio serving Tradition and St. Lucie West. Pricing and recent work.',
  h1: 'Photographer and Videographer in Port St. Lucie, FL',
  answerParagraph:
    "Wonderlands Studio serves Port St. Lucie, Florida, from our studio at 943 SE Brookedge Avenue E, with a focus on quinceañeras, maternity and family photography for the area's growing Hispanic community. Collections start at $500. We also cover weddings throughout Tradition and St. Lucie West. Bilingual studio.",

  servicesHeading: 'What we shoot in Port St. Lucie',
  cards: [
    {
      title: 'Maternity & Family',
      services: ['maternity-photographer'],
      description:
        'Editorial maternity and family sessions in our Port St. Lucie studio or on location.',
      linkLabels: ['See maternity photography →'],
    },
    {
      title: 'Quinceañeras',
      services: ['quinceanera-photographer'],
      comingSoonBody: paragraphs([
        [
          "Photography and film for the Quince celebration, built for Port St. Lucie's Hispanic community.",
        ],
        [
          'Page in progress — ',
          {
            text: 'check on WhatsApp',
            href: getWhatsAppLink(
              'Hi Wonderlands Studio — I would like to ask about quinceañera coverage in Port St. Lucie.',
              { source: 'site', medium: 'hub-card', campaign: 'psl-hub-en' },
            ),
          },
          ' in the meantime.',
        ],
      ]),
    },
    {
      title: 'Weddings & Elopements',
      services: ['wedding-photographer'],
      comingSoonBody: paragraphs([
        ['Full wedding coverage throughout Tradition and St. Lucie West.'],
        [
          'Page in progress — ',
          {
            text: 'check on WhatsApp',
            href: getWhatsAppLink(
              'Hi Wonderlands Studio — I would like to ask about wedding coverage in Port St. Lucie.',
              { source: 'site', medium: 'hub-card', campaign: 'psl-hub-en' },
            ),
          },
          ' in the meantime.',
        ],
      ]),
    },
  ],

  venuesHeading: 'Where we work in Port St. Lucie',
  venuesBody: [
    paragraph([
      'Tradition Square, St. Lucie West, and the surrounding Port St. Lucie area — no travel fee for local venues.',
    ]),
  ],

  studioHeading: 'Our Port St. Lucie studio',
  studioIntro:
    'Address, hours, and a photo of the actual space — climate-controlled, cinematic lighting.',
  directionsLabel: 'Get directions',

  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Where exactly is your Port St. Lucie studio?',
      answer:
        "We're located in Port St. Lucie, serving Tradition, St. Lucie West and the surrounding area. Message us for exact directions when you book.",
    },
    {
      question: 'Do you serve the Hispanic community in Port St. Lucie?',
      answer:
        'Yes — our Port St. Lucie location is fully bilingual and quinceañeras are one of our main focuses here, alongside maternity and family sessions.',
    },
    {
      question: 'Can you also cover a wedding in West Palm Beach?',
      answer:
        'Yes — West Palm Beach is our primary wedding market, with full collections and pricing. See West Palm Beach weddings.',
    },
  ],

  finalCta: {
    heading: 'Planning a session in Port St. Lucie?',
    body: "Message us in English or Spanish and we'll confirm availability the same day.",
    label: 'WhatsApp +1 561 260 3245',
    message: 'Hi Wonderlands Studio — I would like to plan a session in Port St. Lucie.',
  },

  breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Port St. Lucie' }],

  hero: {
    eyebrow: 'Bilingual photography & video studio',
    alt: 'Wonderlands Studio photography session in Port St. Lucie, Florida',
  },
};

const ES: HubPageContent = {
  metaTitle: 'Fotógrafo en Port St. Lucie, FL | Wonderlands Studio',
  metaDescription:
    'Fotografía y video de quinceañera, embarazo y boda en Port St. Lucie. Estudio bilingüe que atiende Tradition y St. Lucie West. Precios y trabajos recientes.',
  h1: 'Fotógrafo y Videógrafo en Port St. Lucie, FL',
  answerParagraph:
    'Wonderlands Studio atiende Port St. Lucie, Florida, desde nuestro estudio en 943 SE Brookedge Avenue E, con un enfoque en quinceañeras para la creciente comunidad hispana de la zona, además de embarazo y familia. Las colecciones de embarazo empiezan en $500. También cubrimos bodas en Tradition y St. Lucie West. Estudio bilingüe.',

  servicesHeading: 'Qué cubrimos en Port St. Lucie',
  cards: [
    {
      title: 'Quinceañeras',
      services: ['quinceanera-photographer'],
      comingSoonBody: paragraphs([
        [
          'Fotografía y video para la celebración de Quince, pensados para la comunidad hispana de Port St. Lucie.',
        ],
        [
          'Página en construcción — ',
          {
            text: 'consulta por WhatsApp',
            href: getWhatsAppLink(
              'Hola Wonderlands Studio — quisiera consultar sobre cobertura de quinceañera en Port St. Lucie.',
              { source: 'site', medium: 'hub-card', campaign: 'psl-hub-es' },
            ),
          },
          ' mientras tanto.',
        ],
      ]),
    },
    {
      title: 'Embarazo y familia',
      services: ['maternity-photographer'],
      description:
        'Sesiones editoriales de embarazo y familia en nuestro estudio de Port St. Lucie o en locación.',
      linkLabels: ['Ver fotografía de embarazo →'],
    },
    {
      title: 'Bodas y ceremonias civiles',
      services: ['wedding-photographer'],
      comingSoonBody: paragraphs([
        ['Cobertura completa de boda en Tradition y St. Lucie West.'],
        [
          'Página en construcción — ',
          {
            text: 'consulta por WhatsApp',
            href: getWhatsAppLink(
              'Hola Wonderlands Studio — quisiera consultar sobre cobertura de boda en Port St. Lucie.',
              { source: 'site', medium: 'hub-card', campaign: 'psl-hub-es' },
            ),
          },
          ' mientras tanto.',
        ],
      ]),
    },
  ],

  venuesHeading: 'Dónde trabajamos en Port St. Lucie',
  venuesBody: [
    paragraph([
      'Tradition Square, St. Lucie West y los alrededores de Port St. Lucie — sin cargo por traslado en locaciones locales.',
    ]),
  ],

  studioHeading: 'Nuestro estudio en Port St. Lucie',
  studioIntro: 'Dirección, horario y una foto del espacio real — con climatización e iluminación cinematográfica.',
  directionsLabel: 'Cómo llegar',

  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Dónde queda exactamente su estudio en Port St. Lucie?',
      answer:
        'Estamos en Port St. Lucie, atendiendo Tradition, St. Lucie West y los alrededores. Escríbenos para la dirección exacta al reservar.',
    },
    {
      question: '¿Atienden a la comunidad hispana en Port St. Lucie?',
      answer:
        'Sí — nuestra sede de Port St. Lucie es completamente bilingüe y las quinceañeras son uno de nuestros enfoques principales aquí, junto con embarazo y familia.',
    },
    {
      question: '¿También pueden cubrir una boda en West Palm Beach?',
      answer:
        'Sí — West Palm Beach es nuestro mercado principal de bodas, con colecciones y precios completos. Ver bodas en West Palm Beach.',
    },
  ],

  finalCta: {
    heading: '¿Planeando una sesión en Port St. Lucie?',
    body: 'Escríbenos en español o inglés y confirmamos disponibilidad el mismo día.',
    label: 'WhatsApp +1 561 260 3245',
    message: 'Hola Wonderlands Studio — quisiera planear una sesión en Port St. Lucie.',
  },

  breadcrumbs: [{ name: 'Inicio', path: '/es/' }, { name: 'Port St. Lucie' }],

  hero: {
    eyebrow: 'Estudio bilingüe de fotografía y video',
    alt: 'Sesión de fotografía de Wonderlands Studio en Port St. Lucie, Florida',
  },
};

export const HUB_PSL: Readonly<Record<Lang, HubPageContent>> = { en: EN, es: ES };
