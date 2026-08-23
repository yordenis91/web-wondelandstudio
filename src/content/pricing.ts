/**
 * Contenido de `/pricing/` y su par español `/es/precios/`.
 *
 * Texto literal de `docs/copy/pricing-copydeck.md`. `pageType: aggregate` — la única
 * página que muestra el catálogo completo (los cuatro `pageType` a la vez) en un solo
 * lugar, sin redeclarar ni un precio: cada sección referencia su página hoja por link
 * visible, y el JSON-LD la referencia por `@id` (`AggregatePageTemplate.astro`).
 */
import type { Lang } from '../i18n/routes.ts';
import type { AggregatePageContent } from '../lib/pageContent.ts';

const EN: AggregatePageContent = {
  metaTitle: 'Pricing | Wonderlands Studio',
  metaDescription:
    'Complete pricing for weddings, quinceañeras, maternity, family and branding photography and video in West Palm Beach and Port St. Lucie. No hidden fees.',
  h1: 'Pricing',
  answerParagraph:
    'Wonderlands Studio publishes complete pricing for every service: wedding collections from $1,200 to $5,500, quinceañeras from $950 to $3,200, maternity from $500, family sessions from $350, and branding from $700 one-time or $500 to $3,500 a month. All prices include professional retouching and a private gallery. No hidden fees for local venues in Palm Beach County or Port St. Lucie.',

  howToReadHeading: 'How to read this page',
  howToReadBody:
    "Every collection below shows exactly what's included — hours, deliverables, add-ons. Prices are the same whether you book in West Palm Beach or Port St. Lucie; only travel outside our two coverage areas changes the number, and that's always quoted separately in writing before you book.",

  weddings: {
    heading: 'Weddings & Elopements',
    linkLabel: 'Full wedding details →',
    linkHref: '/west-palm-beach/wedding-photographer/',
  },
  quinceaneras: {
    heading: 'Quinceañeras',
    note: 'Currently our strongest quinceañera coverage is in Port St. Lucie.',
    linkLabel: 'Quinceañera details →',
    linkHref: '/port-st-lucie/#quinceanera',
  },
  maternityFamily: { heading: 'Maternity & Family' },
  socialEvents: { heading: 'Social Events' },
  branding: {
    heading: 'Brand & Business Content',
    sessionsHeading: 'One-time sessions',
    monthlyHeading: 'Monthly content partnership',
    monthlyNote: 'Billed monthly, cancel with 30 days notice.',
    levelLabel: 'Track',
    photoLabel: 'Photo-led',
    videoLabel: 'Video-led',
    linkLabel: 'Full branding details →',
    linkHref: '/west-palm-beach/brand-photography/',
  },

  alwaysIncludedHeading: "What's always included",
  alwaysIncludedBody:
    'Professional retouching · private online gallery · high resolution and web-size files · bilingual service throughout · no travel fees within Palm Beach County or Port St. Lucie.',

  paymentHeading: 'Payment',
  paymentBody:
    '50% deposit to reserve your date, balance due on the day. We accept Zelle, cash and all major credit cards, and offer monthly payment plans for full collections and large event packages.',

  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Are these the final prices, or is there a deposit and extra fees?',
      answer:
        'These are complete collection prices. A 50% deposit secures your date; the balance is due on the day. There are no hidden fees for venues within Palm Beach County or Port St. Lucie — travel outside those areas is quoted separately, in writing, before you book.',
    },
    {
      question:
        'Why is there such a small price difference between photo-only and photo+video collections?',
      answer:
        "Because we'd rather film your event than not. Across every category — weddings, quinceañeras, social events — we deliberately kept the step up to include video small, so it's an easy yes rather than a separate purchase.",
    },
    {
      question: 'Do West Palm Beach and Port St. Lucie have different prices?',
      answer:
        "No. Pricing is the same in both locations. What differs is which services we currently emphasize in each market — quinceañeras and maternity are strongest in Port St. Lucie, weddings and branding in West Palm Beach — but the prices themselves don't change.",
    },
    {
      question:
        'Can I combine services, like a maternity session and a birth announcement package?',
      answer:
        "Yes. Message us with what you're planning and we'll build a custom proposal — this is common enough that we quote it as routine, not as a special request.",
    },
    {
      question: 'Do you offer payment plans?',
      answer:
        "Yes, for full wedding, quinceañera and branding collections. Ask when you request your proposal and we'll lay out a monthly schedule that fits your date.",
    },
  ],

  finalCta: {
    heading: 'Still not sure what fits?',
    body: "Tell us what you're planning and we'll recommend the right collection — no pressure, no obligation.",
    label: 'WhatsApp (561) 260-3245',
    message: 'Hi Wonderlands Studio — I have a question about pricing.',
  },

  breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Pricing' }],

  hero: {
    eyebrow: 'Complete pricing, no hidden fees',
    alt: 'A printed Wonderlands Studio album and proof prints',
  },
};

