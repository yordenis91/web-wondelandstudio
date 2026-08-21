# Copy Deck — Hubs de ciudad
**`/west-palm-beach/` y `/port-st-lucie/` · Tercer tipo de página: índice, no vende nada por sí sola**

> **Qué resuelve este deck que los anteriores no:** boda y branding son páginas hoja —
> el usuario llega y decide. El hub es una página **índice**: su trabajo es repartir al
> visitante hacia la página hoja correcta, y sostener la entidad geográfica de la ciudad
> para SEO local. Es también la página que fuerza a resolver el problema que dejamos
> abierto en el PLAN.md: **qué pasa cuando un link apunta a un servicio que existe en la
> matriz pero todavía no tiene página construida.**

> **Tokens:** `{{WPB_STREET_ADDRESS}}` · `{{WPB_POSTAL_CODE}}` · `{{WPB_LAT}}` · `{{WPB_LNG}}`

---

## 0. El problema de ruteo, resuelto aquí

La matriz completa de servicios por ciudad (de tu documento original) tiene 9 líneas por
ciudad. Fase 1 solo construye 4. El hub tiene que listar servicios de las tres fases sin
que el sitio muestre links rotos ni el usuario caiga en páginas vacías.

**Regla de `routes.ts` que este deck exige:**

Cada entrada de la matriz servicio×ciudad tiene un `status`:

| status | Significa | Comportamiento en el hub |
|---|---|---|
| `active` | Tiene copy deck y página construida | Card clickeable, enlaza a la página |
| `planned` | Existe en la matriz, prioridad asignada, sin página aún | Card visible, sin link — o link al formulario de contacto con el servicio preseleccionado |
| — | No existe en la matriz de ese negocio | No aparece en el hub |

Esto es lo que le faltaba a la matriz declarada en CLAUDE.md: no basta con "existe o no
existe", hace falta un tercer estado intermedio. Con esto, el link a
`/port-st-lucie/wedding-photographer/` desde el copy deck de boda WPB deja de ser
ambiguo: hasta que ese `status` pase a `active`, el link apunta al hub de PSL
(`/port-st-lucie/#wedding` — ancla a la card correspondiente), no a una URL que no existe.

**Esto también cambia el Bloque 1.** `getAllRoutes()` debe devolver únicamente rutas
`active` para el sitemap; `getServiceMatrix(city)` (nueva función) devuelve las 9 líneas
completas con su `status`, para que el hub las pueda renderizar todas.

---

## 1. Ficha técnica — ambos hubs

| Campo | WPB | PSL |
|---|---|---|
| URL EN | `/west-palm-beach/` | `/port-st-lucie/` |
| URL ES | `/es/west-palm-beach/` | `/es/port-st-lucie/` |
| Query objetivo | photographer west palm beach | photographer port st lucie |
| Rol en el funnel | Entidad geográfica + distribución hacia servicios | Igual, mercado distinto |

Estas páginas **no** llevan prioridad de ads — no son la puerta de entrada de campaña
(esa es la página de servicio específica), son la puerta de entrada de **navegación y de
autoridad geográfica**. Google necesita una página por ciudad que agregue todo el
`LocalBusiness` de esa ubicación; sin ella, el `Service` de cada página hoja queda
huérfano de un `@id` de ubicación consistente.

**Meta title WPB** (52 car.)
`Photographer in West Palm Beach, FL | Wonderlands Studio`

**Meta description WPB** (151 car.)
`Wedding, brand and family photography and video in West Palm Beach. Bilingual studio serving Palm Beach County. See services, pricing and recent work.`

**Meta title PSL** (49 car.)
`Photographer in Port St. Lucie, FL | Wonderlands Studio`

**Meta description PSL** (148 car.)
`Quinceañera, maternity and wedding photography and video in Port St. Lucie. Bilingual studio serving Tradition and St. Lucie West. Pricing and recent work.`

---

## 2. Contenido — West Palm Beach (Inglés)

## H1
**Photographer and Videographer in West Palm Beach, FL**

## Párrafo-respuesta (59 palabras)

