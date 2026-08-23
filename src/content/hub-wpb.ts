/**
 * Contenido de `/west-palm-beach/` y su par español.
 *
 * Texto literal de `docs/copy/city-hubs-copydeck.md` §2 (EN) y §4 (ES). `pageType: hub`
 * — no vende un servicio, reparte al visitante hacia la página hoja correcta y sostiene
 * la entidad `PhotographyBusiness` completa de la sede.
 *
 * Dos desviaciones deliberadas del texto literal, ambas explicadas en detalle en
 * `content/psl-maternity-photographer.ts` (mismo patrón, ya aplicado ahí):
 *
 * 1. Las cuatro notas "coming soon" del deck (§2, líneas de Video Production y
 *    Maternity & Family) están escritas en español dentro de la sección en inglés del
 *    propio deck — un error de redacción del deck, no una decisión bilingüe a
 *    propósito (el resto de la sección EN es inglés de punta a punta). Se traducen aquí
 *    al inglés para no servir una página en inglés con una frase suelta en español.
 * 2. Los enlaces en línea de las FAQ #3 ("[See Port St. Lucie services →]") se
 *    mantienen como texto — `FAQ.astro` renderiza la respuesta como texto plano en las
 *    18 páginas ya construidas; añadir soporte de enlace en línea solo para dos
 *    preguntas de dos hubs no valía la pena frente a extenderlo genéricamente.
 */
import { paragraph, paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { HubPageContent } from '../lib/pageContent.ts';
import { getWhatsAppLink } from '../data/business.ts';

const EN: HubPageContent = {
  metaTitle: 'Photographer in West Palm Beach, FL | Wonderlands Studio',
  metaDescription:
    'Wedding, brand and family photography and video in West Palm Beach. Bilingual studio serving Palm Beach County. See services, pricing and recent work.',
  h1: 'Photographer and Videographer in West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio is a bilingual photography and video studio based in West Palm Beach, Florida, serving Palm Beach County. We specialize in weddings, brand and business content, and family sessions, with collections from $250 for portraits to $5,500 for full-day wedding coverage. Every session includes professional retouching. English and Spanish spoken. (561) 260-3245.',

  servicesHeading: 'What we shoot in West Palm Beach',
  cards: [
    {
      title: 'Weddings & Elopements',
      services: ['wedding-photographer', 'wedding-videographer'],
      description:
        'Editorial photography and cinematic film for Palm Beach County weddings, one team for both.',
      linkLabels: ['See wedding photography →', 'See wedding videography →'],
    },
    {
      title: 'Brand & Business Content',
      services: ['brand-photography'],
      description:
        'Headshots, real estate and personal branding photography, one-time or as a monthly content partnership.',
      linkLabels: ['See branding services →'],
    },
    {
      title: 'Video Production',
      services: ['video-production'],
      comingSoonBody: paragraphs([
        ['Commercial video, interviews and social content production for businesses.'],
        [
          'Page in progress — ',
          {
            text: 'check availability on WhatsApp',
            href: getWhatsAppLink(
              'Hi Wonderlands Studio — I would like to ask about video production services in West Palm Beach.',
              { source: 'site', medium: 'hub-card', campaign: 'wpb-hub-en' },
            ),
          },
          ' in the meantime.',
        ],
      ]),
    },
    {
      title: 'Quinceañeras',
      services: ['quinceanera-photographer'],
      comingSoonBody: paragraphs([
        [
          "Photography and film for the Quince celebration. Our quinceañera focus is currently strongest in Port St. Lucie — ",
          { text: 'see quinceañera coverage there →', href: '/port-st-lucie/#quinceanera' },
        ],
      ]),
    },
    {
      title: 'Maternity & Family',
      services: ['maternity-photographer'],
      comingSoonBody: paragraphs([
        ['Family, maternity and portrait sessions in our studio or on location.'],
        [
          'Page in progress — ',
          {
            text: 'check availability on WhatsApp',
            href: getWhatsAppLink(
              'Hi Wonderlands Studio — I would like to ask about maternity and family sessions in West Palm Beach.',
              { source: 'site', medium: 'hub-card', campaign: 'wpb-hub-en' },
            ),
          },
          ' in the meantime.',
        ],
      ]),
    },
  ],

  venuesHeading: 'Where we work in Palm Beach County',
  venuesBody: [
    paragraph([
      'The Breakers, the Flagler Museum, the Norton Museum of Art, the Kravis Center, Grandview Gardens, Worth Avenue, Clematis Street, and the downtown waterfront — plus Palm Beach Gardens, Wellington, Jupiter and Boca Raton, all with no travel fee.',
    ]),
  ],

  studioHeading: 'Our West Palm Beach studio',
  studioIntro:
    'Climate-controlled, cinematic lighting, optimized for newborn sessions and headshots alike.',
  directionsLabel: 'Get directions',

  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Do you have a physical studio in West Palm Beach?',
      answer:
        'Yes, our studio is based in West Palm Beach and we also shoot on location throughout Palm Beach County with no travel fee.',
    },
    {
      question: 'What services do you offer in West Palm Beach specifically?',
      answer:
        'Weddings, brand and business content are our primary focus in this market. We also cover family, maternity and portrait sessions, and quinceañeras on request.',
    },
    {
      question: 'Do you also work in Port St. Lucie?',
      answer:
        'Yes — Port St. Lucie is our second location, with its own studio and a focus on quinceañeras, maternity and family. See Port St. Lucie services.',
    },
  ],

  finalCta: {
    heading: 'Not sure which service fits?',
    body: "Tell us what you're planning and we'll point you to the right page — or just answer your questions directly.",
    label: 'WhatsApp (561) 260-3245',
    message: 'Hi Wonderlands Studio — I have a question about your services in West Palm Beach.',
  },

  breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'West Palm Beach' }],

  hero: {
    eyebrow: 'Bilingual photography & video studio',
    alt: 'Wonderlands Studio photography session in West Palm Beach, Florida',
  },
};

