# Plan de implementación — Wonderlands Studio

Basado en `CLAUDE.md` y en los copy decks piloto `docs/copy/wpb-wedding-photographer-copydeck.md`
y `docs/copy/wpb-wedding-videographer-copydeck.md`. No hay código en el repo todavía (solo
`CLAUDE.md` y estos dos copy decks), así que este plan parte de cero.

Los copy decks no son solo texto: traen el JSON-LD real de una página, la tabla de precios,
las reglas anti-canibalización y el checklist de validación. Uso ese contenido como fuente de
verdad siempre que decide algo — lo cito donde corresponde.

---

## 0. Supuestos explícitos

Todo lo que sigue está marcado inline con **[Supuesto]** donde invento algo que ni CLAUDE.md
ni los copy decks dicen literalmente. Lista resumida para revisar de un vistazo:

1. **[Confirmado, no supuesto]** `pricingCatalog` es un documento *singleton*. La regla 2 de
   CLAUDE.md dice "un único documento de Sanity" — singular, literal.
2. **[Supuesto]** Las páginas hub de ciudad (`/west-palm-beach/`, `/port-st-lucie/`) se modelan
   como `servicePage` con `serviceKey` vacío, no como un séptimo schema. `businessLocation`
   queda limitado a hechos físicos (NAP, geo, áreas, idiomas) — así lo describe CLAUDE.md
   literalmente, sin campos de copy.
3. **[Supuesto de diseño]** `src/data/business.ts` se **genera** en build time a partir de
   `businessLocation` en Sanity, en lugar de mantenerse a mano. Resuelve la tensión entre
   "importado de business.ts" (regla 3) y "vive en un documento de Sanity" (modelo de
   contenido). Ver sección 2.7.
4. **[Confirmado por evidencia]** El slug de ciudad no se traduce: `west-palm-beach` es igual
   en EN y ES en ambos copy decks. Solo el segmento de servicio cambia de idioma.
5. **[Supuesto de diseño]** La descripción de "qué incluye" de cada `Offer` (JSON-LD) y de la
   tabla de precios en pantalla es texto propio de cada `servicePage`, no de `pricingCatalog`.
   Precio/horas/nombre del tier sí vienen de `pricingCatalog`. Ver sección 2.3 — lo exige el
   hecho de que "The Full Experience" tiene distinta redacción de "incluye" en la página de
   foto vs. la de video, con el mismo precio.
6. **[Supuesto de diseño]** Los add-ons (segundo fotógrafo, hora extra…) también viven en
   `pricingCatalog` como catálogo global con precio. Cada `servicePage` selecciona cuáles
   mostrar y en qué orden — nunca escribe un precio de add-on directamente.
7. **[Supuesto]** `testimonial.quote` existe en EN y ES, redactado nativamente como el resto
   del copy del sitio (no traducción automática).
8. **[Supuesto]** "Mínimo 12 fotos" es una convención del copy deck piloto (página de boda),
   no un mínimo sitewide en el schema. Se deja como validación blanda/lint por tipo de
   contenido, no como `Rule.required().min(12)` global en `galleryItem`.
9. **[Supuesto]** `post` (blog) vive en `/blog/[slug]/` y `/es/blog/[slug]/` con slug propio
   por idioma — CLAUDE.md no lo especifica; lo asumo por consistencia con el resto del sitio.
10. **[Inferido del copy deck]** `isRelatedTo` entre `Service` hermanos exige una referencia
    `relatedService` **en el mismo idioma** (EN↔EN, ES↔ES) — así cruzan los dos copy decks.
11. **[Supuesto]** `/pricing/` ↔ `/es/precios/` y `/about-lisandra/` ↔ `/es/sobre-lisandra/`
    son páginas de archivo literal, no parte de la matriz combinatoria ciudad×servicio.
12. **[Supuesto]** Existen dos schemas adicionales no listados en CLAUDE.md pero necesarios
    para que el JSON-LD compile: `siteSettings` (singleton, nodo `Organization`) y `person`
    (Lisandra, referenciada como `founder`). Ver sección 2.8.

---

## 1. Estructura de carpetas

