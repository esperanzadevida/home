# Home y recorrido visual — Iglesia Esperanza de Vida

**Estado publicado, 2026-11-22:** GitHub Pages sirve la Home y las rutas públicas bajo `/home`. La portada usa el MP4 de cintas verdes, poster WebP y narrativa HTML sincronizada al scroll. `ScrollScrubHero.tsx` resuelve el prefijo de Pages y conserva el poster con movimiento reducido o señales de conexión limitada; el contenido vive en `ScrollScrubNarrative.tsx` y `scroll-scrub-hero.css`.

## Propósito de la portada

Orientar a quien llega por primera vez y dejar visibles tres acciones: planificar la visita, conocer los horarios/ubicación y contactar a la comunidad. La agenda, ministerios y mensajes aparecen después como rutas secundarias.

## Recorrido de contenido

1. **Bienvenida (0–0,28 del recorrido).** Titular HTML, copy breve y enlaces a `/servicios` y `/ministerios`.
2. **Información práctica (0,32–0,64).** Horarios desde `churchProfile.schedule`, dirección desde `churchProfile.address` y enlace a `/contacto`. Las dos tarjetas dejan libre el centro del encuadre.
3. **Cierre (0,68–1).** Invitación breve y enlace a `/contacto`; permanece visible al final.
4. **Home editorial.** Comunidad, próximos encuentros, ministerios y mensaje reciente desde las configuraciones compartidas.
5. **Pie compartido.** Horarios, contacto y rutas comunes.

No duplicar horarios, eventos o perfiles. Las cifras, testimonios, mapas, aportes, compras y envíos solo se muestran cuando el contenido o una integración funcional los respalda.

## Video y movimiento

- El MP4 servido es H.264, 1920 × 1080, 24 fps, 5,04 s y 4,29 MB; se conserva una copia verificada del original en docs/assets. El poster es un fotograma WebP de 1280 × 720.
- Las bandas cambian opacidad y posición con una curva `smoothstep`, leyendo `--scrub-progress`; ScrollScrubHero maneja carga nativa, fallback y scrubbing sin copiar el MP4 a un Blob de JavaScript.
- Cada banda usa un scrim radial y los textos sobre video usan tres sombras. Los botones no usan sombra tipográfica.
- Con `prefers-reduced-motion: reduce`, `saveData`, conexión `slow-2g`/`2g` o `downlink` <= 2 Mb/s, el hero conserva el poster y no descarga el MP4. En móvil con conexión suficiente y movimiento normal se permite el scrubbing.
- El contenido conserva HTML, foco visible y enlaces reales. Las bandas inactivas usan `inert` y `aria-hidden` hasta entrar en su tramo.

## Evidencia local y pendientes

- En 1440 × 900, revisé el primer cuadro, la escena práctica cerca de progreso 0,5 y el cierre cerca de 1. El ancho del documento se mantuvo en 1440 px; no hubo errores de consola salvo el mensaje informativo de React DevTools.
- A 390 × 844 con tema oscuro y movimiento reducido, las cuatro escenas quedaron visibles y ordenadas, no hubo overflow y el navegador no solicitó el MP4. Los enlaces miden al menos 44 px de alto.
- En la build de producción local (3146), el poster se pintó y el reproductor pasó a `video-ready`. La versión comprimida pesa 4.290.098 bytes y marcó VMAF 92,854 frente al original. En Chrome local, el scrub llegó a `currentTime` 2,52 s en progreso 0,5 y 5,01 s en 0,994. La petición inicial respondió con un rango que abarcaba el archivo completo; al buscar, el navegador solicitó sufijos superpuestos. El tamaño del archivo no se presenta como una medición de bytes agregados en la sesión.
- Lighthouse móvil de Home (390 × 844, movimiento reducido): Accesibilidad 100, Buenas prácticas 100 y navegación por agentes 100. SEO 66 por el `noindex,nofollow` intencional del entorno local.
- En la Home de escritorio, el primer Tab revela «Ir al contenido principal» con foco visible. Es una comprobación puntual; falta recorrer toda la secuencia de teclado.
- En producción GitHub Pages, la Home activó `hero-scrub.mp4` con movimiento normal: a 1280 × 960, progreso 0,4785 movió el video a 2,41 s de 5,04 s; a 390 × 844 no hubo overflow. Con `prefers-reduced-motion: reduce`, quedó el poster y no se solicitó el MP4. En `/servicios`, progreso 0,6493 movió el video a 5,17 s de 7,97 s, sin overflow a 1280 px.
- Confirmación directa del usuario (2026-11-21): el MP4 del hero se generó con una suscripción paga activa de Magnific y a partir de una imagen propia o licenciada. La confirmación corresponde a `public/videos/hero-scrub.mp4`; el repositorio no conserva el identificador de generación.
- Quedan pendientes la matriz integral de accesibilidad/teclado/lector de pantalla, la revisión de rutas y Admin, y la auditoría integral de rendimiento del sitio. El sitio ya se publica en GitHub Pages.

## Orden local siguiente

1. Completar la revisión de las rutas públicas y sus estados vacíos/enlaces.
2. Revisar Admin en móvil/escritorio y claro/oscuro, con sus estados declarados como prototipos locales.
3. Terminar QA de contraste, teclado, lector de pantalla y carga/error.
4. Validar migraciones/seed/RLS localmente antes de conectar servicios.
5. Integrar Supabase o Vercel solo con credenciales y autorización correspondiente. GitHub Pages ya publica la exportación estática mediante Actions.
