# Formulario de contacto — puesta en marcha

**Estado: desplegado (2026-08-25).** `BUSINESS.contactFormEndpoint` en
`src/data/business.ts` ya apunta al Worker real y el formulario está activo en
`/contact/` y `/es/contacto/`. Esta guía queda como referencia para redesplegar, rotar
la API key de Resend, o si alguna vez hay que mover el Worker a otra cuenta.

`worker-contact/` es un Worker de Cloudflare independiente del sitio: recibe el POST de
`ContactForm.astro`, valida, envía un correo con [Resend](https://resend.com) y
redirige a la página de gracias. El sitio y el Worker se despliegan por separado — el
sitio no necesita saber nada de Resend, solo la URL final del Worker.

Mientras estos pasos no estén hechos, `ContactForm.astro` no renderiza el formulario en
ninguna página (`BUSINESS.contactFormEndpoint` sigue siendo un placeholder sin resolver)
— es el mismo criterio que ya aplica el sitio a un teléfono o dirección sin confirmar.

## 1. Cuenta de Resend

1. Crea una cuenta gratis en [resend.com](https://resend.com) (100 correos/día, 3000/mes
   gratis — de sobra para un formulario de contacto).
2. Verifica el dominio `wonderlandsstudio.com` (Resend → Domains → Add Domain, agrega
   los registros DNS que te den). Mientras no esté verificado, puedes probar con la
   dirección de pruebas `onboarding@resend.dev` como `FROM_EMAIL` — los correos solo
   llegarán a la dirección con la que creaste la cuenta de Resend, no sirve para
   producción.
3. Genera una API key (Resend → API Keys → Create API Key).

## 2. Configurar y desplegar el Worker

```bash
cd worker-contact
npm install
npx wrangler login                      # autoriza wrangler contra tu cuenta de Cloudflare

npx wrangler secret put RESEND_API_KEY  # pega la key de Resend cuando la pida
npx wrangler secret put NOTIFY_EMAIL    # el correo donde Lisandra quiere recibir los avisos
```

Si el dominio ya está verificado en Resend, `wrangler.jsonc` ya trae
`FROM_EMAIL: "contact@wonderlandsstudio.com"` — no hace falta tocarlo. Si estás
probando con `onboarding@resend.dev`, edita ese valor en `worker-contact/wrangler.jsonc`
antes de desplegar.

```bash
npx wrangler deploy
```

Al terminar, Wrangler imprime la URL del Worker — algo como:

```
https://wonderlands-contact-form.<tu-subdominio>.workers.dev
```

## 3. Conectar el Worker al sitio

Copia esa URL y pásamela (o edítala tú mismo): en `src/data/business.ts`, sustituye el
valor de `contactFormEndpoint` por la URL real, y borra
`'CONTACT_FORM_ENDPOINT'` de `PENDING_TOKEN_NAMES` en `src/data/tokens.ts` si sigue ahí.
El próximo `pnpm build` ya renderiza el formulario en `/contact/` y `/es/contacto/`.

**Ya hecho** — el Worker vive en
`https://wonderlands-contact-form.correosoyordenis.workers.dev`.

## Verificar el dominio del remitente (obligatorio para producción)

El Worker envía desde `FROM_EMAIL` (`contact@wonderlandsstudio.com`). Resend solo acepta ese
remitente si el dominio está **verificado**; si no, rechaza cada envío con un 403 y los
mensajes no llegan. Estado a 2026-10-29: en el DNS **no aparecen** los registros de Resend
(`resend._domainkey` ni `send`), así que probablemente no está verificado.

1. Resend → **Domains** → `wonderlandsstudio.com`: copia los registros que indica (DKIM y los de
   `send`).
2. Añádelos en **Cloudflare → DNS** de `wonderlandsstudio.com` (el dominio ya usa los
   nameservers de Cloudflare). **No toques los MX de la raíz**: apuntan a Hostinger y es donde
   vive el correo `@wonderlandsstudio.com`.
3. Resend → **Verify**. Cuando salga *Verified*, envía un mensaje de prueba desde el
   formulario y comprueba que llega a `NOTIFY_EMAIL`.

## Redirección tras el envío

El Worker devuelve al visitante al sitio desde el que envió (según el `Referer`), pero solo si
es `SITE_URL` o `PREVIEW_ORIGIN` (vista previa en `workers.dev`, en `wrangler.jsonc`). Cualquier
otro origen cae en `SITE_URL`, así que un `Referer` falsificado no abre una redirección
abierta. Antes iba siempre a `SITE_URL`, que durante la migración sigue siendo el WordPress.

## Límites conocidos (v1)

- **Sin reintento ni respaldo si Resend falla**, pero ya no es silencioso: si Resend no
  acepta el correo (cuenta suspendida, límite, typo en la API key, o **dominio del
  remitente sin verificar**, el caso más probable), el Worker lo registra en sus logs
  (Cloudflare dashboard → Workers → `wonderlands-contact-form` → Logs) y manda al visitante a
  `/send-error/` (`/es/error-envio/`), que dice claramente que el mensaje NO llegó y le da el
  WhatsApp. El mensaje igualmente se pierde: la vía de respaldo es el WhatsApp del visitante.
  Si hace falta que no se pierda nada, la mejora natural es guardar cada envío en D1 o KV
  además de intentar el correo.
- **Sin CAPTCHA, solo honeypot.** Suficiente contra bots genéricos; si empieza a llegar
  spam más sofisticado, Cloudflare Turnstile se integra en el formulario sin backend
  propio (widget + un campo de verificación en el POST).
- **Sin límite de envíos por IP.** Si hace falta, Cloudflare's Rate Limiting Rules
  (dashboard → el Worker → Settings) lo resuelve sin tocar código.
