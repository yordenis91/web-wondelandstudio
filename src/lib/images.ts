/**
 * Fotos optimizadas por `scripts/optimize-images.ts` → `public/img/<id>-<ancho>.{avif,webp}`.
 *
 * El `src` de respaldo es el WebP más grande; `sources` ofrece AVIF y WebP por ancho para
 * que el navegador elija el más pequeño que cubra su pantalla (LCP en móvil 4G, regla 8
 * de CLAUDE.md). Las dimensiones salen del archivo real, no se escriben a mano, para que
 * el `<img>` reserve el hueco correcto y no haya CLS.
 */
import { PHOTOS, type PhotoId } from './photos.generated.ts';

export type { PhotoId };

export interface HeroImage {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly sources?: readonly { readonly srcset: string; readonly type: string }[];
}

function srcset(id: PhotoId, ext: 'avif' | 'webp'): string {
  return PHOTOS[id].widths.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(', ');
}

export function photo(id: PhotoId): HeroImage {
  const { width, height } = PHOTOS[id];
  return {
    src: `/img/${id}-${width}.webp`,
    width,
    height,
    sources: [
      { srcset: srcset(id, 'avif'), type: 'image/avif' },
      { srcset: srcset(id, 'webp'), type: 'image/webp' },
    ],
  };
}
