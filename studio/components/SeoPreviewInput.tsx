import { Box, Card, Text } from '@sanity/ui';
import { useFormValue } from 'sanity';

/**
 * Campo de solo lectura para el grupo "Preview" de `servicePage`: aproxima cómo se ve el
 * snippet en un resultado de búsqueda a partir de los datos ya cargados en el documento,
 * sin duplicar ningún dato (no escribe nada — es puramente informativo).
 */
export function SeoPreviewInput() {
  const metaTitle = useFormValue(['metaTitle']) as string | undefined;
  const metaDescription = useFormValue(['metaDescription']) as string | undefined;
  const h1 = useFormValue(['h1']) as string | undefined;
  const answerParagraph = useFormValue(['answerParagraph']) as string | undefined;

  return (
    <Box>
      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Text size={1} muted style={{ marginBottom: '0.5em', display: 'block' }}>
          Vista previa de Google
        </Text>
        <Text size={2} style={{ color: '#1a0dab', marginBottom: '0.25em' }}>
          {metaTitle || h1 || '(sin metaTitle todavía)'}
        </Text>
        <Text size={1} style={{ color: '#006621', marginBottom: '0.25em' }}>
          wonderlandsstudio.com
        </Text>
        <Text size={1} muted>
          {metaDescription || '(sin metaDescription todavía)'}
        </Text>
      </Card>
      <Card padding={3} radius={2} shadow={1} tone="transparent" border marginTop={3}>
        <Text size={1} muted style={{ marginBottom: '0.5em', display: 'block' }}>
          Párrafo-respuesta (lo que leen los crawlers de LLM)
        </Text>
        <Text size={2}>{answerParagraph || '(sin answerParagraph todavía)'}</Text>
      </Card>
    </Box>
  );
}
