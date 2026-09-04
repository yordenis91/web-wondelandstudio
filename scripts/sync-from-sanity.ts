/**
 * Trae desde Sanity el NAP (`businessLocation`) y los testimonios (`testimonial`), y
 * actualiza los archivos locales que el sitio de verdad lee — `src/data/business.ts`
 * sigue siendo la única fuente que consultan las plantillas (regla 3 de CLAUDE.md);
 * esto solo automatiza mantenerla al día con lo que Lisandra edite en el Studio.
 *
 * Deliberadamente NO es un fetch en tiempo de build: el sitio es 100% estático y no
 * depende de que Sanity esté disponible para compilar. Si Sanity estuviera caído justo
 * cuando Cloudflare hace el deploy, el sitio se construye igual con los últimos datos
 * sincronizados — el riesgo de una dependencia de red en cada build queda fuera del
 * camino crítico. Este script lo corre una persona a mano después de un cambio real en
 * el Studio; el diff que deja en git es la revisión.
 *
 * `business.ts` no se regenera entero — solo reemplaza los 5 campos que hoy siguen
 * siendo `token(...)` sin confirmar (dirección/coordenadas de WPB, teléfono de PSL) por
 * el valor real, y solo si Sanity ya lo tiene. El resto del archivo (lógica, comentarios,
 * datos ya confirmados) se deja intacto. Si el patrón esperado no aparece donde debería
 * — porque el archivo cambió de forma, o porque ya se sincronizó antes — el script
 * lanza en vez de escribir a ciegas.
 *
 * `src/content/testimonials.ts` sí se regenera completo: a partir de aquí es un espejo
 * de lo que hay en Sanity, no contenido hecho a mano.
 *
 * Dry run por defecto. Uso:
 *   node scripts/sync-from-sanity.ts            # dry run
 *   node scripts/sync-from-sanity.ts --apply    # escribe
 */
import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const APPLY = process.argv.includes('--apply');

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

if (!projectId) {
  throw new Error('Falta SANITY_STUDIO_PROJECT_ID en el entorno (ver studio/.env).');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  // Opcional: solo hace falta si el dataset no es público. La mayoría de los datasets
  // de Sanity son de lectura pública por defecto.
  token: process.env.SANITY_API_TOKEN,
});

interface ResolvedToken {
  readonly name: string;
  readonly value: string;
}

interface LocationDoc {
  readonly key: 'wpb' | 'psl';
  readonly address: { readonly streetAddress?: string; readonly postalCode?: string };
  readonly geo?: { readonly latitude?: number; readonly longitude?: number };
  readonly phone: { readonly e164?: string; readonly display?: string };
}

interface TestimonialSanityDoc {
  readonly _id: string;
  readonly text: string;
  readonly author: string;
  readonly city?: 'wpb' | 'psl';
  readonly category: string;
  readonly verified: boolean;
}

function replaceOrThrow(source: string, search: string, replacement: string, label: string): string {
  if (!source.includes(search)) {
    throw new Error(
      `sync-from-sanity: no encontré el patrón esperado para ${label} en business.ts — ` +
        `puede que ya se haya sincronizado antes, o que el archivo cambió de forma. Revisa a mano.`,
    );
  }
  return source.replace(search, replacement);
}

