import { useCallback, useMemo } from 'react';
import { Box, Text } from '@sanity/ui';
import { type StringInputProps, set, unset } from 'sanity';

/**
 * Umbrales del `answerParagraph`, compartidos con la validación de `servicePage` para
 * que la cifra viva en un solo sitio.
 *
 * Los dos límites NO tienen el mismo peso:
 *
 * - `MAX_WORDS` es la regla dura. Es la única cifra que fija CLAUDE.md en el modelo de
 *   contenido ("answerParagraph (máx 65 palabras, validado)"), y pasarse arriesga que
 *   el párrafo doble como copy de otra sección — contenido duplicado entre hermanas.
 * - `MIN_WORDS` es guía editorial, no requisito. Un párrafo corto compite peor en AI
 *   Overviews, pero cinco párrafos ya aprobados en `docs/copy/` caen en 57-59 palabras,
 *   así que rechazarlos sería bloquear contenido real.
 */
export const MIN_WORDS = 60;
export const MAX_WORDS = 65;

export function countWords(value: string | undefined): number {
  if (!value) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function WordCountInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;
  const count = useMemo(() => countWords(value), [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = event.currentTarget.value;
      onChange(next ? set(next) : unset());
    },
    [onChange],
  );

  /* Tres estados, no dos: pasarse es un error que bloquea, quedarse corto es solo un
     aviso. El color lo refleja para que no parezcan la misma gravedad. */
  const tone =
    count === 0
      ? 'default'
      : count > MAX_WORDS
        ? 'critical'
        : count < MIN_WORDS
          ? 'caution'
          : 'positive';

  return (
    <Box>
      <textarea
        {...elementProps}
        value={value ?? ''}
        onChange={handleChange}
        rows={4}
        style={{
          width: '100%',
          fontFamily: 'inherit',
          fontSize: '1em',
          padding: '0.75em',
          border: '1px solid var(--card-border-color)',
          borderRadius: '3px',
          resize: 'vertical',
        }}
      />
      <Box marginTop={2}>
        <Text size={1} weight="medium" style={{ color: `var(--card-badge-${tone}-dot-color, inherit)` }}>
          {count} / {MIN_WORDS}-{MAX_WORDS} palabras
          {count > MAX_WORDS ? ` — sobran ${count - MAX_WORDS}, no se puede guardar` : ''}
          {count > 0 && count < MIN_WORDS ? ` — faltan ${MIN_WORDS - count} (aviso, se puede guardar)` : ''}
        </Text>
      </Box>
    </Box>
  );
}
