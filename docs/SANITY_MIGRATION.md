# Migración a Sanity — paso a paso

Este documento acompaña a `scripts/migrate-to-sanity.ts`. Corre en tu máquina local, no
en un sandbox remoto — el script necesita salir a la red hacia `api.sanity.io`.

## 0. Qué migra esto y qué no

Migra lo que el schema actual (`studio/schemaTypes/`) puede representar sin pérdida:

- `businessLocation` — 2 documentos (WPB, PSL), NAP completo.
- `pricingCatalog` — 1 documento singleton, todas las colecciones y precios del sitio
  (boda, quinceañera, maternidad + extras de familia, eventos sociales, marca — sesiones
  únicas y socio mensual).
- `testimonial` — 9 documentos, los testimonios reales ya cargados en el sitio
  (`src/content/testimonials.ts`).

**No migra `servicePage` todavía.** El schema actual no tiene campos para `pricing`,
`finalCta`, `hero` ni `breadcrumbs` — lo más importante de cada página — y `sections` no
admite el tipo `steps` que usa la página de boda. Migrar el contenido de las 18 páginas
hoy perdería justo eso. Hace falta extender el schema primero; es la continuación
natural de este trabajo, no algo que este script intente resolver a medias.

`pricingCatalog` sí referencia por adelantado los documentos `servicePage` que van a
existir después (`servicePage.{lang}.{routeId}`, el mismo `id` que ya usa
`i18n/routes.ts`). Esas referencias van a verse "rotas" en el Studio hasta que se cree
esa migración — es esperado, no un error de este script.

## 1. Instalar dependencias

```bash
npm install
```

Trae `@sanity/client`, que el script usa para escribir.

## 2. Generar un token de escritura

En [sanity.io/manage](https://sanity.io/manage) → tu proyecto → **API** → **Tokens** →
**Add API token**. Nombre sugerido: `migration`. Permisos: **Editor** (necesita poder
crear y reemplazar documentos).

Copia el token — Sanity solo lo muestra una vez.

## 3. Pasar el token al script

Nunca lo pongas en un archivo que se commitee. Dos formas:

**Opción A — variable de entorno inline:**
```bash
SANITY_API_TOKEN=sk... npm run sanity:migrate
```

**Opción B — `.env` en la raíz del repo** (ya está en `.gitignore`, igual que
`studio/.env`):
```bash
echo "SANITY_API_TOKEN=sk..." >> .env
```
y luego exportarlo antes de correr el script:
```bash
export $(cat .env | xargs) && npm run sanity:migrate
```

## 4. Dry run primero

```bash
npm run sanity:migrate
```

Esto **no escribe nada** — imprime qué documentos crearía y cuántas referencias por
producto. Revisa que los números cuadren (2 sedes, ~9 tiers/colecciones con sus
referencias) antes de aplicar.

## 5. Aplicar

```bash
npm run sanity:migrate:apply
```

Usa `createOrReplace`: correrlo de nuevo no duplica nada, sobreescribe con los mismos
datos. Seguro de re-ejecutar si algo falla a mitad de camino.

## 6. Verificar en el Studio

```bash
npx sanity dev
```
o entra al Studio ya desplegado. Deberías ver:
- **Ubicación del negocio** — 2 documentos, West Palm Beach y Port St. Lucie.
- **Catálogo de precios** — 1 documento, con todas las colecciones. Las referencias a
  página van a mostrarse como pendientes/rotas — es lo esperado hasta la migración de
  `servicePage`.

WPB va a mostrar advertencias de validación en `address.streetAddress` y
`address.postalCode` (siguen sin confirmar — regla 4 de CLAUDE.md, el script no
inventa el dato, lo deja vacío). PSL no debería mostrar ninguna sede con teléfono
pendiente en el Studio de `businessLocation` — aunque el sitio público sigue sin
mostrar el teléfono de PSL hasta que Lisandra lo confirme.

## 7. Lo que Lisandra edita después — traer los cambios de vuelta

La migración de arriba es de una sola vía, código → Sanity, y solo hace falta correrla
una vez (o de nuevo si se agregan testimonios nuevos a mano en el código). El día a día
va al revés: Lisandra cambia un precio, un testimonio, el teléfono de PSL, algo en el
Studio, y ese cambio tiene que volver al sitio.

Para eso está `scripts/sync-from-sanity.ts` (`npm run sanity:sync` / `sanity:sync:apply`)
— trae de Sanity el NAP y los testimonios y actualiza `src/data/business.ts` y
`src/content/testimonials.ts`. No hace falta un `SANITY_API_TOKEN` para esto (el dataset
es de lectura pública), solo `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET` — ya
están en `studio/.env`.

```bash
export $(cat studio/.env | xargs)
npm run sanity:sync            # dry run — imprime qué cambiaría
npm run sanity:sync:apply      # escribe de verdad
git diff                        # revisa el cambio como cualquier otro
git add -A && git commit -m "sync: ..." && git push
```

Deliberadamente no es un fetch en tiempo de build — el sitio sigue siendo 100%
estático y no depende de que Sanity esté arriba para compilar. Es un paso manual, con
el diff de git como revisión, igual que cualquier otro cambio de contenido en este
proyecto.

**Precios y el copy de cada página (títulos, párrafos, FAQs) siguen sin este mecanismo**
— viven en código y se editan pidiéndoselo directamente a quien mantiene el sitio.
Extender esto a precios es el siguiente paso natural cuando haga falta; el copy de
página necesita primero terminar el schema de `servicePage` (ver más abajo).

## 8. Lo que queda pendiente después de esto

Dos huecos reales encontrados al preparar la migración, para decidir antes de seguir:

1. **`servicePage` necesita campos nuevos** para poder migrar el contenido de las 18
   páginas sin perder nada: `pricing`/`sessions`/`monthly` (según `pageType`),
   `finalCta`, `hero`, `breadcrumbs`, y una variante `steps` en `sections`. Es trabajo
   de schema, no de este script.
2. **`pricingCatalog.entries[].name` es un solo string**, sin variante EN/ES — coincide
   en todos los productos excepto "The Luxury Collection" / "Colección de Lujo". Si el
   frontend llega a leer `name` directamente de Sanity, esa colección se vería mal en
   una de las dos versiones de idioma. Necesita un segundo campo (`nameES`) o similar.
