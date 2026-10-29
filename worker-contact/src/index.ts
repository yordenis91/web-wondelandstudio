/**
 * Endpoint del formulario de contacto — recibe el POST nativo de
 * `src/components/ContactForm.astro`, no una llamada `fetch()` desde JS. Por eso no
 * hace falta CORS: una navegación de formulario cruza de origen sin que el navegador la
 * bloquee, a diferencia de un `fetch()` desde el mismo contexto. Responde siempre con
 * una redirección 302 — nunca JSON — porque quien llega aquí es el navegador
 * navegando, no un cliente que vaya a leer un cuerpo de respuesta.
 *
 * Ver docs/CONTACT_FORM_SETUP.md para desplegar esto: cuenta de Resend, secrets de
 * Wrangler, `wrangler deploy`.
 */

export interface Env {
  readonly RESEND_API_KEY: string;
  /** A dónde llega el aviso de cada envío — el correo de Lisandra, normalmente. */
  readonly NOTIFY_EMAIL: string;
  readonly FROM_EMAIL: string;
  readonly SITE_URL: string;
  /** Vista previa del sitio (workers.dev), opcional: también es un origen válido de envío. */
  readonly PREVIEW_ORIGIN?: string;
}

const MAX_MESSAGE_LENGTH = 5000;

/**
 * El sitio al que se devuelve al visitante. Sale del `Referer`, pero solo si es el sitio
 * real o la vista previa declarada: así un envío desde `workers.dev` vuelve a `workers.dev`
 * (antes iba siempre al dominio de producción, que durante la migración sigue siendo el
 * WordPress viejo) y un `Referer` falsificado nunca convierte esto en una redirección
 * abierta.
 */
function returnOrigin(request: Request, env: Env): string {
  const allowed = [env.SITE_URL, env.PREVIEW_ORIGIN].filter((o): o is string => Boolean(o));
  try {
    const origin = new URL(request.headers.get('Referer') ?? '').origin;
    if (allowed.some((o) => new URL(o).origin === origin)) return origin;
  } catch {
    // Referer ausente o inválido: se usa el sitio de producción.
  }
  return env.SITE_URL;
}

function thankYouUrl(origin: string, lang: string): string {
  return lang === 'es' ? `${origin}/es/gracias/` : `${origin}/thank-you/`;
}

function errorUrl(origin: string, lang: string): string {
  return lang === 'es' ? `${origin}/es/error-envio/` : `${origin}/send-error/`;
}

function contactUrl(origin: string, lang: string): string {
  return lang === 'es' ? `${origin}/es/contacto/` : `${origin}/contact/`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** `true` solo si Resend aceptó el correo. Cualquier otra cosa es un mensaje que no salió. */
async function sendNotification(env: Env, fields: Record<string, string>): Promise<boolean> {
  const lines = [
    `Nombre: ${fields.name}`,
    `Teléfono: ${fields.phone}`,
    fields.email ? `Correo: ${fields.email}` : undefined,
    `Página: ${fields.page || '(no especificada)'}`,
    `Idioma: ${fields.lang || 'en'}`,
    '',
    'Mensaje:',
    fields.message,
  ].filter((line): line is string => line !== undefined);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Wonderlands Studio <${env.FROM_EMAIL}>`,
        to: env.NOTIFY_EMAIL,
        reply_to: fields.email || undefined,
        subject: `Nuevo contacto: ${fields.name}`,
        text: lines.join('\n'),
      }),
    });

    if (!response.ok) {
      // Causa típica: el dominio de FROM_EMAIL no está verificado en Resend (403).
      console.error('Resend respondió', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('No se pudo contactar con Resend', error);
    return false;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const origin = returnOrigin(request, env);
    const form = await request.formData();
    const get = (name: string) => (form.get(name)?.toString() ?? '').trim();

    const lang = get('lang') === 'es' ? 'es' : 'en';

    // Honeypot: un bot casi siempre rellena cualquier <input> que encuentre, una
    // persona nunca ve este campo. Se responde como si hubiera funcionado, sin enviar
    // el aviso — así el bot no aprende que falló y no reintenta con más agresividad.
    if (get('company') !== '') {
      return Response.redirect(thankYouUrl(origin, lang), 302);
    }

    const name = get('name');
    const phone = get('phone');
    const email = get('email');
    const message = get('message');
    const page = get('page');

    const errors =
      !name || !phone || !message || message.length > MAX_MESSAGE_LENGTH || (email && !isValidEmail(email));

    if (errors) {
      // El navegador ya valida `required`/`type="email"` antes de enviar — llegar aquí
      // sin cumplirlos es un envío directo (bot, curl), no un visitante real. Vuelve a
      // la página de origen sin más ceremonia: no hay mensaje de error en pantalla que
      // mostrar sin JS que lea un query param, y no vale la pena el JS solo para esto.
      return Response.redirect(contactUrl(origin, lang), 302);
    }

    // "Gracias" solo si el correo salió de verdad. Si no, el visitante lo sabe y tiene a
    // mano el WhatsApp, en vez de creer que Lisandra recibió un mensaje que se perdió.
    const sent = await sendNotification(env, { name, phone, email, message, page, lang });

    return Response.redirect(sent ? thankYouUrl(origin, lang) : errorUrl(origin, lang), 302);
  },
} satisfies ExportedHandler<Env>;
