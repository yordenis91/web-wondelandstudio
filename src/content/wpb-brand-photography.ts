/**
 * Contenido de `/west-palm-beach/brand-photography/` y su par español.
 *
 * Texto literal de `docs/copy/wpb-brand-photography-copydeck.md`. Primera página
 * `pageType: subscription` del sitio: precio recurrente con dos líneas en paralelo
 * (foto-primero / video-primero) además de sesiones únicas, documentado en `SubscriptionPageContent`
 * (`lib/pageContent.ts`) en vez del `PageContent` de las páginas de boda.
 */
import { paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { SubscriptionPageContent } from '../lib/pageContent.ts';

const EN: SubscriptionPageContent = {
  metaTitle: 'Brand Photographer in West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Headshots, real estate and personal branding photography in West Palm Beach. One-time sessions from $700 or a monthly content partnership from $1,500.',
  h1: 'Brand Photographer in West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio produces branding photography for real estate agents, executives and business owners in West Palm Beach. Book a one-time session from $700, or a monthly content partnership from $1,500 that delivers a fresh batch of photos and reels every month without you having to plan a shoot yourself. Bilingual studio and on-location work. (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Two ways to work with us',
      body: paragraphs([
        [
          'Most businesses start one of two ways: they need photos for one specific thing — a new headshot, a listing, a launch — or they need a steady stream of content and are tired of their feed going quiet for weeks at a time. We built two paths for that.',
        ],
        [
          { text: 'A single session', bold: true },
          ' gets you a complete, polished set for a specific need: headshots, a property, a personal brand refresh. You own the files, there is no ongoing commitment, and you book again whenever you need more.',
        ],
        [
          { text: 'A monthly partnership', bold: true },
          ' puts your content on a schedule. Once a month, we shoot a new batch of photos and short vertical videos built around what your business is doing that month — a new listing, a launch, a behind-the-scenes moment, a client win. You stop scrambling for something to post and start having a library to pull from.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Who this is for',
      body: paragraphs([
        [
          "Real estate agents who need listing photography that doesn't look like every other listing on the MLS. Executives and founders who need headshots and LinkedIn content that reads as current, not from three years and one hairstyle ago. Local business owners — clinics, boutiques, restaurants, service businesses — who know they need consistent content and don't have the time or the eye to produce it themselves.",
        ],
      ]),
    },
  ],

  sessions: {
    heading: 'One-time sessions',
    note: 'Full pricing. No subscription required.',
    afterTable: paragraphs([
      [
        'These sit at opposite ends on purpose. Impulso Visual covers a focused need — one set of headshots, one property. La Autoridad is a full brand shoot: the kind of session that resets your entire visual presence in one day.',
      ],
    ]),
  },

  monthly: {
    heading: 'Monthly content partnership',
    note: 'Billed monthly. Cancel with 30 days notice. No long-term contract required.',
    levelLabel: 'Track',
    photoLabel: 'Photo-led',
    videoLabel: 'Video-led',
    afterTable: paragraphs([
      [
        'There are two partnership tracks, built around the same monthly rhythm but with a different center of gravity.',
      ],
      [
        { text: 'Photo-led', bold: true },
        ' (El Socio de Crecimiento) gives you a larger volume of still photography each month with a handful of short-form video clips folded in — the right fit if your brand runs primarily on photos: real estate, e-commerce, product-led businesses.',
      ],
      [
        { text: 'Video-led', bold: true },
        ' (Brand Partner) flips the ratio: reels and short-form video are the majority of the delivery, with stills supporting. This is the track for founders and service businesses building an audience on Reels and TikTok, where video is what actually moves the algorithm.',
      ],
      [
        'If you are deciding between the two: ',
        {
          text: 'video is the better bet for reach, photo is the better bet for a polished, evergreen library.',
          bold: true,
        },
        ' Most businesses that go video-led still get usable stills from the same shoot — you are not choosing to have zero photos.',
      ],
    ]),
    ctaLabel: 'Get a custom quote on WhatsApp',
    ctaMessage:
      'Hi Wonderlands Studio — I would like a custom quote for a monthly branding content partnership.',
    portfolioLink: { label: 'See recent branding work', href: '/portfolio/branding/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'steps',
      heading: 'How a partnership actually works',
      steps: [
        {
          lead: 'Kickoff call.',
          rest: 'We learn your business, your brand voice, and what "on brand" looks like for you before the first shoot.',
        },
        {
          lead: 'Monthly shoot day.',
          rest: 'Scheduled in advance, built around whatever is happening in your business that month — new hires, new services, a seasonal push.',
        },
        {
          lead: 'Delivery in 3–5 business days.',
          rest: 'Stills in high resolution and web size, video cut vertical and ready to post.',
        },
        {
          lead: 'You keep full usage rights',
          rest: 'to everything, from month one.',
        },
        {
          lead: 'Adjust or pause monthly.',
          rest: "No shoot happening this month because you're on vacation? Tell us and we shift the schedule — you are not locked into a rigid calendar.",
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'About Lisandra',
      body: paragraphs([
        [
          'Lisandra directs branding sessions the same way she directs weddings: putting people at ease in front of a camera is a skill on its own, and it shows up as much in a headshot as it does in a bridal portrait. Bilingual direction means an executive team that mixes English and Spanish speakers gets the same experience, in the same session, without switching photographers. ',
          { text: 'Read more →', href: '/about-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'What clients say',
  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Should I book a single session or a monthly partnership?',
      answer:
        'If you have one specific need — a new headshot, a property to list, a one-time launch — book a single session. If you post regularly and are tired of running out of content, or you know consistent posting matters for your business and you are not doing it, the partnership pays for itself the first month you don\'t have to think about it.',
    },
    {
      question: "What's the actual difference between the photo-led and video-led partnership?",
      answer:
        'Both include stills and video every month. The photo-led track weighs more toward a larger volume of still images with a handful of video clips. The video-led track weighs toward reels and short-form video, with fewer but still usable stills. Pick based on where your audience actually is — LinkedIn and a website favor stills, Instagram and TikTok favor video.',
    },
    {
      question: 'Can I cancel the monthly partnership?',
      answer:
        'Yes, with 30 days notice. There is no long-term contract. Most clients who start monthly stay because the content keeps performing, not because they are locked in.',
    },
    {
      question: 'Do you shoot on location or only in studio?',
      answer:
        'Both. Headshots and product work often happen in our West Palm Beach studio for consistent lighting; real estate, lifestyle and behind-the-scenes content happens on location at your business.',
    },
    {
      question: 'Who owns the photos and videos?',
      answer:
        'You do, from delivery. Full usage rights for business purposes, no licensing fees, no restrictions on where you post or use them.',
    },
    {
      question: 'How fast do I get the content?',
      answer:
        '3 to 5 business days for a monthly partnership shoot. Single sessions typically deliver in 1 week; La Autoridad (our largest single session) in 10 days given the larger volume of images.',
    },
    {
      question: 'Do you do real estate photography specifically?',
      answer:
        "Yes — it's one of the most common uses of the Impulso Visual session and of the photo-led partnership. Listings, twilight exteriors, and walkthrough-style galleries for the MLS and social.",
    },
  ],

  finalCta: {
    heading: 'Tell us what your brand needs.',
    body: "One session or an ongoing partnership — send us a message and we'll recommend the right fit, no obligation.",
    label: 'WhatsApp (561) 260-3245',
    message:
      'Hi Wonderlands Studio — I would like to talk about branding photography for my business.',
  },

  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'West Palm Beach', path: '/west-palm-beach/' },
    { name: 'Brand Photographer' },
  ],

  hero: {
    eyebrow: 'Branding photography, bilingual studio',
    alt: 'Executive headshot session in the Wonderlands Studio West Palm Beach studio',
  },
};

const ES: SubscriptionPageContent = {
  metaTitle: 'Fotógrafo de Marca en West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Headshots, bienes raíces y fotografía de marca personal en West Palm Beach. Sesiones únicas desde $700 o socio de contenido mensual desde $1,500.',
  h1: 'Fotógrafo de Marca en West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio produce fotografía de marca para agentes inmobiliarios, ejecutivos y dueños de negocio en West Palm Beach. Reserva una sesión única desde $700, o un socio de contenido mensual desde $1,500 que te entrega fotos y reels nuevos cada mes sin que tengas que organizar la sesión tú mismo. Estudio bilingüe y trabajo en locación. (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Dos formas de trabajar con nosotros',
      body: paragraphs([
        [
          'La mayoría de los negocios empieza de una de dos maneras: necesitan fotos para algo puntual —un headshot nuevo, una propiedad, un lanzamiento— o necesitan un flujo constante de contenido y ya están cansados de que su feed se quede en silencio semanas enteras. Construimos dos caminos para eso.',
        ],
        [
          { text: 'Una sesión única', bold: true },
          ' te da un set completo y pulido para una necesidad específica: headshots, una propiedad, un refresh de marca personal. Los archivos son tuyos, no hay compromiso continuo, y reservas de nuevo cuando necesites más.',
        ],
        [
          { text: 'Un socio de contenido mensual', bold: true },
          ' pone tu contenido en un calendario. Una vez al mes, hacemos una tanda nueva de fotos y videos verticales cortos, construidos alrededor de lo que tu negocio esté haciendo ese mes —un listado nuevo, un lanzamiento, un detrás de cámaras, una historia de cliente contento. Dejas de improvisar qué publicar y empiezas a tener una biblioteca de la cual sacar contenido.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Para quién es esto',
      body: paragraphs([
        [
          'Agentes inmobiliarios que necesitan fotos de listados que no se vean igual a todos los demás en el MLS. Ejecutivos y fundadores que necesitan headshots y contenido de LinkedIn que se vea actual, no de hace tres años y otro corte de pelo. Dueños de negocio locales —clínicas, boutiques, restaurantes, negocios de servicio— que saben que necesitan contenido constante y no tienen el tiempo ni el ojo para producirlo ellos mismos.',
        ],
      ]),
    },
  ],

  sessions: {
    heading: 'Sesiones únicas',
    note: 'Precio completo. Sin necesidad de suscripción.',
    afterTable: paragraphs([
      [
        'Están en extremos opuestos a propósito. Impulso Visual cubre una necesidad puntual —un set de headshots, una propiedad. La Autoridad es una producción de marca completa: el tipo de sesión que renueva toda tu presencia visual en un solo día.',
      ],
    ]),
  },

  monthly: {
    heading: 'Socio de contenido mensual',
    note: 'Facturado cada mes. Se cancela con 30 días de aviso. Sin contrato de largo plazo.',
    levelLabel: 'Línea',
    photoLabel: 'Enfoque en foto',
    videoLabel: 'Enfoque en video',
    afterTable: paragraphs([
      [
        'Hay dos líneas de socio de contenido, construidas sobre el mismo ritmo mensual pero con un centro de gravedad distinto.',
      ],
      [
        { text: 'Enfoque en foto', bold: true },
        ' (El Socio de Crecimiento) te da un mayor volumen de fotografía cada mes, con algunos clips cortos de video incluidos — la opción correcta si tu marca funciona principalmente con fotos: bienes raíces, e-commerce, negocios de producto.',
      ],
      [
        { text: 'Enfoque en video', bold: true },
        ' (Brand Partner) invierte la proporción: los reels y el video corto son la mayor parte de la entrega, con fotos de apoyo. Esta es la línea para fundadores y negocios de servicio que están construyendo audiencia en Reels y TikTok, donde el video es lo que de verdad mueve el algoritmo.',
      ],
      [
        'Si estás decidiendo entre las dos: ',
        {
          text: 'el video es mejor apuesta para alcance, la foto es mejor apuesta para una biblioteca pulida y duradera.',
          bold: true,
        },
        ' La mayoría de los negocios que eligen video siguen recibiendo fotos utilizables de la misma sesión — no estás eligiendo tener cero fotos.',
      ],
    ]),
    ctaLabel: 'Pide una cotización a la medida por WhatsApp',
    ctaMessage:
      'Hola Wonderlands Studio — quisiera una cotización a la medida para un socio de contenido mensual de marca.',
    portfolioLink: { label: 'Ver trabajos recientes de marca', href: '/es/portafolio/marca/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'steps',
      heading: 'Cómo funciona una alianza en la práctica',
      steps: [
        {
          lead: 'Llamada inicial.',
          rest: 'Conocemos tu negocio, la voz de tu marca y cómo se ve "on brand" para ti antes de la primera sesión.',
        },
        {
          lead: 'Día de sesión mensual.',
          rest: 'Programado con anticipación, construido alrededor de lo que esté pasando en tu negocio ese mes — contrataciones nuevas, servicios nuevos, un empujón de temporada.',
        },
        {
          lead: 'Entrega en 3 a 5 días hábiles.',
          rest: 'Fotos en alta resolución y tamaño web, video cortado en vertical y listo para publicar.',
        },
        {
          lead: 'Conservas todos los derechos de uso',
          rest: 'desde el primer mes.',
        },
        {
          lead: 'Ajusta o pausa cada mes.',
          rest: '¿No hay sesión este mes porque estás de vacaciones? Avísanos y movemos el calendario — no estás atado a un cronograma rígido.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Sobre Lisandra',
      body: paragraphs([
        [
          'Lisandra dirige las sesiones de marca de la misma forma en que dirige bodas: poner a alguien cómodo frente a una cámara es una habilidad en sí misma, y se nota tanto en un headshot como en un retrato de novia. La dirección bilingüe significa que un equipo ejecutivo que mezcla personas de habla inglesa y española recibe la misma experiencia, en la misma sesión, sin cambiar de fotógrafa. ',
          { text: 'Conoce más →', href: '/es/sobre-lisandra/' },
        ],
      ]),
    },
  ],

  testimonialsHeading: 'Lo que dicen los clientes',
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Debería reservar una sesión única o un socio de contenido mensual?',
      answer:
        'Si tienes una necesidad puntual —un headshot nuevo, una propiedad para listar, un lanzamiento único— reserva una sesión única. Si publicas seguido y ya te cansaste de quedarte sin contenido, o sabes que publicar de forma constante le importa a tu negocio y no lo estás haciendo, la alianza mensual se paga sola desde el primer mes en que dejas de pensarlo.',
    },
    {
      question: '¿Cuál es la diferencia real entre la línea de foto y la de video?',
      answer:
        'Las dos incluyen fotos y video cada mes. La línea de foto pesa más hacia un mayor volumen de imágenes fijas con algunos clips de video. La línea de video pesa hacia reels y video corto, con menos fotos pero igual de utilizables. Elige según dónde esté realmente tu audiencia — LinkedIn y una página web favorecen las fotos, Instagram y TikTok favorecen el video.',
    },
    {
      question: '¿Puedo cancelar el socio de contenido mensual?',
      answer:
        'Sí, con 30 días de aviso. No hay contrato de largo plazo. La mayoría de los clientes que empiezan la alianza mensual se quedan porque el contenido sigue funcionando, no porque estén atados.',
    },
    {
      question: '¿Trabajan en locación o solo en estudio?',
      answer:
        'Las dos. Los headshots y el trabajo de producto suelen hacerse en nuestro estudio de West Palm Beach para una luz consistente; bienes raíces, lifestyle y contenido de detrás de cámaras se hacen en locación, en tu negocio.',
    },
    {
      question: '¿De quién son las fotos y los videos?',
      answer:
        'Tuyos, desde la entrega. Derechos de uso completos para fines de negocio, sin cargos de licencia, sin restricciones sobre dónde los publiques o los uses.',
    },
    {
      question: '¿Qué tan rápido recibo el contenido?',
      answer:
        'De 3 a 5 días hábiles para una sesión de alianza mensual. Las sesiones únicas suelen entregarse en 1 semana; La Autoridad (nuestra sesión única más grande) en 10 días por el mayor volumen de imágenes.',
    },
    {
      question: '¿Hacen fotografía de bienes raíces específicamente?',
      answer:
        'Sí — es uno de los usos más comunes de la sesión Impulso Visual y de la alianza con enfoque en foto. Listados, exteriores al atardecer y galerías tipo recorrido para el MLS y redes sociales.',
    },
  ],

  finalCta: {
    heading: 'Cuéntanos qué necesita tu marca.',
    body: 'Una sesión o una alianza continua — mándanos un mensaje y te recomendamos lo que mejor te queda, sin compromiso.',
    label: 'WhatsApp (561) 260-3245',
    message: 'Hola Wonderlands Studio — quisiera hablar sobre fotografía de marca para mi negocio.',
  },

  breadcrumbs: [
    { name: 'Inicio', path: '/es/' },
    { name: 'West Palm Beach', path: '/es/west-palm-beach/' },
    { name: 'Fotógrafo de Marca' },
  ],

  hero: {
    eyebrow: 'Fotografía de marca, estudio bilingüe',
    alt: 'Sesión de headshot ejecutivo en el estudio de Wonderlands Studio en West Palm Beach',
  },
};

export const WPB_BRAND_PHOTOGRAPHY: Readonly<Record<Lang, SubscriptionPageContent>> = {
  en: EN,
  es: ES,
};
