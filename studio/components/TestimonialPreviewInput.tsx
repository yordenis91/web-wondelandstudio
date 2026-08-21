import { Badge, Box, Card, Text } from '@sanity/ui';
import { useFormValue } from 'sanity';

/**
 * Campo de solo lectura para el grupo "Preview" de `testimonial`: muestra cómo se leería
 * la cita en la página, y el estado de `verified` bien visible — porque un testimonio no
 * verificado nunca debe alimentar `Review`/`AggregateRating` (regla 5 de CLAUDE.md).
 */
export function TestimonialPreviewInput() {
  const text = useFormValue(['text']) as string | undefined;
  const author = useFormValue(['author']) as string | undefined;
  const city = useFormValue(['city']) as string | undefined;
  const verified = useFormValue(['verified']) as boolean | undefined;

  return (
    <Card padding={4} radius={2} shadow={1} tone="transparent" border>
      <Badge tone={verified ? 'positive' : 'caution'} marginBottom={3}>
        {verified ? 'Verificado — sale en schema' : 'Sin verificar — no sale en schema'}
      </Badge>
      <Box marginTop={3}>
        <Text size={2} style={{ fontStyle: 'italic' }}>
          “{text || '(sin texto todavía)'}”
        </Text>
      </Box>
      <Box marginTop={3}>
        <Text size={1} muted>
          — {author || '(sin autor)'}{city ? `, ${city.toUpperCase()}` : ''}
        </Text>
      </Box>
    </Card>
  );
}