const ES: HubPageContent = {
  metaTitle: 'Fotógrafo en West Palm Beach, FL | Wonderlands Studio',
  metaDescription:
    'Fotografía y video de boda, marca y familia en West Palm Beach. Estudio bilingüe que atiende el condado de Palm Beach. Servicios, precios y trabajos recientes.',
  h1: 'Fotógrafo y Videógrafo en West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio es un estudio bilingüe de fotografía y video con sede en West Palm Beach, Florida, que atiende todo el condado de Palm Beach. Nos especializamos en bodas, contenido de marca y negocio, y sesiones familiares, con colecciones desde $250 para retratos hasta $5,500 para cobertura de boda de día completo. Cada sesión incluye retoque profesional. Atendemos en español e inglés. (561) 260-3245.',

  servicesHeading: 'Qué cubrimos en West Palm Beach',
  cards: [
    {
      title: 'Bodas y ceremonias civiles',
      services: ['wedding-photographer', 'wedding-videographer'],
      description:
        'Fotografía editorial y video cinematográfico para bodas en el condado de Palm Beach, un solo equipo para las dos cosas.',
      linkLabels: ['Ver fotografía de boda →', 'Ver video de boda →'],
    },
    {
      title: 'Marca y contenido de negocio',
      services: ['brand-photography'],
      description:
        'Headshots, bienes raíces y fotografía de marca personal, como sesión única o como alianza mensual de contenido.',
      linkLabels: ['Ver servicios de marca →'],
    },
    {
      title: 'Producción de video',
      services: ['video-production'],
      comingSoonBody: paragraphs([
        ['Video comercial, entrevistas y producción de contenido para redes sociales.'],
        [
          'Página en construcción — ',
          {
            text: 'consulta disponibilidad por WhatsApp',
            href: getWhatsAppLink(
              'Hola Wonderlands Studio — quisiera consultar sobre producción de video en West Palm Beach.',
              { source: 'site', medium: 'hub-card', campaign: 'wpb-hub-es' },
            ),
          },
          ' mientras tanto.',
        ],
      ]),
    },
    {
      title: 'Quinceañeras',
      services: ['quinceanera-photographer'],
      comingSoonBody: paragraphs([
        [
          'Fotografía y video para la celebración de Quince. Nuestro enfoque de quinceañeras es hoy más fuerte en Port St. Lucie — ',
          {
            text: 'ver cobertura de quinceañeras allá →',
            href: '/es/port-st-lucie/#quinceanera',
          },
        ],
      ]),
    },
    {
      title: 'Embarazo y familia',
      services: ['maternity-photographer'],
      comingSoonBody: paragraphs([
        ['Sesiones familiares, de embarazo y de retrato en nuestro estudio o en locación.'],
        [
          'Página en construcción — ',
          {
            text: 'consulta disponibilidad por WhatsApp',
            href: getWhatsAppLink(
              'Hola Wonderlands Studio — quisiera consultar sobre sesiones de embarazo y familia en West Palm Beach.',
              { source: 'site', medium: 'hub-card', campaign: 'wpb-hub-es' },
            ),
          },
          ' mientras tanto.',
        ],
      ]),
    },
  ],

  venuesHeading: 'Dónde trabajamos en el condado de Palm Beach',
  venuesBody: [
    paragraph([
      'The Breakers, el Flagler Museum, el Norton Museum of Art, el Kravis Center, Grandview Gardens, Worth Avenue, Clematis Street y el waterfront del downtown — más Palm Beach Gardens, Wellington, Jupiter y Boca Raton, todo sin cargo por traslado.',
    ]),
  ],

  studioHeading: 'Nuestro estudio en West Palm Beach',
  studioIntro:
    'Con climatización e iluminación cinematográfica, optimizado tanto para sesiones de recién nacidos como para headshots.',
  directionsLabel: 'Cómo llegar',

  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Tienen un estudio físico en West Palm Beach?',
      answer:
        'Sí, nuestro estudio está en West Palm Beach y también trabajamos en locación en todo el condado de Palm Beach, sin cargo por traslado.',
    },
    {
      question: '¿Qué servicios ofrecen específicamente en West Palm Beach?',
      answer:
        'Bodas y contenido de marca y negocio son nuestro enfoque principal en este mercado. También cubrimos sesiones familiares, de embarazo y de retrato, y quinceañeras bajo pedido.',
    },
    {
      question: '¿También trabajan en Port St. Lucie?',
      answer:
        'Sí — Port St. Lucie es nuestra segunda sede, con su propio estudio y un enfoque en quinceañeras, embarazo y familia. Ver servicios en Port St. Lucie.',
    },
  ],

  finalCta: {
    heading: '¿No sabes qué servicio te conviene?',
    body: 'Cuéntanos qué estás planeando y te guiamos a la página correcta — o respondemos tus preguntas directamente.',
    label: 'WhatsApp (561) 260-3245',
    message: 'Hola Wonderlands Studio — tengo una pregunta sobre sus servicios en West Palm Beach.',
  },

  breadcrumbs: [{ name: 'Inicio', path: '/es/' }, { name: 'West Palm Beach' }],

  hero: {
    eyebrow: 'Estudio bilingüe de fotografía y video',
    alt: 'Sesión de fotografía de Wonderlands Studio en West Palm Beach, Florida',
  },
};

export const HUB_WPB: Readonly<Record<Lang, HubPageContent>> = { en: EN, es: ES };