const ES: AggregatePageContent = {
  metaTitle: 'Precios | Wonderlands Studio',
  metaDescription:
    'Precios completos de bodas, quinceañeras, embarazo, familia y fotografía de marca en West Palm Beach y Port St. Lucie. Sin cargos ocultos.',
  h1: 'Precios',
  answerParagraph:
    'Wonderlands Studio publica precios completos para cada servicio: colecciones de boda desde $1,200 hasta $5,500, quinceañeras desde $950 hasta $3,200, embarazo desde $500, sesiones familiares desde $350, y marca desde $700 por sesión única o de $500 a $3,500 al mes. Todos los precios incluyen retoque profesional y galería privada. Sin cargos ocultos en locaciones del condado de Palm Beach o Port St. Lucie.',

  howToReadHeading: 'Cómo leer esta página',
  howToReadBody:
    'Cada colección de abajo muestra exactamente qué incluye — horas, entregables, adicionales. Los precios son los mismos si reservas en West Palm Beach o en Port St. Lucie; solo el traslado fuera de nuestras dos zonas de cobertura cambia el número, y eso siempre se cotiza por separado y por escrito antes de reservar.',

  weddings: {
    heading: 'Bodas y ceremonias civiles',
    linkLabel: 'Detalles completos de boda →',
    linkHref: '/es/west-palm-beach/fotografo-de-bodas/',
  },
  quinceaneras: {
    heading: 'Quinceañeras',
    note: 'Nuestra cobertura de quinceañeras es hoy más fuerte en Port St. Lucie.',
    linkLabel: 'Detalles de quinceañeras →',
    linkHref: '/es/port-st-lucie/#quinceanera',
  },
  maternityFamily: { heading: 'Embarazo y Familia' },
  socialEvents: { heading: 'Eventos sociales' },
  branding: {
    heading: 'Marca y contenido de negocio',
    sessionsHeading: 'Sesiones únicas',
    monthlyHeading: 'Socio de contenido mensual',
    monthlyNote: 'Facturado cada mes, se cancela con 30 días de aviso.',
    levelLabel: 'Línea',
    photoLabel: 'Enfoque en foto',
    videoLabel: 'Enfoque en video',
    linkLabel: 'Detalles completos de marca →',
    linkHref: '/es/west-palm-beach/fotografia-de-marca/',
  },

  alwaysIncludedHeading: 'Qué siempre incluye',
  alwaysIncludedBody:
    'Retoque profesional · galería privada en línea · archivos en alta resolución y tamaño web · atención bilingüe en todo momento · sin cargos por traslado dentro del condado de Palm Beach o Port St. Lucie.',

  paymentHeading: 'Forma de pago',
  paymentBody:
    '50% de depósito para reservar tu fecha, el resto se paga el día del evento. Aceptamos Zelle, efectivo y todas las tarjetas principales, y ofrecemos planes de pago mensuales para colecciones completas y paquetes de eventos grandes.',

  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Estos son los precios finales, o hay depósito y cargos extra?',
      answer:
        'Estos son los precios completos de cada colección. Un depósito del 50% asegura tu fecha; el resto se paga el día del evento. No hay cargos ocultos en locaciones dentro del condado de Palm Beach o Port St. Lucie — el traslado fuera de esas zonas se cotiza aparte, por escrito, antes de reservar.',
    },
    {
      question: '¿Por qué la diferencia de precio entre solo foto y foto con video es tan chica?',
      answer:
        'Porque el número final es lo que decide, no la estrategia detrás. En bodas, quinceañeras y eventos sociales, mantuvimos ese salto lo más bajo posible a propósito, para que agregar video no se sienta como una compra aparte sino como una decisión fácil de sí.',
    },
    {
      question: '¿West Palm Beach y Port St. Lucie tienen precios distintos?',
      answer:
        'No. El precio es el mismo en las dos sedes. Lo que cambia es qué servicio enfocamos más en cada mercado — quinceañeras y embarazo son más fuertes en Port St. Lucie, bodas y marca en West Palm Beach — pero el precio en sí no cambia.',
    },
    {
      question:
        '¿Puedo combinar servicios, como una sesión de embarazo con un paquete de anuncio de nacimiento?',
      answer:
        'Sí. Escríbenos con lo que estás planeando y armamos una propuesta a la medida — nos lo piden lo suficiente como para cotizarlo de forma habitual, no como caso especial.',
    },
    {
      question: '¿Ofrecen planes de pago?',
      answer:
        'Sí, para colecciones completas de boda, quinceañera y marca. Pregunta al pedir tu propuesta y armamos un calendario mensual que se ajuste a tu fecha.',
    },
  ],

  finalCta: {
    heading: '¿Todavía no sabes qué te conviene?',
    body: 'Cuéntanos qué estás planeando y te recomendamos la colección correcta — sin presión, sin compromiso.',
    label: 'WhatsApp (561) 260-3245',
    message: 'Hola Wonderlands Studio — tengo una pregunta sobre precios.',
  },

  breadcrumbs: [{ name: 'Inicio', path: '/es/' }, { name: 'Precios' }],

  hero: {
    eyebrow: 'Precios completos, sin cargos ocultos',
    alt: 'Un álbum impreso de Wonderlands Studio junto a pruebas de impresión',
  },
};

export const PRICING: Readonly<Record<Lang, AggregatePageContent>> = { en: EN, es: ES };
