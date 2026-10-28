import { defineArrayMember, defineField } from 'sanity';

/**
 * Portable Text, no texto plano.
 *
 * Los copy decks llevan enlaces dentro de los párrafos ("entra directamente a [video de
 * bodas en West Palm Beach](...)"), y un `text` plano no los puede representar.
 *
 * Deliberadamente pobre: solo párrafos, listas, negrita, cursiva y enlace. Sin
 * encabezados —el H2 de cada sección es su propio campo, y permitir otro aquí rompería
 * la jerarquía de la página— y sin estilos de color, que es decisión de diseño.
 */
export const portableBodyMember = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Párrafo', value: 'normal' }],
  lists: [
    { title: 'Viñetas', value: 'bullet' },
    { title: 'Numerada', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Negrita', value: 'strong' },
      { title: 'Cursiva', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Enlace',
        fields: [
          defineField({
            name: 'href',
            title: 'Destino',
            type: 'string',
            description:
              'Ruta interna con barra inicial y final (/es/precios/), ancla (#wedding), o URL completa.',
            /**
             * Un enlace interno sin barra final acaba en una redirección o en un 404,
             * porque el sitio se sirve con `trailingSlash: always`. Esto lo atrapa al
             * guardar en vez de en producción.
             */
            validation: (Rule) =>
              Rule.required().custom((value?: string) => {
                if (!value) return 'El enlace necesita un destino';
                if (/^https?:\/\//.test(value)) return true;
                if (/^#[a-z0-9-]+$/.test(value)) return true;
                if (!value.startsWith('/')) {
                  return 'Una ruta interna empieza por "/" (o usa una URL completa con https://)';
                }
                const [path] = value.split('#');
                if (!path.endsWith('/')) {
                  return 'Una ruta interna acaba en "/" — el sitio usa trailingSlash: always';
                }
                return true;
              }),
          }),
        ],
      },
    ],
  },
});

/** Campo `array` de Portable Text con el mismo conjunto de marcas en todo el Studio. */
export function portableBodyField(name: string, title: string, opts: { group?: string; required?: boolean; description?: string } = {}) {
  return defineField({
    name,
    title,
    description: opts.description,
    type: 'array',
    group: opts.group,
    of: [portableBodyMember],
    validation: opts.required ? (Rule) => Rule.required().min(1) : undefined,
  });
}
