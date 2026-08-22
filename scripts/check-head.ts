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

  return { file, path: toSitePath(file), canonical, alternates };
}

function main(): void {
  if (!existsSync(DIST)) {
    console.error(`check-head: no existe ${DIST}/ — corre el build primero.`);
    process.exit(1);
  }

  const pages = findHtml(DIST).map(parseHead);
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

    // Reciprocidad: cada alternate tiene que existir y devolver el enlace.
    for (const [lang, href] of page.alternates) {
      if (lang === 'x-default') continue;

      const target = byUrl.get(href);
      if (!target) {
        errors.push(`${page.path} — hreflang="${lang}" apunta a ${href}, que no existe en dist/`);
        continue;
      }
      const back = target.alternates.get(lang);
      if (back !== href) {
        errors.push(
          `${page.path} — relación no recíproca con ${target.path}: ` +
            `esta declara ${lang}=${href}, la otra declara ${lang}=${back ?? 'nada'}`,
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
