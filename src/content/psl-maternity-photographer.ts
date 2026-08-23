/**
 * Contenido de `/port-st-lucie/maternity-photographer/` y su par español.
 *
 * Texto literal de `docs/copy/psl-maternity-photographer-copydeck.md`. `pageType: event`
 * igual que boda — el mismo `ServicePageTemplate` sirve sin cambios, que es justo lo que
 * este deck existe para validar (§0 del deck). Sin página hermana: maternidad no tiene
 * split foto/video, así que `relatedServicePath` no se pasa.
 *
 * Una desviación deliberada del texto literal del deck: el párrafo-respuesta y el CTA
 * final del deck terminan en `{{PSL_PHONE_772}}` — el teléfono propio de PSL todavía sin
 * confirmar (`src/data/business.ts`). Regla 4 de CLAUDE.md: un token sin resolver que
 * llegue a `dist/` aborta el build, así que copiarlo literal aquí no es una opción. En
 * vez de inventar un número, el párrafo-respuesta cierra sin ese teléfono y el CTA usa
 * el WhatsApp del negocio, que es el mismo para las dos sedes y ya está confirmado
 * (`BUSINESS.whatsapp` en `business.ts`) — es el canal que el botón realmente marca.
 */
import { paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { PageContent } from '../lib/pageContent.ts';

const EN: PageContent = {
  metaTitle: 'Maternity Photographer in Port St. Lucie | Wonderlands Studio',
  metaDescription:
    'Bilingual maternity photography in Port St. Lucie, FL. Editorial sessions from $500, with photo + video + follow-up available. Studio or on location.',
  h1: 'Maternity Photographer in Port St. Lucie, FL',
  answerParagraph:
    'Wonderlands Studio photographs maternity sessions in Port St. Lucie, Florida, from our studio near Tradition. Collections start at $500 for an editorial photography session, with a $1,450 option that adds cinematic video and a follow-up session after birth. Every session includes wardrobe guidance, professional retouching and a private gallery. Bilingual studio.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'An editorial session, not a snapshot',
      body: paragraphs([
        [
          "We direct every maternity session the way we'd direct an editorial shoot: curated wardrobe options, deliberate posing that photographs well even for clients who've never been in front of a camera, and light shaped for a magazine-quality finish rather than a flat studio backdrop. Whether that's our climate-controlled studio or a scenic outdoor location around Port St. Lucie, the direction is the same.",
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Two ways to document this season',
      body: paragraphs([
        [
          { text: 'Esencia de Vida', bold: true },
          " is a single editorial session — the classic maternity gallery, timed for around 32 to 36 weeks when the belly is at its most photogenic and you're still comfortable enough for a full session.",
        ],
        [
          { text: 'Raíces Eternas', bold: true },
          ' goes further: it pairs the maternity session with a short cinematic video and a follow-up session once the baby arrives, so the pregnancy and the first meeting become one continuous story instead of two separate purchases months apart.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Collections and pricing',
    note: 'Complete pricing. No hidden fees for Port St. Lucie and Tradition-area locations.',
    afterTable: paragraphs([
      [
        'Both collections include professional retouching and delivery in your private online gallery, in high resolution and web size.',
      ],
    ]),
    addOns:
      'Add-ons: partner and sibling portraits · additional wardrobe change · extended session time · printed prints and albums.',
    ctaLabel: 'Check availability on WhatsApp',
    ctaMessage:
      'Hi Wonderlands Studio — I would like to check availability for a maternity session in Port St. Lucie.',
    portfolioLink: { label: 'See recent maternity work', href: '/portfolio/maternity/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'prose',
      heading: 'Studio or on location',
      body: paragraphs([
        [
          { text: 'In our studio: ', bold: true },
          'climate-controlled, with cinematic lighting built for this kind of session — useful if the Florida heat makes an outdoor session at 34 weeks less appealing than it sounds.',
        ],
        [
          { text: 'On location: ', bold: true },
          'the golden hour light around Port St. Lucie and Tradition Square, scenic parks, and beach access nearby. We help you choose based on the season and how you\'re feeling, not just what looks best in a portfolio.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'When to book',
      body: paragraphs([
        [
          "Most clients book between 28 and 32 weeks and shoot between 32 and 36, which gives enough lead time to plan wardrobe and enough belly to make the photos feel like a real milestone rather than an early guess. If you're past that window, message us anyway — a session works right up until close to your due date, we just plan it a little differently.",
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'About Lisandra',
      body: paragraphs([
        [
          "Lisandra approaches maternity sessions with the same patience she brings to newborn photography — unhurried, warm, and used to working with clients who are tired, swollen-ankled, and not entirely sure they want to be photographed right now. Most leave glad they did it anyway. ",
          { text: 'Read more about her work →', href: '/about-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'What clients say',
  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'What week of pregnancy is best for a maternity session?',
      answer:
        "Between 32 and 36 weeks is the sweet spot for most people — the belly is fully shaped and you're usually still comfortable enough for a full session. Twins or higher-risk pregnancies often shoot a little earlier; we plan that with you individually.",
    },
    {
      question: 'What should I wear, and do you provide wardrobe?',
      answer:
        "We provide guidance on silhouettes and colors that photograph well, and can suggest options if you don't already have something in mind. Flowing fabrics and fitted pieces both work — it depends on the mood you want, studio-editorial or soft and natural.",
    },
    {
      question: 'Can my partner and other children be in some of the photos?',
      answer:
        'Yes, and we recommend it. Family portraits are included as part of a full session; just let us know when you book so we plan enough time for both the solo and family portions.',
    },
    {
      question: 'What does Raíces Eternas actually include, step by step?',
      answer:
        'The maternity session first, at 32 to 36 weeks, with cinematic video included alongside the photography. Once your baby arrives, you schedule the follow-up newborn session, usually within the first two weeks. You end up with one continuous visual story instead of booking two separate services months apart.',
    },
    {
      question: 'Do you shoot in the studio or do I have to go outdoors?',
      answer:
        'Either. Our Port St. Lucie studio is climate-controlled, which matters more than it sounds like in Florida summer. Outdoor sessions happen at golden hour, when the light and the heat both cooperate.',
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'As soon as you know your due date, if you have a specific week in mind — maternity dates are more flexible than wedding dates, but the popular 32-to-36-week window fills up during peak baby season (roughly the same months as wedding season, since babies follow weddings by about nine months).',
    },
  ],

  finalCta: {
    heading: 'Ready to document this season?',
    body: "Send us your due date and we'll help you find the right week to book.",
    label: 'WhatsApp +1 561 260 3245',
    message:
      'Hi Wonderlands Studio — I would like to check availability for a maternity session in Port St. Lucie.',
  },

  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Port St. Lucie', path: '/port-st-lucie/' },
    { name: 'Maternity Photographer' },
  ],

  hero: {
    eyebrow: 'Maternity photography, bilingual studio',
    alt: 'Editorial maternity photography session in Port St. Lucie, Florida',
  },
};

const ES: PageContent = {
  metaTitle: 'Fotógrafo de Embarazo en Port St. Lucie | Wonderlands Studio',
  metaDescription:
    'Fotografía de embarazo bilingüe en Port St. Lucie, FL. Sesiones editoriales desde $500, con opción de foto + video + seguimiento. Estudio o en locación.',
  h1: 'Fotógrafo de Embarazo en Port St. Lucie, FL',
  answerParagraph:
    'Wonderlands Studio fotografía sesiones de embarazo en Port St. Lucie, Florida, desde nuestro estudio cerca de Tradition. Las colecciones empiezan en $500 por una sesión editorial de fotografía, con una opción de $1,450 que suma video cinematográfico y una sesión de seguimiento después del nacimiento. Cada sesión incluye guía de vestuario, retoque profesional y galería privada. Estudio bilingüe.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Una sesión editorial, no una foto rápida',
      body: paragraphs([
        [
          'Dirigimos cada sesión de embarazo como dirigiríamos una producción editorial: opciones de vestuario cuidadas, poses pensadas que se ven bien incluso si nunca has estado frente a una cámara, y luz trabajada para un acabado de revista en vez de un fondo plano de estudio. Ya sea en nuestro estudio con climatización o en una locación al aire libre en Port St. Lucie, la dirección es la misma.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Dos formas de documentar esta etapa',
      body: paragraphs([
        [
          { text: 'Esencia de Vida', bold: true },
          ' es una sola sesión editorial — la galería clásica de embarazo, programada alrededor de las semanas 32 a 36, cuando la pancita está en su punto más fotogénico y todavía estás cómoda para una sesión completa.',
        ],
        [
          { text: 'Raíces Eternas', bold: true },
          ' va más allá: une la sesión de embarazo con un video corto y cinematográfico y una sesión de seguimiento cuando llega el bebé, para que el embarazo y el primer encuentro se conviertan en una sola historia continua —de mamá a familia— en vez de dos compras separadas meses después.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Colecciones y precios',
    note: 'Precios completos. Sin cargos ocultos en Port St. Lucie y alrededores de Tradition.',
    afterTable: paragraphs([
      [
        'Ambas colecciones incluyen retoque profesional y entrega en tu galería privada en línea, en alta resolución y tamaño web.',
      ],
    ]),
    addOns:
      'Adicionales: retratos de pareja y hermanos · cambio de vestuario adicional · tiempo extendido de sesión · impresiones y álbumes.',
    ctaLabel: 'Consulta disponibilidad por WhatsApp',
    ctaMessage:
      'Hola Wonderlands Studio — quisiera consultar disponibilidad para una sesión de embarazo en Port St. Lucie.',
    portfolioLink: { label: 'Ver trabajos recientes de embarazo', href: '/es/portafolio/maternidad/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'prose',
      heading: 'En estudio o en locación',
      body: paragraphs([
        [
          { text: 'En nuestro estudio: ', bold: true },
          'con climatización e iluminación cinematográfica pensada para este tipo de sesión — útil cuando el calor de Florida hace que una sesión al aire libre a las 34 semanas suene menos atractiva de lo que parece.',
        ],
        [
          { text: 'En locación: ', bold: true },
          'la luz dorada de Port St. Lucie y Tradition Square, parques con buena vista y acceso cercano a la playa. Te ayudamos a elegir según la temporada y cómo te sientas, no solo lo que se ve mejor en un portafolio.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Cuándo reservar',
      body: paragraphs([
        [
          'La mayoría reserva entre las semanas 28 y 32 y hace la sesión entre la 32 y la 36, lo que da tiempo suficiente para planear el vestuario y suficiente pancita para que las fotos se sientan como un hito real y no como una apuesta temprana. Si ya pasaste esa ventana, escríbenos de todas formas — una sesión funciona hasta cerca de la fecha de parto, solo la planeamos distinto.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Sobre Lisandra',
      body: paragraphs([
        [
          'Lisandra trabaja las sesiones de embarazo con la misma paciencia que le pone a la fotografía de recién nacidos — sin prisa, cálida, y acostumbrada a trabajar con clientas cansadas, con los tobillos hinchados, y no muy convencidas de querer que las fotografíen justo ahora. La mayoría termina contenta de haberlo hecho. ',
          { text: 'Conoce más de su trabajo →', href: '/es/sobre-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'Lo que dicen las clientas',
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Qué semana del embarazo es mejor para la sesión?',
      answer:
        'Entre la semana 32 y la 36 es el punto ideal para la mayoría — la pancita ya tiene su forma completa y normalmente todavía estás cómoda para una sesión completa. Embarazos de gemelos o de mayor riesgo suelen hacerse un poco antes; eso lo planeamos contigo de forma individual.',
    },
    {
      question: '¿Qué me pongo, y ustedes dan el vestuario?',
      answer:
        'Te damos guía sobre siluetas y colores que se ven bien en cámara, y podemos sugerir opciones si todavía no tienes nada en mente. Telas fluidas y prendas ajustadas funcionan las dos — depende del ambiente que quieras, editorial de estudio o algo suave y natural.',
    },
    {
      question: '¿Pueden salir mi pareja y mis otros hijos en algunas fotos?',
      answer:
        'Sí, y lo recomendamos. Los retratos familiares están incluidos en una sesión completa; solo avísanos al reservar para planear tiempo suficiente para la parte individual y la familiar.',
    },
    {
      question: '¿Qué incluye exactamente Raíces Eternas, paso a paso?',
      answer:
        'Primero la sesión de embarazo, entre la semana 32 y la 36, con video cinematográfico incluido junto con la fotografía. Cuando llega tu bebé, agendas la sesión de seguimiento de recién nacido, normalmente dentro de las primeras dos semanas. Terminas con una sola historia visual continua en vez de reservar dos servicios separados con meses de diferencia.',
    },
    {
      question: '¿Hacen las sesiones en estudio o tengo que salir al aire libre?',
      answer:
        'Las dos opciones. Nuestro estudio en Port St. Lucie tiene climatización, que importa más de lo que suena en el verano de Florida. Las sesiones al aire libre se hacen a la hora dorada, cuando la luz y el calor cooperan los dos.',
    },
    {
      question: '¿Con cuánta anticipación debo reservar?',
      answer:
        'Apenas sepas tu fecha probable de parto, si ya tienes una semana específica en mente — las fechas de embarazo son más flexibles que las de boda, pero la ventana popular de la semana 32 a la 36 se llena durante la temporada alta de bebés (más o menos los mismos meses que la temporada de bodas, porque los bebés llegan unos nueve meses después de las bodas).',
    },
  ],

  finalCta: {
    heading: '¿Lista para documentar esta etapa?',
    body: 'Mándanos tu fecha probable de parto y te ayudamos a encontrar la semana correcta para reservar.',
    label: 'WhatsApp +1 561 260 3245',
    message:
      'Hola Wonderlands Studio — quisiera consultar disponibilidad para una sesión de embarazo en Port St. Lucie.',
  },

  breadcrumbs: [
    { name: 'Inicio', path: '/es/' },
    { name: 'Port St. Lucie', path: '/es/port-st-lucie/' },
    { name: 'Fotógrafo de Embarazo' },
  ],

  hero: {
    eyebrow: 'Fotografía de embarazo, estudio bilingüe',
    alt: 'Sesión editorial de fotografía de embarazo en Port St. Lucie, Florida',
  },
};

export const PSL_MATERNITY_PHOTOGRAPHER: Readonly<Record<Lang, PageContent>> = {
  en: EN,
  es: ES,
};