```
web-wondelandstudio/
├── astro.config.ts
├── package.json
├── tsconfig.json                      # strict: true
├── .env.example
├── CLAUDE.md
├── docs/
│   ├── PLAN.md
│   └── copy/                          # copy decks fuente — referencia editorial, no se importan en build
├── public/
│   ├── fonts/
│   └── robots.txt
├── scripts/
│   ├── check-tokens.ts                # falla el build si queda un {{TOKEN}} sin resolver (CLAUDE.md regla 4)
│   ├── generate-business-data.ts      # Sanity businessLocation -> src/data/business.ts (ver 2.7)
│   ├── check-duplicate-copy.ts        # solapamiento de párrafos entre páginas hermanas (regla 7)
│   └── check-route-reciprocity.ts     # hreflang + relatedService recíprocos, alimenta pnpm test
├── sanity/
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   └── schemas/
│       ├── index.ts
│       ├── documents/
│       │   ├── businessLocation.ts
│       │   ├── pricingCatalog.ts
│       │   ├── servicePage.ts
│       │   ├── testimonial.ts
│       │   ├── post.ts
│       │   ├── galleryItem.ts
│       │   ├── person.ts              # [Supuesto 12]
│       │   └── siteSettings.ts        # [Supuesto 12] singleton
│       └── objects/
│           ├── seoMeta.ts
│           ├── faqItem.ts
│           ├── pricingTier.ts
│           ├── addOn.ts
│           ├── offerOverride.ts       # tierKey + descripción propia de la página
│           ├── videoEmbed.ts
│           └── pageSection.ts         # bloque H2 + portable text, ver 2.3
├── src/
│   ├── data/
│   │   └── business.ts                # generado — NAP tipado, único punto de import (regla 3)
│   ├── i18n/
│   │   ├── routes.ts                  # mapa central de slugs EN<->ES (sección 3)
│   │   ├── ui.ts                      # strings de interfaz fijos (botones, labels de nav)
│   │   └── locales.ts
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts
│   │   │   ├── queries/
│   │   │   │   ├── servicePage.ts
│   │   │   │   ├── pricingCatalog.ts
│   │   │   │   ├── businessLocation.ts
│   │   │   │   ├── testimonial.ts
│   │   │   │   ├── post.ts
│   │   │   │   └── galleryItem.ts
│   │   │   └── image.ts               # urlFor + helpers AVIF/WebP
│   │   ├── jsonld/
│   │   │   ├── partials/
│   │   │   │   ├── organization.ts    # @id #organization
│   │   │   │   ├── location.ts        # @id .../#location, parametrizado por businessLocation
│   │   │   │   └── person.ts          # @id about-lisandra/#lisandra
│   │   │   ├── buildServiceGraph.ts   # compone el @graph completo de una servicePage
│   │   │   ├── buildFaqNode.ts
│   │   │   ├── buildBreadcrumbNode.ts
│   │   │   ├── buildVideoObjectNode.ts
│   │   │   └── types.ts
│   │   ├── hreflang.ts                # deriva <link alternate> desde routes.ts
│   │   └── seo.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ServicePageLayout.astro
│   ├── components/
│   │   ├── seo/{JsonLd.astro, HreflangLinks.astro}
│   │   ├── pricing/{PricingTable.astro, AddOnsList.astro}
│   │   ├── media/{ResponsiveImage.astro, VideoEmbed.astro}   # VideoEmbed: preload=none, click-to-load
│   │   ├── faq/FaqAccordion.astro
│   │   └── nav/{Header.astro, Footer.astro, LanguageSwitch.astro}
│   └── pages/
│       ├── index.astro                                        # /
│       ├── es/index.astro                                     # /es/
│       ├── pricing/index.astro   +  es/precios/index.astro     # literales, ver Supuesto 11
│       ├── about-lisandra/index.astro  +  es/sobre-lisandra/index.astro
│       ├── portfolio/[category]/index.astro  +  es/portafolio/[categoria]/index.astro
│       └── [...path].astro                                    # matriz ciudad×servicio, ver sección 3
└── tests/
    ├── hreflang.test.ts                # recorre el sitemap, exige reciprocidad (regla 6)
    ├── duplicate-copy.test.ts          # wrapper de scripts/check-duplicate-copy.ts
    └── performance-budget.test.ts      # LCP/CLS/JS inicial (regla 8), corre contra `pnpm build`
```

