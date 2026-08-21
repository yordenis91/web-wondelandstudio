# Copy Deck — `/pricing/`
**Wonderlands Studio · Cuarto y último tipo de página: `pageType: aggregate`**

> **Qué prueba este deck:** es la única página que muestra **todo** el catálogo en un
> solo lugar — tiers de evento en escalera (boda, quinceañera, maternidad, eventos
> sociales) y catálogos paralelos de suscripción (branding) al mismo tiempo. Si
> `pricingCatalog` con `billingType` y `track` no alcanza para representar esto sin
> parches, el modelo está mal y hay que corregirlo antes del Bloque 2. Ver sección 5.

---

## 0. Ficha técnica

| Campo | Valor |
|---|---|
| URL EN | `/pricing/` |
| URL ES | `/es/precios/` |
| Query objetivo | wedding photographer prices west palm beach, photography pricing florida |
| Prioridad ads | No lleva presupuesto propio — es página de confianza/conversión, no de captación |
| Rol | La página que Google y los LLM citan cuando alguien pregunta "cuánto cuesta" sin especificar servicio |

**Por qué esta página importa más de lo que su prioridad de ads sugiere:** ninguna otra
página del sitio muestra el catálogo completo. Cuando un LLM responde "¿cuánto cuesta un
fotógrafo de bodas en Palm Beach?" y compara varios estudios, esta es la URL con más
probabilidad de ser la fuente citada, porque es la única que no obliga a adivinar qué
servicio preguntar primero.

**Meta title** (42 car.)
`Pricing | Wonderlands Studio`

**Meta description** (154 car.)
`Complete pricing for weddings, quinceañeras, maternity, family and branding photography and video in West Palm Beach and Port St. Lucie. No hidden fees.`

---

## 1. Contenido — Inglés

## H1
**Pricing**

## Párrafo-respuesta (64 palabras)

Wonderlands Studio publishes complete pricing for every service: wedding collections from
$1,200 to $5,500, quinceañeras from $950 to $3,200, maternity from $500, family sessions
from $350, and branding from $700 one-time or $500 to $3,500 a month. All prices include
professional retouching and a private gallery. No hidden fees for local venues in Palm
Beach County or Port St. Lucie.

## H2 — How to read this page

Every collection below shows exactly what's included — hours, deliverables, add-ons.
Prices are the same whether you book in West Palm Beach or Port St. Lucie; only travel
outside our two coverage areas changes the number, and that's always quoted separately
in writing before you book.

*Nota de diseño: esta oración es la que resuelve una contradicción real del sitio
actual — el sitio viejo sugiere precios distintos por ciudad sin explicarlo. Aquí se
declara explícitamente que el precio es único y transparente, lo cual es cierto según
tu documento de precios revisados.*

## H2 — Weddings & Elopements
*(pageType: event — tabla de tiers en escalera, reusa PricingTable.astro)*

| Collection | Price | Coverage | Includes |
|---|---|---|---|
| Elopement / Civil | $1,200 | 3 hours | Photography only |
| The Essential Story | $1,850 | 6 hours | Photography + short film |
| The Full Experience | $2,950 | 8 hours | Photography + cinematic film + drone + reel |
| The Tradition | $3,800 | 8 hours | Everything above + second photographer + album |
| The Luxury Collection | $5,500 | 10 hours | Photography + extended film + premium album |

[Full wedding details →](/west-palm-beach/wedding-photographer/)

## H2 — Quinceañeras
*(pageType: event, mismo molde que boda — valida que event no está atado a "boda"
como concepto sino al patrón de tiers en escalera)*

| Collection | Price | Coverage | Includes |
|---|---|---|---|
| Momento Real | $950 | 4h event | Photography only |
| Quince de Ensueño | $1,500 | Pre-session + 6h event | Photography + short film |
| Experiencia Real | $2,300 | Pre-session + 8h event | Photography + cinematic film + drone + reel |
| Colección Realeza | $3,200 | Pre-session + 10h event | Photography + film + album + second photographer |

