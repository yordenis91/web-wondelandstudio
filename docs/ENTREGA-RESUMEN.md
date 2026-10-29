# Wonderlands Studio — resumen de entrega

Fecha: 2026-10-28. Vista previa publicada en
`https://web-wondelandstudio.correosoyordenis.workers.dev/`. El dominio
`wonderlandsstudio.com` **ya usa los nameservers de Cloudflare pero todavía sirve el WordPress de
Hostinger**; el correo `@wonderlandsstudio.com` también está en Hostinger y no se toca. El cambio se hace en el
corte (ver `docs/ENTREGA.md`, sección 3).

## 1. Qué se entrega

**Sitio bilingüe (inglés y español), 26 páginas**, con rutas propias en cada idioma:
inicio, West Palm Beach y Port St. Lucie (cada una con su página de ciudad), fotógrafo de
bodas, videógrafo de bodas, fotografía de marca, fotógrafo de embarazo, precios, sobre
Lisandra, contacto y portafolio (bodas, embarazo, marca).

**Diseño**
- Fotos reales de Lisandra y del estudio en la portada de cada página.
- Logo en la cabecera y en el pie; redes sociales (Instagram, TikTok, Facebook) como iconos.
- Menú de ciudades que se despliega al pulsar el nombre; uno solo abierto a la vez.
- Se ve y funciona bien en móvil.

**SEO local y buscadores con IA**
- Todo el texto, los precios y las preguntas frecuentes están en el HTML (los buscadores con
  IA no ejecutan JavaScript).
- Cada página en inglés enlaza a su par en español y viceversa (verificado por prueba
  automática en las 26 páginas).
- Canónicas, mapa del sitio y `robots.txt`. Datos estructurados sin reseñas inventadas: no se
  marca ninguna reseña hasta que existan reales y verificables.
- Cada página tiene sus propios textos: una prueba automática detecta párrafos repetidos entre
  páginas.
- Un solo catálogo de precios: no puede haber precios contradictorios entre páginas.
- Datos de contacto (nombre, dirección, teléfono) tomados de un único archivo, idénticos en
  todo el sitio.

**Formulario de contacto y WhatsApp** en el sitio. El botón de WhatsApp funciona. El formulario
**todavía no está comprobado de punta a punta**: para que el aviso llegue por correo hay que
verificar el dominio en Resend y desplegar la versión nueva del Worker (ver sección 3). Mientras
tanto, si el envío falla, el visitante ya no ve un "gracias" falso: ve un aviso claro de que el
mensaje no llegó y un botón de WhatsApp.

**Panel de edición (Sanity):** `https://wonderlands-studio.sanity.studio/` — para cambiar
textos, precios y fotos sin tocar código.

**Redirección** de la única URL antigua en español a su página nueva, para no perder el
posicionamiento actual.

## 2. Rendimiento

Medido con Lighthouse en móvil con red 4G simulada (`pnpm lighthouse`), el 2026-10-28, sobre
el código ya publicado. Presupuesto del proyecto: LCP < 2 s, CLS < 0.05, JavaScript inicial
< 20 KB.

| Página | Puntuación | LCP | CLS |
|---|---|---|---|
| Inicio (EN) | 100 | 1.29 s | 0.000 |
| Inicio (ES) | 100 | 1.29 s | 0.000 |
| Fotógrafo de bodas, WPB (EN) | 100 | 1.28 s | 0.000 |
| Ciudad West Palm Beach (EN) | 100 | 1.28 s | 0.000 |
| Precios (EN) | 100 | 1.29 s | 0.000 |

**Todas cumplen el presupuesto.** El JavaScript inicial de cada página está por debajo de
20 KB (prueba automática).

Notas honestas sobre la medición:
- Son datos de laboratorio (simulados), no de usuarios reales. Se repitió dos veces con el
  mismo resultado.
- Una medición anterior dio LCP de 2.4 s en cuatro de estas páginas. Coincidió con una
  máquina de pruebas casi sin memoria y con procesos de medición viejos todavía abiertos, y no
  se repitió al limpiar el entorno. Se corrigió el script de medición para que no los deje
  abiertos. No se encontró un problema real en las páginas, pero conviene volver a medir
  después del cambio de dominio.
- Solo se midieron cinco páginas clave, no las 26.

## 3. Lo que falta (y de quién depende)

