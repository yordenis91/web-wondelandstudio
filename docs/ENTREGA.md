# Entrega del sitio — pendientes y plan de corte

Estado a 2026-10-28. El sitio nuevo ya funciona en
`https://web-wondelandstudio.correosoyordenis.workers.dev/` (Cloudflare). Sustituye al
WordPress de Hostinger en `wonderlandsstudio.com`. Este documento separa lo que **falta
del lado de Lisandra** de lo que **hay que hacer el día del corte**.

## 1. Pendientes del dueño (bloquean o afectan el SEO local)

Sin estos datos el sitio se publica, pero con el NAP incompleto, que es justo lo que
más pesa en SEO local.

| # | Dato / decisión | Para qué sirve | Dónde se pone |
|---|---|---|---|
| 1 | **Dirección de calle de West Palm Beach** | NAP, schema `LocalBusiness`, Google Business Profile | `src/data/business.ts` (`{{WPB_STREET_ADDRESS}}`) |
| 2 | **Código postal de WPB** | Ídem | `{{WPB_POSTAL_CODE}}` |
| 3 | **Coordenadas de WPB** (se sacan de Google Maps de la dirección) | Schema geo | `{{WPB_LAT}}`, `{{WPB_LNG}}` |
| 4 | **Teléfono propio de Port St. Lucie (772)**, si existe | Hoy PSL usa el (561) 260-3245 de forma **provisional** | `src/data/business.ts`, bloque `PSL.phone` |
| 5 | **Fotos para Pricing, Contacto y Portafolio** | Esas páginas aún tienen un fondo gris/marrón vacío arriba. Hacen falta 1600 px de ancho mínimo | `imagenes/` y `node scripts/optimize-images.ts` |
| 6 | **Reseñas reales y verificables** | Las de la home mezclan español e inglés. Mientras no estén verificadas **no** se marca schema `Review` | Sanity → `testimonial` (campo `verified`) |
| 7 | **Confirmar precios** | El sitio viejo tenía precios contradictorios. El nuevo los toma de un solo documento | Sanity → `pricingCatalog` |
| 8 | **Revisar textos EN/ES** | Son copy decks escritos por nosotros; Lisandra debe dar el visto bueno | Sanity → `servicePage` |

Si falta la dirección de WPB, **el build avisa pero no falla**, y las plantillas omiten
el dato en lugar de imprimir el placeholder. Aun así, no conviene dejarlo así más de
unos días.

## 2. Pendientes técnicos antes de apuntar el dominio

- [x] **Lighthouse** (2026-10-28): las cinco rutas clave cumplen — puntuación 100, LCP
      ≈ 1.3 s, CLS 0. Detalle en `docs/ENTREGA-RESUMEN.md`. Volver a medir tras el corte de DNS.
- [ ] **Rich Results Test** de la home, una página de servicio y Pricing.
- [ ] **Revisión en un teléfono real** de la vista previa de Cloudflare (menú, hero,
      formulario de contacto).
- [ ] **Probar el formulario de contacto** de punta a punta y confirmar que llega el correo
      a la dirección de Lisandra (ver `docs/CONTACT_FORM_SETUP.md`).
- [ ] **Revocar el token de Sanity** que se pegó en un chat durante el trabajo
      (sanity.io/manage → proyecto → API → Tokens) y crear uno nuevo solo si hace falta.
- [ ] Fusionar el PR #23 a `main`.

## 3. Plan de corte: de WordPress en Hostinger a Cloudflare

El sitio viejo era **una sola página en dos idiomas**, así que hay poco que redirigir: la
versión EN sigue viviendo en `/` y la ES cambia de URL. Esa única regla ya está en
`public/_redirects` (301 de
`/es/fotografo-y-videografo-bilingue-en-west-palm-beach-y-port-st-lucie/` a `/es/`).

### Antes de tocar nada
1. **Averigua dónde está el dominio y dónde está el correo.** Entra a Hostinger y mira:
   - ¿El dominio `wonderlandsstudio.com` está **registrado** en Hostinger o solo
     alojado ahí?
   - ¿Hay cuentas de **correo** con ese dominio (por ejemplo contact@...)? Si las hay, sus
     registros **MX** hay que copiarlos tal cual; si se pierden, deja de llegar el correo.
2. **Haz una copia de seguridad** del WordPress (Hostinger → Backups) y exporta la lista
   completa de registros DNS actuales (captura de pantalla vale).
3. **No canceles el hosting de Hostinger todavía.** Se mantiene al menos 2–4 semanas como
   respaldo.

### El corte
4. **Añade el dominio a Cloudflare** (Add a site → `wonderlandsstudio.com`, plan Free).
   Cloudflare importa los registros que detecta; **compáralos con tu copia** y añade a
   mano los que falten (sobre todo MX, SPF/DKIM y los de Resend para el formulario).
5. **Cambia los nameservers** en el registrador (Hostinger, si ahí está registrado) por los
   dos que te dé Cloudflare. Tarda desde minutos hasta unas horas.
6. **Conecta el dominio al Worker**: Cloudflare → Workers & Pages → `wonderlands-studio`
   → Settings → Domains & Routes → Add → Custom domain: `wonderlandsstudio.com`. Añade
   también `www.wonderlandsstudio.com` y haz que **redirija con 301 al dominio sin www**
   (el sitio declara el dominio sin www como canónico).
7. **Verifica el dominio de Resend** (registros DNS que indica Resend) para que el
   formulario envíe desde `contact@wonderlandsstudio.com`.

### Verificación el mismo día
8. `curl -sI https://wonderlandsstudio.com/` responde 200 y el HTML ya trae los precios
   (`curl -s https://wonderlandsstudio.com/pricing/ | grep "\$1,200"`).
9. La URL ES antigua redirige con 301:
   `curl -sI https://wonderlandsstudio.com/es/fotografo-y-videografo-bilingue-en-west-palm-beach-y-port-st-lucie/`
10. `https://wonderlandsstudio.com/sitemap.xml` y `/robots.txt` cargan.
11. Se envía un mensaje de prueba por el formulario y llega.
12. El correo del dominio sigue funcionando (enviar y recibir una prueba).

### Después del corte
13. **Google Search Console**: añadir la propiedad del dominio, enviar `sitemap.xml` y
    pedir indexación de la home y de las páginas de servicio.
14. **Google Business Profile**: que el nombre, la dirección y el teléfono sean
    **idénticos** a los del sitio (regla de NAP del proyecto) y que apunte al sitio nuevo.
15. **Google Tag Manager** (`GTM-PR44DVLT`): confirmar en la vista previa de GTM que
    dispara en el dominio nuevo.
16. **Retirar el WordPress** de Hostinger solo cuando pasen 2–4 semanas sin incidencias y
    con el correo confirmado. Antes, bloquear su indexación o ponerlo detrás de contraseña
    para no tener contenido duplicado.

## 4. Quién necesita acceso a qué

El sitio no debe depender de la cuenta personal de quien lo construyó. Lisandra debería ser
**propietaria o administradora** de: Cloudflare (sitio y Worker), el proyecto de Sanity
(`74tin3nw`, Studio en `https://wonderlands-studio.sanity.studio/`), Resend, el repositorio de
GitHub, Search Console y Google Tag Manager.