async function syncBusiness(): Promise<readonly ResolvedToken[]> {
  const locations = await client.fetch<readonly LocationDoc[]>(
    `*[_type == "businessLocation"]{ key, address, geo, phone }`,
  );
  const wpb = locations.find((l) => l.key === 'wpb');
  const psl = locations.find((l) => l.key === 'psl');

  const path = 'src/data/business.ts';
  let source = readFileSync(path, 'utf8');
  const changes: ResolvedToken[] = [];

  if (wpb?.address.streetAddress) {
    source = replaceOrThrow(
      source,
      `streetAddress: token('WPB_STREET_ADDRESS'),`,
      `streetAddress: ${JSON.stringify(wpb.address.streetAddress)},`,
      'WPB_STREET_ADDRESS',
    );
    changes.push({ name: 'WPB_STREET_ADDRESS', value: wpb.address.streetAddress });
  }

  if (wpb?.address.postalCode) {
    source = replaceOrThrow(
      source,
      `postalCode: token('WPB_POSTAL_CODE'),`,
      `postalCode: ${JSON.stringify(wpb.address.postalCode)},`,
      'WPB_POSTAL_CODE',
    );
    changes.push({ name: 'WPB_POSTAL_CODE', value: wpb.address.postalCode });
  }

  if (wpb?.geo?.latitude != null) {
    source = replaceOrThrow(
      source,
      `latitude: token('WPB_LAT'),`,
      `latitude: ${wpb.geo.latitude},`,
      'WPB_LAT',
    );
    changes.push({ name: 'WPB_LAT', value: String(wpb.geo.latitude) });
  }

  if (wpb?.geo?.longitude != null) {
    source = replaceOrThrow(
      source,
      `longitude: token('WPB_LNG'),`,
      `longitude: ${wpb.geo.longitude},`,
      'WPB_LNG',
    );
    changes.push({ name: 'WPB_LNG', value: String(wpb.geo.longitude) });
  }

  if (psl?.phone.e164 && psl.phone.display) {
    source = replaceOrThrow(
      source,
      `    // Pendiente: Lisandra tiene que confirmar si existe una línea 772 propia de PSL o\n` +
        `    // si esta sede usa el mismo número de WPB. Ver docs/PLAN.md §7.\n` +
        `    e164: token('PSL_PHONE_772'),\n` +
        `    display: token('PSL_PHONE_772'),`,
      `    e164: ${JSON.stringify(psl.phone.e164)},\n    display: ${JSON.stringify(psl.phone.display)},`,
      'PSL_PHONE_772',
    );
    // El valor legible, no el E.164 — esto se usa para reemplazar menciones en
    // comentarios y docs (`docs/copy/*.md`), donde lo que se lee es el formato humano.
    changes.push({ name: 'PSL_PHONE_772', value: psl.phone.display });
  }

  if (changes.length > 0 && APPLY) writeFileSync(path, source);
  return changes;
}

/** Quita de `PENDING_TOKEN_NAMES` los tokens que `syncBusiness()` acaba de resolver. */
function pruneResolvedTokens(resolved: readonly ResolvedToken[]): readonly string[] {
  if (resolved.length === 0) return [];

  const path = 'src/data/tokens.ts';
  let source = readFileSync(path, 'utf8');
  const pruned: string[] = [];

  for (const { name } of resolved) {
    const line = `  '${name}',\n`;
    if (source.includes(line)) {
      source = source.replace(line, '');
      pruned.push(name);
    }
  }

  if (pruned.length > 0 && APPLY) writeFileSync(path, source);
  return pruned;
}

const SWEEP_EXTENSIONS = new Set(['.ts', '.astro', '.md']);
const SWEEP_SKIP_DIRS = new Set(['node_modules', '.git', '.astro', 'dist', 'worker-contact']);

function* walkFiles(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SWEEP_SKIP_DIRS.has(entry.name)) continue;
      yield* walkFiles(full);
    } else if (SWEEP_EXTENSIONS.has(extname(entry.name))) {
      yield full;
    }
  }
}

/**
 * `syncBusiness()` ya resolvió el dato donde de verdad se usa (`business.ts`). Esto
 * limpia lo que queda: menciones del token en comentarios y en `docs/copy/*.md` —
 * documentación que explica que el dato está pendiente, y que `check-tokens` trataría
 * como un token huérfano en cuanto `pruneResolvedTokens()` lo saque de la lista de
 * conocidos. Sustituye el literal por el valor real tal cual, sin tocar el resto de la
 * frase — deja una nota "todavía sin confirmar" desactualizada en vez de un error de
 * build, que alguien puede limpiar a mano cuando la vea.
 */
