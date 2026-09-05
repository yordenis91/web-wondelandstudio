/**
 * Testimonios — sincronizados desde Sanity (`pnpm sanity:sync`), no hechos a mano.
 * Para cambiar un texto, una categoría o el estado `verified`, edítalo en el Studio
 * y vuelve a correr el script; un cambio a mano aquí se pierde en el próximo sync.
 *
 * `verified: true` en Sanity significa que alguien del estudio confirmó que la cita
 * es real y que hay permiso para publicarla — no que sea una reseña pública
 * verificable. Por eso el sitio sigue sin `Review`/`AggregateRating` en JSON-LD
 * (regla 5 de CLAUDE.md): no hay función en `schema.ts` que los construya.
 */
import type { TestimonialDoc } from '../lib/queries.ts';

export const TESTIMONIALS: readonly TestimonialDoc[] = [
  {
    _id: "yailin-blanco-wedding",
    text: "Me encantaron las fotos de mi boda, muchísimas gracias por tu dedicación y paciencia para que todo saliera hermoso, bendiciones...",
    author: "Yailin Blanco",
    city: "psl",
    category: "wedding",
    verified: true,
  },
  {
    _id: "jennifer-enriquez-branding",
    text: "I went to wonderland for a photo session and honestly, it was a great experience. Lisandra was super friendly and professional from the...",
    author: "Jennifer Enriquez",
    city: "wpb",
    category: "branding",
    verified: true,
  },
  {
    _id: "yadira-machado-maternity",
    text: "Wonderlands Studio es parte de la familia, pues Lisi ha estado presente en momentos muy importantes de nuestras vidas...",
    author: "Yadira Machado",
    city: "psl",
    category: "maternity",
    verified: true,
  },
  {
    _id: "daniela-yanes-branding",
    text: "I had such a great experience working with Lisandra. She was super easy to work with, made the whole process fun, and really...",
    author: "Daniela Yanes",
    city: "wpb",
    category: "branding",
    verified: true,
  },
  {
    _id: "rocio-rozas-general",
    text: "Muy buen servicio me encantó su trabajo y atención",
    author: "Rocío Rozas",
    city: "wpb",
    category: "general",
    verified: true,
  },
  {
    _id: "genrry-leyva-alba-general",
    text: "Excelente estudio unas fotos magníficas me encantan las fotos que hacen 😊😊",
    author: "Genrry Leyva Alba",
    city: "wpb",
    category: "general",
    verified: true,
  },
  {
    _id: "ana-buela-general",
    text: "El servicio es increíble. La fotógrafa te hace sentir confiante cuando estás en la sesión de fotos. Las fotos tienen una calidad...",
    author: "ana buela",
    category: "general",
    verified: true,
  },
  {
    _id: "laura-yanes-general",
    text: "Best photographer ever. Super professional and creative. I’ll go with her every time. Super recommended...",
    author: "laura yanes",
    city: "wpb",
    category: "general",
    verified: true,
  },
  {
    _id: "diasmary-pedrozo-general",
    text: "Me encantaron las fotos, una experiencia inolvidable los recomiendo mucho, son muy buenos 😍😍😍",
    author: "DIASMARY PEDROZO",
    city: "wpb",
    category: "general",
    verified: true,
  },
] as const;