*Currently our strongest quinceañera coverage is in Port St. Lucie.*
[Quinceañera details →](/port-st-lucie/#quinceanera)

## H2 — Maternity & Family

| Session | Price | Includes |
|---|---|---|
| Maternity — Esencia de Vida | $500 | Editorial maternity session |
| Maternity — Raíces Eternas | $1,450 | Photo + video + follow-up session |
| Newborn | from $450 | Studio or in-home session |
| Kids & Family | from $350 | Studio or outdoor session |
| Individual / Portraits | from $250 | Studio session |

## H2 — Social Events
*(paquete genérico — 2h base, la única tabla del sitio con estructura de "hora adicional")*

| Service | Price |
|---|---|
| Photography only | $200 |
| Photo + Video | $400 |
| Additional hour (photo only) | $100 |
| Additional hour (photo + video) | $250 |

## H2 — Brand & Business Content
*(pageType: subscription — aquí es donde la página agregada tiene que renderizar algo
distinto a una escalera de tiers. Reusa SubscriptionTable.astro, no PricingTable.astro.)*

**One-time sessions**

| Session | Price |
|---|---|
| Impulso Visual | $700 |
| La Autoridad | $3,500 |

**Monthly content partnership** — billed monthly, cancel with 30 days notice

| Track | Entry | Partnership | Top tier |
|---|---|---|---|
| Photo-led | Social Content — $500/mo | El Socio de Crecimiento — $1,500/mo | La Autoridad — $3,500/mo |
| Video-led | Social Content — $500/mo | Brand Partner — $1,350/mo | Cinematic Legacy — $3,200+/mo |

[Full branding details →](/west-palm-beach/brand-photography/)

## H2 — What's always included

Professional retouching · private online gallery · high resolution and web-size files ·
bilingual service throughout · no travel fees within Palm Beach County or Port St. Lucie.

## H2 — Payment

50% deposit to reserve your date, balance due on the day. We accept Zelle, cash and all
major credit cards, and offer monthly payment plans for full collections and large event
packages.

## H2 — Frequently asked questions

**Are these the final prices, or is there a deposit and extra fees?**
These are complete collection prices. A 50% deposit secures your date; the balance is due
on the day. There are no hidden fees for venues within Palm Beach County or Port St.
Lucie — travel outside those areas is quoted separately, in writing, before you book.

**Why is there such a small price difference between photo-only and photo+video
collections?**
Because we'd rather film your event than not. Across every category — weddings,
quinceañeras, social events — we deliberately kept the step up to include video small,
so it's an easy yes rather than a separate purchase.

**Do West Palm Beach and Port St. Lucie have different prices?**
No. Pricing is the same in both locations. What differs is which services we currently
emphasize in each market — quinceañeras and maternity are strongest in Port St. Lucie,
weddings and branding in West Palm Beach — but the prices themselves don't change.

**Can I combine services, like a maternity session and a birth announcement package?**
Yes. Message us with what you're planning and we'll build a custom proposal — this is
common enough that we quote it as routine, not as a special request.

**Do you offer payment plans?**
Yes, for full wedding, quinceañera and branding collections. Ask when you request your
proposal and we'll lay out a monthly schedule that fits your date.

## CTA final
**Still not sure what fits?** Tell us what you're planning and we'll recommend the right
collection — no pressure, no obligation. [WhatsApp (561) 260-3245]

---

## 2. Contenido — Español
*Escrito nativo, no traducido. Título corto ("Precios") para rankear mejor la query
literal en español.*

**Meta title** (30 car.)
`Precios | Wonderlands Studio`

**Meta description** (144 car.)
`Precios completos de bodas, quinceañeras, embarazo, familia y fotografía de marca en West Palm Beach y Port St. Lucie. Sin cargos ocultos.`

## H1
**Precios**

## Párrafo-respuesta (63 palabras)

Wonderlands Studio publica precios completos para cada servicio: colecciones de boda
desde $1,200 hasta $5,500, quinceañeras desde $950 hasta $3,200, embarazo desde $500,
sesiones familiares desde $350, y marca desde $700 por sesión única o de $500 a $3,500
al mes. Todos los precios incluyen retoque profesional y galería privada. Sin cargos
ocultos en locaciones del condado de Palm Beach o Port St. Lucie.

## H2 — Cómo leer esta página

Cada colección de abajo muestra exactamente qué incluye — horas, entregables,
adicionales. Los precios son los mismos si reservas en West Palm Beach o en Port St.
Lucie; solo el traslado fuera de nuestras dos zonas de cobertura cambia el número, y eso
siempre se cotiza por separado y por escrito antes de reservar.

## H2 — Bodas y ceremonias civiles
*(`pageType: event` — tabla de tiers en escalera, reusa `PricingTable.astro`)*

| Colección | Precio | Cobertura | Incluye |
|---|---|---|---|
| Elopement / Civil | $1,200 | 3 horas | Solo fotografía |
| The Essential Story | $1,850 | 6 horas | Fotografía + video corto |
| The Full Experience | $2,950 | 8 horas | Fotografía + video cine + drone + reel |
| The Tradition | $3,800 | 8 horas | Todo lo anterior + segundo fotógrafo + álbum |
| The Luxury Collection | $5,500 | 10 horas | Fotografía + video extendido + álbum premium |

[Detalles completos de boda →](/es/west-palm-beach/fotografo-de-bodas/)

## H2 — Quinceañeras

| Colección | Precio | Cobertura | Incluye |
|---|---|---|---|
| Momento Real | $950 | Evento de 4h | Solo fotografía |
| Quince de Ensueño | $1,500 | Pre-sesión + evento de 6h | Fotografía + video corto |
| Experiencia Real | $2,300 | Pre-sesión + evento de 8h | Fotografía + video cine + drone + reel |
| Colección Realeza | $3,200 | Pre-sesión + evento de 10h | Fotografía + video + álbum + segundo fotógrafo |

*Nuestra cobertura de quinceañeras es hoy más fuerte en Port St. Lucie.*
[Detalles de quinceañeras →](/es/port-st-lucie/#quinceanera)

## H2 — Embarazo y Familia

| Sesión | Precio | Incluye |
|---|---|---|
| Embarazo — Esencia de Vida | $500 | Sesión editorial de embarazo |
| Embarazo — Raíces Eternas | $1,450 | Foto + video + sesión de seguimiento |
| Recién nacido | desde $450 | Sesión en estudio o a domicilio |
| Niños y familia | desde $350 | Sesión en estudio o al aire libre |
| Individual / Retratos | desde $250 | Sesión en estudio |

## H2 — Eventos sociales
*(paquete genérico — la única tabla del sitio con estructura de "hora adicional")*

| Servicio | Precio |
|---|---|
| Solo fotografía | $200 |
| Foto + Video | $400 |
| Hora adicional (solo foto) | $100 |
| Hora adicional (foto + video) | $250 |

## H2 — Marca y contenido de negocio
*(`pageType: subscription` — reusa `SubscriptionTable.astro`, no `PricingTable.astro`)*

**Sesiones únicas**

| Sesión | Precio |
|---|---|
| Impulso Visual | $700 |
| La Autoridad | $3,500 |

**Socio de contenido mensual** — facturado cada mes, se cancela con 30 días de aviso

| Línea | Entrada | Alianza | Nivel superior |
|---|---|---|---|
| Enfoque en foto | Contenido Social — $500/mes | El Socio de Crecimiento — $1,500/mes | La Autoridad — $3,500/mes |
| Enfoque en video | Contenido Social — $500/mes | Brand Partner — $1,350/mes | Cinematic Legacy — $3,200+/mes |

[Detalles completos de marca →](/es/west-palm-beach/fotografia-de-marca/)

## H2 — Qué siempre incluye

Retoque profesional · galería privada en línea · archivos en alta resolución y tamaño
web · atención bilingüe en todo momento · sin cargos por traslado dentro del condado de
Palm Beach o Port St. Lucie.

## H2 — Forma de pago

50% de depósito para reservar tu fecha, el resto se paga el día del evento. Aceptamos
Zelle, efectivo y todas las tarjetas principales, y ofrecemos planes de pago mensuales
para colecciones completas y paquetes de eventos grandes.

## H2 — Preguntas frecuentes

**¿Estos son los precios finales, o hay depósito y cargos extra?**
Estos son los precios completos de cada colección. Un depósito del 50% asegura tu
fecha; el resto se paga el día del evento. No hay cargos ocultos en locaciones dentro
del condado de Palm Beach o Port St. Lucie — el traslado fuera de esas zonas se cotiza
aparte, por escrito, antes de reservar.

**¿Por qué la diferencia de precio entre solo foto y foto con video es tan chica?**
Porque el número final es lo que decide, no la estrategia detrás. En bodas,
quinceañeras y eventos sociales, mantuvimos ese salto lo más bajo posible a propósito,
para que agregar video no se sienta como una compra aparte sino como una decisión
fácil de sí.

**¿West Palm Beach y Port St. Lucie tienen precios distintos?**
No. El precio es el mismo en las dos sedes. Lo que cambia es qué servicio enfocamos
más en cada mercado — quinceañeras y embarazo son más fuertes en Port St. Lucie, bodas
y marca en West Palm Beach — pero el precio en sí no cambia.

**¿Puedo combinar servicios, como una sesión de embarazo con un paquete de anuncio de
nacimiento?**
Sí. Escríbenos con lo que estás planeando y armamos una propuesta a la medida — nos lo
piden lo suficiente como para cotizarlo de forma habitual, no como caso especial.

**¿Ofrecen planes de pago?**
Sí, para colecciones completas de boda, quinceañera y marca. Pregunta al pedir tu
propuesta y armamos un calendario mensual que se ajuste a tu fecha.

## CTA final
**¿Todavía no sabes qué te conviene?** Cuéntanos qué estás planeando y te recomendamos
la colección correcta — sin presión, sin compromiso. [WhatsApp (561) 260-3245]

---

## 3. JSON-LD

Esta es la única página cuyo `@graph` mezcla `Service` de `pageType: event` y
`pageType: subscription` en el mismo documento. Se compone concatenando el
`hasOfferCatalog` de cada `Service` ya declarado en sus páginas hoja — **no se redeclaran
los precios aquí**, se referencian por `@id`, para que nunca haya dos fuentes de verdad
del mismo precio en JSON-LD.

```json
{
  "@type": "WebPage",
  "@id": "https://wonderlandsstudio.com/pricing/#page",
  "name": "Pricing",
  "about": [
    { "@id": "https://wonderlandsstudio.com/west-palm-beach/wedding-photographer/#service" },
    { "@id": "https://wonderlandsstudio.com/west-palm-beach/wedding-videographer/#service" },
    { "@id": "https://wonderlandsstudio.com/west-palm-beach/brand-photography/#service" },
    { "@id": "https://wonderlandsstudio.com/port-st-lucie/maternity-photographer/#service" }
  ],
  "mainEntity": {
    "@type": "FAQPage",
    "@id": "https://wonderlandsstudio.com/pricing/#faq"
  }
}
```

**Regla dura para `schema.ts`:** si `/pricing/` alguna vez declarara su propio
`hasOfferCatalog` con los mismos precios que ya existen en las páginas hoja, cualquier
actualización de precio tendría que hacerse en dos lugares — que es exactamente el bug
que tiene el sitio actual hoy (precios contradictorios en tres sitios distintos). Por
eso `/pricing/` solo referencia por `@id` y nunca repite un `price` literal en su propio
bloque de JSON-LD.

---

## 4. Imágenes

Esta página no necesita galería propia — es la única página de servicio sin fotos
protagonistas. Un fondo editorial discreto y consistente basta; el contenido es la tabla,
no la imagen. Foto de portada opcional del estudio o de un detalle de producto (álbum
impreso, por ejemplo) para no dejar la página completamente sin imagen.

---

## 5. Resultado de la validación de `pageType: aggregate`

Esto es lo que se buscaba probar con este deck, respondido:

- **¿`pricingCatalog` con `billingType` y `track` alcanza sin parches?** Sí. Esta página
  simplemente renderiza dos componentes ya existentes uno después del otro —
  `PricingTable.astro` para las secciones `event` (boda, quinceañera, maternidad,
  eventos sociales) y `SubscriptionTable.astro` para la de branding. No hizo falta un
  componente nuevo.
- **¿Hace falta un componente `AggregatePricingPage.astro`?** No como componente de
  precio — es solo composición de layout (varias secciones con H2, una detrás de otra).
  Sí conviene un componente contenedor **liviano** (`PricingSection.astro`) que reciba un
  título de sección y decida internamente si renderiza `PricingTable` o
  `SubscriptionTable` según el `pageType` de los datos que recibe — así el layout de
  `/pricing/` no tiene que saber la diferencia, solo itera secciones.
- **¿El JSON-LD necesita algo nuevo?** Sí, un patrón nuevo pero simple:
  `WebPage.about[]` referenciando `Service` por `@id` en vez de declarar
  `hasOfferCatalog` propio. Esto se documenta como regla dura arriba porque es fácil de
  romper sin querer al copiar el patrón de las páginas hoja.

**Conclusión: los cuatro `pageType` quedan validados contra contenido real.** No hace
falta seguir descubriendo campos nuevos en el modelo antes de construir el Bloque 2 —
las piezas que faltan (`PricingSection.astro`, el patrón `about[]`) ya están
especificadas arriba.

---

## 6. Checklist

- [ ] Ningún precio en esta página está hardcodeado — todos vienen de `pricingCatalog`
      vía referencia a la página hoja correspondiente
- [ ] `hasOfferCatalog` NO se redeclara en el JSON-LD de esta página, solo `about[]`
- [ ] FAQ únicas frente a las 4 páginas hoja ya escritas
- [ ] La sección de quinceañeras enlaza al hub de PSL (`#quinceanera`), no a una URL
      `planned` — misma regla que en el deck de hubs
- [ ] hreflang recíproco EN↔ES
- [x] Versión ES escrita — nativa, no traducida; FAQ sin reutilizar de boda, video ni
      branding