**Por qué un solo `[...path].astro`** en vez de una carpeta por URL literal: la matriz
ciudad×servicio×idioma va a crecer (hoy 2 ciudades × 2 servicios documentados, pero la tabla
de rutas de CLAUDE.md ya lista `brand-photography` y `maternity-photographer`). Un archivo por
ruta significa que alguien puede crear `es/west-palm-beach/fotografo-bodas/` (sin el `de`) y
nada lo detecta hasta que un test de hreflang lo note en producción. Con rutas derivadas de
`src/i18n/routes.ts`, un slug mal escrito no compila. Ver sección 3 para la alternativa
descartada y el trade-off completo.

---

## 2. Modelo de datos de Sanity

### 2.1 `businessLocation`

Solo hechos físicos — sin copy editorial (Supuesto 2). Un documento por ciudad (WPB, PSL).

| Campo | Tipo | Notas |
|---|---|---|
| `citySlug` | string, enum | `west-palm-beach` \| `port-st-lucie` — debe existir en `routes.ts` |
| `displayName` | string | "West Palm Beach" |
| `streetAddress` | string | puede contener `{{TOKEN}}` en dev; `check-tokens.ts` bloquea el build si llega así a producción |
| `addressLocality` / `addressRegion` / `postalCode` | string | |
| `phone` | string | formato E.164 para JSON-LD (`+1-561-260-3245`) + display separado si hace falta |
| `geo` | object `{lat, lng}` | ambos campos aceptan token hasta tener coordenadas reales |
| `areaServed` | array de `{type: 'City'|'AdministrativeArea', name}` | orden = orden de aparición en `areaServed` del JSON-LD |
| `knowsLanguage` | array de string | `['en-US', 'es-US']` |
| `priceRange` | string | opcional — el copy deck solo lo trae en WPB, no en PSL |
| `paymentAccepted` | array de string | `['Cash', 'Credit Card', 'Zelle']` |
| `isPrimary` | boolean | WPB=true — para desambiguar cuál ubicación es el `parentOrganization` por defecto si hiciera falta |

### 2.2 `servicePage`

Una por combinación servicio+ciudad+idioma (CLAUDE.md, literal), **o** ciudad+idioma con
`serviceKey` vacío para las páginas hub (Supuesto 2).

| Campo | Tipo | Notas |
|---|---|---|
| `language` | string enum | `en` \| `es` |
| `serviceKey` | string enum, nullable | referencia a la clave canónica en `routes.ts` (`wedding-photographer`, etc.); vacío = página hub de ciudad |
| `citySlug` | reference/string | debe existir en `businessLocation` |
| `h1` | string, required | |
| `answerParagraph` | text, required | **validación custom: máx 65 palabras** (CLAUDE.md, literal) |
| `metaTitle` | string | validación blanda ~60 car. (los copy decks miden 57–59) |
| `metaDescription` | string | validación blanda ~155 car. |
| `targetQuery` / `secondaryQueries` | string / array | **[Supuesto]** metadata de brief SEO, no se renderiza — solo referencia editorial |
| `sections` | array de `pageSection` | ver 2.3 — bloques modulares con H2 propio, no una lista fija de secciones |
| `offerCatalog` | array de `offerOverride` | ver 2.3 |
| `addOnsSelection` | array de referencias a `pricingCatalog.addOns[].key` + orden | qué add-ons mostrar en esta página |
| `faqs` | array de `faqItem` | **mínimo 4** (CLAUDE.md); los copy decks traen 6 y 7 |
| `heroImage` | reference a `galleryItem` | en la página de video, el hero es un frame fijo tratado como foto — no un campo de schema distinto, solo una convención editorial |
| `gallery` | array de referencias a `galleryItem` | sin mínimo hardcodeado en el schema (Supuesto 8); lint blando en CI |
| `videoEmbeds` | array de `videoEmbed` | solo relevante en páginas tipo "videographer"; alimenta `VideoObject` condicional (ver 4.4) |
| `relatedService` | reference a otro `servicePage` | mismo idioma (Supuesto 10) — alimenta `isRelatedTo` recíproco |
| `bioTeaser` | reference a `person` | opcional — el bloque "About Lisandra" del copy deck de foto no aparece en el de video; si se repite en más páginas, tratarlo como componente renderizado desde `person.bio`, no como párrafo copiado, para no disparar `check-duplicate-copy.ts` |

**`sections` como bloques modulares, no campos fijos** — evidencia concreta: la página de
fotografía tiene "How booking works" como H2 propio; la de video **no lo tiene**, en su lugar
trae "Gear and crew" y "Airspace, venues and logistics". Si `servicePage` tuviera campos fijos
(`bookingSteps`, `venuesList`…) uno de los dos documentos tendría campos vacíos sin sentido, y
cualquier página futura con una sección nueva exigiría una migración de schema. Un array de
bloques `{ heading, body: portableText, blockType? }` cubre ambos casos sin tocar el schema.

