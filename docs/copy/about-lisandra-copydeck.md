# Copy Deck — `/about-lisandra/`
**Wonderlands Studio · Página de autor · Quinto `pageType`, bajo riesgo estructural**

> **Por qué esta página importa más de lo que su tráfico sugiere:** cada página hoja
> del sitio enlaza aquí ("Read more about her work →"). Es la página que consolida la
> entidad **Lisandra** como autora/creadora — la señal E-E-A-T (Experience, Expertise,
> Authoritativeness, Trust) que Google y los LLM usan para decidir si confiar en el
> resto del sitio. Sin esta página, cada mención de Lisandra en las páginas hoja es una
> afirmación sin respaldo.

---

## 0. Ficha técnica

| Campo | Valor |
|---|---|
| URL EN | `/about-lisandra/` |
| URL ES | `/es/sobre-lisandra/` |
| Query objetivo | No compite por keyword transaccional — es de autoridad/marca |
| Prioridad ads | Ninguna — no lleva presupuesto, es infraestructura de confianza |
| `pageType` | `about` — nuevo, quinto valor, sin componentes de precio |

**Meta title** (52 car.)
`Meet Lisandra | Wonderlands Studio Photographer`

**Meta description** (149 car.)
`Meet Lisandra, creative director and lead photographer at Wonderlands Studio, serving West Palm Beach and Port St. Lucie in English and Spanish.`

---

## 1. Contenido — Inglés

## H1
**Meet Lisandra**

## Párrafo-respuesta (58 palabras)

Lisandra is the creative director and lead photographer at Wonderlands Studio, a
bilingual photography and video studio serving West Palm Beach and Port St. Lucie,
Florida. She specializes in editorial wedding, quinceañera, maternity and brand
photography, directing every session in English and Spanish. Wonderlands Studio has
served South Florida families and businesses since 2021.

*Nota: el año de fundación es un placeholder razonable — confirmar con Lisandra el año
real antes de publicar. Esta es exactamente la clase de afirmación verificable que un
LLM puede citar, así que tiene que ser exacta.*

## H2 — How she works

Lisandra doesn't direct with a rigid list of poses. She watches how someone actually
moves and stands when they're not thinking about the camera, and builds the session
around that instead of fighting it. It's part of why clients who say they hate having
their photo taken tend to relax faster than they expect to.

That same instinct works across very different kinds of days — a bride getting ready
with her mother, a toddler mid-tantrum during a family session, an executive who's never
done a branding shoot before. Different problems, same underlying skill: making someone
comfortable enough in front of a lens that what comes through is actually them.

## H2 — Bilingual by default, not as an add-on

Lisandra directs every session — family portraits, wedding formals, corporate
headshots — in English or Spanish, switching as needed within the same session so no one
in the room is left translating for someone else. For multigenerational families and
bilingual executive teams, this tends to be the difference between a session that runs
smoothly and one that loses twenty minutes to miscommunication during the group shots.

## H2 — What she specializes in

**Weddings & elopements** — editorial photography and cinematic film across Palm Beach
County. [See wedding services →](/west-palm-beach/wedding-photographer/)

