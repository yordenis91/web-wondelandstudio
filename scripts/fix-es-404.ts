/**
 * Astro solo trata `src/pages/404.astro` como caso especial y lo emite como `404.html`
 * plano — necesario para que Cloudflare (`not_found_handling: "404-page"`, ver
 * `wrangler.jsonc`) lo encuentre al resolver una ruta inexistente. Ese trato especial no
 * alcanza a rutas anidadas: `src/pages/es/404.astro` sale como `es/404/index.html`
 * (`build.format: 'directory'`, igual que cualquier otra página), y ahí Cloudflare no lo
 * ve al buscar el 404 más cercano para una URL bajo `/es/`.
 *
 * Este paso replica a mano, solo para `es/`, lo que Astro ya hace solo para la raíz:
 * mueve `dist/es/404/index.html` a `dist/es/404.html`.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SRC = join('dist', 'es', '404', 'index.html');
const DEST = join('dist', 'es', '404.html');

function main(): void {
  if (!existsSync(SRC)) {
    console.error(`fix-es-404: no existe ${SRC} — corre "astro build" primero.`);
    process.exit(1);
  }

  mkdirSync(dirname(DEST), { recursive: true });
  writeFileSync(DEST, readFileSync(SRC));
  rmSync(join('dist', 'es', '404'), { recursive: true, force: true });

  console.log(`fix-es-404: ${SRC} → ${DEST}`);
}

main();