### 2.3 Precio: `pricingCatalog` (singleton) + overrides por página

Regla 2 de CLAUDE.md es categórica: un único documento. Pero el mismo tier tiene **distinta
redacción de "incluye"** según la página — mismo precio y horas, distinta frase (Supuesto 5):

- Foto, "The Full Experience": *"Photography + cinematic film with vows + drone + vertical reel"*
- Video, "The Full Experience": *"Cinematic film with real vows, drone and vertical reel"*

**`pricingCatalog` (singleton):**

| Campo | Tipo | Notas |
|---|---|---|
| `collections` | array de `pricingTier` | `{ key, name_en, name_es, price (number USD), coverageHours, category, popularHighlight: boolean, baseIncludes_en/es: array<string>, sortOrder }` |
| `addOns` | array de `addOn` | `{ key, label_en, label_es, price (number, nullable si es "additional hour" sin precio fijo listado), sortOrder }` |

**En `servicePage.offerCatalog`** solo vive `{ tierKey, includedDescription_en, includedDescription_es }`
— el precio y las horas **siempre** se resuelven en build time desde `pricingCatalog` por
`tierKey`, nunca se copian. Esto es lo que hace que "los precios viven en un único documento"
siga siendo cierto aunque la redacción varíe por página: si el precio cambia en Sanity, las
dos páginas se actualizan solas; si la redacción de "incluye" cambia, es edición de una sola
página sin tocar el catálogo.

**Alternativa descartada:** duplicar el objeto `Offer` completo (precio incluido) dentro de
cada `servicePage`. Técnicamente el número seguiría "viviendo" en Sanity, pero en dos lugares
— exactamente el patrón de precios contradictorios que CLAUDE.md dice estar arreglando.

### 2.4 `testimonial`

| Campo | Tipo | Notas |
|---|---|---|
| `authorName` | string | |
| `quote_en` / `quote_es` | text | **[Supuesto 7]** redactado nativo, no traducción automática |
| `category` | string enum | `wedding` \| `brand` \| `maternity` — filtra, según CLAUDE.md literal |
| `city` | reference | filtra, según CLAUDE.md literal |
| `verified` | boolean, required | **solo `verified: true` sale en schema** — gate duro antes de tocar JSON-LD (regla 5) |
| `sourceUrl` | url, opcional | link a la reseña original (Google/Instagram) para poder verificar `verified` |
| `dateReceived` | date | |

**Filtrado en query, no en `servicePage`:** el bloque "What couples say" se resuelve con una
query `testimonial` por `category` + `city` en el momento de renderizar, no con una lista
curada guardada en el documento de la página — evita listas de testimonios que quedan
desactualizadas cuando se agregan reseñas nuevas.

### 2.5 `post`

| Campo | Tipo | Notas |
|---|---|---|
| `title_en` / `title_es` | string | |
| `slug_en` / `slug_es` | slug | **[Supuesto 9]** — patrón de ruta no cubierto por CLAUDE.md ni los copy decks |
| `body_en` / `body_es` | portable text | |
| `excerpt_en` / `excerpt_es` | text | |
| `coverImage` | reference a `galleryItem` | |
| `category` / `tags` | string / array | |
| `author` | reference a `person` | |
| `publishedAt` | datetime | |

### 2.6 `galleryItem`

| Campo | Tipo | Notas |
|---|---|---|
| `image` | image asset | AVIF con fallback WebP en el pipeline de output, no en el schema |
| `alt_en` | string, required | obligatorio — CLAUDE.md literal |
| `alt_es` | string, required | obligatorio — CLAUDE.md literal |
| `category` | string enum | debe alinear con las categorías de `/portfolio/[category]/` |
| `city` | reference | |
| `credit` | string, opcional | |
| `sortOrder` | number | |

### 2.7 `src/data/business.ts` — generado, no manual

Regla 3 dice "importado de `src/data/business.ts`, jamás escrito a mano en una plantilla". El
modelo de contenido dice que el NAP vive en `businessLocation` (Sanity). Dos fuentes de verdad
para el mismo dato es el problema que la regla 3 existe para evitar.

