/**
 * Contenido de `/west-palm-beach/wedding-photographer/` y su par español.
 *
 * Texto **literal** de `docs/copy/wpb-wedding-photographer-copydeck.md`. No se reescribe
 * ni se resume nada: el deck está aprobado y es la fuente. Lo único que no viene de ahí
 * son los precios, que se leen de `data/pricing.ts` (regla 2 de CLAUDE.md).
 *
 * La forma imita la que devolverá `servicePageQuery` de Sanity, para que conectar el CMS
 * sea sustituir el import y no reescribir la página.
 */
import { paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { PageContent } from '../lib/pageContent.ts';

export type { ProseSectionContent, StepsSectionContent, SectionContent, PageContent } from '../lib/pageContent.ts';

const EN: PageContent = {
  metaTitle: 'Wedding Photographer in West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Bilingual wedding photographer in West Palm Beach. Editorial photo and cinema coverage from $1,200. Transparent pricing, real galleries, no travel fees.',
  h1: 'Wedding Photographer in West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio is a bilingual wedding photography and cinema studio based in West Palm Beach, Florida. We photograph weddings and elopements across Palm Beach County, with collections from $1,200 for intimate ceremonies to $5,500 for full-day luxury coverage. Every collection includes high-end retouching and a private gallery. English and Spanish spoken throughout. Call (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Photo and cinema, from one team',
      body: paragraphs([
        [
          'Most couples in Palm Beach hire a photographer and then scramble to find a videographer who works well beside them. We do both. One team, one creative direction, one contract — and no two vendors competing for the same three feet of aisle. The photographs are editorial and unhurried; the film is cinematic, cut with your real vows and your real voices.',
        ],
        [
          'If film is what you care about most, start on our ',
          {
            text: 'West Palm Beach wedding videography page',
            href: '/west-palm-beach/wedding-videographer/',
          },
          ' instead. Same team, different emphasis.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Venues we cover in Palm Beach County',
      body: paragraphs([
        [
          'We shoot throughout West Palm Beach and Palm Beach Island with no travel fee: The Breakers, the Flagler Museum, the Norton Museum of Art, the Kravis Center, Grandview Gardens, the Ann Norton Sculpture Gardens, Worth Avenue, Clematis Street and the downtown waterfront. We also cover Palm Beach Gardens, Wellington, Jupiter and Boca Raton.',
        ],
        [
          'For weddings north of the county line, see our ',
          { text: 'Port St. Lucie wedding coverage', href: '/port-st-lucie/#wedding' },
          '.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Wedding collections and pricing',
    note: 'Prices are current and complete. No hidden fees for local venues in Palm Beach County.',
    afterTable: paragraphs([
      [
        'Most couples choose The Essential Story. The step from photography-only to photography plus film is $650 — deliberately small, because we would rather film your wedding than not.',
      ],
      [
        'Every collection includes professional retouching, a private online gallery in high resolution and web size, and a 3-week delivery window for the full gallery. Social-ready vertical clips are delivered in 24–48 hours.',
      ],
    ]),
    addOns:
      'Add-ons: second photographer $500 · additional hour · printed albums · engagement session · rehearsal-dinner coverage.',
    ctaLabel: 'Check your date on WhatsApp',
    ctaMessage:
      'Hi Wonderlands Studio — I would like to check your availability for my wedding in West Palm Beach.',
  },

  sectionsAfterPricing: [
    {
      kind: 'steps',
      heading: 'How booking works',
      steps: [
        {
          lead: 'Message us',
          rest: 'with your date and venue. We answer in Spanish or English, whichever you prefer.',
        },
        {
          lead: 'We send a proposal',
          rest: 'with the collections that fit your day — usually within 24 hours.',
        },
        {
          lead: 'Reserve the date',
          rest: 'with a 50% deposit. Zelle, cash and all major credit cards accepted, and we offer monthly payment plans for full collections.',
        },
        {
          lead: 'We plan the timeline together',
          rest: 'so the photography never runs the day.',
        },
        {
          lead: 'You receive your gallery',
          rest: 'in 3 weeks; vertical clips in 24–48 hours.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'About Lisandra',
      body: paragraphs([
        [
          'Lisandra is the creative director and lead photographer at Wonderlands Studio. She is a mother, which is roughly why nobody in front of her camera ends up looking stiff, and she directs in Spanish and English without ever making anyone feel like the odd one out at their own wedding. ',
          { text: 'Read more about her work →', href: '/about-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'What couples say',
  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question:
        'How far in advance should I book a wedding photographer in West Palm Beach?',
      answer:
        'Peak season here runs November through April, and Saturdays in that window are usually gone 9 to 12 months out. Summer and weekday weddings are often available with 3 to 4 months’ notice. If your date is close, message us anyway — we hold a small number of short-notice dates each month.',
    },
    {
      question: 'Do you charge travel fees for Palm Beach venues?',
      answer:
        'No. Everything in Palm Beach County is covered with no travel fee, and the same applies to Port St. Lucie, where we have our second location. For weddings elsewhere in Florida we include travel in the proposal so there are no surprises.',
    },
    {
      question: 'Can we hire photography only and add film later?',
      answer:
        'Yes, up until roughly 60 days before the wedding, subject to team availability. Adding film after booking costs the difference between collections — there is no penalty for changing your mind. It is far easier than trying to find a second vendor late.',
    },
    {
      question: 'Do you offer a bilingual ceremony experience?',
      answer:
        'Yes, fully. Direction, family group shots and all coordination happen in Spanish or English as needed. In practice this matters most during formal portraits, when there are relatives who simply will not follow instructions in English — and that is exactly where the day tends to lose twenty minutes.',
    },
    {
      question: 'What happens if it rains?',
      answer:
        'Florida weather is what it is. We plan indoor and covered alternatives with your venue during the timeline meeting, and we carry lighting that makes an indoor plan B look intentional rather than salvaged.',
    },
    {
      question: 'Do you shoot a second photographer?',
      answer:
        'It is included in The Tradition and the Luxury Collection, and available as a $500 add-on on any other collection. We recommend it for guest counts above 120, or whenever getting-ready happens in two separate locations.',
    },
  ],

  finalCta: {
    heading: 'Check your date.',
    body: 'Send us your wedding date and venue and we will confirm availability the same day — usually within a couple of hours.',
    label: 'WhatsApp (561) 260-3245',
    message:
      'Hi Wonderlands Studio — I would like to confirm availability for my wedding date.',
  },

  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'West Palm Beach', path: '/west-palm-beach/' },
    { name: 'Wedding Photographer' },
  ],

  hero: {
    eyebrow: 'Bilingual wedding photography and cinema',
    alt: 'Bride and groom during golden hour portraits in West Palm Beach, Florida',
  },
};

const ES: PageContent = {
  metaTitle: 'Fotógrafo de Bodas en West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Fotógrafo de bodas bilingüe en West Palm Beach. Fotografía editorial y video cinematográfico desde $1,200. Precios claros y sin cargos por traslado local.',
  h1: 'Fotógrafo de Bodas en West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio es un estudio bilingüe de fotografía y video de bodas en West Palm Beach, Florida. Cubrimos bodas y ceremonias civiles en todo el condado de Palm Beach, con colecciones desde $1,200 para bodas íntimas hasta $5,500 para cobertura de día completo. Todas incluyen retoque profesional y galería privada. Atendemos en español e inglés. Llama al (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Foto y video con un solo equipo',
      body: paragraphs([
        [
          'La mayoría de las parejas contrata al fotógrafo primero y después sale a buscar un videógrafo a las carreras, esperando que los dos se lleven bien el día de la boda. Nosotros hacemos las dos cosas. Un solo equipo, una sola dirección creativa, un solo contrato — y nadie peleándose el mismo metro de pasillo.',
        ],
        [
          'Si lo que más te importa es el video, entra directamente a ',
          {
            text: 'video de bodas en West Palm Beach',
            href: '/es/west-palm-beach/videografo-de-bodas/',
          },
          '.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Dónde cubrimos en el condado de Palm Beach',
      body: paragraphs([
        [
          'Trabajamos en todo West Palm Beach y Palm Beach Island sin cargo por traslado: The Breakers, Flagler Museum, Norton Museum of Art, Kravis Center, Grandview Gardens, Ann Norton Sculpture Gardens, Worth Avenue, Clematis Street y el waterfront del downtown. También cubrimos Palm Beach Gardens, Wellington, Jupiter y Boca Raton.',
        ],
        [
          'Si tu boda es más al norte, mira nuestra ',
          {
            text: 'cobertura de bodas en Port St. Lucie',
            href: '/es/port-st-lucie/#wedding',
          },
          '.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Colecciones y precios',
    note: 'Precios completos y actuales. Sin cargos escondidos en locaciones del condado.',
    afterTable: paragraphs([
      [
        'La mayoría elige The Essential Story. De solo foto a foto con video hay $650 de diferencia — a propósito, porque preferimos filmar tu boda a no filmarla.',
      ],
      [
        'Todas incluyen retoque profesional, galería privada en alta resolución y tamaño web, y entrega en 3 semanas. Los clips verticales para redes salen en 24–48 horas.',
      ],
    ]),
    addOns:
      'Adicionales: segundo fotógrafo $500 · hora extra · álbumes impresos · sesión de compromiso · cobertura de la cena de ensayo.',
    ctaLabel: 'Consultar tu fecha por WhatsApp',
    ctaMessage:
      'Hola Wonderlands Studio — quisiera consultar disponibilidad para mi boda en West Palm Beach.',
  },

  sectionsAfterPricing: [
    {
      kind: 'steps',
      heading: 'Cómo se reserva',
      steps: [
        { lead: 'Escríbenos', rest: 'tu fecha y locación. Te respondemos en español.' },
        {
          lead: 'Te enviamos la propuesta',
          rest: 'con las colecciones que encajan en tu día, normalmente en menos de 24 horas.',
        },
        {
          lead: 'Reservas la fecha',
          rest: 'con el 50%. Aceptamos Zelle, efectivo y todas las tarjetas, y damos planes de pago mensuales para las colecciones completas.',
        },
        {
          lead: 'Armamos el cronograma juntos',
          rest: 'para que las fotos no se coman la fiesta.',
        },
        {
          lead: 'Recibes tu galería',
          rest: 'en 3 semanas; los clips verticales en 24–48 horas.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Sobre Lisandra',
      body: paragraphs([
        [
          'Lisandra es directora creativa y fotógrafa principal de Wonderlands Studio. Es mamá, que es más o menos la razón por la que nadie termina saliendo tieso en sus fotos, y dirige en español y en inglés sin que ningún familiar quede fuera de la conversación el día de su propia boda. ',
          { text: 'Conoce más de su trabajo →', href: '/es/sobre-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'Lo que dicen las parejas',
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question:
        '¿Con cuánta anticipación debo reservar un fotógrafo de bodas en West Palm Beach?',
      answer:
        'La temporada alta aquí va de noviembre a abril, y los sábados de esos meses suelen agotarse con 9 a 12 meses de anticipación. Verano y bodas entre semana se consiguen con 3 o 4 meses. Si tu fecha está cerca, escríbenos igual: guardamos algunas fechas de última hora cada mes.',
    },
    {
      question: '¿Cobran traslado a las locaciones de Palm Beach?',
      answer:
        'No. Todo el condado de Palm Beach va sin cargo por traslado, igual que Port St. Lucie, donde tenemos nuestra segunda ubicación. Para bodas en otras partes de Florida el traslado va incluido en la propuesta, sin sorpresas después.',
    },
    {
      question: '¿Puedo contratar solo fotografía y agregar video más adelante?',
      answer:
        'Sí, hasta unos 60 días antes de la boda y sujeto a disponibilidad del equipo. Agregar video después cuesta la diferencia entre colecciones, sin penalidad. Es mucho más fácil que salir a buscar otro proveedor a última hora.',
    },
    {
      question: '¿Atienden en español durante toda la boda?',
      answer:
        'Completamente. La dirección, las fotos de familia y toda la coordinación se hacen en español o inglés según haga falta. Donde más se nota es en las fotos formales con la familia: ahí es donde normalmente se pierden veinte minutos cuando alguien no entiende las instrucciones.',
    },
    {
      question: '¿Qué pasa si llueve el día de la boda?',
      answer:
        'Es Florida. En la reunión de cronograma dejamos definido el plan B bajo techo con tu locación, y llevamos iluminación propia para que el interior se vea intencional y no improvisado.',
    },
    {
      question: '¿Trabajan con segundo fotógrafo?',
      answer:
        'Va incluido en The Tradition y en la Colección de Lujo, y se puede agregar por $500 a cualquier otra. Lo recomendamos si hay más de 120 invitados o si los preparativos son en dos lugares distintos.',
    },
  ],

  finalCta: {
    heading: 'Consulta tu fecha.',
    body: 'Mándanos la fecha y el lugar de tu boda y te confirmamos disponibilidad el mismo día.',
    label: 'WhatsApp (561) 260-3245',
    message:
      'Hola Wonderlands Studio — quisiera confirmar disponibilidad para la fecha de mi boda.',
  },

  breadcrumbs: [
    { name: 'Inicio', path: '/es/' },
    { name: 'West Palm Beach', path: '/es/west-palm-beach/' },
    { name: 'Fotógrafo de Bodas' },
  ],

  hero: {
    eyebrow: 'Fotografía y video de bodas, bilingüe',
    alt: 'Novios en sesión de retratos al atardecer en West Palm Beach, Florida',
  },
};

export const WPB_WEDDING_PHOTOGRAPHER: Readonly<Record<Lang, PageContent>> = {
  en: EN,
  es: ES,
};
