/**
 * Contenido de `/west-palm-beach/wedding-videographer/` y su par español.
 *
 * Texto **literal** de `docs/copy/wpb-wedding-videographer-copydeck.md`. Página hermana
 * de `wpb-wedding-photographer.ts` — comparte precio y estructura de colecciones, pero
 * el deck exige cero párrafos compartidos, cero FAQ repetidas y `isRelatedTo` recíproco.
 * No hay bloque "How booking works" en esta página, a diferencia de la de fotografía —
 * es exactamente el caso que `sectionsAfterPricing` como array modular existe para
 * cubrir sin forzar una sección vacía.
 */
import { paragraphs } from '../lib/richtext.ts';
import type { Lang } from '../i18n/routes.ts';
import type { PageContent } from '../lib/pageContent.ts';

// Sin sección `steps`: esta página no tiene bloque "How booking works" (ver nota de
// archivo arriba), pero `PageContent` se comparte con la de fotografía en
// `lib/pageContent.ts` en vez de declararse aquí de nuevo.

const EN: PageContent = {
  metaTitle: 'Wedding Videographer in West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Cinematic wedding films in West Palm Beach, with photography by the same team. Real vows, real audio. Collections from $1,850. Bilingual. Reels in 24-48 hours.',
  h1: 'Wedding Videographer in West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio films weddings in West Palm Beach, Florida, with cinematic coverage built around your real vows and real audio. Collections that include film start at $1,850 and run to $5,500 for full-day coverage with an extended feature film. Photography is handled by the same team, so you hire once. Vertical reels are delivered in 24 to 48 hours. Bilingual crew. (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'What your film actually contains',
      body: paragraphs([
        [
          'A wedding film is not b-roll set to a licensed track. We record audio properly — lapel mics on the officiant and the groom, a board feed where the venue allows it — so your vows and your toasts are in the film in your own voices, not paraphrased by a song.',
        ],
        [
          'What you receive depends on the collection: a 3 to 5 minute music clip, a 6 to 10 minute cinematic film cut with vows and speeches, or an extended feature that carries the full ceremony and reception. Every collection with film also includes a vertical reel for Instagram and TikTok, delivered before you leave for your honeymoon.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'One team for film and photography',
      body: paragraphs([
        [
          'This is the practical reason most couples end up here. Hiring a videographer and a photographer separately means two contracts, two timelines, two creative directions, and two people negotiating over the same spot at the front of the aisle during your first kiss.',
        ],
        [
          "We shoot both. The film crew and the photographer plan the day together, share the same shot list, and stay out of each other's frame because it is the same frame. If photography is your priority and film is the addition, our ",
          {
            text: 'West Palm Beach wedding photography page',
            href: '/west-palm-beach/wedding-photographer/',
          },
          ' leads with that.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Gear and crew',
      body: paragraphs([
        [
          'Full-frame cinema bodies with dual recording, prime and zoom glass, gimbal for movement, on-camera and off-camera lighting for receptions, and licensed drone operation where the venue and airspace permit it — much of Palm Beach Island sits under restricted airspace, so we confirm this per venue rather than promising it blindly.',
        ],
        [
          'Crew size scales with the collection: solo hybrid coverage for smaller weddings, a two-person film team plus photographer for the larger ones. All footage is backed up to two drives before we leave the venue.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Collections that include film',
    note: 'Complete pricing. Same collections as our photography coverage — film is included, not billed separately.',
    afterTable: paragraphs([
      [
        'Our $1,200 Elopement collection is photography only. If you want your elopement filmed, The Essential Story at 6 hours is the entry point.',
      ],
      [
        'Delivery: vertical reel in 24 to 48 hours. Full film in 3 weeks, alongside the photo gallery.',
      ],
    ]),
    addOns:
      'Add-ons: raw ceremony footage · additional hour · rehearsal dinner · same-day edit played at the reception · second film operator.',
    ctaLabel: 'Check your date on WhatsApp',
    ctaMessage:
      'Hi Wonderlands Studio — I would like to check your availability for wedding film coverage in West Palm Beach.',
    portfolioLink: { label: 'Watch recent films', href: '/portfolio/weddings/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'prose',
      heading: 'Airspace, venues and the boring logistics',
      body: paragraphs([
        [
          'Drone coverage is spectacular at Grandview Gardens or a waterfront reception and simply not legal at several Palm Beach Island properties near PBI airport. We check the airspace for your specific venue before the proposal goes out, so nothing gets promised and then quietly dropped.',
        ],
        [
          'Same with audio: some venues restrict where we can place a recorder during the ceremony, and a few churches limit camera positions entirely. We resolve all of it with your coordinator in the timeline meeting, not on the morning of.',
        ],
        [
          'We cover West Palm Beach, Palm Beach, Palm Beach Gardens, Wellington, Jupiter and Boca Raton with no travel fee. North of the county line, see ',
          { text: 'Port St. Lucie', href: '/port-st-lucie/#wedding' },
          '.',
        ],
      ]),
    },
  ],

  testimonialsHeading: 'What couples say',
  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: 'Is a wedding videographer worth it if we already have a photographer?',
      answer:
        'Different jobs. Photographs hold a moment; the film holds what your father actually said during his toast and how your voice sounded when it broke halfway through your vows. Couples who skip film tend to regret it around the first anniversary, when they realize nobody recorded any of it. That is also why the step from photo-only to photo-plus-film in our collections is $650 rather than the $1,500 most studios charge for a separate vendor.',
    },
    {
      question: 'How long is the finished wedding film?',
      answer:
        'Three to five minutes for the short film, six to ten for the cinematic version, and twenty to forty for the extended feature, which carries the ceremony and the key reception moments closer to real time. Most couples watch the short version constantly and the long version once a year.',
    },
    {
      question: 'Will you record our vows and speeches?',
      answer:
        'Yes, in every collection that includes film. We use lapel microphones and, when the venue permits, a direct feed from the sound board. Ceremony audio is the single thing couples ask us to recover afterward, and it cannot be fixed in post if nobody recorded it.',
    },
    {
      question: 'Can you fly a drone at our venue?',
      answer:
        'Sometimes. Several West Palm Beach and Palm Beach Island venues sit inside controlled airspace around Palm Beach International, and drone use requires authorization that is not always granted. We verify your specific venue before we send the proposal and say plainly whether it is possible.',
    },
    {
      question: 'When do we get the video?',
      answer:
        'The vertical reel arrives in 24 to 48 hours, so you have something to post before the honeymoon. The full film is delivered in about 3 weeks, at the same time as your photo gallery.',
    },
    {
      question: 'Do you offer a same-day edit?',
      answer:
        'Yes, as an add-on. We cut a 60 to 90 second piece from the getting-ready and ceremony footage and hand it to your DJ to play during dinner. It requires an editor on site all day, so it needs to be arranged at booking rather than requested on the day.',
    },
    {
      question: 'Can we book film only, without photography?',
      answer:
        'We can, but we rarely recommend it. Coordinating our film crew around a photographer we have never worked with adds friction to your day and usually costs more than our combined collection. If you already have a photographer booked, message us and we will tell you honestly whether it makes sense.',
    },
  ],

  finalCta: {
    heading: 'Check your date.',
    body: 'Send your wedding date and venue. We confirm availability the same day, and the proposal includes the drone and audio answer for your specific venue.',
    label: 'WhatsApp (561) 260-3245',
    message:
      'Hi Wonderlands Studio — I would like to confirm availability for wedding film coverage.',
  },

  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'West Palm Beach', path: '/west-palm-beach/' },
    { name: 'Wedding Videographer' },
  ],

  hero: {
    eyebrow: 'Cinematic wedding films, bilingual crew',
    alt: 'Still frame from a West Palm Beach wedding film during the ceremony',
  },
};

const ES: PageContent = {
  metaTitle: 'Videógrafo de Bodas en West Palm Beach | Wonderlands Studio',
  metaDescription:
    'Video cinematográfico de bodas en West Palm Beach, con fotografía del mismo equipo. Votos y audio real. Colecciones desde $1,850. En español. Reels en 24-48 horas.',
  h1: 'Videógrafo de Bodas en West Palm Beach, FL',
  answerParagraph:
    'Wonderlands Studio graba bodas en West Palm Beach, Florida, con video cinematográfico construido sobre tus votos y tu audio real. Las colecciones que incluyen video empiezan en $1,850 y llegan a $5,500 con cobertura de día completo y película extendida. La fotografía la hace el mismo equipo, así que contratas una sola vez. Reels en 24 a 48 horas. Atendemos en español. (561) 260-3245.',

  sectionsBeforePricing: [
    {
      kind: 'prose',
      heading: 'Qué trae tu video de verdad',
      body: paragraphs([
        [
          'Un video de boda no es b-roll con una canción encima. Grabamos audio en serio — micrófono de solapa al oficiante y al novio, y toma directa de la consola donde la locación lo permite — para que tus votos y los brindis estén en la película con tu propia voz.',
        ],
        [
          'Según la colección recibes un music clip de 3 a 5 minutos, una película cinematográfica de 6 a 10 minutos armada con votos y discursos, o una versión extendida que carga la ceremonia y la fiesta completas. Todas las colecciones con video incluyen además un reel vertical para Instagram y TikTok, entregado antes de que te vayas de luna de miel.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Un solo equipo para foto y video',
      body: paragraphs([
        [
          'Esta es la razón práctica por la que la mayoría termina aquí. Contratar videógrafo y fotógrafo por separado son dos contratos, dos cronogramas, dos ideas distintas de cómo debe verse tu boda, y dos personas peleándose el mismo lugar frente al altar en el momento del beso.',
        ],
        [
          'Nosotros hacemos las dos cosas. El equipo de video y la fotógrafa arman el día juntos y comparten la misma lista de tomas. Si lo tuyo es principalmente la fotografía, entra por ',
          {
            text: 'fotógrafo de bodas en West Palm Beach',
            href: '/es/west-palm-beach/fotografo-de-bodas/',
          },
          '.',
        ],
      ]),
    },
    {
      kind: 'prose',
      heading: 'Equipo técnico',
      body: paragraphs([
        [
          'Cámaras cine full frame con grabación dual, ópticas fijas y zoom, gimbal para movimiento, iluminación propia para la recepción, y drone con operación licenciada donde el espacio aéreo y la locación lo permitan — buena parte de Palm Beach Island está en espacio aéreo restringido, así que lo confirmamos locación por locación en vez de prometerlo de entrada.',
        ],
        [
          'El tamaño del equipo va con la colección: cobertura híbrida individual en bodas pequeñas, dos operadores de video más fotógrafa en las grandes. Todo el material se respalda en dos discos antes de salir de la locación.',
        ],
      ]),
    },
  ],

  pricing: {
    heading: 'Colecciones con video',
    note: 'Precios completos. Son las mismas colecciones que en fotografía — el video va incluido, no se cobra aparte.',
    afterTable: paragraphs([
      [
        'La colección Elopement de $1,200 es solo fotografía. Si quieres tu boda civil grabada, la entrada es The Essential Story con 6 horas.',
      ],
      [
        'Entrega: reel vertical en 24 a 48 horas. Video completo en 3 semanas, junto con la galería de fotos.',
      ],
    ]),
    addOns:
      'Adicionales: material bruto de la ceremonia · hora extra · cena de ensayo · edición del mismo día proyectada en la fiesta · segundo operador de video.',
    ctaLabel: 'Consultar tu fecha por WhatsApp',
    ctaMessage:
      'Hola Wonderlands Studio — quisiera consultar disponibilidad para cobertura de video de boda en West Palm Beach.',
    portfolioLink: { label: 'Ver videos recientes', href: '/es/portafolio/bodas/' },
  },

  sectionsAfterPricing: [
    {
      kind: 'prose',
      heading: 'Espacio aéreo, locaciones y la logística aburrida',
      body: paragraphs([
        [
          'El drone se ve espectacular en Grandview Gardens o en una recepción frente al agua, y sencillamente no es legal en varias propiedades de Palm Beach Island cerca del aeropuerto de PBI. Revisamos el espacio aéreo de tu locación antes de mandarte la propuesta, para no prometer algo que después desaparece sin explicación.',
        ],
        [
          'Con el audio pasa igual: algunas locaciones limitan dónde podemos poner una grabadora durante la ceremonia, y varias iglesias restringen las posiciones de cámara. Todo eso se resuelve con tu coordinadora en la reunión de cronograma, no la mañana de la boda.',
        ],
        [
          'Cubrimos West Palm Beach, Palm Beach, Palm Beach Gardens, Wellington, Jupiter y Boca Raton sin cargo por traslado. Más al norte, mira ',
          { text: 'Port St. Lucie', href: '/es/port-st-lucie/#wedding' },
          '.',
        ],
      ]),
    },
  ],

  testimonialsHeading: 'Lo que dicen las parejas',
  faqHeading: 'Preguntas frecuentes',
  faqs: [
    {
      question: '¿Vale la pena contratar video si ya tengo fotógrafo?',
      answer:
        'Son cosas distintas. La foto guarda el momento; el video guarda lo que tu papá dijo en el brindis y cómo se te quebró la voz a la mitad de los votos. Las parejas que se saltan el video suelen arrepentirse al primer aniversario, cuando se dan cuenta de que nadie grabó nada. Por eso el salto de solo foto a foto con video en nuestras colecciones es de $650 y no de los $1,500 que cuesta contratar un proveedor aparte.',
    },
    {
      question: '¿Cuánto dura el video terminado?',
      answer:
        'De 3 a 5 minutos el corto, de 6 a 10 la versión cinematográfica, y entre 20 y 40 la película extendida, que lleva la ceremonia y los momentos clave de la fiesta casi en tiempo real. La mayoría ve el corto todo el tiempo y el largo una vez al año.',
    },
    {
      question: '¿Graban los votos y los discursos?',
      answer:
        'Sí, en todas las colecciones con video. Usamos micrófonos de solapa y, cuando la locación lo permite, toma directa de la consola de sonido. El audio de la ceremonia es lo que más nos piden recuperar después, y no hay forma de arreglarlo en edición si nadie lo grabó.',
    },
    {
      question: '¿Pueden volar drone en mi locación?',
      answer:
        'A veces. Varias locaciones de West Palm Beach y Palm Beach Island están dentro del espacio aéreo controlado del aeropuerto internacional, y volar ahí requiere una autorización que no siempre se otorga. Verificamos tu locación específica antes de mandar la propuesta y te decimos claramente si se puede o no.',
    },
    {
      question: '¿En cuánto tiempo entregan?',
      answer:
        'El reel vertical en 24 a 48 horas, para que tengas qué publicar antes de la luna de miel. El video completo en unas 3 semanas, al mismo tiempo que la galería de fotos.',
    },
    {
      question: '¿Hacen edición del mismo día?',
      answer:
        'Sí, como adicional. Cortamos un video de 60 a 90 segundos con el material de los preparativos y la ceremonia, y se lo pasamos al DJ para proyectarlo durante la cena. Requiere un editor en la locación todo el día, así que se coordina al reservar y no se puede pedir el mismo día.',
    },
    {
      question: '¿Puedo contratar solo video, sin fotografía?',
      answer:
        'Se puede, pero casi nunca lo recomendamos. Coordinar nuestro equipo de video con un fotógrafo que no conocemos le mete fricción a tu día y normalmente sale más caro que nuestra colección combinada. Si ya tienes fotógrafo contratado, escríbenos y te decimos con honestidad si conviene.',
    },
  ],

  finalCta: {
    heading: 'Consulta tu fecha.',
    body: 'Mándanos la fecha y el lugar de tu boda. Confirmamos disponibilidad el mismo día, y la propuesta ya incluye la respuesta de drone y audio para tu locación.',
    label: 'WhatsApp (561) 260-3245',
    message:
      'Hola Wonderlands Studio — quisiera confirmar disponibilidad para cobertura de video de mi boda.',
  },

  breadcrumbs: [
    { name: 'Inicio', path: '/es/' },
    { name: 'West Palm Beach', path: '/es/west-palm-beach/' },
    { name: 'Videógrafo de Bodas' },
  ],

  hero: {
    eyebrow: 'Video cinematográfico de bodas, equipo bilingüe',
    alt: 'Fotograma de un video de boda en West Palm Beach durante la ceremonia',
  },
};

export const WPB_WEDDING_VIDEOGRAPHER: Readonly<Record<Lang, PageContent>> = {
  en: EN,
  es: ES,
};