function sweepTokenMentions(resolved: readonly ResolvedToken[]): readonly string[] {
  if (resolved.length === 0) return [];

  const touched = new Set<string>();
  for (const dir of ['src', 'docs']) {
    for (const file of walkFiles(dir)) {
      let source = readFileSync(file, 'utf8');
      let changed = false;
      for (const { name, value } of resolved) {
        const literal = `{{${name}}}`;
        if (source.includes(literal)) {
          source = source.split(literal).join(value);
          changed = true;
        }
      }
      if (changed) {
        touched.add(file);
        if (APPLY) writeFileSync(file, source);
      }
    }
  }
  return [...touched];
}

function testimonialsFileContent(docs: readonly TestimonialSanityDoc[]): string {
  const entries = docs
    .map((t) => {
      const cityLine = t.city ? `\n    city: ${JSON.stringify(t.city)},` : '';
      return (
        `  {\n` +
        `    _id: ${JSON.stringify(t._id)},\n` +
        `    text: ${JSON.stringify(t.text)},\n` +
        `    author: ${JSON.stringify(t.author)},${cityLine}\n` +
        `    category: ${JSON.stringify(t.category)},\n` +
        `    verified: ${t.verified},\n` +
        `  },`
      );
    })
    .join('\n');

  return (
    `/**\n` +
    ` * Testimonios — sincronizados desde Sanity (\`pnpm sanity:sync\`), no hechos a mano.\n` +
    ` * Para cambiar un texto, una categoría o el estado \`verified\`, edítalo en el Studio\n` +
    ` * y vuelve a correr el script; un cambio a mano aquí se pierde en el próximo sync.\n` +
    ` *\n` +
    ` * \`verified: true\` en Sanity significa que alguien del estudio confirmó que la cita\n` +
    ` * es real y que hay permiso para publicarla — no que sea una reseña pública\n` +
    ` * verificable. Por eso el sitio sigue sin \`Review\`/\`AggregateRating\` en JSON-LD\n` +
    ` * (regla 5 de CLAUDE.md): no hay función en \`schema.ts\` que los construya.\n` +
    ` */\n` +
    `import type { TestimonialDoc } from '../lib/queries.ts';\n\n` +
    `export const TESTIMONIALS: readonly TestimonialDoc[] = [\n${entries}\n] as const;\n`
  );
}

async function syncTestimonials(): Promise<number> {
  const docs = await client.fetch<readonly TestimonialSanityDoc[]>(
    `*[_type == "testimonial"] | order(_createdAt asc) { _id, text, author, city, category, verified }`,
  );

  if (APPLY) writeFileSync('src/content/testimonials.ts', testimonialsFileContent(docs));
  return docs.length;
}

async function main(): Promise<void> {
  console.log(`\n${APPLY ? 'APLICANDO' : 'DRY RUN'} — proyecto ${projectId}/${dataset}\n`);

  const businessChanges = await syncBusiness();
  if (businessChanges.length === 0) {
    console.log('business.ts: nada que sincronizar (los 5 campos pendientes siguen vacíos en Sanity, o ya se sincronizaron).');
  } else {
    console.log(`business.ts: ${businessChanges.length} campo(s):`);
    for (const { name, value } of businessChanges) console.log(`  · ${name} → "${value}"`);
  }

  const prunedTokens = pruneResolvedTokens(businessChanges);
  if (prunedTokens.length > 0) {
    console.log(`tokens.ts: ${prunedTokens.length} token(s) resuelto(s), quitados de PENDING_TOKEN_NAMES: ${prunedTokens.join(', ')}`);
  }

  const sweptFiles = sweepTokenMentions(businessChanges);
  if (sweptFiles.length > 0) {
    console.log(`Menciones del token sustituidas en ${sweptFiles.length} archivo(s) (comentarios, docs/copy/):`);
    for (const file of sweptFiles) console.log(`  · ${file}`);
  }

  const testimonialCount = await syncTestimonials();
  console.log(`testimonials.ts: ${testimonialCount} testimonio(s) en Sanity.`);

  if (!APPLY) {
    console.log('\nDry run — nada escrito. Corre con --apply para escribir de verdad.\n');
  } else {
    console.log('\nListo — revisa el diff (git diff) antes de commitear.\n');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
