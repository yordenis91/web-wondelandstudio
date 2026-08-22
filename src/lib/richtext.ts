/**
 * Texto con enlaces en línea.
 *
 * Los copy decks llevan enlaces dentro de los párrafos ("start on our [West Palm Beach
 * wedding videography page](...) instead"), y el `sections[].body` de Sanity está
 * tipado hoy como `string` plano, que no los puede representar. Esto cubre el hueco
 * sin inventar un parser de markdown: un párrafo es una lista de trozos, y cada trozo
 * es texto suelto o texto con destino.
 *
 * Es deliberadamente pobre —sin negrita, sin listas anidadas, sin imágenes— porque es
 * un puente. Cuando `body` pase a Portable Text en Sanity, este módulo se sustituye por
 * el renderer de Portable Text y los datos ya tienen la misma forma: trozos con marcas.
 */

export interface Link {
  readonly text: string;
  readonly href: string;
}

/** Un trozo de párrafo: texto plano, o texto que enlaza a algún sitio. */
export type Segment = string | Link;

/** Un párrafo es una secuencia de trozos. */
export type Paragraph = readonly Segment[];

export function isLink(segment: Segment): segment is Link {
  return typeof segment !== 'string';
}

/** El texto plano de un párrafo, sin marcas. Para meta descripciones y avisos de build. */
export function plainText(paragraph: Paragraph): string {
  return paragraph.map((s) => (isLink(s) ? s.text : s)).join('');
}
