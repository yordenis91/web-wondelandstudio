/**
 * Contenido de `/about-lisandra/` y su par español `/es/sobre-lisandra/`.
 *
 * Texto literal de `docs/copy/about-lisandra-copydeck.md`. Página de autor —
 * `pageType: about` — que consolida a Lisandra como entidad E-E-A-T: cada página hoja
 * del sitio enlaza aquí, y esta es la única que declara su `Person` completa.
 */
import { paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { AboutPageContent } from '../lib/pageContent.ts';

const EN: AboutPageContent = {
  metaTitle: 'Meet Lisandra | Wonderlands Studio Photographer',
  metaDescription:
    'Meet Lisandra, creative director and lead photographer at Wonderlands Studio, serving West Palm Beach and Port St. Lucie in English and Spanish.',
  h1: 'Meet Lisandra',
  answerParagraph:
    'Lisandra is the creative director and lead photographer at Wonderlands Studio, a bilingual photography and video studio serving West Palm Beach and Port St. Lucie, Florida. She specializes in editorial wedding, quinceañera, maternity and brand photography, directing every session in English and Spanish. Wonderlands Studio has served South Florida families and businesses since 2021.',

  howSheWorksHeading: 'How she works',
  howSheWorksBody: paragraphs([
    [
      "Lisandra doesn't direct with a rigid list of poses. She watches how someone actually moves and stands when they're not thinking about the camera, and builds the session around that instead of fighting it. It's part of why clients who say they hate having their photo taken tend to relax faster than they expect to.",
    ],
    [
      "That same instinct works across very different kinds of days — a bride getting ready with her mother, a toddler mid-tantrum during a family session, an executive who's never done a branding shoot before. Different problems, same underlying skill: making someone comfortable enough in front of a lens that what comes through is actually them.",
    ],
  ]),

  bilingualHeading: 'Bilingual by default, not as an add-on',
  bilingualBody: paragraphs([
    [
      "Lisandra directs every session — family portraits, wedding formals, corporate headshots — in English or Spanish, switching as needed within the same session so no one in the room is left translating for someone else. For multigenerational families and bilingual executive teams, this tends to be the difference between a session that runs smoothly and one that loses twenty minutes to miscommunication during the group shots.",
    ],
  ]),

  specialtiesHeading: 'What she specializes in',
  specialties: [
    {
      title: 'Weddings & elopements',
      description: 'Editorial photography and cinematic film across Palm Beach County.',
      linkLabel: 'See wedding services →',
      linkHref: '/west-palm-beach/wedding-photographer/',
    },
    {
      title: 'Quinceañeras',
      description:
        "Fashion-forward photography and video, centered in Port St. Lucie's growing Hispanic community.",
      linkLabel: 'See quinceañera coverage →',
      linkHref: '/port-st-lucie/#quinceanera',
    },
    {
      title: 'Maternity & family',
      description: 'Editorial sessions in both West Palm Beach and Port St. Lucie.',
      linkLabel: 'See maternity photography →',
      linkHref: '/port-st-lucie/maternity-photographer/',
    },
    {
      title: 'Brand & business content',
      description:
        'Headshots, real estate and monthly content partnerships for executives and business owners.',
      linkLabel: 'See branding services →',
      linkHref: '/west-palm-beach/brand-photography/',
    },
  ],

  studioHeading: 'Get to know Wonderlands Studio',
  studioBody: paragraphs([
    [
      "Founded in West Palm Beach, Wonderlands Studio grew from family and newborn photography into full wedding, quinceañera and branding coverage across South Florida — expanding to a second location in Port St. Lucie to serve the area's growing community. The throughline across every category is the same: editorial-quality images, warmth in front of the camera, and service in whichever language makes a client comfortable.",
    ],
  ]),

  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Does Lisandra personally shoot every session, or does she have a team?',
      answer:
        "Lisandra is the lead photographer and directs every session personally. For larger events — weddings, quinceañeras with second-photographer add-ons — she works alongside a small team she's trained directly, so the same eye and the same direction carry through even when there's a second shooter in the room.",
    },
    {
      question: 'Is Lisandra available for sessions in both West Palm Beach and Port St. Lucie?',
      answer:
        "Yes. She works across both locations and travels between them regularly — there's no extra fee or reduced availability for booking in either city.",
    },
    {
      question: 'Does she speak Spanish fluently, or is it a translated experience?',
      answer:
        'Fluently, as a native or near-native bilingual speaker — not a translated experience. Direction, small talk, and technical instructions during a session all happen naturally in whichever language the client is most comfortable with.',
    },
    {
      question: 'How did Wonderlands Studio expand from family photography into weddings and branding?',
      answer:
        "The shift followed where clients and demand were actually going — established families in Palm Beach asked for wedding and branding coverage, and Port St. Lucie's growing community created real demand for quinceañeras that wasn't being served locally. The studio expanded into those categories rather than starting them from scratch.",
    },
  ],

  finalCta: {
    heading: 'Want to work with Lisandra directly?',
    body: 'Every session at Wonderlands Studio is under her creative direction.',
    label: 'Get in touch on WhatsApp',
    message: 'Hi Wonderlands Studio — I would like to work with Lisandra directly.',
  },

  breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'About' }],

  hero: {
    eyebrow: 'Creative director & lead photographer',
    alt: 'Portrait of Lisandra, creative director at Wonderlands Studio',
  },
};

