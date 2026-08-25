/**
 * `pnpm test` — parte "hreflang" (CLAUDE.md, sección Comandos).
 *
 * A diferencia de `scripts/check-head.ts` (que valida el `<head>` realmente servido de
 * cada página), este test recorre `dist/sitemap.xml` — el artefacto que de verdad lee
 * un crawler para descubrir el sitio. Son dos garantías distintas: una comprueba que
 * cada página declare su hreflang correctamente, la otra que `generate-sitemap.ts` no
 * lo haya transcrito mal al volcarlo al sitemap. Ambas fuentes salen del mismo mapa
 * (`ROUTES` en `i18n/routes.ts`), así que en un build sano coinciden — este test existe
 * para el día en que no coincidan.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const SITEMAP_PATH = 'dist/sitemap.xml';

interface SitemapUrl {
  readonly loc: string;
  readonly alternates: ReadonlyMap<string, string>;
}

function parseSitemap(xml: string): readonly SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];

  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;

    const alternates = new Map<string, string>();
    const linkRe = /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"\s*\/>/g;
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(block)) !== null) {
      alternates.set(match[1]!, match[2]!);
    }
    urls.push({ loc, alternates });
  }

  return urls;
}

test('dist/sitemap.xml existe (corre "pnpm build" antes de "pnpm test")', () => {
  assert.ok(existsSync(SITEMAP_PATH), `falta ${SITEMAP_PATH} — corre "pnpm build" primero`);
});

test('cada URL del sitemap declara los tres hreflang requeridos', () => {
  const urls = parseSitemap(readFileSync(SITEMAP_PATH, 'utf8'));
  assert.ok(urls.length > 0, 'el sitemap no tiene ninguna <url>');

  for (const url of urls) {
    for (const required of ['en-US', 'es-US', 'x-default']) {
      assert.ok(
        url.alternates.has(required),
        `${url.loc} — falta hreflang="${required}"`,
      );
    }
  }
});

/**
 * Recíproco de verdad, no solo "el destino existe": cada URL declara una pareja
 * (en-US, es-US), y para que sea mutua, la página que vive en cada lado de esa pareja
 * tiene que declarar exactamente la misma pareja — no solo confirmarse a sí misma.
 * Comparar `target.alternates.get(lang)` contra su propia URL (que es como se hacía en
 * un borrador anterior de este test) es una tautología: cualquier página que se
 * autorreferencie correctamente la pasa, apunte o no al socio real. La comparación que
 * importa es que ambos lados coincidan en la pareja completa.
 */
test('el hreflang del sitemap es recíproco: ambos lados de cada pareja EN/ES coinciden', () => {
  const urls = parseSitemap(readFileSync(SITEMAP_PATH, 'utf8'));
  const byLoc = new Map(urls.map((u) => [u.loc, u]));

  for (const url of urls) {
    const enHref = url.alternates.get('en-US');
    const esHref = url.alternates.get('es-US');
    assert.ok(enHref && esHref, `${url.loc} — falta en-US o es-US`);

    for (const partnerHref of [enHref, esHref]) {
      const partner = byLoc.get(partnerHref!);
      assert.ok(
        partner,
        `${url.loc} — apunta a ${partnerHref}, que no existe como <url> en el sitemap`,
      );

      assert.equal(
        partner.alternates.get('en-US'),
        enHref,
        `${url.loc} declara la pareja en-US=${enHref}/es-US=${esHref}, pero ${partner.loc} ` +
          `declara en-US=${partner.alternates.get('en-US')} — no coinciden`,
      );
      assert.equal(
        partner.alternates.get('es-US'),
        esHref,
        `${url.loc} declara la pareja en-US=${enHref}/es-US=${esHref}, pero ${partner.loc} ` +
          `declara es-US=${partner.alternates.get('es-US')} — no coinciden`,
      );
    }
  }
});