**Quinceañeras** — fashion-forward photography and video, centered in Port St. Lucie's
growing Hispanic community. [See quinceañera coverage →](/port-st-lucie/#quinceanera)

**Maternity & family** — editorial sessions in both West Palm Beach and Port St. Lucie.
[See maternity photography →](/port-st-lucie/maternity-photographer/)

**Brand & business content** — headshots, real estate and monthly content partnerships
for executives and business owners. [See branding services →](/west-palm-beach/brand-photography/)

## H2 — Behind the camera
[Foto o breve galería — Lisandra trabajando, no solo posando para su propio retrato.
Prueba visual de que dirige sesiones, no solo las promociona.]

## H2 — Get to know Wonderlands Studio

Founded in West Palm Beach, Wonderlands Studio grew from family and newborn photography
into full wedding, quinceañera and branding coverage across South Florida — expanding to
a second location in Port St. Lucie to serve the area's growing community. The throughline
across every category is the same: editorial-quality images, warmth in front of the
camera, and service in whichever language makes a client comfortable.

## H2 — Frequently asked questions

**Does Lisandra personally shoot every session, or does she have a team?**
Lisandra is the lead photographer and directs every session personally. For larger
events — weddings, quinceañeras with second-photographer add-ons — she works alongside a
small team she's trained directly, so the same eye and the same direction carry through
even when there's a second shooter in the room.

**Is Lisandra available for sessions in both West Palm Beach and Port St. Lucie?**
Yes. She works across both locations and travels between them regularly — there's no
extra fee or reduced availability for booking in either city.

**Does she speak Spanish fluently, or is it a translated experience?**
Fluently, as a native or near-native bilingual speaker — not a translated experience.
Direction, small talk, and technical instructions during a session all happen naturally
in whichever language the client is most comfortable with.

**How did Wonderlands Studio expand from family photography into weddings and branding?**
The shift followed where clients and demand were actually going — established families
in Palm Beach asked for wedding and branding coverage, and Port St. Lucie's growing
community created real demand for quinceañeras that wasn't being served locally. The
studio expanded into those categories rather than starting them from scratch.

## CTA final
**Want to work with Lisandra directly?** Every session at Wonderlands Studio is under her
creative direction. [Get in touch on WhatsApp](wa.me link)

---

## 2. Nota para la versión ES

- Título: `Conoce a Lisandra`, no "Sobre Lisandra" — más cálido, más acorde al tono que
  ya se usó en las secciones "About Lisandra" de los demás decks en español.
- El bloque bilingüe ("Bilingual by default") es el que más vale la pena reescribir con
  ejemplos concretos en español — mencionar directamente la situación de abuela que solo
  habla español en una boda, más que la abstracción de "comunicación fluida".
- Esta página en español probablemente reciba más tráfico de búsqueda directa
  ("fotógrafa bilingüe west palm beach", "fotógrafa que hable español") que su
  equivalente en inglés — vale la pena optimizar el H1 en español pensando en eso, no
  solo traducir "Meet Lisandra" literal.

---

## 3. JSON-LD

Primera página del sitio con `@type: Person` como entidad completa, no solo referenciada.
Es lo que el resto del sitio usa vía `@id` (`founder`, autoría de posts del blog cuando
existan).

```json
{
  "@type": "Person",
  "@id": "https://wonderlandsstudio.com/about-lisandra/#lisandra",
  "name": "Lisandra",
  "jobTitle": "Creative Director & Lead Photographer",
  "worksFor": { "@id": "https://wonderlandsstudio.com/#organization" },
  "knowsLanguage": ["en-US", "es-US"],
  "knowsAbout": [
    "Wedding Photography",
    "Quinceañera Photography",
    "Maternity Photography",
    "Brand Photography"
  ],
  "url": "https://wonderlandsstudio.com/about-lisandra/",
  "sameAs": [
    "https://www.instagram.com/wonderlandsSTUDIO"
  ]
}
```

**Nota de consistencia:** `CLAUDE.md` y el deck piloto de boda ya referencian
`{ "@id": "https://wonderlandsstudio.com/about-lisandra/#lisandra" }` en el campo
`founder` de `Organization`. Ese `@id` tiene que coincidir exactamente con el declarado
aquí — es la clase de desalineación silenciosa que no rompe el build pero sí rompe el
grafo de entidades para Google.

---

## 4. Lo que este deck le agrega al modelo

Mínimo, como se esperaba de una página de bajo riesgo:

- **`servicePage.pageType`** gana un quinto valor: `'about'`. No necesita
  `PricingTable`, `SubscriptionTable` ni `ServiceCard` — solo secciones de texto e
  imagen, reusando `AnswerBlock.astro` y `FAQ.astro` que ya existen.
- **Sin cambios en `pricingCatalog`, `cityServiceMatrix` ni en ningún componente de
  precio.** Confirma que no todo `pageType` nuevo implica trabajo de modelo — algunos
  solo consumen lo que ya existe.

---

## 5. Checklist

- [ ] El `@id` de `Person` coincide exactamente con el referenciado en `Organization.founder`
      y en cualquier `author` de futuros posts de blog
- [ ] Año de fundación confirmado con Lisandra antes de publicar (placeholder marcado)
- [ ] FAQ únicas frente a las 5 páginas hoja ya escritas
- [ ] hreflang recíproco EN↔ES
- [ ] **Con este deck, el alcance de contenido para Fase 1 + página de autor queda
      completo.** Solo faltan las versiones ES de todo lo aprobado.
