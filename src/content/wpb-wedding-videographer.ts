/**
 * Contenido de `/west-palm-beach/wedding-videographer/` y su par español.
 *
 * Texto **literal** de `docs/copy/wpb-wedding-videographer-copydeck.md`. Página hermana
 * de `wpb-wedding-photographer.ts` — comparte precio y estructura de colecciones, pero
 * el deck exige cero párrafos compartidos, cero FAQ repetidas y `isRelatedTo` recíproco.
 * No hay bloque "How booking works" en esta página, a diferencia de la de fotografía —
 * es exactamente el caso que `sectionsAfterPricing` como array modular existe para
 * cubrir sin forzar una sección vacía.
 *
 * **Desde que el contenido vive en Sanity este archivo ya no contiene el texto.** El
 * texto está en `sanity/wpb-wedding-videographer.ts`, que genera `scripts/sync-from-sanity.ts` desde el
 * Studio. Este comentario se conserva por el historial de decisiones editoriales de arriba.
 */

export { CONTENT as WPB_WEDDING_VIDEOGRAPHER } from './sanity/wpb-wedding-videographer.ts';