**Recomendación:** `scripts/generate-business-data.ts` corre antes del build (`pnpm build` lo
invoca), consulta los dos documentos `businessLocation` en Sanity y escribe un
`src/data/business.ts` tipado y *git-ignored*. Las plantillas solo hacen
`import { WPB, PSL } from '~/data/business.ts'` — nunca tocan el cliente de Sanity para NAP —
y `check-tokens.ts` corre sobre ese archivo generado para abortar el build si algo sigue en
`{{TOKEN}}`.

| Opción | Trade-off |
|---|---|
| **A — generado desde Sanity (recomendado)** | Sanity sigue siendo la única fuente editable; `business.ts` es un artefacto de build. Costo: un paso más en el pipeline, y el build necesita acceso de red a Sanity (ya lo necesita para todo lo demás). |
| B — `business.ts` escrito a mano, `businessLocation` se reduce a geo/áreas/idiomas | Cero codegen. Riesgo real: alguien edita el NAP en el Studio de Sanity pensando que es la fuente viva, y queda desincronizado silenciosamente del `business.ts` real — el mismo síntoma que ya existe con los tres precios contradictorios que CLAUDE.md quiere eliminar. |

Recomiendo A porque el riesgo de B es estructuralmente el mismo problema que motivó la regla 2.

### 2.8 Schemas adicionales no listados en CLAUDE.md

**[Supuesto 12]** — necesarios para que el `@graph` de JSON-LD compile, ninguno de los dos
está en la lista de 6 schemas de CLAUDE.md:

- **`siteSettings`** (singleton): `orgName`, `logoAsset`, `sameAs` (Instagram/TikTok/Facebook —
  `@wonderlandsSTUDIO` según CLAUDE.md), `founder` (reference a `person`), `defaultOgImage`.
  Alimenta el nodo `Organization` (`#organization`), que es idéntico en todas las páginas.
- **`person`**: `name`, `role`, `bio_en`, `bio_es`, `photo`. Usado como `founder` en
  `Organization`, como contenido de `/about-lisandra/`, y como `author` de `post`.

Si se prefiere no agregar schemas nuevos, la alternativa es hardcodear estos datos en
`src/lib/jsonld/partials/organization.ts` como constantes de código. Lo descarto porque el
logo, el `sameAs` y la bio de Lisandra son exactamente el tipo de dato que un no-developer va
a querer editar sin deploy — y porque `/about-lisandra/` necesita ese contenido de todas
formas.

---

## 3. Routing bilingüe: slugs por idioma desde un mapa central

### 3.1 El mapa central

`src/i18n/routes.ts` — la única fuente de verdad para qué slug corresponde a qué idioma.
Confirmado por los dos copy decks: el segmento de ciudad **no se traduce**, solo el de
servicio.

```ts
// src/i18n/routes.ts — forma, no implementación completa
export const cities = {
  'west-palm-beach': { en: 'west-palm-beach', es: 'west-palm-beach' },
  'port-st-lucie':   { en: 'port-st-lucie',   es: 'port-st-lucie' },
} as const;

export const services = {
  'wedding-photographer':   { en: 'wedding-photographer',   es: 'fotografo-de-bodas' },
  'wedding-videographer':   { en: 'wedding-videographer',   es: 'videografo-de-bodas' },
  'brand-photography':      { en: 'brand-photography',      es: 'fotografia-de-marca' },
  'maternity-photographer': { en: 'maternity-photographer', es: 'fotografo-de-embarazo' },
} as const;

// Qué combinaciones ciudad×servicio existen realmente (no todas las ciudades
// ofrecen todos los servicios — CLAUDE.md solo lista maternity-photographer en PSL)
export const cityServiceMatrix: Record<CityKey, ServiceKey[]> = {
  'west-palm-beach': ['wedding-photographer', 'wedding-videographer', 'brand-photography'],
  'port-st-lucie':   ['maternity-photographer'],
};
```

`cityServiceMatrix` existe porque la matriz **no es un producto cartesiano completo** — la
tabla de rutas de CLAUDE.md no tiene `/port-st-lucie/wedding-photographer/` como página propia
(aunque el copy deck sí *enlaza* ahí como "Port St. Lucie wedding coverage" — posible
inconsistencia entre el copy deck piloto y la tabla de rutas oficial; lo marco para resolver
con el usuario, no lo resuelvo por mi cuenta).

### 3.2 Cómo se generan las páginas: opciones y recomendación

