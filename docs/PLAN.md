# Wonderlands Studio — Plan de implementación
**v4 · Actualizado tras los copy decks de: boda WPB (foto+video), branding WPB, hubs de ciudad, `/pricing/`, maternidad PSL, `/about-lisandra/`**

---

## 1. Qué cambió desde v1

v1 se escribió con un solo tipo de página en mente (servicio+ciudad, evento). Siete
copy decks después, **Fase 1 queda completa en copy EN** y aparecieron cinco valores de
`pageType` en total, todos probados contra contenido real. Nada de lo de v1 se
descarta — se generaliza.

| Descubierto en | Qué forzó a cambiar |
|---|---|
| Deck de boda WPB | Línea base: `pageType: event`, `Offer` de tier fijo, `VideoObject` condicional |
| Deck de video WPB | `isRelatedTo` entre servicios hermanos, anti-canibalización de FAQ |
| Deck de branding | `pageType: subscription`, `Offer` recurrente (`unitCode: MON`), catálogos paralelos |
| Decks de hub | `pageType: hub`, sistema de `status` (active/planned), `cityServiceMatrix` |
| Deck de `/pricing/` | `pageType: aggregate` — validado sin campos nuevos; solo `PricingSection.astro` y el patrón `WebPage.about[]` en JSON-LD |
| Deck de maternidad PSL | Confirma que `pageType: event` generaliza más allá de boda/quinceañera, sin cambios de modelo |
| Deck de `/about-lisandra/` | `pageType: about` — quinto valor, **cero cambios de modelo**; entidad `Person` completa por primera vez |

**Estado del modelo: los cinco `pageType` están probados contra contenido real, y el
alcance completo de Fase 1 tiene copy EN escrito.** El Bloque 2 (Sanity) ya no depende
de ningún deck futuro para su esquema — ver sección 7 para lo que sigue pendiente, que
ahora es solo contenido en español y decisiones de negocio, no arquitectura.

---

## 2. Tipos de página (`servicePage.pageType`)

Cinco valores, cinco formas de precio (o ausencia de precio), cinco patrones de render:

| pageType | Ejemplo | Estructura de precio | Componente |
|---|---|---|---|
| `event` | Boda, quinceañera, maternidad | Tiers fijos, escalera ascendente | `PricingTable.astro` |
| `subscription` | Branding | Sesión única + 2 catálogos de mensualidad en paralelo | `SubscriptionTable.astro` |
| `hub` | `/west-palm-beach/`, `/port-st-lucie/` | No tiene precio propio, resume "desde $X" de sus hijos | `ServiceCard.astro` (grid) |
| `aggregate` | `/pricing/` | Consume el catálogo completo, todos los pageType | `PricingSection.astro` — decide `PricingTable` vs `SubscriptionTable` por sección |
| `about` | `/about-lisandra/` | Sin precio — solo texto, imagen y FAQ | Reusa `AnswerBlock.astro` y `FAQ.astro`, sin componente de precio |

**`aggregate` validado.** `/pricing/` no declara precios propios: cada sección
(bodas, quinceañeras, maternidad, eventos sociales, branding) reusa el componente que
ya existe para su `pageType` de origen. El único componente nuevo que aportó,
`PricingSection.astro`, es un contenedor de layout — no toca el modelo de datos, solo
decide qué tabla renderizar según el `pageType` de la sección que recibe.

**`about` validado — es el caso más simple de los cinco.** No introdujo ningún campo
nuevo en `pricingCatalog` ni `cityServiceMatrix`, ni ningún componente de precio. Solo
confirma que `servicePage` ya tenía todo lo necesario (secciones de texto, FAQ,
imágenes) para una página sin tabla de precios. Lo único nuevo que aportó fue una
entidad `Person` completa en JSON-LD — ver sección 6.

Regla dura de JSON-LD que el deck de `/pricing/` fijó: **`/pricing/` nunca redeclara un
`price`.** Usa `WebPage.about[]` referenciando cada `Service` por `@id`. Si algún día se
declarara un `hasOfferCatalog` propio en esta página, se reintroduciría el bug que tiene
el sitio de WordPress actual — precios contradictorios en más de un lugar del sitio.

---

## 3. Sistema de rutas y estados

### 3.1 Dos fuentes de verdad, no una

- **`cityServiceMatrix`** (documento nuevo en Sanity, no es `servicePage`): las 9 líneas
  de servicio × 2 ciudades = 18 entradas, cada una con `status`, `adPriority`
  (alto/medio/bajo) y referencia opcional a un `servicePage`.
- **`servicePage`**: solo existe para las entradas con `status: active`.

Este desdoblamiento es deliberado: permite que el hub muestre las 9 líneas por ciudad
desde el día uno del CMS, sin esperar a que cada página hoja esté escrita.

### 3.2 Valores de `status`

