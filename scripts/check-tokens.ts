/**
 * Guardia de tokens de placeholder (regla 4 de CLAUDE.md).
 *
 * Recorre `src/`, `docs/` y `dist/` buscando `{{TOKEN}}` sin resolver:
 *
 *  - En `dist/` cualquier token es un ERROR. Es HTML que se serviría a un usuario o a
 *    un crawler con un placeholder dentro.
 *  - En `src/` y `docs/` un token declarado en `src/data/tokens.ts` es un AVISO: es un
 *    dato pendiente conocido, no una errata. Uno no declarado es un ERROR.
 *
 * Sale con código 1 si hay al menos un error, e imprime archivo, línea y columna.
 *
 * Uso:
 *   node scripts/check-tokens.ts                 # src, docs y dist
 *   node scripts/check-tokens.ts --only dist     # solo dist (tras astro build)
 *   node scripts/check-tokens.ts --strict        # los avisos también fallan
 *   node scripts/check-tokens.ts --verbose       # una línea por aviso, no un resumen
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PENDING_TOKEN_NAMES } from '../src/data/tokens.ts';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');

const SCAN_DIRS = ['src', 'docs', 'dist'] as const;
type ScanDir = (typeof SCAN_DIRS)[number];

const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', '.vercel', '.wrangler']);

const TEXT_EXTENSIONS = new Set([
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.jsonc', '.md', '.mdx', '.html', '.xml', '.txt',
  '.css', '.svg', '.yml', '.yaml',
]);

const TOKEN_PATTERN = /\{\{\s*([A-Z0-9_]+)\s*\}\}/g;

const PENDING = new Set<string>(PENDING_TOKEN_NAMES);

interface Finding {
  readonly file: string;
  readonly line: number;
  readonly column: number;
  readonly token: string;
  readonly severity: 'error' | 'warn';
  readonly text: string;
}

function parseArgs(argv: readonly string[]): {
  only: ScanDir[] | null;
  strict: boolean;
  verbose: boolean;
} {
  let only: ScanDir[] | null = null;
  let strict = false;
  let verbose = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--strict') {
      strict = true;
    } else if (arg === '--verbose') {
      verbose = true;
    } else if (arg === '--only') {
      const value = argv[i + 1];
      i += 1;
      if (!value || !SCAN_DIRS.includes(value as ScanDir)) {
        throw new Error(`--only espera uno de: ${SCAN_DIRS.join(', ')}`);
      }
      only = [value as ScanDir];
    }
  }
  return { only, strict, verbose };
}

function* walk(dir: string): Generator<string> {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // El directorio no existe todavía (dist antes del primer build).
  }

  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf('.');
      const ext = dot === -1 ? '' : entry.name.slice(dot);
      if (TEXT_EXTENSIONS.has(ext)) yield full;
    }
  }
}

function scanFile(file: string, inDist: boolean): Finding[] {
  const findings: Finding[] = [];
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((text, index) => {
    TOKEN_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = TOKEN_PATTERN.exec(text)) !== null) {
      const name = match[1]!;
      const known = PENDING.has(name);
      findings.push({
        file: relative(ROOT, file),
        line: index + 1,
        column: match.index + 1,
        token: name,
        severity: inDist || !known ? 'error' : 'warn',
        text: text.trim(),
      });
    }
  });

  return findings;
}

/**
 * Los pendientes conocidos se repiten decenas de veces en los copy decks. Listarlos uno
 * a uno sepulta los errores reales, así que por defecto van agrupados por token, con la
 * primera aparición como referencia. `--verbose` los lista todos.
 */
function reportWarnings(warnings: readonly Finding[], verbose: boolean): void {
  if (warnings.length === 0) return;

  if (verbose) {
    for (const finding of warnings) {
      console.warn(
        `  aviso  ${finding.file}:${finding.line}:${finding.column}  {{${finding.token}}} pendiente de confirmar`,
      );
    }
    return;
  }

  const byToken = new Map<string, Finding[]>();
  for (const finding of warnings) {
    const list = byToken.get(finding.token) ?? [];
    list.push(finding);
    byToken.set(finding.token, list);
  }

  console.warn('check-tokens: datos pendientes de confirmar (declarados en src/data/tokens.ts)');
  for (const [name, list] of [...byToken].sort((a, b) => a[0].localeCompare(b[0]))) {
    const first = list[0]!;
    const rest = list.length > 1 ? `, +${list.length - 1} más` : '';
    console.warn(
      `  aviso  {{${name}}} — ${list.length} aparición(es): ${first.file}:${first.line}:${first.column}${rest}`,
    );
  }
  console.warn('         (--verbose para la lista completa)');
}

function main(): void {
  const { only, strict, verbose } = parseArgs(process.argv.slice(2));
  const dirs = only ?? [...SCAN_DIRS];

  const findings: Finding[] = [];
  for (const dir of dirs) {
    const inDist = dir === 'dist';
    for (const file of walk(join(ROOT, dir))) {
      findings.push(...scanFile(file, inDist));
    }
  }

  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warn');

  reportWarnings(warnings, verbose || strict);

  for (const finding of errors) {
    const reason = finding.file.startsWith('dist')
      ? 'token sin resolver en el HTML servido'
      : `token no declarado en src/data/tokens.ts`;
    console.error(
      `  ERROR  ${finding.file}:${finding.line}:${finding.column}  {{${finding.token}}} — ${reason}\n         ${finding.text}`,
    );
  }

  const scanned = dirs.join(', ');
  if (errors.length > 0) {
    console.error(
      `\ncheck-tokens: ${errors.length} error(es) en ${scanned}. El build se detiene aquí.`,
    );
    process.exit(1);
  }

  if (strict && warnings.length > 0) {
    console.error(`\ncheck-tokens: ${warnings.length} aviso(s) con --strict. El build se detiene aquí.`);
    process.exit(1);
  }

  console.log(
    `check-tokens: sin tokens sin resolver en ${scanned}` +
      (warnings.length > 0 ? ` (${warnings.length} pendiente(s) conocido(s))` : ''),
  );
}

main();
