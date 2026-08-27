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
}

const MAX_MESSAGE_LENGTH = 5000;

function thankYouUrl(env: Env, lang: string): string {
  return lang === 'es' ? `${env.SITE_URL}/es/gracias/` : `${env.SITE_URL}/thank-you/`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendNotification(env: Env, fields: Record<string, string>): Promise<void> {
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
    // No hay reintento ni cola de respaldo en esta versión — un fallo aquí se pierde
    // salvo que alguien revise los logs del Worker en el dashboard de Cloudflare. Ver
    // la nota de "Límites conocidos" en docs/CONTACT_FORM_SETUP.md.
    console.error('Resend respondió', response.status, await response.text());
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const referer = request.headers.get('Referer') ?? env.SITE_URL;
    const form = await request.formData();
    const get = (name: string) => (form.get(name)?.toString() ?? '').trim();

    const lang = get('lang') === 'es' ? 'es' : 'en';

    // Honeypot: un bot casi siempre rellena cualquier <input> que encuentre, una
    // persona nunca ve este campo. Se responde como si hubiera funcionado, sin enviar
    // el aviso — así el bot no aprende que falló y no reintenta con más agresividad.
    if (get('company') !== '') {
      return Response.redirect(thankYouUrl(env, lang), 302);
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
      return Response.redirect(referer, 302);
    }

    await sendNotification(env, { name, phone, email, message, page, lang });

    return Response.redirect(thankYouUrl(env, lang), 302);
  },
} satisfies ExportedHandler<Env>;