| status | La página existe | Aparece en hub como | Aparece en sitemap | Aparece en JSON-LD `makesOffer` |
|---|---|---|---|---|
| `active` | Sí | Card clickeable | Sí | Sí |
| `planned` | No | Card informativa + WhatsApp | No | No |

### 3.3 Funciones de `routes.ts`

- `getAllRoutes()` → solo `active`. Alimenta sitemap y `check-tokens`.
- `getServiceMatrix(city)` → las 9 líneas completas con `status`. Alimenta los hubs.
- `getAlternate(path, lang)` → sin cambios de v1.

### 3.4 Regla de enlace entre páginas hoja

Un copy deck **nunca** enlaza directo a una URL `planned`. Enlaza al ancla del hub
correspondiente (`/port-st-lucie/#wedding`) hasta que el `status` de esa entrada cambie
a `active` — momento en el que el link se actualiza a la URL final.

> Acción pendiente sobre el deck ya entregado: en
> `docs/copy/wpb-wedding-photographer-copydeck.md`, el link a
> `/port-st-lucie/wedding-photographer/` debe cambiar a `/port-st-lucie/#wedding` antes
> de implementarse, porque esa entrada en la matriz es `status: planned` en Fase 1.

---

## 4. Modelo de datos Sanity — consolidado

### `businessLocation`
Sin cambios de v1. WPB y PSL, NAP, geo, idiomas.

### `cityServiceMatrix` — nuevo, introducido por los hubs
```
- city: 'wpb' | 'psl'
- service: string (slug del servicio, ej. 'wedding-photographer')
- status: 'active' | 'planned'
- adPriority: 'alto' | 'medio' | 'bajo'
- servicePageRef: reference → servicePage (solo si status = active)
- fromPrice: number (para mostrar "desde $X" en el hub aunque status = planned)
```

### `servicePage`
```
- language: 'en' | 'es'
- city: 'wpb' | 'psl'
- service: string
- pageType: 'event' | 'subscription' | 'hub' | 'aggregate' | 'about'   ← 5 valores, todos validados
- h1: string
- answerParagraph: string (validación 60–65 palabras)
- secciones: array de { title, body, images }
- faqs: array de { pregunta, respuesta } (mínimo 4)
- videoEmbeds: array opcional (solo si pageType permite video — descubierto en deck de video)
- metaTitle, metaDescription
- imagenes: array con altEN y altES obligatorios
- testimonialRefs: array de reference → testimonial
```

### `pricingCatalog` — modificado por el deck de branding
```
- entries: array de:
  - name: string
  - tier: string (para event: elopement/essential/full/tradition/luxury)
  - billingType: 'oneTime' | 'monthly'        ← nuevo, introducido por branding
  - track: 'photo-led' | 'video-led' | null   ← nuevo, para catálogos paralelos
  - price: number
  - coverage: string
  - includes: array de string
  - appliesTo: reference → servicePage (para saber a qué página pertenece cada entrada)
```

### `testimonial`
Sin cambios de v1. `verified: boolean`, default false.

### `galleryItem`
Sin cambios de v1. `altEN` y `altES` obligatorios.

### `post`
Sin cambios de v1.

---

## 5. Componentes — consolidado

| Componente | Introducido en | Renderiza |
|---|---|---|
| `Layout.astro` | v1 | head, canonical, hreflang recíproco |
| `Hero.astro` | v1 | imagen estática, nunca video autoplay |
| `AnswerBlock.astro` | v1 | párrafo-respuesta 60-65 palabras |
| `PricingTable.astro` | v1 (boda) | tiers fijos, `pageType: event` |
| `FAQ.astro` | v1 | detalles nativos, sin JS |
| `Gallery.astro` | v1 | grid con lazy loading |
| `TestimonialList.astro` | v1 | filtra por category y city, solo `verified: true` |
| `CTAWhatsApp.astro` | v1 | UTM + evento dataLayer |
| `Breadcrumbs.astro` | v1 | `BreadcrumbList` |
| `SubscriptionTable.astro` | deck branding | dos columnas paralelas, `pageType: subscription` |
| `ServiceCard.astro` | deck hubs | estado visual active/planned, CTA condicionado |
| `PricingSection.astro` | deck pricing | contenedor liviano, elige `PricingTable` o `SubscriptionTable` por sección |

---

## 6. JSON-LD — reglas consolidadas

- Entidades compartidas por `@id`: `#organization`, `#location` (WPB y PSL). Nunca se
  redeclaran completas en cada página, solo se referencian.
- `Service` con `hasOfferCatalog`:
  - `pageType: event` → un solo `OfferCatalog`, tiers en escalera.
  - `pageType: subscription` → `hasOfferCatalog` es un **array** de catálogos paralelos.