| Opción | Descripción | Trade-off |
|---|---|---|
| **A — archivo por URL literal** | Una carpeta `src/pages/west-palm-beach/wedding-photographer/index.astro`, otra `src/pages/es/west-palm-beach/fotografo-de-bodas/index.astro`, etc. | Explícito, cero indirección, el router de Astro "simplemente funciona". Pero el slug queda hardcodeado en el nombre de carpeta — nada impide que alguien cree `fotografo-bodas` (sin "de") y quede huérfano de `routes.ts`, silenciosamente roto hasta que el test de hreflang lo pesque en CI. No escala: cada ciudad o servicio nuevo son N carpetas nuevas a mano. |
| **B — ruta dinámica derivada de `routes.ts` (recomendado)** | Un único `src/pages/[...path].astro` con `getStaticPaths()` que itera `cityServiceMatrix` × `cities` × `services` × idioma, resuelve el `servicePage` de Sanity correspondiente, y solo genera una ruta si el documento existe en Sanity (evita páginas fantasma sin contenido). | El slug SIEMPRE sale de `routes.ts` — un typo ahí rompe el build, no queda huérfano en producción. Agregar una ciudad o servicio nuevo es una línea en el mapa + un documento en Sanity, no archivos nuevos. Costo: una capa de indirección más para razonar "¿qué componente renderiza esta URL?" — se mitiga con `ServicePageLayout.astro` haciendo todo el trabajo visual y `[...path].astro` siendo solo el resolver de datos. |

**Recomendación: B**, solo para la matriz combinatoria ciudad×servicio. Las páginas que no son
parte de esa matriz (`/`, `/pricing/`, `/about-lisandra/`, `/portfolio/[category]/`) se quedan
como archivos literales — no ganan nada con la indirección porque no se multiplican.

`getStaticPaths()` en `[...path].astro`, forma:

```ts
export async function getStaticPaths() {
  const paths = [];
  for (const [city, allowedServices] of Object.entries(cityServiceMatrix)) {
    for (const service of allowedServices) {
      for (const lang of ['en', 'es'] as const) {
        const slug = [
          lang === 'es' ? 'es' : null,
          cities[city][lang],
          services[service][lang],
        ].filter(Boolean).join('/');
        const doc = await fetchServicePage({ city, service, lang }); // undefined si no existe -> no se genera la ruta
        if (doc) paths.push({ params: { path: slug }, props: { doc, city, service, lang } });
      }
    }
  }
  return paths;
}
```

### 3.3 hreflang recíproco desde el mismo mapa

`src/lib/hreflang.ts` deriva `getAlternate(city, service, lang)` de `routes.ts` — la misma
función que generó la ruta EN sabe construir la ruta ES equivalente, así que el `<link
rel="alternate">` nunca puede apuntar a un slug que `routes.ts` no reconozca. El test
`tests/hreflang.test.ts` (regla 6) sigue siendo necesario como red de seguridad — cubre el
caso en que existe la ruta EN pero el documento ES de Sanity no se publicó todavía — pero deja
de ser la única defensa contra un slug mal escrito.

---

## 4. Composición de JSON-LD por partials referenciados por `@id`

El copy deck ya trae el `@graph` completo de una página real. La composición no es un
problema de diseño abierto — es implementar exactamente esa forma para todas las páginas.

### 4.1 Nodos del `@graph` y de dónde sale cada uno

| Nodo | `@id` | Origen | Repetido en |
|---|---|---|---|
| `Organization` | `#organization` | `siteSettings` + `person` (founder) | **todas** las páginas — idéntico |
| `PhotographyBusiness` (location) | `{city}/#location` | `businessLocation` | todas las páginas de esa ciudad |
| `Service` | `{path}/#service` | `servicePage` + `pricingCatalog` (resuelto por `tierKey`) | propio de cada página |
| `FAQPage` | `{path}/#faq` | `servicePage.faqs` | propio de cada página |
| `BreadcrumbList` | (sin `@id` fijo) | derivado de `routes.ts` + `citySlug` | propio de cada página |
| `VideoObject` | condicional | `servicePage.videoEmbeds` | solo si el video es autoalojado — el copy deck de video lo dice explícito: "Si van en Vimeo o YouTube, el VideoObject lo declara la plataforma y aquí sobra" |
| `Review` / `AggregateRating` | — | **nunca** | prohibido hasta reseñas reales verificables (regla 5) |

### 4.2 Dónde vive la forma del JSON-LD: código vs. Sanity

