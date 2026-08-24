/**
 * Contenido de `/portfolio/[category]/`, una entrada por categoría de
 * `PORTFOLIO_CATEGORIES` (`i18n/routes.ts`).
 *
 * Las imágenes son `hero-placeholder.svg` repetido — igual que el resto del sitio
 * mientras no lleguen las fotos reales de Lisandra. La página no se enlaza todavía
 * desde la nav ni el footer (decisión explícita: existe y compila, pero nadie llega
 * aquí hasta que haya fotos que mostrar) — ver conversación del 2026-08-24.
 */
import type { PortfolioPageContent } from '../lib/pageContent.ts';
import type { PortfolioCategory } from '../i18n/routes.ts';

const PLACEHOLDER_COUNT = 6;

function placeholderImages(altEN: string, altES: string, lang: 'en' | 'es') {
  const alt = lang === 'en' ? altEN : altES;
  return Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    src: '/hero-placeholder.svg',
    alt: `${alt} — ${i + 1}`,
    width: 1600,
    height: 900,
  }));
}

interface CategoryCopy {
  readonly h1: { readonly en: string; readonly es: string };
  readonly metaTitle: { readonly en: string; readonly es: string };
  readonly metaDescription: { readonly en: string; readonly es: string };
  readonly answerParagraph: { readonly en: string; readonly es: string };
  readonly imageAlt: { readonly en: string; readonly es: string };
}

const COPY: Readonly<Record<PortfolioCategory['id'], CategoryCopy>> = {
  weddings: {
    h1: { en: 'Wedding Photography & Film Portfolio', es: 'Portafolio de Fotografía y Video de Bodas' },
    metaTitle: {
      en: 'Wedding Portfolio | Wonderlands Studio',
      es: 'Portafolio de Bodas | Wonderlands Studio',
    },
    metaDescription: {
      en: 'Real wedding coverage across Palm Beach County — getting ready, ceremony, reception and film, in the same editorial style every couple receives.',
      es: 'Cobertura real de bodas en el condado de Palm Beach — preparativos, ceremonia, recepción y video, en el mismo estilo editorial que recibe cada pareja.',
    },
    answerParagraph: {
      en: 'A look at wedding days we’ve covered across West Palm Beach and the surrounding area — from getting-ready details through the last dance, photographed and filmed by the same team on the same day.',
      es: 'Un vistazo a las bodas que hemos cubierto en West Palm Beach y sus alrededores — desde los preparativos hasta el último baile, fotografiadas y filmadas por el mismo equipo el mismo día.',
    },
    imageAlt: {
      en: 'Wedding photography and film by Wonderlands Studio',
      es: 'Fotografía y video de boda por Wonderlands Studio',
    },
  },
  branding: {
    h1: { en: 'Brand Photography Portfolio', es: 'Portafolio de Fotografía de Marca' },
    metaTitle: {
      en: 'Brand Photography Portfolio | Wonderlands Studio',
      es: 'Portafolio de Fotografía de Marca | Wonderlands Studio',
    },
    metaDescription: {
      en: 'Editorial brand photography for South Florida businesses — headshots, product and lifestyle sessions built for a consistent visual identity.',
      es: 'Fotografía de marca editorial para negocios del sur de Florida — retratos corporativos, producto y estilo de vida para una identidad visual consistente.',
    },
    answerParagraph: {
      en: 'Brand sessions we’ve shot for South Florida businesses — headshots, product photography and lifestyle content built around a single, consistent visual identity.',
      es: 'Sesiones de marca que hemos hecho para negocios del sur de Florida — retratos corporativos, fotografía de producto y contenido de estilo de vida construidos alrededor de una identidad visual consistente.',
    },
    imageAlt: {
      en: 'Brand photography session by Wonderlands Studio',
      es: 'Sesión de fotografía de marca por Wonderlands Studio',
    },
  },
  maternity: {
    h1: { en: 'Maternity Photography Portfolio', es: 'Portafolio de Fotografía de Embarazo' },
    metaTitle: {
      en: 'Maternity Portfolio | Wonderlands Studio',
      es: 'Portafolio de Embarazo | Wonderlands Studio',
    },
    metaDescription: {
      en: 'Maternity and newborn sessions from our Port St. Lucie studio — soft, patient, editorial-quality images for growing families.',
      es: 'Sesiones de embarazo y recién nacidos desde nuestro estudio en Port St. Lucie — imágenes suaves, con paciencia y calidad editorial para familias en crecimiento.',
    },
    answerParagraph: {
      en: 'Maternity and newborn sessions from our Port St. Lucie studio — unhurried, editorial-quality images made with the patience these sessions need.',
      es: 'Sesiones de embarazo y recién nacidos desde nuestro estudio en Port St. Lucie — imágenes sin prisa, de calidad editorial, hechas con la paciencia que estas sesiones requieren.',
    },
    imageAlt: {
      en: 'Maternity photography session by Wonderlands Studio',
      es: 'Sesión de fotografía de embarazo por Wonderlands Studio',
    },
  },
};

const FINAL_CTA = {
  en: {
    heading: 'Like what you see?',
    body: 'Let’s talk about your date and what a session with us looks like.',
    label: 'Check your date',
    message: 'Hi Wonderlands Studio — I saw the portfolio and would like to check availability.',
  },
  es: {
    heading: '¿Te gustó lo que viste?',
    body: 'Hablemos de tu fecha y de cómo sería una sesión con nosotros.',
    label: 'Consulta tu fecha',
    message: 'Hola Wonderlands Studio — vi el portafolio y quisiera consultar disponibilidad.',
  },
} as const;

export function getPortfolioH1(categoryId: PortfolioCategory['id'], lang: 'en' | 'es'): string {
  return COPY[categoryId].h1[lang];
}

export function getPortfolioContent(
  categoryId: PortfolioCategory['id'],
  lang: 'en' | 'es',
  breadcrumbs: readonly { readonly name: string; readonly path?: string }[],
): PortfolioPageContent {
  const copy = COPY[categoryId];
  return {
    metaTitle: copy.metaTitle[lang],
    metaDescription: copy.metaDescription[lang],
    h1: copy.h1[lang],
    answerParagraph: copy.answerParagraph[lang],
    finalCta: FINAL_CTA[lang],
    breadcrumbs,
    hero: { eyebrow: lang === 'en' ? 'Portfolio' : 'Portafolio', alt: copy.imageAlt[lang] },
  };
}

export function getPortfolioImages(categoryId: PortfolioCategory['id'], lang: 'en' | 'es') {
  const copy = COPY[categoryId];
  return placeholderImages(copy.imageAlt.en, copy.imageAlt.es, lang);
}