- `Offer` recurrente (`pageType: subscription`) usa `priceSpecification` con
  `unitCode: "MON"`. Nunca un `price` plano para algo mensual.
- `isRelatedTo` recíproco entre páginas hermanas (ej. wedding-photographer ↔
  wedding-videographer) para señalar que no son contenido duplicado.
- **Nunca** se emite un `Service` ni se incluye en el `makesOffer` de un hub si su
  `cityServiceMatrix.status` no es `active`. Un `Service` sin `url` resoluble es
  penalizable.
- **Nunca** `Review` ni `AggregateRating` sin testimonios `verified: true`.
- `VideoObject` solo si el video está autoalojado; si vive en Vimeo/YouTube, la
  plataforma ya lo declara y aquí se omite.
- **`/pricing/` (`pageType: aggregate`) nunca declara su propio `hasOfferCatalog`.**
  Usa `WebPage.about[]`, un array de referencias por `@id` a cada `Service` cuyo precio
  ya vive en su página hoja. Un solo precio, una sola fuente de verdad, sin importar en
  cuántas páginas se muestre.
- **`Person` (Lisandra) se declara completa una sola vez, en `/about-lisandra/`.**
  Todo el resto del sitio la referencia por
  `{ "@id": "https://wonderlandsstudio.com/about-lisandra/#lisandra" }` — el `founder`
  de `Organization`, y más adelante el `author` de cada post del blog. El `@id` debe
  coincidir carácter por carácter en los dos lugares donde ya se usa (deck de boda WPB
  y deck de about-lisandra); una desalineación aquí no rompe el build pero sí rompe el
  grafo de entidades para Google sin que nada lo detecte automáticamente.

---

## 7. Abierto — necesita decisión o copy deck antes de codificarse

Con los cinco `pageType` validados y Fase 1 completa en copy EN, ya no queda nada que
bloquee arquitectura. Todo lo que sigue es contenido en español, verificación de datos
con Lisandra, o decisiones de negocio.

- **Verificar el año de fundación del estudio.** El deck de `/about-lisandra/` usa
  "since 2021" como placeholder — es una afirmación factual que un LLM puede citar,
  así que necesita el dato real antes de publicar, no una fecha razonable.
- **Confirmación de Lisandra sobre el drone.** El deck de video WPB afirma operación
  licenciada de drone; si no hay Part 107 + LAANC vigente, esa sección se reescribe antes
  de publicar.
- **Decisión de Lisandra sobre visibilidad de la dirección de PSL.** El deck de hub la
  deja condicionada: JSON-LD siempre la lleva, el texto visible en pantalla depende de si
  se oculta en Google Business Profile por ser domicilio particular.
- **Versiones ES de los siete decks existentes.** Ninguna se ha escrito todavía — se
  hacen después de aprobar cada versión EN, igual que se hizo con la dupla de boda.
- **Corrección pendiente en el deck de boda WPB ya entregado:** el link a
  `/port-st-lucie/wedding-photographer/` debe cambiar a `/port-st-lucie/#wedding` antes
  de implementarse (ver sección 3.4).
- **Verificar consistencia del `@id` de `Person`** entre el deck de boda WPB (donde se
  referencia por primera vez en `Organization.founder`) y el deck de `/about-lisandra/`
  (donde se declara completo). Ver sección 6.

---

## 8. Orden recomendado de lo que queda

**Fase 1 está completa en copy EN — las 4 páginas [Alto], `/pricing/`, los 2 hubs y
`/about-lisandra/` tienen deck aprobado.** Lo que sigue ya no es descubrimiento de
modelo, es producción de contenido y verificación:

1. Aplicar la corrección de link pendiente (sección 7) en el deck de boda WPB, antes de
   que Claude Code lea los siete decks en el Bloque 2.
2. Verificar con Lisandra: año de fundación, estado de la licencia de drone, y decisión
   sobre la dirección visible de PSL — los tres bloqueantes de contenido, no de código.
3. Versiones ES de los siete decks EN ya aprobados (boda foto, boda video, branding,
   hubs de ciudad, pricing, maternidad PSL, about-lisandra).
4. Con las versiones ES listas, el Bloque 2 (Sanity) y el Bloque 5 (primera página real)
   pueden ejecutarse sobre el alcance completo de Fase 1 de una sola vez, en vez de
   iterar página por página como se hizo durante el descubrimiento del modelo.

**El Bloque 2 (Sanity) ya puede ejecutarse en Claude Code sin riesgo de encontrar un
campo no previsto en el modelo.** Los cinco `pageType` están probados, la matriz de
`status` resuelve el ruteo entre fases, y el patrón de entidades compartidas por `@id`
(`Organization`, `PhotographyBusiness` por ciudad, `Person`) cubre todo lo que el sitio
necesita declarar en JSON-LD. Lo que queda en esta lista es contenido y verificación,
no arquitectura.