| Opción | Descripción | Trade-off |
|---|---|---|
| A — JSON-LD como documento/objeto libre en Sanity | Un editor podría cambiar la forma del `@graph` sin deploy. | El schema.org es estructura, no copy — un editor sin querer rompe `hasOfferCatalog` o deja un `@id` huérfano, y el error no se detecta hasta el Rich Results Test manual en el PR. |
| **B — hechos en Sanity, forma en código (recomendado)** | `businessLocation`, `pricingCatalog`, `servicePage`, `person`, `siteSettings` dan los *datos*; `src/lib/jsonld/partials/*.ts` los *shapea* en nodos schema.org, tipados. | Un cambio de shape (agregar `VideoObject`, ajustar `isRelatedTo`) es un PR de código, revisable y testeable contra el Rich Results Test antes de mergear — que es exactamente el flujo que ya pide CLAUDE.md ("PR con salida de Rich Results Test"). Costo: agregar un tipo de nodo nuevo requiere tocar código, no solo el CMS. |

Recomiendo B: el flujo de trabajo de CLAUDE.md ya asume que el JSON-LD se valida por PR, lo
que solo tiene sentido si vive en código versionado.

### 4.3 `buildServiceGraph()` — forma de la composición

```ts
// src/lib/jsonld/buildServiceGraph.ts — forma, no implementación completa
function buildServiceGraph(ctx: ServicePageContext) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationPartial(ctx.siteSettings),                 // @id #organization, igual en todo el sitio
      locationPartial(ctx.businessLocation),                 // @id {city}/#location
      servicePartial(ctx),                                   // referencia al location por @id, no lo repite
      faqPartial(ctx.servicePage.faqs, ctx.canonicalUrl),
      breadcrumbPartial(ctx.breadcrumbTrail),
      ...(ctx.selfHostedVideos.map(videoObjectPartial)),     // [] si todo está en Vimeo/YouTube
    ],
  };
}
```

`servicePartial()` es el único nodo que resuelve precios: recibe `servicePage.offerCatalog`
(array de `{ tierKey, description }`) y para cada `tierKey` busca `name`/`price` en
`pricingCatalog.collections` — así el `Offer.price` de JSON-LD sale siempre del mismo lugar
que el número que se muestra en la tabla visible, sin duplicar el dato.

### 4.4 `isRelatedTo` recíproco

`servicePartial()` agrega `isRelatedTo: { '@id': ... }` solo si `servicePage.relatedService`
está seteado. La reciprocidad (foto → video **y** video → foto) no se puede garantizar solo
con una referencia unidireccional en Sanity — recomiendo que `scripts/check-route-reciprocity.ts`
verifique, igual que hace con hreflang, que si A referencia a B como `relatedService`, B
referencia de vuelta a A, y falle `pnpm test` si no.

### 4.5 `VideoObject` condicional

`servicePage.videoEmbeds[].platform` decide: `self-hosted` → se emite `VideoObject` con
`name`/`description`/`thumbnailUrl`/`uploadDate`/`contentUrl`; `vimeo` \| `youtube` → se omite
el nodo por completo, tal como especifica el copy deck de video. El componente
`VideoEmbed.astro` (carga bajo click, `preload="none"`, sin autoplay — regla de la página de
video) es independiente de esta decisión de JSON-LD; una cosa es cómo se sirve el HTML, otra
qué structured data se declara.

---

## 5. Abierto — necesita decisión del usuario, no la tomo por mi cuenta

- El copy deck de fotografía enlaza a `/port-st-lucie/wedding-photographer/`, pero
  `cityServiceMatrix` (derivada de la tabla de rutas de CLAUDE.md) no incluye ese servicio en
  PSL — solo `maternity-photographer`. Antes de implementar, hay que confirmar si PSL también
  ofrece fotografía de bodas (y la tabla de rutas de CLAUDE.md está incompleta) o si ese link
  del copy deck piloto es un placeholder a corregir.
- No hay copy deck para `brand-photography`, `maternity-photographer`, las páginas hub de
  ciudad, `/pricing/`, ni `/about-lisandra/` — el modelo de datos de este plan generaliza a
  partir de dos páginas de un solo tipo (servicio de boda en WPB). Cuando lleguen esos copy
  decks puede aparecer un campo que este plan no previó (ya pasó una vez: `videoEmbeds` y
  `VideoObject` condicional solo se descubrieron al leer el segundo deck).
