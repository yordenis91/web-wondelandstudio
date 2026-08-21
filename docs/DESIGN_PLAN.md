# Wonderlands Studio — Plan de diseño visual

Documenta las decisiones de diseño ya tomadas e implementadas en
`src/styles/tokens.css` y `src/styles/global.css` (PR #5), más las que se van
sumando por secciones. Es el complemento visual de `docs/PLAN.md` — ese
documento cubre datos, rutas y JSON-LD; este cubre color, tipografía, forma e
interacción.

---

## 0. Principio rector

CLAUDE.md lo dice explícito y es el filtro que pasa cada decisión de este
documento:

> Fotografía editorial de alta gama, bilingüe, cálida pero no cursi [...]
> No usar: fondo crema con serif de alto contraste y acento terracota; negro
> con acento verde ácido; layout tipo periódico con filetes finos. Son los
> tres defaults de diseño generado por IA y se notan.
>
> La foto manda. La interfaz se calla. Un solo elemento con personalidad —
> decidirlo y justificarlo, no repartir efectos por toda la página.

Cada decisión de color, tipografía o interacción de este documento se
justifica contra ese párrafo, no contra gusto personal.

---

## 1. Paleta de color

### 1.1 Tokens base (interfaz)

Definidos en `src/styles/tokens.css`, extraídos con evidencia del `style.css`
del sitio actual (no calcados — ver sección 5 de qué se descartó):

| Token | Valor | Uso | Evidencia |
|---|---|---|---|
| `--color-bg` | `#0a0a0a` | Fondo base | `body.site-dark { background: #000 }` en el CSS original; se suaviza un punto para no ser negro puro de pantalla |
| `--color-bg-elevated` | `#141414` | Superficies elevadas (cards, header sticky) | Derivado, sin equivalente directo en el original |
| `--color-fg` | `#f5f2ee` | Texto primario | Blanco cálido, no `#fff` clínico — empareja mejor con el dorado que un blanco frío |
| `--color-fg-muted` | `#a8a8a8` | Texto secundario | `color: #a8a8a8` usado en listas de widget del CSS original |
| `--color-border` | `#2a2a2a` | Divisores, bordes sutiles | `border-color: #393939` en modo oscuro del original, ajustado |
| `--color-accent` | `#c48f56` | **Único** acento vivo de la interfaz | Valor exacto del CSS original — el más repetido de sus 3 variantes cercanas (`#c48f56`, `#bc8953`, `#bc8a53`) |
| `--color-accent-fg` | `#0a0a0a` | Texto sobre superficies con acento relleno | — |

**Regla dura:** `--color-accent` se usa en dos lugares y solo dos — el botón
(`.button`) y el eyebrow label (`.eyebrow`). El sitio original lo repartía en
~40 selectores (paginación, fechas de blog, bordes de widget, tags, hovers de
menú...). Eso es exactamente lo que la regla "un elemento, no efectos
repartidos" prohíbe. Antes de agregar el acento a un componente nuevo, la
pregunta es "¿esto compite con el botón principal por atención?" — si la
respuesta no es un no claro, no lleva acento.

### 1.2 Color vivo: la fotografía, no la interfaz

La interfaz en reposo es casi monocroma — texto claro sobre fondo casi negro,
un único acento dorado disciplinado. El color vivo de verdad vive en las
fotos, que es lo que el estudio vende. Esto se implementa como un patrón
concreto, no como una intención vaga:

**Patrón: grilla de portafolio en escala de grises, color al interactuar.**

| Propiedad | Valor / regla |
|---|---|
| Estado de reposo | Todas las fotos de la grilla en `grayscale(100%)` |
| Estado de interacción | La foto bajo el cursor/foco vuelve a color completo — `grayscale(0%)` |
| Alcance | **Solo** la grilla de portafolio (`/portfolio/[category]/` y los bloques de "trabajos recientes" en páginas hoja y hubs). Nunca en el hero, nunca en la galería de una página de servicio individual — ahí la foto ya está vendiendo, no necesita un gesto de descubrimiento |
| Mecanismo | 100% CSS (`filter` + `transition`), cero JS |
| Impacto en rendimiento | Ninguno medible: la imagen ya está pintada y decodificada antes de la interacción; el filtro no dispara reflow ni repintado de layout, así que no toca LCP ni CLS |

Por qué esto y no un acento de color en la interfaz: es el gesto opuesto a
los tres defaults prohibidos — esos ponen el color *en el chrome* (acento
terracota, verde ácido, filetes). Acá el color vive en la fotografía. La
interfaz se queda callada hasta que el usuario elige mirar una foto en
particular, y en ese momento exacto la foto es lo único que cambia.

**Spec técnica de referencia** (para cuando se construya `PortfolioGrid.astro`
en el Bloque 5 — no implementado todavía, solo especificado aquí):

```css
.portfolio-item img {
  filter: grayscale(100%);
  transition: filter 400ms ease;
}

.portfolio-item:hover img,
.portfolio-item:focus-visible img {
  filter: grayscale(0%);
}
```

`:focus-visible` además de `:hover` para que la interacción sea accesible por
teclado, no solo por mouse.

**Abierto — necesita decisión antes de implementarse:** en touch (móvil,
donde no hay `:hover` real) la foto se queda en escala de grises salvo que se
toque y mantenga el foco, lo cual no es un patrón de descubrimiento natural
en móvil. Dos caminos, sin resolver todavía:

- Opción A: en touch, las fotos se muestran directamente a color (el gesto
  de descubrimiento es exclusivo de desktop/mouse, vía `@media (hover: hover)`).
- Opción B: se agrega un IntersectionObserver mínimo que revela el color al
  entrar en viewport — deja de ser 100% CSS, rompe la ventaja de cero JS.

Recomiendo A: mantiene el patrón 100% CSS y cero JS en todos los dispositivos,
a costa de que el "descubrimiento" solo exista en desktop. En móvil, que es
la mayoría del tráfico según el presupuesto de rendimiento de CLAUDE.md, la
foto simplemente se ve — lo cual no es una pérdida, es el comportamiento por
defecto razonable.

---

## 2. Tipografía

| Token | Valor | Evidencia |
|---|---|---|
| `--font-sans` | `'Montserrat', 'Helvetica Neue', Arial, sans-serif` | Fuente única del sitio original, en todos los pesos de heading |
| Escala H1–H5 | `clamp()` fluido, min/max tomados de los breakpoints desktop/mobile del CSS original (H1: 48px móvil → 60px desktop, y así en cascada) | Evita duplicar reglas por media query manteniendo el mismo rango de tamaños que ya existía |
| `--text-eyebrow` | 13px, uppercase, `letter-spacing: 0.08em`, color acento | El label pequeño sobre cada H1 ("SESIONES FOTOGRÁFICAS...", "ESTUDIO FOTOGRÁFICO Y DE VIDEO...") — es el otro único lugar donde vive el acento, ver 1.1 |

Carga vía Google Fonts (`fonts.googleapis.com`, con `preconnect` +
`font-display: swap`) en vez de autoalojada — pendiente de revisar si vale la
pena autoalojar los `.woff2` para recortar el round-trip externo, dado el
presupuesto de LCP < 2.0s de CLAUDE.md. No es bloqueante hoy porque el peso
de Montserrat en 3 cortes (400/600/700) es bajo, pero es la primera
optimización a probar si Lighthouse marca algo en el bloque de fuentes.

---

## 3. Espaciado y forma

| Token | Valor | Nota |
|---|---|---|
| `--space-1`…`--space-12` | Escala de 8px (8/16/24/32/48/64/96px) | Estándar, sin evidencia específica del original que la contradiga |
| `--radius` | `0` | Esquinas rectas en toda la interfaz — botones, cards, inputs. Evidencia: `.button-style1 { border-radius: 0 }` en el CSS original. Encaja con "editorial, no cursi": nada redondeado, nada suave de forma gratuita |
| `--content-max` | 1170px | Ancho de contenido, valor tomado del `.container` de Bootstrap del tema original — es el único número de su sistema de grid que vale la pena conservar, el resto del grid no se trae (ver sección 5) |

---

## 4. Componentes definidos hasta ahora

| Componente | Dónde vive | Qué hace |
|---|---|---|
| `.eyebrow` | `global.css` | Label uppercase pequeño, color acento, sobre un H1 |
| `.button` | `global.css` | Borde 1px acento, transparente en reposo, relleno de acento + texto invertido al hover, mayúsculas, esquina recta |
| `.container` | `global.css` | Ancho máximo + padding lateral responsivo |
| Grilla de portafolio (grayscale→color) | Especificado en 1.2, **sin implementar** | Pendiente de `PortfolioGrid.astro` en el Bloque 5 |

---

## 5. Qué se descartó del sitio anterior, y por qué

El `style.css` original pesa ~4700 líneas. Lo que no se trajo:

- **Grid de Bootstrap** (`.col-*`, `.offset-*`, breakpoints sm/md/lg/xl) —
  Astro con CSS nativo resuelve layout con flexbox/grid directo en cada
  componente, no necesita una capa de utilidades genéricas.
- **Soporte RTL completo** — el sitio es EN/ES, ninguno de los dos es RTL.
- **Estilos de WooCommerce** (minicart, checkout, product grid) — el sitio no
  vende productos, vende servicios vía WhatsApp/formulario.
- **Animaciones de preloader, prefijos `-webkit-box`/`-ms-flexbox`** —
  artefactos de soporte para navegadores de 2018. Astro/Vite targetea
  navegadores modernos.
- **El acento repartido en ~40 selectores** — ver 1.1, es el problema que
  este documento existe para evitar repetir.
- **El toggle claro/oscuro** — visible en la segunda captura de referencia
  del sitio actual. Decisión explícita del usuario (confirmada en PR #5): un
  solo tema oscuro por ahora. Menos JS, menos superficie de mantenimiento, y
  ya es el look distintivo del sitio según ambas capturas de referencia. Si
  se pide más adelante, es un componente aparte con su propio estado — no
  builds sobre los tokens actuales, que están escritos para un solo tema
  (`html { color-scheme: dark }` fijo, sin variables duplicadas por esquema).

---

## 6. Fuente de verdad

Este documento es la justificación; el código es la fuente de verdad real:

- `src/styles/tokens.css` — todos los custom properties
- `src/styles/global.css` — reset, elementos base, `.button`, `.eyebrow`,
  `.container`

Si un valor de este documento y el código no coinciden, el código gana y este
documento está desactualizado — hay que corregirlo, no al revés.

---

## 7. Abierto — pendiente de definir

- Fallback de la grilla de portafolio en touch/móvil (sección 1.2)
- Autoalojar Montserrat vs. Google Fonts CDN, según lo que diga Lighthouse
- Tratamiento del hero: imagen estática confirmado por CLAUDE.md (regla 8,
  "el hero es imagen, nunca video autoplay"), pero el crop/overlay/tratamiento
  de color sobre la imagen del hero no está especificado todavía
- Estados de foco visibles (accesibilidad) para nav, links de texto — solo
  `.button` y la grilla de portafolio tienen estado de interacción definido
  hasta ahora
- Tratamiento visual de `FAQ.astro`, `PricingTable.astro`,
  `SubscriptionTable.astro`, `TestimonialList.astro` — ninguno tiene spec
  visual todavía, solo existen como nombres de componente en `docs/PLAN.md`
