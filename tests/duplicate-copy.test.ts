/**
 * `pnpm test` — parte "duplicados de copy" (CLAUDE.md, sección Comandos y regla 7).
 *
 * "Las páginas servicio+ciudad compiten entre sí si comparten copy" — así que este test
 * no se limita a esas páginas: cualquier párrafo sustancial (≥40 caracteres) que
 * aparezca idéntico en el `<main>` de dos páginas *distintas* es contenido duplicado
 * para un buscador, sea cual sea el `pageType`.
 *
 * Deliberadamente solo mira dentro de `<main>...</main>`: el texto de `<header>` y
 * `<footer>` (nombre del estudio, tagline, NAP) se repite a propósito en las 24
 * páginas — es navegación y marca, no el contenido que compite por una consulta de
 * búsqueda. Escaparlo por estructura evita mantener una lista de "frases permitidas".
 *
 * Dos exclusiones más, por el mismo motivo — datos que deben repetirse, no prosa que
 * compite por una consulta:
 *  - `<section class="testimonials">`: son citas reales de clientes (`TestimonialList`),
 *    no se traducen ni se reescriben por idioma — la misma cita EN aparece igual en la
 *    home EN y ES a propósito.
 *  - `<p class="studio__address">`: el NAP de cada sede, que la regla 3 de CLAUDE.md
 *    exige idéntico en todo el sitio — lo contrario de lo que este test vigila.
 *
 * Fuera de esas dos excepciones, un par bilingüe (una página EN y su par ES) nunca
 * coincide aquí: son textos en idiomas distintos, nunca literalmente iguales.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const MIN_LENGTH = 40;

function findHtml(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/** `dist/es/index.html` → `/es/` */
function toSitePath(file: string): string {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  return `/${rel.replace(/index\.html$/, '')}`;
}

function mainParagraphs(html: string): readonly string[] {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch) return [];

  const withoutTestimonials = mainMatch[1]!.replace(
    /<section class="testimonials"[^>]*>[\s\S]*?<\/section>/g,
    '',
  );

  const paragraphs: string[] = [];
  const pRe = /<p([^>]*)>([\s\S]*?)<\/p>/g;
  let match: RegExpExecArray | null;
  while ((match = pRe.exec(withoutTestimonials)) !== null) {
    if (/class="studio__address"/.test(match[1]!)) continue;

    const text = stripTags(match[2]!);
    if (text.length >= MIN_LENGTH) paragraphs.push(text);
  }
  return paragraphs;
}

test('dist/ existe (corre "pnpm build" antes de "pnpm test")', () => {
  assert.ok(existsSync(DIST), `falta ${DIST}/ — corre "pnpm build" primero`);
});

test('ningún párrafo sustancial de <main> se repite entre páginas distintas', () => {
  const files = findHtml(DIST);
  const byText = new Map<string, Set<string>>();

  for (const file of files) {
    const path = toSitePath(file);
    const html = readFileSync(file, 'utf8');
    for (const text of mainParagraphs(html)) {
      const pages = byText.get(text) ?? new Set<string>();
      pages.add(path);
      byText.set(text, pages);
    }
  }

  const duplicates = [...byText].filter(([, pages]) => pages.size > 1);

  if (duplicates.length > 0) {
    const report = duplicates
      .map(([text, pages]) => `  · "${text.slice(0, 80)}${text.length > 80 ? '…' : ''}" — en ${[...pages].join(', ')}`)
      .join('\n');
    assert.fail(`${duplicates.length} párrafo(s) duplicado(s) entre páginas:\n${report}`);
  }
});
