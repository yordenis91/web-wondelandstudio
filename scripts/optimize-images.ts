/**
 * Optimiza las fotos de `imagenes/` a AVIF + WebP en varios anchos, en `public/img/`, y
 * escribe `src/lib/photos.generated.ts` con las dimensiones reales de cada una.
 *
 * Nunca amplía: si la fuente mide 1600px de ancho, no se genera un 1920 (sería el mismo
 * archivo más pesado y borroso). Cuando lleguen los originales basta con reemplazarlos en
 * `imagenes/` y volver a correr esto — los anchos nuevos aparecen solos.
 *
 * `sharp` no es dependencia directa del proyecto (la trae Astro), así que se resuelve
 * desde Astro en vez de añadirla a package.json.
 *
 * Uso: node scripts/optimize-images.ts
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const fromAstro = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
const sharp = fromAstro('sharp') as typeof import('sharp');

/** id estable → archivo de origen. El id es lo que usan las páginas (`src/lib/images.ts`). */
const SOURCES: Readonly<Record<string, string>> = {
  wedding: 'IMG-20260908-WA0038.jpg',
  maternity: 'IMG-20260908-WA0039.jpg',
  quinceanera: 'IMG-20260908-WA0040.jpg',
  'team-cinema': 'IMG-20260909-WA0049.jpg',
  'clock-tower': 'IMG-20260910-WA0009.jpg',
  'brand-studio': 'IMG-20260910-WA0015.jpg',
  lisandra: 'IMG-20261001-WA0025.jpg',
};

const WIDTHS = [480, 800, 1200, 1600] as const;
const OUT = 'public/img';
mkdirSync(OUT, { recursive: true });

const manifest: Record<string, { width: number; height: number; widths: number[] }> = {};

for (const [id, file] of Object.entries(SOURCES)) {
  const input = join('imagenes', file);
  const meta = await sharp(input).metadata();
  const { width, height } = meta;
  if (!width || !height) throw new Error(`No pude leer las dimensiones de ${input}`);

  const widths = WIDTHS.filter((w) => w < width);
  widths.push(width > 1600 ? 1600 : width); // el mayor disponible, sin pasar de 1600
  const unique = [...new Set(widths)].sort((a, b) => a - b);

  for (const w of unique) {
    const base = sharp(input).resize({ width: w });
    await base.clone().avif({ quality: 55 }).toFile(join(OUT, `${id}-${w}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(join(OUT, `${id}-${w}.webp`));
  }
  const top = unique[unique.length - 1];
  manifest[id] = { width: top, height: Math.round((height * top) / width), widths: unique };
  console.log(`${id}: ${unique.join(', ')}px`);
}

writeFileSync(
  'src/lib/photos.generated.ts',
  `/** GENERADO por scripts/optimize-images.ts — no editar a mano. */\n` +
    `export const PHOTOS = ${JSON.stringify(manifest, null, 2)} as const;\n` +
    `export type PhotoId = keyof typeof PHOTOS;\n`,
);

/**
 * Logo: blanco sobre transparente (`imagenes/w_logo.webp`), pensado para el fondo oscuro del
 * sitio. Se generan tres anchos en `public/logo/` — la cabecera lo pinta a ~90px y el
 * footer a ~140px, así que con 180/360/540 cubre 1x y 2x sin servir de más.
 */
const LOGO_WIDTHS = [180, 360, 540] as const;
mkdirSync('public/logo', { recursive: true });
for (const w of LOGO_WIDTHS) {
  await sharp(join('imagenes', 'w_logo.webp'))
    .resize({ width: w })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(join('public/logo', `wonderlands-${w}.webp`));
}
console.log(`logo: ${LOGO_WIDTHS.join(', ')}px`);
