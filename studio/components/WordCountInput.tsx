import { useCallback, useMemo } from 'react';
import { Box, Text } from '@sanity/ui';
import { type StringInputProps, set, unset } from 'sanity';

/**
 * `answerParagraph` debe caer en 60-65 palabras (CLAUDE.md regla 7 / PLAN.md §2): un
 * párrafo-respuesta demasiado corto no compite en AI Overviews, uno demasiado largo dobla
 * como copy de otra sección y arriesga contenido duplicado entre páginas hermanas.
 */
const MIN_WORDS = 60;
const MAX_WORDS = 65;

function countWords(value: string | undefined): number {
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

  const inRange = count >= MIN_WORDS && count <= MAX_WORDS;
  const tone = count === 0 ? 'default' : inRange ? 'positive' : 'critical';

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
          {count > 0 && !inRange
            ? count < MIN_WORDS
              ? ` — faltan ${MIN_WORDS - count}`
              : ` — sobran ${count - MAX_WORDS}`
            : ''}
        </Text>
      </Box>
    </Box>
  );
}