Wonderlands Studio is a bilingual photography and video studio based in West Palm Beach,
Florida, serving Palm Beach County. We specialize in weddings, brand and business
content, and family sessions, with collections from $250 for portraits to $5,500 for
full-day wedding coverage. Every session includes professional retouching. English and
Spanish spoken. (561) 260-3245.

## H2 — What we shoot in West Palm Beach

*Esta sección es la que resuelve el `status` planned/active. Cada card lleva el precio
"desde", una línea de una oración, y el link condicionado por status.*

**Weddings & Elopements** — from $1,200
Editorial photography and cinematic film for Palm Beach County weddings, one team for
both. [See wedding photography →](/west-palm-beach/wedding-photographer/) ·
[See wedding videography →](/west-palm-beach/wedding-videographer/)

**Brand & Business Content** — from $700
Headshots, real estate and personal branding photography, one-time or as a monthly
content partnership. [See branding services →](/west-palm-beach/brand-photography/)

**Video Production** — from $550 *(coming soon)*
Commercial video, interviews and social content production for businesses.
*Página en construcción — [consulta disponibilidad por WhatsApp](wa.me link) mientras tanto.*

**Quinceañeras** — from $1,500 *(coming soon)*
Photography and film for the Quince celebration. Our quinceañera focus is currently
strongest in Port St. Lucie — [see quinceañera coverage there →](/port-st-lucie/#quinceanera).

**Maternity & Family** — from $350
Family, maternity and portrait sessions in our studio or on location.
*Página en construcción — [consulta disponibilidad por WhatsApp](wa.me link) mientras tanto.*

*Nota de implementación: las tres cards "coming soon" no llevan `Offer` en JSON-LD hasta
que exista la página. Llevan el precio en texto plano visible, no en datos estructurados
— eso evita declarar un `Service` sin `url` propia, que Google penaliza como oferta sin
resolver.*

## H2 — Where we work in Palm Beach County

*(reusa el bloque de venues del deck de boda, sección "Venues we cover" — es contenido
geográfico legítimo de repetir en la página padre, a diferencia de los párrafos de venta)*

The Breakers, the Flagler Museum, the Norton Museum of Art, the Kravis Center, Grandview
Gardens, Worth Avenue, Clematis Street, and the downtown waterfront — plus Palm Beach
Gardens, Wellington, Jupiter and Boca Raton, all with no travel fee.

## H2 — Our West Palm Beach studio

Address, hours, and a photo of the actual space. Climate-controlled, cinematic lighting,
optimized for newborn sessions and headshots alike.

`{{WPB_STREET_ADDRESS}}, West Palm Beach, FL {{WPB_POSTAL_CODE}}`
[Get directions] · [(561) 260-3245]

## H2 — Recent work in West Palm Beach
*[Grid de portfolio filtrado por city: wpb. Alimentado por galleryItem.]*

## H2 — Frequently asked questions

**Do you have a physical studio in West Palm Beach?**
Yes, our studio is based in West Palm Beach and we also shoot on location throughout
Palm Beach County with no travel fee.

**What services do you offer in West Palm Beach specifically?**
Weddings, brand and business content are our primary focus in this market. We also cover
family, maternity and portrait sessions, and quinceañeras on request.

**Do you also work in Port St. Lucie?**
Yes — Port St. Lucie is our second location, with its own studio and a focus on
quinceañeras, maternity and family. [See Port St. Lucie services →](/port-st-lucie/)

## CTA final
**Not sure which service fits?** Tell us what you're planning and we'll point you to the
right page — or just answer your questions directly. [WhatsApp (561) 260-3245]

---

## 3. Contenido — Port St. Lucie (Inglés)

Mismo patrón, invertido: aquí lo `active` en Fase 1 es solo maternidad, y bodas/quince
son `planned`.

## H1
**Photographer and Videographer in Port St. Lucie, FL**

## Párrafo-respuesta (57 palabras)

Wonderlands Studio serves Port St. Lucie, Florida, from our studio at 943 SE Brookedge
Avenue E, with a focus on quinceañeras, maternity and family photography for the area's
growing Hispanic community. Collections start at $500. We also cover weddings throughout
Tradition and St. Lucie West. Bilingual studio. `{{PSL_PHONE_772}}`.

## H2 — What we shoot in Port St. Lucie

**Maternity & Family** — from $500
Editorial maternity and family sessions in our Port St. Lucie studio or on location.
[See maternity photography →](/port-st-lucie/maternity-photographer/)

**Quinceañeras** — from $1,500 *(coming soon)*
Photography and film for the Quince celebration, built for Port St. Lucie's Hispanic
community. *Página en construcción — [consulta por WhatsApp](wa.me link) mientras tanto.*

**Weddings & Elopements** — from $1,200 *(coming soon)*
Full wedding coverage throughout Tradition and St. Lucie West.
*Página en construcción — [consulta por WhatsApp](wa.me link) mientras tanto.*

## H2 — Where we work in Port St. Lucie

Tradition Square, St. Lucie West, and the surrounding Port St. Lucie area — no travel fee
for local venues.

## H2 — Our Port St. Lucie studio

`943 SE Brookedge Avenue E, Port Saint Lucie, FL 34983`
[Get directions] · `{{PSL_PHONE_772}}`

*Decisión confirmada por Lisandra: la dirección se muestra en texto visible en la
página, igual que en West Palm Beach. El JSON-LD la lleva también, para consistencia de
`LocalBusiness`.*

## H2 — Recent work in Port St. Lucie
*[Grid filtrado por city: psl.]*

## H2 — Frequently asked questions

**Where exactly is your Port St. Lucie studio?**
We're located in Port St. Lucie, serving Tradition, St. Lucie West and the surrounding
area. Message us for exact directions when you book.

**Do you serve the Hispanic community in Port St. Lucie?**
Yes — our Port St. Lucie location is fully bilingual and quinceañeras are one of our main
focuses here, alongside maternity and family sessions.

**Can you also cover a wedding in West Palm Beach?**
Yes — West Palm Beach is our primary wedding market, with full collections and pricing.
[See West Palm Beach weddings →](/west-palm-beach/wedding-photographer/)

## CTA final
**Planning a session in Port St. Lucie?** Message us in English or Spanish and we'll
confirm availability the same day. [WhatsApp `{{PSL_PHONE_772}}`]

---

## 4. Contenido — West Palm Beach (Español)

## H1
**Fotógrafo y Videógrafo en West Palm Beach, FL**

## Párrafo-respuesta (59 palabras)

Wonderlands Studio es un estudio bilingüe de fotografía y video con sede en West Palm
Beach, Florida, que atiende todo el condado de Palm Beach. Nos especializamos en
bodas, contenido de marca y negocio, y sesiones familiares, con colecciones desde $250
para retratos hasta $5,500 para cobertura de boda de día completo. Cada sesión incluye
retoque profesional. Atendemos en español e inglés. (561) 260-3245.

## H2 — Qué cubrimos en West Palm Beach

**Bodas y ceremonias civiles** — desde $1,200
Fotografía editorial y video cinematográfico para bodas en el condado de Palm Beach, un
solo equipo para las dos cosas. [Ver fotografía de boda →](/es/west-palm-beach/fotografo-de-bodas/) ·
[Ver video de boda →](/es/west-palm-beach/videografo-de-bodas/)

**Marca y contenido de negocio** — desde $700
Headshots, bienes raíces y fotografía de marca personal, como sesión única o como
alianza mensual de contenido. [Ver servicios de marca →](/es/west-palm-beach/fotografia-de-marca/)

**Producción de video** — desde $550 *(próximamente)*
Video comercial, entrevistas y producción de contenido para redes sociales.
*Página en construcción — [consulta disponibilidad por WhatsApp](wa.me link) mientras tanto.*

**Quinceañeras** — desde $1,500 *(próximamente)*
Fotografía y video para la celebración de Quince. Nuestro enfoque de quinceañeras es
hoy más fuerte en Port St. Lucie — [ver cobertura de quinceañeras allá →](/es/port-st-lucie/#quinceanera).

**Embarazo y familia** — desde $350
Sesiones familiares, de embarazo y de retrato en nuestro estudio o en locación.
*Página en construcción — [consulta disponibilidad por WhatsApp](wa.me link) mientras tanto.*

## H2 — Dónde trabajamos en el condado de Palm Beach

The Breakers, el Flagler Museum, el Norton Museum of Art, el Kravis Center, Grandview
Gardens, Worth Avenue, Clematis Street y el waterfront del downtown — más Palm Beach
Gardens, Wellington, Jupiter y Boca Raton, todo sin cargo por traslado.

## H2 — Nuestro estudio en West Palm Beach

Dirección, horario y una foto del espacio real. Con climatización e iluminación
cinematográfica, optimizado tanto para sesiones de recién nacidos como para headshots.

`{{WPB_STREET_ADDRESS}}, West Palm Beach, FL {{WPB_POSTAL_CODE}}`
[Cómo llegar] · [(561) 260-3245]

## H2 — Trabajos recientes en West Palm Beach
*[Grid de portafolio filtrado por city: wpb.]*

## H2 — Preguntas frecuentes

**¿Tienen un estudio físico en West Palm Beach?**
Sí, nuestro estudio está en West Palm Beach y también trabajamos en locación en todo el
condado de Palm Beach, sin cargo por traslado.

**¿Qué servicios ofrecen específicamente en West Palm Beach?**
Bodas y contenido de marca y negocio son nuestro enfoque principal en este mercado.
También cubrimos sesiones familiares, de embarazo y de retrato, y quinceañeras bajo
pedido.

**¿También trabajan en Port St. Lucie?**
Sí — Port St. Lucie es nuestra segunda sede, con su propio estudio y un enfoque en
quinceañeras, embarazo y familia. [Ver servicios en Port St. Lucie →](/es/port-st-lucie/)

## CTA final
**¿No sabes qué servicio te conviene?** Cuéntanos qué estás planeando y te guiamos a la
página correcta — o respondemos tus preguntas directamente. [WhatsApp (561) 260-3245]

---

## 5. Contenido — Port St. Lucie (Español)

*El párrafo-respuesta lidera con quinceañeras, no con embarazo, aunque embarazo sea el
único `status: active` de momento — es la página más relevante del sitio para el
público hispano, y el orden de aparición de las cards no tiene que ser el orden de
disponibilidad.*

## H1
**Fotógrafo y Videógrafo en Port St. Lucie, FL**

## Párrafo-respuesta (58 palabras)

Wonderlands Studio atiende Port St. Lucie, Florida, desde nuestro estudio en 943 SE
Brookedge Avenue E, con un enfoque en quinceañeras para la creciente comunidad hispana
de la zona, además de embarazo y familia. Las colecciones de embarazo empiezan en $500.
También cubrimos bodas en Tradition y St. Lucie West. Estudio bilingüe. `{{PSL_PHONE_772}}`.

## H2 — Qué cubrimos en Port St. Lucie

**Quinceañeras** — desde $1,500 *(próximamente)*
Fotografía y video para la celebración de Quince, pensados para la comunidad hispana de
Port St. Lucie. *Página en construcción — [consulta por WhatsApp](wa.me link) mientras
tanto.*

**Embarazo y familia** — desde $500
Sesiones editoriales de embarazo y familia en nuestro estudio de Port St. Lucie o en
locación. [Ver fotografía de embarazo →](/es/port-st-lucie/fotografo-de-embarazo/)

**Bodas y ceremonias civiles** — desde $1,200 *(próximamente)*
Cobertura completa de boda en Tradition y St. Lucie West.
*Página en construcción — [consulta por WhatsApp](wa.me link) mientras tanto.*

## H2 — Dónde trabajamos en Port St. Lucie

Tradition Square, St. Lucie West y los alrededores de Port St. Lucie — sin cargo por
traslado en locaciones locales.

## H2 — Nuestro estudio en Port St. Lucie

`943 SE Brookedge Avenue E, Port Saint Lucie, FL 34983`
[Cómo llegar] · `{{PSL_PHONE_772}}`

## H2 — Trabajos recientes en Port St. Lucie
*[Grid filtrado por city: psl.]*

## H2 — Preguntas frecuentes

**¿Dónde queda exactamente su estudio en Port St. Lucie?**
Estamos en Port St. Lucie, atendiendo Tradition, St. Lucie West y los alrededores.
Escríbenos para la dirección exacta al reservar.

**¿Atienden a la comunidad hispana en Port St. Lucie?**
Sí — nuestra sede de Port St. Lucie es completamente bilingüe y las quinceañeras son
uno de nuestros enfoques principales aquí, junto con embarazo y familia.

**¿También pueden cubrir una boda en West Palm Beach?**
Sí — West Palm Beach es nuestro mercado principal de bodas, con colecciones y precios
completos. [Ver bodas en West Palm Beach →](/es/west-palm-beach/fotografo-de-bodas/)

## CTA final
**¿Planeando una sesión en Port St. Lucie?** Escríbenos en español o inglés y
confirmamos disponibilidad el mismo día. [WhatsApp `{{PSL_PHONE_772}}`]

---

## 6. JSON-LD

Los hubs cargan el `PhotographyBusiness` completo (no solo lo referencian por `@id` como
hacen las páginas hoja) más un `ItemList` de los servicios activos — **nunca** de los
`planned`, para no declarar `Service` sin `url` resoluble.

```json
{
  "@type": "PhotographyBusiness",
  "@id": "https://wonderlandsstudio.com/west-palm-beach/#location",
  "name": "Wonderlands Studio — West Palm Beach",
  "url": "https://wonderlandsstudio.com/west-palm-beach/",
  "telephone": "+1-561-260-3245",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{WPB_STREET_ADDRESS}}",
    "addressLocality": "West Palm Beach",
    "addressRegion": "FL",
    "postalCode": "{{WPB_POSTAL_CODE}}",
    "addressCountry": "US"
  },
  "hasMap": "https://maps.google.com/?cid=REPLACE_WITH_GBP_CID",
  "makesOffer": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "item": { "@id": "https://wonderlandsstudio.com/west-palm-beach/wedding-photographer/#service" } },
      { "@type": "ListItem", "position": 2, "item": { "@id": "https://wonderlandsstudio.com/west-palm-beach/wedding-videographer/#service" } },
      { "@type": "ListItem", "position": 3, "item": { "@id": "https://wonderlandsstudio.com/west-palm-beach/brand-photography/#service" } }
    ]
  }
}
```

`makesOffer` solo lista los tres `Service` que tienen `@id` real porque su página existe.
`schema.ts` construye este array filtrando la matriz por `status === 'active'` — es la
misma fuente de verdad que decide qué card es clickeable en el HTML.

---

## 7. Lo que este deck le agrega al modelo

- **`servicePage.pageType`** gana un tercer valor: `'hub'`, sumado a `event` y
  `subscription` del deck de branding.
- **Nuevo tipo de documento en Sanity: `cityServiceMatrix`** (o campo dentro de
  `businessLocation`) — no es un `servicePage`, es la fuente de verdad de qué servicios
  existen por ciudad, con `status: active | planned`, prioridad (`alto/medio/bajo`), y
  referencia al `servicePage` cuando `status = active`.
- **`routes.ts` gana `getServiceMatrix(city)`**, distinto de `getAllRoutes()`. El primero
  alimenta los hubs (todo, con status); el segundo alimenta el sitemap (solo `active`).
- **`schema.ts`** necesita la regla explícita: nunca emitir `Service` ni meterlo en
  `makesOffer` si su `servicePage` correspondiente no existe con `status: active`.
- **Componente nuevo: `ServiceCard.astro`** con estado visual condicionado — clickeable
  vs. "coming soon" con CTA de respaldo a WhatsApp.

---

## 8. Checklist

- [ ] Ninguna card `planned` tiene `<a href>` a una URL que no existe — o va al ancla del
      hub o va a WhatsApp, nunca a un link roto
- [ ] `makesOffer` en JSON-LD excluye todo lo `planned`
- [ ] El bloque de venues no se copia palabra por palabra al de la página hoja de boda —
      se resume, no se duplica verbatim (riesgo de contenido duplicado interno)
- [ ] hreflang recíproco EN↔ES en ambos hubs
- [x] El link desde el deck de boda WPB a PSL se actualizó para apuntar a
      `/port-st-lucie/#wedding` — corregido en ambos decks de boda (foto y video), EN y ES
- [x] Versiones ES de ambos hubs escritas — nativas, no traducidas
- [x] Dirección de PSL: decisión confirmada por Lisandra, se muestra en texto visible
