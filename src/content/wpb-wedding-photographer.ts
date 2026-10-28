/**
 * Contenido de `/west-palm-beach/wedding-photographer/` y su par español.
 *
 * Texto **literal** de `docs/copy/wpb-wedding-photographer-copydeck.md`. No se reescribe
 * ni se resume nada: el deck está aprobado y es la fuente. Lo único que no viene de ahí
 * son los precios, que se leen de `data/pricing.ts` (regla 2 de CLAUDE.md).
 *
 * La forma imita la que devolverá `servicePageQuery` de Sanity, para que conectar el CMS
 * sea sustituir el import y no reescribir la página.
 *
 * **Desde que el contenido vive en Sanity este archivo ya no contiene el texto.** El
 * texto está en `sanity/wpb-wedding-photographer.ts`, que genera `scripts/sync-from-sanity.ts` desde el
 * Studio. Este comentario se conserva por el historial de decisiones editoriales de arriba.
 */

export { CONTENT as WPB_WEDDING_PHOTOGRAPHER } from './sanity/wpb-wedding-photographer.ts';

export type { ProseSectionContent, StepsSectionContent, SectionContent, PageContent } from '../lib/pageContent.ts';
