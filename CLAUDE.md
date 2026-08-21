# Wonderlands Studio — Sitio web

Sitio bilingüe (EN/ES) para un estudio de fotografía y video en el sur de Florida.
El objetivo del proyecto es SEO local y visibilidad en buscadores con IA. Cada decisión
técnica se subordina a eso.

## Stack

- **Astro 5**, output `static`. Sin islas de React salvo que una interacción real lo exija.
- **Sanity** como CMS (dataset `production`, i18n con campo `language`).
- **Cloudflare Pages** para hosting, **Cloudflare Workers** para el endpoint de formulario.
- TypeScript estricto. CSS nativo con custom properties — sin Tailwind, sin CSS-in-JS.
- `pnpm` como gestor de paquetes.

## Reglas no negociables

1. **Cero JavaScript de cliente en el render del contenido.** Todo el texto, precios,
   FAQ y schema deben estar en el HTML servido. Los crawlers de LLM no ejecutan JS.
   Verificación: `curl -s <url> | grep "<precio>"` debe encontrarlo.
2. **Los precios viven en un único documento de Sanity** (`pricingCatalog`). Nunca
   hardcodear un precio en un componente o en contenido. El sitio actual tiene precios
   contradictorios en tres lugares; eso es exactamente lo que estamos arreglando.
3. **NAP idéntico en todo el sitio**, importado de `src/data/business.ts`. Jamás escribir
   un teléfono o dirección a mano en una plantilla.
4. **Tokens de placeholder fallan el build.** Cualquier `{{TOKEN}}` sin resolver en
   contenido o schema aborta el deploy. Ver `scripts/check-tokens.ts`.
5. **Nada de `Review` ni `AggregateRating` en JSON-LD** hasta que existan reseñas reales
   verificables. Marcar reseñas inexistentes es motivo de acción manual en Google.
6. **hreflang recíproco obligatorio.** Cada página EN declara su par ES y viceversa.
   El test `hreflang.test.ts` recorre el sitemap y falla si una relación no es mutua.
7. **Sin párrafos duplicados entre páginas.** Las páginas servicio+ciudad compiten entre
   sí si comparten copy. Cada una tiene su propio párrafo-respuesta y sus propias FAQ.
8. **Presupuesto de rendimiento:** LCP < 2.0s en móvil 4G, CLS < 0.05, JS inicial < 20KB.
   El hero es imagen, nunca video autoplay.

## Arquitectura de rutas

```
/                                        /es/
/west-palm-beach/                        /es/west-palm-beach/
/west-palm-beach/wedding-photographer/   /es/west-palm-beach/fotografo-de-bodas/
/west-palm-beach/wedding-videographer/   /es/west-palm-beach/videografo-de-bodas/
/west-palm-beach/brand-photography/      /es/west-palm-beach/fotografia-de-marca/
/port-st-lucie/                          /es/port-st-lucie/
/port-st-lucie/maternity-photographer/   /es/port-st-lucie/fotografo-de-embarazo/
/pricing/                                /es/precios/
/about-lisandra/                         /es/sobre-lisandra/
/portfolio/[category]/                   /es/portafolio/[categoria]/
```

Las rutas ES son slugs en español, no el slug inglés bajo `/es/`. Se generan desde un
mapa central en `src/i18n/routes.ts`.

## Modelo de contenido (Sanity)

- `businessLocation` — WPB y PSL. NAP, geo, áreas servidas, idiomas.
- `pricingCatalog` — colecciones con tier, precio, cobertura, incluye, categoría.
- `servicePage` — una por combinación servicio+ciudad+idioma. Campos: h1,
  answerParagraph (máx 65 palabras, validado), secciones, faqs (mín 4), meta, imágenes.
- `testimonial` — con `category` y `city` para filtrar. Campo `verified` booleano;
  solo los verificados salen en schema.
- `post` — blog / trabajos recientes.
- `galleryItem` — imagen con alt EN y ES obligatorios, categoría y ciudad.

## Datos del negocio

- Wonderlands Studio, directora creativa Lisandra.
- **WPB:** `{{WPB_STREET_ADDRESS}}`, West Palm Beach, FL `{{WPB_POSTAL_CODE}}` — tel (561) 260-3245
- **PSL:** 943 SE Brookedge Avenue E, Port Saint Lucie, FL 34983 — tel `{{PSL_PHONE_772}}`
- WhatsApp: +1 561 260 3245. Instagram / TikTok / Facebook: `@wonderlandsSTUDIO`

## Dirección visual

Fotografía editorial de alta gama, bilingüe, cálida pero no cursi. El sitio compite
contra fotógrafos de bodas de Palm Beach, así que el listón visual es alto.

No usar: fondo crema con serif de alto contraste y acento terracota; negro con acento
verde ácido; layout tipo periódico con filetes finos. Son los tres defaults de diseño
generado por IA y se notan.

La foto manda. La interfaz se calla. Un solo elemento con personalidad — decidirlo y
justificarlo, no repartir efectos por toda la página.

## Comandos

```bash
pnpm dev            # servidor local
pnpm build          # incluye check-tokens y validación de schema
pnpm test           # hreflang, duplicados de copy, presupuesto de rendimiento
pnpm lighthouse     # audita las rutas clave contra el presupuesto
pnpm sanity:deploy  # despliega el studio
```

## Flujo de trabajo

Rama por página o por sistema. PR con: screenshot móvil, salida de Rich Results Test,
y números de Lighthouse. No mergear nada que baje el presupuesto de rendimiento.
