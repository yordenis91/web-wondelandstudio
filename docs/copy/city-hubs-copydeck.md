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

*Nota: si esta dirección queda oculta en Google Business Profile por ser domicilio
particular (como se discutió), la página web puede o no mostrarla en texto visible —
decisión pendiente de Lisandra. El JSON-LD la lleva de todos modos para consistencia de
`LocalBusiness`, independientemente de lo que se muestre en pantalla.*

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

## 4. Nota para las versiones ES

- Ambos hubs se escriben nativos, no traducidos, igual regla que los decks anteriores.
- El hub de PSL en español probablemente sea la página más importante del sitio para el
  público hispano — vale la pena que su párrafo-respuesta lidere con quinceañeras, no con
  maternidad, aunque maternidad sea el único `status: active` de momento. El orden de
  aparición de las cards no tiene que ser el orden de disponibilidad.
- Las etiquetas *(coming soon)* / *"página en construcción"* deben decir algo accionable,
  no solo "próximamente" — el WhatsApp de respaldo es lo que evita perder al visitante.

---

## 5. JSON-LD

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

## 6. Lo que este deck le agrega al modelo

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

## 7. Checklist

- [ ] Ninguna card `planned` tiene `<a href>` a una URL que no existe — o va al ancla del
      hub o va a WhatsApp, nunca a un link roto
- [ ] `makesOffer` en JSON-LD excluye todo lo `planned`
- [ ] El bloque de venues no se copia palabra por palabra al de la página hoja de boda —
      se resume, no se duplica verbatim (riesgo de contenido duplicado interno)
- [ ] hreflang recíproco EN↔ES en ambos hubs
- [ ] El link desde el deck de boda WPB a PSL se actualiza para apuntar a
      `/port-st-lucie/#wedding` en vez de a una URL de página hoja inexistente
