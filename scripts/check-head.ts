/**
 * Verifica el `<head>` de todo lo que hay en `dist/`.
 *
 * No comprueba que las etiquetas "existan": comprueba que sean **recíprocas**. Recorre
 * cada HTML construido, lee su canonical y sus `hreflang`, y exige que la página a la
 * que apunta cada alternate exista y apunte de vuelta. Una relación hreflang unilateral
 * es exactamente lo que Google ignora, y es invisible mirando una sola página.
 *
 * Es la red que pide la regla 6 de CLAUDE.md. `Layout.astro` ya hace imposible declarar
 * una cara sin la otra, pero eso solo cubre las rutas que pasan por él; esto cubre lo
 * que realmente se sirve.
 *
 * Cualquier página con `<meta name="robots" content="noindex...">` queda fuera —
 * 404 y las páginas de gracias del formulario (`ErrorLayout.astro` en vez de
 * `Layout.astro`) son las que hoy llevan esa etiqueta. Canonical y hreflang no
 * aplican a una página que Google no va a indexar; detectarlo por el propio `noindex`
 * en vez de por nombre de archivo cubre cualquier página así, presente o futura, sin
 * tener que acordarse de añadirla a una lista aparte.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SITE = 'https://wonderlandsstudio.com';

interface PageHead {
  readonly file: string;
  /** Ruta del sitio: `/`, `/es/`, `/pricing/`… */
  readonly path: string;
  readonly canonical?: string;
  readonly alternates: ReadonlyMap<string, string>;
  readonly noindex: boolean;
}

function findHtml(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** `dist/es/index.html` → `/es/` */
function toSitePath(file: string): string {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  const withoutIndex = rel.replace(/index\.html$/, '');
  return `/${withoutIndex}`;
}

function isNoindex(head: string): boolean {
  return /<meta\s+name="robots"\s+content="noindex/i.test(head);
}

function parseHead(file: string): PageHead {
  const html = readFileSync(file, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  const canonical = head.match(
    /<link\s+rel="canonical"\s+href="([^"]+)"/i,
  )?.[1];

  const alternates = new Map<string, string>();
  const re = /<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(head)) !== null) {
    alternates.set(match[1]!, match[2]!);
  }

  return { file, path: toSitePath(file), canonical, alternates, noindex: isNoindex(head) };
}

function main(): void {
  if (!existsSync(DIST)) {
    console.error(`check-head: no existe ${DIST}/ — corre el build primero.`);
    process.exit(1);
  }

  const pages = findHtml(DIST)
    .map(parseHead)
    .filter((page) => !page.noindex);
  const byUrl = new Map(pages.map((p) => [`${SITE}${p.path}`, p]));
  const errors: string[] = [];

  for (const page of pages) {
    const expected = `${SITE}${page.path}`;

    if (!page.canonical) {
      errors.push(`${page.path} — sin <link rel="canonical">`);
    } else if (page.canonical !== expected) {
      errors.push(`${page.path} — canonical apunta a ${page.canonical}, se esperaba ${expected}`);
    }

    for (const required of ['en-US', 'es-US', 'x-default']) {
      if (!page.alternates.has(required)) {
        errors.push(`${page.path} — falta hreflang="${required}"`);
      }
    }

    /**
     * Reciprocidad de verdad: ambos lados de la pareja EN/ES tienen que declarar
     * exactamente los mismos dos enlaces. Comparar `target.alternates.get(lang)`
     * contra la propia URL de `target` (como hacía una versión anterior de este
     * chequeo) es una tautología — cualquier página que se autorreferencie
     * correctamente lo pasa, apunte o no al socio real. Lo que hay que comparar es que
     * el destino declare la MISMA pareja completa, no solo que se confirme a sí mismo.
     */
    const enHref = page.alternates.get('en-US');
    const esHref = page.alternates.get('es-US');
    for (const href of [enHref, esHref]) {
      if (!href) continue;

      const target = byUrl.get(href);
      if (!target) {
        errors.push(`${page.path} — apunta a ${href}, que no existe en dist/`);
        continue;
      }

      if (target.alternates.get('en-US') !== enHref || target.alternates.get('es-US') !== esHref) {
        errors.push(
          `${page.path} declara la pareja en-US=${enHref}/es-US=${esHref}, pero ${target.path} ` +
            `declara en-US=${target.alternates.get('en-US')}/es-US=${target.alternates.get('es-US')} — no coinciden`,
        );
      }
    }

    // Regla 5 de CLAUDE.md: ni una reseña marcada hasta que existan verificables.
    const html = readFileSync(page.file, 'utf8');
    for (const forbidden of ['"@type":"Review"', '"@type":"AggregateRating"']) {
      if (html.includes(forbidden)) {
        errors.push(`${page.path} — emite ${forbidden} en JSON-LD, prohibido (CLAUDE.md regla 5)`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`check-head: ${errors.length} error(es)\n`);
    for (const error of errors) console.error(`  ERROR  ${error}`);
    process.exit(1);
  }

  console.log(
    `check-head: ${pages.length} página(s) con canonical y hreflang recíproco, sin Review/AggregateRating.`,
  );
  for (const page of pages) {
    const pairs = [...page.alternates]
      .map(([lang, href]) => `${lang}→${href.replace(SITE, '') || '/'}`)
      .join('  ');
    console.log(`  ok  ${page.path}  ${pairs}`);
  }
}

main();
