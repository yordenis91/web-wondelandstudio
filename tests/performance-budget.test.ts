/**
 * `pnpm test` — parte "presupuesto de rendimiento" (CLAUDE.md regla 8), mitad estática.
 *
 * Solo cubre el presupuesto de **JS inicial < 20KB**: es medible sin navegador, a partir
 * del propio HTML servido, así que puede correr en cada `pnpm test` sin costo. LCP y CLS
 * necesitan un render real con throttling de red — eso es lo que audita `pnpm lighthouse`
 * (`scripts/lighthouse-audit.ts`) contra las rutas clave, aparte, porque es más lento y
 * no tiene sentido correrlo en cada `pnpm test`.
 *
 * Cuenta cada `<script>` que el navegador ejecutaría: los `is:inline` de Astro (bytes de
 * su propio contenido) y cualquier `<script src="...">` (bytes del archivo en `dist/`).
 * Excluye `type="application/ld+json"`: es datos para crawlers, nunca se parsea como JS.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const BUDGET_BYTES = 20 * 1024;

function findHtml(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function toSitePath(file: string): string {
  const rel = relative(DIST, file).replace(/\\/g, '/');
  return `/${rel.replace(/index\.html$/, '')}`;
}

function scriptTags(html: string): readonly string[] {
  return html.match(/<script\b[^>]*>[\s\S]*?<\/script>/g) ?? [];
}

function initialJsBytes(html: string): number {
  let total = 0;

  for (const tag of scriptTags(html)) {
    if (/type="application\/ld\+json"/.test(tag)) continue;

    const srcMatch = tag.match(/\bsrc="([^"]+)"/);
    if (srcMatch) {
      const scriptPath = join(DIST, srcMatch[1]!.split('?')[0]!);
      if (existsSync(scriptPath)) total += statSync(scriptPath).size;
      continue;
    }

    const inner = tag.replace(/^<script\b[^>]*>/, '').replace(/<\/script>$/, '');
    total += Buffer.byteLength(inner, 'utf8');
  }

  return total;
}

test('dist/ existe (corre "pnpm build" antes de "pnpm test")', () => {
  assert.ok(existsSync(DIST), `falta ${DIST}/ — corre "pnpm build" primero`);
});

test(`el JS inicial de cada página pesa menos de ${BUDGET_BYTES / 1024}KB (regla 8 de CLAUDE.md)`, () => {
  const files = findHtml(DIST);
  const overBudget: string[] = [];

  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    const bytes = initialJsBytes(html);
    if (bytes > BUDGET_BYTES) {
      overBudget.push(`  · ${toSitePath(file)} — ${(bytes / 1024).toFixed(1)}KB`);
    }
  }

  assert.equal(
    overBudget.length,
    0,
    `${overBudget.length} página(s) por encima del presupuesto de ${BUDGET_BYTES / 1024}KB:\n${overBudget.join('\n')}`,
  );
});
