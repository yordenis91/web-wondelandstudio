/**
 * Registro único de tokens de placeholder pendientes de confirmación.
 *
 * Regla 4 de CLAUDE.md: un token de placeholder sin resolver aborta el deploy. Este
 * registro no relaja esa regla, la hace verificable:
 *
 * - Un token declarado aquí es un dato pendiente conocido. `check-tokens` lo reporta
 *   como aviso mientras viva en `src/` o en `docs/`, y lo trata como error si aparece
 *   en `dist/` — es decir, si llegara a renderizarse en HTML servido.
 * - Un token NO declarado aquí es un error en cualquier lugar, siempre. Es la red que
 *   atrapa tipos, tokens huérfanos de un copy deck y restos de plantilla.
 *
 * Resolver un dato = borrar su nombre de esta lista y sustituir el token por el valor
 * real. Mientras el nombre siga aquí, el dato sigue sin confirmar.
 */
export const PENDING_TOKEN_NAMES = [
  'WPB_STREET_ADDRESS',
  'WPB_POSTAL_CODE',
  'WPB_LAT',
  'WPB_LNG',
  'PSL_PHONE_772',
  'CONTACT_FORM_ENDPOINT',
] as const;

export type PendingTokenName = (typeof PENDING_TOKEN_NAMES)[number];

/** El literal exacto tal y como aparece en contenido: `{{WPB_LAT}}`, etc. */
export type PendingToken = `{{${PendingTokenName}}}`;

/** Un valor que puede estar todavía sin confirmar. */
export type Pending<T> = T | PendingToken;

/** Construye el literal del token con el tipo estrecho, no `string`. */
export function token<N extends PendingTokenName>(name: N): `{{${N}}}` {
  return `{{${name}}}`;
}

const TOKEN_SHAPE = /^\{\{[A-Z0-9_]+\}\}$/;

/**
 * `true` si el valor sigue siendo un placeholder. Las plantillas la usan para decidir
 * si un dato se puede pintar todavía; nunca para silenciar el fallo del build.
 */
export function isPending<T>(value: Pending<T>): value is PendingToken {
  return typeof value === 'string' && TOKEN_SHAPE.test(value);
}

/**
 * Devuelve el valor confirmado o lanza. Para usar en JSON-LD y en cualquier sitio donde
 * un placeholder sería peor que la ausencia del campo.
 */
export function requireResolved<T>(value: Pending<T>, label: string): T {
  if (isPending(value)) {
    throw new Error(`Dato sin confirmar: ${label} sigue siendo ${value}`);
  }
  return value as T;
}
