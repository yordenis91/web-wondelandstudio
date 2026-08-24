/**
 * `pnpm lighthouse` (CLAUDE.md, sección Comandos): "audita las rutas clave contra el
 * presupuesto." A diferencia de `tests/performance-budget.test.ts` (estático, solo JS
 * inicial, corre en cada `pnpm test`), esto es una auditoría real con Chrome: LCP y CLS
 * necesitan un render de verdad con throttling de red, no son medibles leyendo el HTML.
 * Por eso es un comando aparte — más lento, no pensado para correr en cada build.
 *
 * Usa el Chromium ya instalado en el entorno (`/opt/pw-browsers/chromium` si existe;
 * si no, deja que `chrome-launcher` busque uno) en vez de que Lighthouse descargue el
 * suyo. `formFactor: 'mobile'` + el throttling por defecto de Lighthouse (perfil
 * "Slow 4G" simulado) es exactamente el escenario que pide la regla 8 de CLAUDE.md:
 * "LCP < 2.0s en móvil 4G, CLS < 0.05".
 *
 * Rutas clave: home (EN/ES), la línea de servicio de mayor prioridad publicitaria
 * (`wpb-wedding-photographer`, `adPriority: 'alto'` en `SERVICE_MATRIX`), el hub de WPB
 * y `/pricing/` — no las 24 páginas del sitio, que sería lento sin aportar más señal:
 * todas comparten `Layout`/`Header`/`Footer`, así que un problema de presupuesto ahí se
 * ve igual de claro en cinco rutas que en veinticuatro.
 */
import { existsSync } from 'node:fs';
import { spawn, type ChildProcess } from 'node:child_process';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const CHROME_PATH = '/opt/pw-browsers/chromium';

const LCP_BUDGET_MS = 2000;
const CLS_BUDGET = 0.05;

const KEY_ROUTES = [
  { path: '/', label: 'Home (EN)' },
  { path: '/es/', label: 'Home (ES)' },
  { path: '/west-palm-beach/wedding-photographer/', label: 'Wedding Photographer WPB (EN)' },
  { path: '/west-palm-beach/', label: 'Hub West Palm Beach (EN)' },
  { path: '/pricing/', label: 'Pricing (EN)' },
] as const;

function startPreviewServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error('astro preview no arrancó a tiempo (30s)'));
    }, 30_000);

    proc.stdout?.on('data', (chunk: Buffer) => {
      if (chunk.toString().includes('Local')) {
        clearTimeout(timeout);
        resolve(proc);
      }
    });
    proc.on('error', reject);
  });
}

interface RouteResult {
  readonly label: string;
  readonly path: string;
  readonly performanceScore: number;
  readonly lcpMs: number;
  readonly cls: number;
}

async function auditRoute(
  route: (typeof KEY_ROUTES)[number],
  port: number,
): Promise<RouteResult> {
  const result = await lighthouse(`${BASE_URL}${route.path}`, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
  });

  if (!result?.lhr) throw new Error(`Lighthouse no devolvió resultado para ${route.path}`);

  const { lhr } = result;
  return {
    label: route.label,
    path: route.path,
    performanceScore: Math.round((lhr.categories.performance?.score ?? 0) * 100),
    lcpMs: lhr.audits['largest-contentful-paint']?.numericValue ?? Infinity,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue ?? Infinity,
  };
}

async function main(): Promise<void> {
  let previewProc: ChildProcess | undefined;
  let chrome: chromeLauncher.LaunchedChrome | undefined;

  try {
    console.log('lighthouse-audit: arrancando "astro preview"...');
    previewProc = await startPreviewServer();

    console.log('lighthouse-audit: lanzando Chrome...');
    chrome = await chromeLauncher.launch({
      chromePath: existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
    });

    const results: RouteResult[] = [];
    for (const route of KEY_ROUTES) {
      console.log(`lighthouse-audit: auditando ${route.path}...`);
      results.push(await auditRoute(route, chrome.port));
    }

    console.log('\nRuta                                    Score  LCP      CLS');
    console.log('-'.repeat(70));

    let failed = false;
    for (const r of results) {
      const lcpOk = r.lcpMs < LCP_BUDGET_MS;
      const clsOk = r.cls < CLS_BUDGET;
      if (!lcpOk || !clsOk) failed = true;

      const lcpStr = `${(r.lcpMs / 1000).toFixed(2)}s${lcpOk ? '' : ' ✗'}`;
      const clsStr = `${r.cls.toFixed(3)}${clsOk ? '' : ' ✗'}`;
      console.log(
        `${r.label.padEnd(40)} ${String(r.performanceScore).padStart(3)}   ${lcpStr.padEnd(9)}${clsStr}`,
      );
    }

    console.log('-'.repeat(70));
    console.log(`Presupuesto: LCP < ${LCP_BUDGET_MS / 1000}s, CLS < ${CLS_BUDGET} (CLAUDE.md regla 8)`);

    if (failed) {
      console.error('\nlighthouse-audit: al menos una ruta clave no cumple el presupuesto.');
      process.exitCode = 1;
    } else {
      console.log('\nlighthouse-audit: todas las rutas clave cumplen el presupuesto.');
    }
  } finally {
    if (chrome) chrome.kill();
    if (previewProc) previewProc.kill();
  }
}

main().catch((error) => {
  console.error('lighthouse-audit: falló', error);
  process.exitCode = 1;
});
