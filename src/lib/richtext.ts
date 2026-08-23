/**
 * Portable Text: los tipos que devuelve Sanity, más un ayudante para escribirlo a mano
 * mientras el CMS no está conectado.
 *
 * Antes esto definía un formato propio (`Segment[]`) como puente. El problema de un
 * formato propio es que el día que Sanity entregue Portable Text hay que reescribir
 * todas las páginas — justo lo que se quería evitar. Ahora el tipo que viaja hasta los
 * componentes **es** el de Sanity: cuando el CMS entre, desaparece `paragraph()` y los
 * datos llegan de GROQ con la misma forma, sin tocar ni un componente.
 *
 * Solo se modela lo que el esquema permite (ver `studio/schemaTypes/servicePage.ts`):
 * párrafos, listas, negrita, cursiva y enlace. Nada más.
 */

export interface PortableTextSpan {
  readonly _type: 'span';
  readonly _key?: string;
  readonly text: string;
  /** Decoradores (`strong`, `em`) o el `_key` de una anotación de `markDefs`. */
  readonly marks?: readonly string[];
}

export interface PortableTextLink {
  readonly _type: 'link';
  readonly _key: string;
  readonly href: string;
}

export type PortableTextMarkDef = PortableTextLink;

export interface PortableTextBlock {
  readonly _type: 'block';
  readonly _key?: string;
  readonly style?: 'normal';
  readonly listItem?: 'bullet' | 'number';
  readonly level?: number;
  readonly children: readonly PortableTextSpan[];
  readonly markDefs?: readonly PortableTextMarkDef[];
}

/* -------------------------------------------------------------------------- */
/* Autoría a mano — desaparece cuando Sanity esté conectado                     */
/* -------------------------------------------------------------------------- */

export interface Link {
  readonly text: string;
  readonly href: string;
}

/** Texto en negrita: el lead-in en negrita de un párrafo ("**A single session** gets…"). */
export interface Bold {
  readonly text: string;
  readonly bold: true;
}

/** Un trozo de párrafo: texto suelto, texto con destino, o texto en negrita. */
export type Segment = string | Link | Bold;

function isLink(segment: Segment): segment is Link {
  return typeof segment !== 'string' && !('bold' in segment);
}

function isBold(segment: Segment): segment is Bold {
  return typeof segment !== 'string' && 'bold' in segment;
}

/**
 * Construye un bloque de Portable Text desde una lista de trozos legible.
 *
 * Escribir Portable Text a mano es ilegible —`markDefs`, `_key`, `marks` cruzados— y un
 * copy deck se revisa leyéndolo. Esto deja la autoría en una forma que se lee de
 * corrido y produce la estructura real que emite Sanity.
 */
export function paragraph(segments: readonly Segment[], key?: string): PortableTextBlock {
  const markDefs: PortableTextMarkDef[] = [];
  const children: PortableTextSpan[] = segments.map((segment, index) => {
    if (isBold(segment)) {
      return {
        _type: 'span',
        _key: `${key ?? 'p'}-s${index}`,
        text: segment.text,
        marks: ['strong'],
      };
    }
    if (!isLink(segment)) {
      return { _type: 'span', _key: `${key ?? 'p'}-s${index}`, text: segment, marks: [] };
    }
    const linkKey = `${key ?? 'p'}-l${index}`;
    markDefs.push({ _type: 'link', _key: linkKey, href: segment.href });
    return {
      _type: 'span',
      _key: `${key ?? 'p'}-s${index}`,
      text: segment.text,
      marks: [linkKey],
    };
  });

  return { _type: 'block', _key: key, style: 'normal', children, markDefs };
}

/** Varios párrafos de una vez, con claves estables derivadas del índice. */
export function paragraphs(
  blocks: readonly (readonly Segment[])[],
): readonly PortableTextBlock[] {
  return blocks.map((segments, index) => paragraph(segments, `p${index}`));
}

/* -------------------------------------------------------------------------- */
/* Lectura                                                                     */
/* -------------------------------------------------------------------------- */

/** El texto plano de un conjunto de bloques. Para meta descripciones y avisos de build. */
export function toPlainText(blocks: readonly PortableTextBlock[]): string {
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) => block.children.map((child) => child.text).join(''))
    .join('\n\n');
}

/** El `href` de una marca, si esa marca es un enlace declarado en `markDefs`. */
export function resolveLink(
  mark: string,
  markDefs: readonly PortableTextMarkDef[] | undefined,
): string | undefined {
  return markDefs?.find((def) => def._key === mark && def._type === 'link')?.href;
}
