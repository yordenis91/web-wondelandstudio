/**
 * Contenido de `/port-st-lucie/maternity-photographer/` y su par español.
 *
 * Texto literal de `docs/copy/psl-maternity-photographer-copydeck.md`. `pageType: event`
 * igual que boda — el mismo `ServicePageTemplate` sirve sin cambios, que es justo lo que
 * este deck existe para validar (§0 del deck). Sin página hermana: maternidad no tiene
 * split foto/video, así que `relatedServicePath` no se pasa.
 *
 * Una desviación deliberada del texto literal del deck: el párrafo-respuesta y el CTA
 * final del deck terminan en `PSL_PHONE_772` — el teléfono propio de PSL todavía sin
 * confirmar (`src/data/business.ts`). Regla 4 de CLAUDE.md: un token sin resolver que
 * llegue a `dist/` aborta el build, así que copiarlo literal aquí no es una opción. En
 * vez de inventar un número, el párrafo-respuesta cierra sin ese teléfono y el CTA usa
 * el WhatsApp del negocio, que es el mismo para las dos sedes y ya está confirmado
 * (`BUSINESS.whatsapp` en `business.ts`) — es el canal que el botón realmente marca.
 *
 * **Desde que el contenido vive en Sanity este archivo ya no contiene el texto.** El
 * texto está en `sanity/psl-maternity-photographer.ts`, que genera `scripts/sync-from-sanity.ts` desde el
 * Studio. Este comentario se conserva por el historial de decisiones editoriales de arriba.
 */

export { CONTENT as PSL_MATERNITY_PHOTOGRAPHER } from './sanity/psl-maternity-photographer.ts';
