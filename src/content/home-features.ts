/**
 * Los 6 puntos de la sección "por qué elegirnos" de la home. Contenido rescatado del
 * sitio actual (captura de pantalla del usuario, `docs/copy/` no tiene deck de home
 * todavía — ver nota en `pages/index.astro`), limpiado de dos frases de relleno SEO
 * ("si buscas un estudio de fotos cerca de mi...", "(foto estudio recién nacido)") que
 * no encajan con el resto del copy ya aprobado en el proyecto. Los 6 puntos se
 * mantienen — son diferencias reales del negocio, ninguno se pisa con otro.
 *
 * Reescrito en los dos idiomas, no traducido literal — mismo criterio que el resto del
 * copy del sitio.
 */
import type { Lang } from '../i18n/routes.ts';

export interface HomeFeature {
  readonly icon: 'frame' | 'reel' | 'light' | 'bilingual' | 'print' | 'hourglass';
  readonly title: string;
  readonly body: string;
}

const EN: readonly HomeFeature[] = [
  {
    icon: 'frame',
    title: 'Expert direction, not just poses',
    body: "We don't just take photographs — we direct you. Whether it's guiding a bride or framing a family, we make sure you look natural, elegant and at ease.",
  },
  {
    icon: 'reel',
    title: 'Photo and film, one team',
    body: 'In the age of Reels and TikTok, why choose? Every session pairs high-resolution stills with vertical video built for social, shot by the same team the same day.',
  },
  {
    icon: 'light',
    title: 'Editorial lighting',
    body: 'We shape natural and studio light to give every gallery a magazine-quality finish — in our climate-controlled studio or on location.',
  },
  {
    icon: 'bilingual',
    title: 'Bilingual, not an afterthought',
    body: 'English and Spanish, spoken fluently throughout the session — so every family member and every client feels understood in front of the camera.',
  },
  {
    icon: 'print',
    title: 'Delivered ready to use',
    body: 'From large-format fine art prints to ultra-sharp digital files, your gallery arrives at full resolution — ready for any screen or wall.',
  },
  {
    icon: 'hourglass',
    title: 'Patience, especially with newborns',
    body: "We specialize in delicate newborn sessions and clients who are camera-shy, building a relaxed atmosphere where the real connection comes through.",
  },
];

const ES: readonly HomeFeature[] = [
  {
    icon: 'frame',
    title: 'Dirección experta, no solo poses',
    body: 'No solo tomamos fotografías: te dirigimos. Ya sea guiando a una novia o encuadrando a una familia, nos aseguramos de que te veas natural, elegante y en confianza.',
  },
  {
    icon: 'reel',
    title: 'Foto y video, un solo equipo',
    body: 'En la era de los Reels y TikTok, ¿por qué elegir? Cada sesión combina fotos en alta resolución con video vertical pensado para redes, hecho por el mismo equipo el mismo día.',
  },
  {
    icon: 'light',
    title: 'Iluminación editorial',
    body: 'Trabajamos la luz natural y de estudio para darle a cada galería un acabado de revista — en nuestro estudio con climatización o en locación.',
  },
  {
    icon: 'bilingual',
    title: 'Bilingüe de fondo',
    body: 'Español e inglés, hablados con fluidez durante toda la sesión — para que cada miembro de la familia y cada cliente se sienta comprendido frente a la cámara.',
  },
  {
    icon: 'print',
    title: 'Entrega lista para usar',
    body: 'Desde impresiones fine art en gran formato hasta archivos digitales ultra nítidos, tu galería llega en máxima resolución — lista para cualquier pantalla o pared.',
  },
  {
    icon: 'hourglass',
    title: 'Paciencia, sobre todo con recién nacidos',
    body: 'Nos especializamos en sesiones delicadas de recién nacidos y en clientes tímidos frente a la cámara, creando un ambiente relajado donde la conexión real se nota.',
  },
];

export const HOME_FEATURES: Readonly<Record<Lang, readonly HomeFeature[]>> = { en: EN, es: ES };