**De Lisandra**
1. Dirección de calle, código postal y coordenadas de **West Palm Beach**.
2. Si Port St. Lucie tiene **teléfono propio (772)**. Hoy usa el (561) 260-3245.
3. **Fotos** para Precios, Contacto y Portafolio (hoy tienen un fondo vacío arriba).
4. **Reseñas reales** de clientes, verificables.
5. Visto bueno final a **precios y textos** en español e inglés.

**Del equipo técnico**
6. **Dejar el formulario entregando correos:** desplegar el Worker actualizado
   (`cd worker-contact && npx wrangler deploy`), verificar `wonderlandsstudio.com` en Resend
   (registros DNS en Cloudflare, sin tocar los MX de Hostinger) y hacer un envío de prueba que
   llegue. Hoy esos registros no están en el DNS, así que probablemente los mensajes no se entregan.
   Detalle en `docs/CONTACT_FORM_SETUP.md`.
7. Pasar el Rich Results Test (home, un servicio y Precios) y revisar el sitio en un teléfono real.
8. **Apuntar el dominio al sitio nuevo.** Los nameservers ya están en Cloudflare; falta cambiar el
   registro web (el apex y `www`) al Worker, sin tocar el correo de Hostinger (plan en
   `docs/ENTREGA.md`).
9. Dar de alta el sitio en Google Search Console y alinear Google Business Profile.
10. Dar a Lisandra acceso de propietaria a Cloudflare, Sanity, Resend y GitHub.
11. Crear el secreto `SANITY_API_TOKEN` (token Viewer) en GitHub para que la sincronización con el
    Studio vuelva a funcionar; hoy el workflow falla.
12. Revocar el token de Sanity que se compartió en un chat durante el trabajo.

## 4. Guion de WhatsApp para la clienta

Mensajes cortos, en orden. Se pueden mandar uno por uno.

**Mensaje 1 — la entrega**
> Hola Lisandra 👋 ¡Tu nueva página ya está lista para que la veas! 🎉
> Entra aquí desde tu celular y cuéntame qué te parece:
> https://web-wondelandstudio.correosoyordenis.workers.dev/
> Está en inglés y español, con tus fotos, tu logo y tus precios.

**Mensaje 2 — qué mirar**
> Te pido que revises tres cosas:
> 1️⃣ Que los precios y los textos sean los que quieres (en los dos idiomas)
> 2️⃣ Que el menú y el botón de WhatsApp funcionen bien en tu celular
> 3️⃣ Que mandes un mensaje de prueba por el formulario de contacto y me avises si ves la página de "gracias"

**Mensaje 3 — lo que necesito de ti**
> Para dejarla completa necesito que me mandes:
> 📍 La dirección del estudio en West Palm Beach (calle y código postal)
> 📞 Si Port St. Lucie tiene su propio número (772) o seguimos con el (561) 260-3245
> 📸 Unas fotos para las páginas de Precios, Contacto y Portafolio (mínimo 1600 px de ancho)
> ⭐ Reseñas reales de clientes que podamos publicar
> Con la dirección, Google entiende mejor dónde estás y te encuentran más fácil en tu zona.

**Mensaje 4 — el cambio de dominio**
> Cuando me des el visto bueno, pasamos tu dominio wonderlandsstudio.com a la página nueva.
> Tu correo @wonderlandsstudio.com está en Hostinger y no lo vamos a tocar: seguirá funcionando
> igual. La página vieja se queda como respaldo unas semanas por si acaso.
> ¿Me confirmas que todo tu correo lo usas desde Hostinger y no tienes otro servicio con ese dominio?

**Mensaje 5 — seguridad (si compartió accesos)**
> Por seguridad, cuando terminemos te pasaré la propiedad de las cuentas (Cloudflare, Sanity) a tu
> nombre, para que la página dependa de ti y no de mí.

**Notas para quien envía**
- No pedirle la prueba del formulario (mensaje 2, punto 3) como confirmación de entrega hasta que el
  equipo haya verificado Resend y desplegado el Worker (sección 3, punto 6); antes de eso, un
  mensaje de prueba muestra "gracias" o el aviso de error, pero el correo puede no llegar.
- Mandar el mensaje 4 solo cuando el formulario ya entregue correos y el equipo haya revisado el DNS
  (ver `docs/ENTREGA.md`).
- No prometer fecha de posicionamiento en Google: el efecto del cambio tarda semanas.