const ES: AboutPageContent = {
  metaTitle: 'Lisandra, Fotógrafa Bilingüe en West Palm Beach',
  metaDescription:
    'Conoce a Lisandra, directora creativa y fotógrafa principal de Wonderlands Studio, en West Palm Beach y Port St. Lucie. Atiende en español e inglés.',
  h1: 'Conoce a Lisandra, Fotógrafa Bilingüe en West Palm Beach',
  answerParagraph:
    'Lisandra es la directora creativa y fotógrafa principal de Wonderlands Studio, un estudio bilingüe de fotografía y video con sede en West Palm Beach y Port St. Lucie, Florida. Se especializa en bodas, quinceañeras, embarazo y fotografía de marca editorial, dirigiendo cada sesión en español e inglés. Wonderlands Studio atiende a familias y negocios del sur de Florida desde 2021.',

  howSheWorksHeading: 'Cómo trabaja',
  howSheWorksBody: paragraphs([
    [
      'Lisandra no dirige con una lista rígida de poses. Observa cómo se mueve y se para alguien de verdad cuando no está pensando en la cámara, y construye la sesión a partir de eso en vez de pelear contra ello. Es parte de por qué los clientes que dicen odiar que les tomen fotos suelen relajarse más rápido de lo que esperaban.',
    ],
    [
      'Ese mismo instinto funciona en días muy distintos entre sí — una novia arreglándose junto a su madre, un niño en plena pataleta durante una sesión familiar, un ejecutivo que nunca ha hecho una sesión de marca. Problemas distintos, la misma habilidad de fondo: lograr que alguien se sienta lo bastante cómodo frente al lente para que lo que sale en la foto sea, de verdad, esa persona.',
    ],
  ]),

  bilingualHeading: 'Bilingüe de fondo, no como opción extra',
  bilingualBody: paragraphs([
    [
      'Lisandra dirige cada sesión —retratos familiares, formales de boda, headshots corporativos— en español o en inglés, cambiando de uno a otro dentro de la misma sesión para que nadie en el salón se quede traduciendo para otra persona. Es la diferencia entre una foto de familia donde la abuela solo entiende la mitad de las instrucciones y se le nota en la cara, y una donde todos —abuela incluida— saben exactamente qué hacer porque se lo dijeron en su idioma. Para familias multigeneracionales y equipos ejecutivos bilingües, eso suele ser la diferencia entre una sesión que fluye y una que pierde veinte minutos en las fotos grupales por un malentendido.',
    ],
  ]),

  specialtiesHeading: 'En qué se especializa',
  specialties: [
    {
      title: 'Bodas y ceremonias civiles',
      description: 'Fotografía editorial y video cinematográfico en todo el condado de Palm Beach.',
      linkLabel: 'Ver servicios de boda →',
      linkHref: '/es/west-palm-beach/fotografo-de-bodas/',
    },
    {
      title: 'Quinceañeras',
      description:
        'Fotografía y video con estilo editorial, centrados en la creciente comunidad hispana de Port St. Lucie.',
      linkLabel: 'Ver cobertura de quinceañeras →',
      linkHref: '/es/port-st-lucie/#quinceanera',
    },
    {
      title: 'Embarazo y familia',
      description: 'Sesiones editoriales tanto en West Palm Beach como en Port St. Lucie.',
      linkLabel: 'Ver fotografía de embarazo →',
      linkHref: '/es/port-st-lucie/fotografo-de-embarazo/',
    },
    {
      title: 'Marca y contenido de negocio',
      description:
        'Headshots, bienes raíces y alianzas mensuales de contenido para ejecutivos y dueños de negocio.',
      linkLabel: 'Ver servicios de marca →',
      linkHref: '/es/west-palm-beach/fotografia-de-marca/',
    },
  ],

  studioHeading: 'Conoce Wonderlands Studio',
  studioBody: paragraphs([
    [
      'Fundado en West Palm Beach, Wonderlands Studio nació de la fotografía familiar y de recién nacidos, y creció hacia bodas completas, quinceañeras y marca en todo el sur de Florida — expandiéndose a una segunda sede en Port St. Lucie para atender a su comunidad en crecimiento. El hilo conductor es siempre el mismo: imágenes de calidad editorial, calidez frente a la cámara, y atención en el idioma en que el cliente se sienta más cómodo.',
    ],
  ]),

  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Lisandra fotografía cada sesión en persona, o tiene un equipo?',
      answer:
        'Lisandra es la fotógrafa principal y dirige cada sesión personalmente. Para eventos grandes —bodas, quinceañeras con segundo fotógrafo como adicional— trabaja junto a un equipo pequeño que ella misma formó, así que la misma mirada y la misma dirección se mantienen incluso cuando hay un segundo fotógrafo en la sala.',
    },
    {
      question: '¿Lisandra atiende sesiones en West Palm Beach y en Port St. Lucie?',
      answer:
        'Sí. Trabaja en las dos sedes y viaja entre ellas con regularidad — no hay cargo extra ni menos disponibilidad por reservar en una ciudad u otra.',
    },
    {
      question: '¿Habla español de verdad, o es una experiencia traducida?',
      answer:
        'De verdad, como hablante bilingüe nativa — no es una experiencia traducida. La dirección, la conversación y las instrucciones técnicas durante la sesión suceden naturalmente en el idioma con el que el cliente esté más cómodo.',
    },
    {
      question: '¿Cómo pasó Wonderlands Studio de fotografía familiar a bodas y marca?',
      answer:
        'El cambio siguió a donde realmente iban los clientes y la demanda — familias ya establecidas en Palm Beach empezaron a pedir cobertura de boda y de marca, y la comunidad en crecimiento de Port St. Lucie generó una demanda real de quinceañeras que nadie estaba cubriendo localmente. El estudio creció hacia esas categorías en vez de empezarlas desde cero.',
    },
  ],

  finalCta: {
    heading: '¿Quieres trabajar directamente con Lisandra?',
    body: 'Cada sesión en Wonderlands Studio está bajo su dirección creativa.',
    label: 'Escríbenos por WhatsApp',
    message: 'Hola Wonderlands Studio — quisiera trabajar directamente con Lisandra.',
  },

  breadcrumbs: [{ name: 'Inicio', path: '/es/' }, { name: 'Sobre Lisandra' }],

  hero: {
    eyebrow: 'Directora creativa y fotógrafa principal',
    alt: 'Retrato de Lisandra, directora creativa de Wonderlands Studio',
  },
};

export const ABOUT_LISANDRA: Readonly<Record<Lang, AboutPageContent>> = { en: EN, es: ES };
