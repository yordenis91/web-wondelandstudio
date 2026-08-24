/**
 * Genera `dist/sitemap.xml` a partir de `ROUTES` (`i18n/routes.ts`) — la misma fuente de
 * verdad que ya alimenta la navegación y el hreflang recíproco de `Layout.astro`. No hay
 * una segunda lista de URLs que mantener sincronizada a mano: si una ruta está en el
 * mapa, sale en el sitemap; si no está, no sale.
 *
 * Cada URL declara sus `xhtml:link` alternates (en-US, es-US, x-default) igual que el
 * `<head>` de la propia página — un sitemap sin hreflang recíproco es tan inútil para
 * SEO multi-idioma como una página sin él (regla 6 de CLAUDE.md, extendida aquí).
 *
 * El portfolio queda fuera a propósito: son páginas que existen y compilan pero que
 * todavía no se enlazan desde ningún sitio del sitio (sin fotos reales que mostrar) —
 * meterlas en el sitemap sería publicarlas igual, por la puerta de atrás.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { getAllRoutes } from '../src/i18n/routes.ts';
import { BUSINESS } from '../src/data/business.ts';

const DIST = 'dist';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry(path: string, enPath: string, esPath: string): string {
  const loc = `${BUSINESS.siteUrl}${path}`;
  const en = `${BUSINESS.siteUrl}${enPath}`;
  const es = `${BUSINESS.siteUrl}${esPath}`;
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="${escapeXml(en)}" />
    <xhtml:link rel="alternate" hreflang="es-US" href="${escapeXml(es)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(en)}" />
  </url>`;
}

function main(): void {
  const routes = getAllRoutes().filter((r) => r.kind !== 'portfolio');

  const entries = routes.flatMap((route) => [
    urlEntry(route.en, route.en, route.es),
    urlEntry(route.es, route.en, route.es),
  ]);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  writeFileSync(join(DIST, 'sitemap.xml'), xml);
  console.log(`generate-sitemap: ${entries.length} URL(s) en ${DIST}/sitemap.xml`);
}

main();
