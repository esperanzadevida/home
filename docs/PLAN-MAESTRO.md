# Plan maestro operativo — Iglesia Esperanza de Vida

## Estado vigente — identidad, Home y rutas públicas en GitHub Pages — 2026-11-22

La decisión más reciente registrada en Obsidian establece **Iglesia Esperanza de Vida**, Asambleas de Dios, Ambato, con emblema de llama verde. Sendero de la Aurora queda como etapa editorial anterior. Los perfiles, ministerios, horarios, dirección y contacto son contenido creativo autorizado para esta ambientación; la interfaz pública no muestra una etiqueta de ficción.

Las nueve imágenes WebP se reutilizan desde `public/images/esperanza-de-vida/`; el inventario activo está en [`ASSETS-ESPERANZA-DE-VIDA.md`](ASSETS-ESPERANZA-DE-VIDA.md). Los horarios siguen siendo texto editable. La portada integra el video de 5,04 s y 4,29 MB, un poster WebP y cuatro escenas narrativas. Home y `/servicios`, `/tienda` y `/en-vivo` se publican como sitio estático en [GitHub Pages](https://esperanzadevida.github.io/home/). `ScrollScrubHero` aplica el prefijo `/home` a los medios locales. Con movimiento reducido, `saveData`, `slow-2g`/`2g` o `downlink` <= 2 Mb/s conserva el poster y omite el MP4; en redes y movimiento normales también permite scrubbing móvil. El original se conserva en `docs/assets/hero-scrub-original.mp4`.

### Orden operativo para continuar

| Orden | Bloque | Trabajo y condición de salida |
|---|---|---|
| 1 | Identidad y contenido local | Mantener marca, perfil, rutas de imagen, catálogo y seed alineados con Esperanza de Vida; conservar el slug anterior de camiseta solo como redirección 308. |
| 2 | Páginas públicas | Barrido base de las 28 rutas públicas en producción a 320 × 740 y 1440 × 1000, títulos/H1, enlaces internos e imágenes completado. Siguen pendientes recorridos funcionales más amplios y las acciones sin backend continúan siendo prototipos locales. |
| 3 | Panel Admin local | Revisar formularios, tablas y navegación Admin en móvil/escritorio. No implicar autenticación ni persistencia donde solo hay UI/datos de muestra. |
| 4 | Calidad local | Recorrer rutas y temas; revisar teclado, contraste, texto alternativo, carga/error y lector de pantalla, registrando solo lo comprobado. |
| 5 | Datos y permisos | Simplificar y validar migraciones, seed, roles y RLS antes de conectar una cuenta. |
| 6 | Servicios y publicación | La exportación estática se publica y verificó en GitHub Pages. Supabase, Vercel y flujos con datos reales siguen sin conectar; verificar modelo, permisos y credenciales antes de activarlos. |
| 7 | Hero con video | Integración, exportación estática y prefijo de medios verificadas. En caché fría, el build local transfirió 4,290,398 bytes en una sola descarga; ocho posiciones de scrubbing reutilizaron el Blob local. En Slow 4G simulado (390 × 844, 4× CPU, downlink 1,6 Mb/s) el fetch tardó 25,1 s, por lo que el poster reemplaza la animación en conexiones limitadas. Siguen pendientes la prueba en red real y la procedencia/permisos del clip. |

La web pública actual es una exportación estática de GitHub Pages. No conectar Supabase ni Vercel antes del cierre local y la entrega de credenciales; los flujos de Auth, persistencia y RLS siguen sin verificarse.

### Avance verificable del estado actual

- El código activo de interfaz y seed está alineado con Esperanza de Vida; las rutas antiguas de imágenes quedan como archivo histórico.
- Home revisada en 1440 × 900 en el primer cuadro, progreso 0,5 y cierre 0,994; en móvil 390 × 844 con movimiento reducido las cuatro bandas aparecen en flujo estático, no hay overflow y la red solo solicita el poster, no el MP4.
- En la exportación de Pages de 2026-11-22, `npm run lint`, `npm run type-check` y `npm run build` pasan y Next genera 64 rutas estáticas. La salida incorpora el prefijo `/home` para Home y los tres heroes de video. La pasada anterior revisó 46 rutas declaradas y 54 paths internos; el slug antiguo de la camiseta devuelve 308 hacia el canónico.
- GitHub Actions publicó el commit `13460a6` en la ejecución [`44970952196`](https://github.com/esperanzadevida/home/actions/runs/44970952196), completada con éxito. Chrome recibió 200 para el MP4 y poster de `/home/`, `/home/servicios/`, `/home/tienda/` y `/home/en-vivo/`; antes, los medios de las tres rutas interiores devolvían 404.
- QA de `/servicios` en producción a 320 × 740: ancho del documento 320 px, etiqueta de capítulo visible, dock de 220,8 px, sin errores de consola. Con movimiento reducido y con `downlink` 1,6 Mb/s simulado, el poster respondió 200 y no se solicitó `services-scrub.mp4`. En local también se comprobó 390 × 844; la licencia del clip sigue sin verificarse.
- Cobertura previa de Lighthouse: 26 rutas y 46 combinaciones de tema; Accesibilidad, Buenas prácticas y navegación por agentes dieron 100. En producción, 28 rutas públicas pasaron el barrido a 320 × 740 y 1440 × 1000: título, un H1 y ancho de documento/cuerpo igual al viewport. El análisis adicional del HTML exportado encontró 1.158 enlaces internos, todos con destino existente y prefijo `/home`. Quedan el recorrido integral de teclado, lector de pantalla, contraste manual, estados de carga/error y rutas dinámicas no cubiertas.
- En producción se recorrieron con teclado algunos flujos de Home en móvil: enlace de salto, notificaciones, cambio de tema, carrito y menú «Más»; Escape cerró los diálogos/restauró el foco, y la navegación desde «Más» enfocó `main#main-content`. Es una muestra de flujos, no un recorrido completo.
- El menú Admin móvil se abrió por su botón con nombre accesible; Escape lo cerró y devolvió el foco al botón. Sigue pendiente revisar teclado en todas las rutas y controles.
- Lighthouse móvil de `/`, `/servicios`, `/sermones`, `/tienda/camiseta-esperanza-de-vida` y `/admin/dashboard` (390 × 844, movimiento reducido): Accesibilidad, Buenas prácticas y navegación por agentes en 100. SEO obtuvo 66 en Home y 63 en las otras rutas porque se mantiene la directiva `noindex,nofollow`; este release la conserva y no prepara el sitio para indexación.
- GitHub Pages publica la exportación estática. Supabase, autenticación real, persistencia y RLS siguen pendientes y no están conectados.

**Actualizado:** 2026-11-22.

**Publicación anterior:** Home publicada en GitHub Pages desde `fbbbd1e` (workflow [`44968250079`](https://github.com/esperanzadevida/home/actions/runs/44968250079), exitoso). Esa versión y `/admin/roles/` respondían 200; el hero medía 380vh a 390 px y 520vh a 1440 px, sin desbordamiento a 320 px. Esta evidencia corresponde al release anterior. Persisten la prueba en red real, procedencia/permisos del clip, QA integral público/Admin, teclado/lector de pantalla, rutas dinámicas y validación de modelo/permisos. Supabase, autenticación real, persistencia y RLS no están conectados ni verificados.

## Fuentes y decisiones confirmadas

- Se revisaron `estebanico.com` y `iecejerusalen.com` en navegador y se consultaron sus checkouts locales de `CODE`. Esteban aporta un hero audiovisual cinematográfico y navegación compacta; Jerusalén combina serif editorial, azul/cálido, horarios y un CTA de visita visible. Se conservaron la orientación práctica y el carácter editorial, adaptando el video local disponible a escenas HTML legibles y accesibles, sin copiar sus piezas ni su identidad.
- Referencias externas consultadas: [Church & Ministry Website Design examples](https://www.churchwebpages.com/Websites) y el [caso de Citizen Church](https://thebrook.studio/work/citizen-church-website), por su uso de una navegación directa, tipografía destacada y fotografía cálida.
- Referencias adicionales consultadas el 2026-11-21: [Zarla — Church Website Examples](https://www.zarla.com/inspiration/church), que analiza Emmanuel Faith y Life.Church; y [Site Builder Report — 41 Church Websites](https://www.sitebuilderreport.com/inspiration/church-websites), sobre orientar la navegación a visitantes y evitar sobrecarga de información. La propuesta aplicada conserva una visita práctica, horarios visibles y contenido editorial propio.
- La ficha de Obsidian `03 Proyectos/22 Doménica Iglesia AoG/Doménica Iglesia AoG.md` define el proyecto como un sitio para una congregación de Asambleas de Dios y registra Next.js App Router, TypeScript, Tailwind CSS, Supabase, Vercel y GitHub como tecnologías previstas.
- `docs/prompts/PROMPTS-POR-FASES.md` contiene los 15 prompts originales por fases. Este archivo es el plan maestro separado: conserva esos prompts como referencia y ordena la ejecución según dependencias, alcance y evidencia.
- La Home integra el MP4 comprimido de 4,29 MB, un poster WebP y cuatro escenas ligadas al scroll. La carga fría local transfirió 4,290,398 bytes en una sola petición; bajo Slow 4G simulado tardó 25,1 s. El fallback estático evita gastar esos datos con `saveData`, `slow-2g`/`2g`, downlink <= 2 Mb/s o movimiento reducido. Permiso/procedencia y medición en red real siguen pendientes.
- GitHub Pages está configurado para la exportación estática. Supabase y Vercel permanecen pendientes de credenciales; no se conectarán esos servicios antes de revisar modelo y permisos.
- Nicola autorizó crear una identidad, historia, horarios, contacto, redes y copy editoriales inventados para el proyecto, con presentación normal en el sitio y sin una etiqueta pública que los describa como ficticios. La fuente canónica del copy y el perfil está en `src/config/church-profile.ts` y `src/config/public-pages.ts`; son decisiones de ambientación creativa del proyecto, no datos verificados de una congregación real.
- Los datos de contacto y redes son texto de presentación. No se conectaron formularios, mapas, compra, aportes, reproductores ni transmisiones; no hay envíos o pagos funcionales.
- La marca activa es Iglesia Esperanza de Vida. Las nueve imágenes reutilizadas se documentan en `docs/ASSETS-ESPERANZA-DE-VIDA.md`; `docs/ASSETS-SENDERO-AURORA.md` conserva la variante histórica.

## Estado observado del proyecto

- El workspace tiene un esqueleto Next.js 15 / React 19 / TypeScript / Tailwind 4 y algunas dependencias UI.
- La Home usa `churchProfile`, `sermonDetails`, `eventDetails` y `publicPageBlueprints` para bienvenida, horarios, mensaje reciente, agenda, ministerios y visita. El hero usa el MP4 y poster con cuatro escenas descritas en `docs/ESTRUCTURA-HOME-Y-VIDEO.md`. Autenticación y flujos de contenido no están implementados.
- Al comenzar la revisión no había `components.json`, lockfile, `node_modules` ni repositorio Git. Ahora hay `package-lock.json`, dependencias instaladas y un repositorio Git conectado a `https://github.com/esperanzadevida/home.git`; la exportación estática se publica desde `main` en GitHub Pages.
- Hay un conjunto de imágenes y vectores en `docs/assets/` y `public/images/`. La guía visual los llama oficiales/descargados, pero no registra enlaces ni licencias. El SVG del logo es un dibujo vectorial local y el JPG premium es ilustrativo; su origen institucional no está verificado. Mantenerlos como referencia, no como identidad aprobada.
- El informe denominacional mezcla fuentes oficiales y secundarias. Verificar cada dato histórico/doctrinal con una fuente primaria antes de usarlo en copy público.
- La nota de Obsidian marca de forma contradictoria los 15 prompts como completados y pendientes. El archivo sí existe; el estado de ejecución de cada fase requiere actualizarse con evidencia.
- Existe una migración SQL y un seed locales, pero no se han aplicado ni validado contra PostgreSQL/Supabase. La auditoría estática detectó y corrigió localmente la asignación de privilegios desde `user_metadata`, el acceso público a perfiles y configuración sensible, y las inserciones abiertas. El seed requiere revisión junto con el perfil Esperanza de Vida; faltan validación en una base, normalización del modelo de roles y revisión del catálogo antes de conectar servicios.

## Secuencia de trabajo

| Etapa | Entregable | Estado / condición de salida |
|---|---|---|
| 0. Reconocimiento | Comparar Obsidian, prompts, código y dependencias. Separar decisiones de propuestas. | Completada en esta revisión. |
| 1. Base del sitio | Stack, tokens, metadatos, configuración de Next, navegación responsive y perfil editorial. | Parcial: perfil y metadatos por página, Open Graph/Twitter y canonical condicional están implementados. GitHub Pages es el destino publicado; queda definir si se usará un dominio propio. |
| 2. Componentes UI base | Controles pertinentes, tema, búsqueda, estados vacíos y navegación. | Parcial: Button y tema existen; se agregan controles nativos de búsqueda/filtro para las listas que los necesitan. No hay catálogo de componentes shadcn configurado. |
| 3. Layout y navegación | Layout público, auth/admin y protección de rutas. | Parcial: layouts y navegación existen; no hay autenticación ni middleware de protección implementados. |
| 4. Modelo y seguridad | Reducir esquema, definir permisos, migraciones, RLS y clientes Supabase. | La corrección estática de privilegios, perfiles, configuración pública e inserciones se incorporó a la migración local. Pendientes: validar SQL/RLS con Supabase, confirmar que `private` no esté expuesto por el Data API, reducir roles duplicados y reconciliar productos/ministerios. No conectar ni aplicar SQL hasta cerrar estos puntos. |
| 5. Home y video | Recorrido, copy, poster/video y mapa de secciones. | Publicada en Pages: Home integra el MP4 comprimido y poster con cuatro escenas narrativas. La transferencia agregada se midió en build local. Pendientes: validación en red representativa, permiso/procedencia del video y QA integral del fallback. |
| 6. Páginas públicas interiores | Requisitos de contenido e interacciones por ruta, más detalles editoriales. | Parcial: 12 secciones interiores y 15 fichas de detalle están implementadas; el sitemap público contiene 28 rutas contando Home. Búsqueda, filtros, calendario, divulgaciones y carrito local se comprobaron en el alcance descrito abajo. Formularios, mapa, medios, registro, pago y transmisión no tienen destino real conectado. |
| 7. Autenticación | Supabase Auth, recuperación, sesión y middleware de protección. | Pendiente de modelo y credenciales. El login existente es UI de prototipo, no una sesión real. |
| 8. Admin de contenido | Dashboard, CMS para blog/sermones/eventos/galería. | Parcial: dashboard, blog/editor Markdown, eventos, sermones y galería están disponibles como prototipos locales. Faltan persistencia, permisos y credenciales; no es un CMS conectado. |
| 9. Admin de tienda | Productos, categorías, inventario, pedidos y pagos. | Parcial: catálogo/editor, categorías, inventario, pedidos/detalle y pagos tienen vistas locales coordinadas. Persistencia, autenticación, operación comercial y pasarela siguen pendientes. |
| 10. Miembros y administración | Miembros, ministerios, donaciones, roles y configuración. | Parcial local: directorio con filtros, perfiles de muestra y CSV; ministerios con horario/líder; donaciones con filtros, resumen y CSV; usuarios y matriz por rol. Las acciones solo modifican la vista; faltan autenticación, persistencia, permisos de servidor, fuente financiera y procesos aprobados. |
| 11. Temas | Revisar color, contraste y modo claro/oscuro. | Base claro/oscuro y toggle presentes; el salto al contenido ahora conserva un indicador visible. Falta el recorrido completo de contraste, teclado y lector de pantalla en páginas y Home. |
| 12. Herramientas avanzadas | Mapas, editores, calendario, time picker e imágenes. | Parcial: calendario público local listo; mapas, editores y uploads esperan ubicación, activos y backend. |
| 13. API y servidor | API de auth, contenido, registros, tienda, donaciones, miembros y uploads. | Pendiente de modelo, permisos y credenciales; no hay endpoints de servicio implementados. |
| 14. Calidad | SEO, accesibilidad, responsive, rendimiento y pruebas. | Parcial: metadatos, SEO local, Open Graph, JSON-LD, estados de ruta y `next/image` están implementados. Lighthouse móvil ha cubierto 26 rutas / 46 combinaciones de tema con 100 en Accesibilidad, Buenas prácticas y navegación por agentes. El QA reciente cubrió las 28 rutas públicas en producción a 320 × 740 y 1440 × 1000, además de enlaces y flujos puntuales de teclado. Sigue pendiente QA integral de teclado, lector de pantalla, contraste manual, estados de carga/error, aprobación de assets y otras rutas dinámicas. |
| 15. Publicación | Repositorio, CI/CD, Supabase, Vercel y verificación de producción. | Repositorio y GitHub Actions conectados; la exportación estática está publicada en GitHub Pages y verificada. Vercel, Supabase y los flujos con datos reales siguen pendientes; revisar modelo y permisos antes de migraciones. |

## Orden ajustado de los 15 prompts

Los prompts originales están organizados por tema, pero su numeración no representa el orden de ejecución. Se usarán así:

1. **Fases 1–3 solo como apoyo local:** completar la base, componentes y layouts que falten para cerrar las pantallas, adaptando el stack existente.
2. **Fases 5 y 6 (Home audiovisual y rutas públicas):** la Home estática ya está publicada; completar la revisión restante de rutas, contenido, navegación y controles, y verificar rendimiento real y permisos del video existente.
3. **Fases 8–10 (Admin local):** completar pantallas y recorridos de muestra; no afirmar persistencia, login u operaciones reales.
4. **Fase 11 y parte local de fase 12:** cerrar ambos temas y solo las herramientas locales que resuelvan necesidades confirmadas.
5. **Fase 14 (QA local):** revisar páginas públicas y Admin responsive, accesibilidad, contraste, teclado y estados. Anotar alcance y evidencia concreta; no dar por hecho una corrida o resultado que no se ejecutó.
6. **Fases 4, 7 y 13, más integraciones de la fase 12:** después del cierre local y cuando Nicola entregue credenciales. Revisar modelo y permisos antes de conectar o aplicar cambios a una base.
7. **Fase 15 (GitHub/Vercel/Supabase y publicación):** GitHub Pages ya aloja la exportación estática; Vercel, Supabase y cualquier flujo con datos reales requieren credenciales y verificación acordada.
8. **Video de la fase 5:** el recurso y la composición ya están publicados; validar rendimiento en red real y procedencia/permisos para decidir su permanencia y usos futuros.

La paleta institucional de `COLOR-SYSTEM.md` y la guía de componentes son propuestas iniciales. Se conservan como tokens editables para esta ambientación; el monograma, el logo y las fotografías no están aprobados como identidad oficial. Los prototipos actuales no fijan el diseño final.

## Activos y herramientas revisados

- El catálogo Magic UI no devolvió un patrón de navegación móvil pertinente. shadcn MCP respondió sin registros configurados para este proyecto; no se creó `components.json` solo para buscar.
- Se revisaron las guías oficiales de Base UI y Radix para menús de navegación. 21st.dev ofrece variantes con animación y dependencias adicionales, pero la navegación del proyecto es una lista simple de enlaces. Se eligió HTML nativo (`nav` y `details/summary`) y no se añadió otra biblioteca.
- La Home integra el MP4 comprimido a 4,29 MB, poster WebP y cuatro escenas narrativas ligadas al progreso del scroll. La carga fría medida en build local fue 4,290,398 bytes en un solo fetch; bajo Slow 4G simulado tardó 25,1 s. Un fallback conserva el poster con movimiento reducido, `saveData`, `slow-2g`/`2g` o `downlink` <= 2 Mb/s. El original está resguardado en `docs/assets/hero-scrub-original.mp4`; la validación en redes reales, permiso y procedencia siguen pendientes.
- Selección UI para el hero con video: Magic UI Scroll Progress solo añade una barra de avance; no coordina escenas con el video. Aceternity Sticky Scroll Reveal presenta texto en dos columnas con una zona sticky, una composición distinta para esta portada. Referencias: [Magic UI Scroll Progress](https://magicui.design/docs/components/scroll-progress) y [Aceternity Sticky Scroll Reveal](https://ui.aceternity.com/components/sticky-scroll-reveal).
- El candidato más cercano es Hero Scrub de 21st.dev, pero usa secuencias canvas, pinning y GSAP, con mayor complejidad que el motor local existente; no se confirmó la licencia específica y no se reutilizó. Beautiful UI Scroll Story sí aporta scrollytelling con paneles por paso (v1.0.0, Pro), aunque exigiría registry shadcn/pro para rehacer una narrativa que ya funciona. RareUI ofrece piezas React animadas, sin un ejemplo equivalente de video por scroll. Referencias: [21st.dev Hero Scrub](https://21st.dev/@jean.duthil13/components/hero-scrub), [Beautiful UI Scroll Story](https://beautiful-ui.dev/components/scroll-story) y [RareUI](https://www.rareui.com/).
- shadcn MCP sigue sin registros para este repo. Se conservó el motor actual y se eligieron HTML semántico y CSS/Tailwind sobre `--scrub-progress`; no se copió código ni se añadió dependencia.
- Se corrigió la configuración PostCSS de Tailwind 4. El build había pasado sin la configuración, pero el preview cargaba solo el reset y no aplicaba utilidades. `postcss.config.mjs` activa `@tailwindcss/postcss` y ahora las clases se generan.
- Se eligieron controles HTML nativos para listas/calendario: el registro de Magic UI no ofreció un filtro pertinente, shadcn no tiene registros configurados y las opciones revisadas de HeroUI eran un sistema adicional innecesario para estas interacciones.
- Para el diálogo del carrito se consultó la documentación oficial HeroUI Drawer v3.2.7. shadcn informó que el proyecto no tiene registros configurados; la búsqueda de Magic UI devolvió un diálogo de video, no un panel de compra. Se conservó React/Tailwind propio para mantener el sistema visual y evitar una dependencia adicional.
- Para navegación de tablet y tarjetas de foto se revisaron shadcn (sin registros configurados en MCP), Base UI, Radix, HeroUI Card 3.2.7, Magic Card, Beautiful UI, RareUI, 21st.dev Destination Card y Aceternity Card. Se mantuvieron `next/image`, Tailwind y el diálogo Radix ya instalado: los candidatos nuevos añadían una base visual, 3D/hover o dependencias que no mejoran lectura táctil ni la navegación en esta pantalla. Sonner, Vaul, cmdk y NumberFlow no correspondían a las interacciones de este bloque. No se añadió dependencia ni se adoptó otra licencia; las versiones instaladas siguen en `package-lock.json`. Referencias: [shadcn Card](https://ui.shadcn.com/docs/components/base/card), [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu), [Radix Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu), [HeroUI Card](https://heroui.com/en/docs/react/components/card), [Magic Card](https://magicui.design/docs/components/magic-card), [Beautiful UI](https://beautiful-ui.dev/components), [RareUI](https://rareui.in/docs), [21st.dev Destination Card](https://mcp.21st.dev/%40ravikatiyar162/components/card-21), [Aceternity Cards](https://ui.aceternity.com/card).
- La capa SEO local obtiene el dominio de `NEXT_PUBLIC_SITE_URL` o `VERCEL_PROJECT_PRODUCTION_URL`; el sitio solo publica sitemap en builds de producción y bloquea la indexación en local/preview. No se fijó un dominio provisional. El sitemap lista `/`, páginas interiores y detalles disponibles. `robots.txt` no protege el Admin.
- Se añadieron Open Graph/Twitter, URLs canónicas cuando hay origen configurado, imagen social generada en `/og`, JSON-LD para iglesia/eventos/artículos/productos y metadata indexable condicional para la Home; admin/login y los entornos local/preview permanecen sin indexación. Los productos no anuncian compra en JSON-LD mientras no exista checkout.
- Se añadieron estados de 404, error y carga; se asociaron las etiquetas del login a sus campos. El enlace de recuperación conduce a contacto mientras no exista `/recuperar` ni auth real; el formulario no simula una sesión.
- Las tarjetas públicas de sermones, eventos y productos, y el carrito usan `next/image` con tamaños responsivos. La optimización no aprueba ni verifica el origen/licencia de los assets.
- El seed SQL se revisó junto con `src/config/church-profile.ts` y se retiraron cuentas bancarias, RUC y peticiones personales inventadas. La migración reforzó localmente RLS, acceso a perfiles y settings, y funciones privilegiadas; las peticiones de oración quedan solo para administradores. No aplicar todavía: validar con Supabase, decidir una sola fuente de roles y reconciliar el catálogo de productos/ministerios. La revisión continúa estática, sin conexión ni query a una base.
- El índice doctrinal usa títulos y paráfrasis propias basadas en la declaración en español de Assemblies of God (EE. UU.). La página enlaza y atribuye la fuente; no se presenta como confirmación de una redacción oficial de la organización ecuatoriana.

## Estructura pública publicada y límites actuales

- `/` — portada publicada con video local comprimido, poster/fallback, bienvenida, horarios, comunidad, sermón, eventos, ministerios y visita. La transferencia local está medida; el fallback estático responde a movimiento reducido y, cuando existe Network Information API, a ahorro de datos/conexiones <= 2 Mb/s. Validar redes reales y permisos del material. Recorrido y criterios en `docs/ESTRUCTURA-HOME-Y-VIDEO.md`.
- `/nosotros` — historia, misión, visión y vida de comunidad.
- `/servicios` — horarios, ubicación y primera visita.
- `/sermones` y `/sermones/[slug]` — archivo y detalle editorial de seis mensajes; no hay reproductor.
- `/eventos` y `/eventos/[slug]` — agenda y detalle de tres actividades; no hay inscripción.
- `/ministerios` — ministerios y formas de participar.
- `/blog` y `/blog/[slug]` — índice y tres artículos editoriales.
- `/tienda` y `/tienda/[slug]` — catálogo y fichas informativas; compra y pago requieren una operación comercial conectada.
- `/galeria` — secciones gráficas editoriales con fotografías originales generadas y documentadas para esta ambientación.
- `/contacto` — información editorial con enlaces directos de correo y teléfono; no incluye formulario ni recopila envíos.
- `/donaciones` — información editorial; no hay formulario, cuentas, botones de aporte ni pago configurados, y la ruta no recoge solicitudes.
- `/oracion` — información de acompañamiento; no recoge solicitudes ni datos sensibles.
- `/en-vivo` — sección editorial sin reproductor, emisión o chat conectados.

## Cobertura actual de fase 6

| Ruta | Implementado localmente | Falta del prompt o depende de integración/datos |
|---|---|---|
| `/nosotros` | Historia, misión/visión/valores, equipo con retratos originales generados, cronología y 16 resúmenes con referencias bíblicas y atribución. | Revisión final de dirección artística; confirmar datos antes de una eventual publicación real. |
| `/servicios` | Horarios, guía de primera visita y FAQ accesible con `details/summary`. | Mapa con ubicación confirmada. |
| `/sermones` | Seis mensajes, búsqueda con debounce, filtros por serie/pastor/fecha/tema, orden por fecha y paginación. | Audio/video real y aprobación de contenido adicional. |
| `/sermones/[slug]` | Seis fichas editoriales, índice, etiquetas, relacionados y compartir/copiar enlace. | Reproductor y transcripción completa/material real. |
| `/eventos` | Alternancia lista/calendario mensual, navegación de mes y filtro por categoría. | Más agenda y datos de ubicación confirmados. |
| `/eventos/[slug]` | Tres fichas editoriales e interacción de compartir/copiar enlace. | Imagen con permiso, mapa y registro funcional. |
| `/blog` | Búsqueda, filtro por categoría, orden y marca de destacado. | Más publicaciones aprobadas y contenido BlockNote/Tiptap si se requiere CMS. |
| `/blog/[slug]` | Tres artículos editoriales, autor, índice, etiquetas, relacionados y compartir/copiar enlace. | Avatar/foto aprobada y CMS de contenido rico. |
| `/ministerios` | Seis ministerios, con divulgación de horario/liderazgo y enlace a contacto. | Formulario real para unirse. |
| `/tienda` | Búsqueda, categoría/precio y orden por precio/novedad/popularidad. | Existencias y métricas comerciales confirmadas. |
| `/tienda/[slug]` | Tres fichas, cantidad/variantes, carrito local, relacionados y compartir/copiar enlace; pedido/pago inactivos. | Galería aprobada, reviews y operación comercial. |
| `/galeria` | Cinco escenas locales originales, con descripciones y formatos optimizados. | Álbumes definitivos, dirección artística aprobada y lightbox si sigue aportando valor. |
| `/contacto` | Información editorial, FAQ y enlaces `mailto:`/`tel:`. La ruta no tiene formulario de envío. | Confirmar los destinos para operación real y definir si hace falta mapa. |
| `/donaciones` | Información editorial. | Montos/destino confirmados, pago e historial con cuenta real. |
| `/oracion` | Información de acompañamiento; no recoge solicitudes ni datos sensibles. | Si se incorpora un envío, requiere backend, controles de privacidad y consentimiento. |
| `/en-vivo` | Página editorial que no afirma tener emisión activa. | Fuente real, reproductor, agenda/countdown y chat moderado. |

## Revisión inicial de rutas (base antes de ampliar los sermones) — 2026-11-19

- `npm run build` completó la compilación de producción y generó 35 páginas estáticas contando el resto de las rutas de la aplicación.
- Las 12 rutas públicas interiores y sus 12 detalles respondieron HTTP 200, con título y H1. Esto verifica su renderizado base, no que todos los requisitos de los 15 prompts estén completos. La revisión confirmó que estas páginas no incluyen formularios ni reproductores embebidos.
- La navegación móvil muestra todas las secciones y no desborda a 390 px; el menú “Más” funciona en escritorio; el cambio de tema claro/oscuro funciona; el CTA del encabezado es un único enlace interactivo; la consola del navegador no reportó errores.
- `/en-vivo` conserva su ruta editorial, pero ahora anuncia futuras transmisiones en vez de afirmar que hay emisiones activas; los mensajes enlazan a sus detalles.
- En la revisión inicial del 2026-11-19, Home todavía mostraba el prototipo anterior, con datos distintos y bloques simulados. La solicitud posterior abrió esa parte; la continuación del 2026-11-21 añadió el hero audiovisual local y alineó la identidad con Esperanza de Vida.

## Verificación del avance local — 2026-11-19

- `npm run build` pasó después de añadir los nuevos componentes y se generaron las 38 páginas estáticas, incluidos los seis detalles de sermones.
- Next build completó compilación, lint integrado, verificación de tipos y generación estática.

## Recorrido manual de interacciones locales — 2026-11-19

- Preview nuevo: `http://localhost:3103`. `/sermones` filtró a un resultado al escribir “esperanza”; a 390 px la página midió 390 px de ancho sin desbordamiento horizontal.
- `/eventos` presentó tres eventos en lista. Al pasar al calendario se mostró noviembre de 2026 con un evento; “Mes siguiente” avanzó a diciembre de 2026 con dos. A 390 px, el documento no desbordó; la cuadrícula conserva desplazamiento interno y una etiqueta accesible que lo explica.
- En `/ministerios`, abrir “Horario y liderazgo” reveló reunión, responsable y enlace de contacto en el disclosure nativo.
- En `/tienda/cuaderno-de-reflexion`, “Agregar al carrito” guardó el recurso y cantidad en `localStorage` y anunció que no se procesó pedido ni pago. La clave local de prueba se eliminó después.
- La consola de la página activa en el puerto 3103 no registró errores desde la última navegación. La sesión conservaba cuatro errores históricos del preview anterior en los puertos 3101/3102 (favicon y recursos estáticos obsoletos); no corresponden al preview 3103.
- Esta pasada comprueba esas interacciones concretas, no todas las rutas ni un recorrido completo de teclado, lector de pantalla, contraste, tablet, autenticación o datos reales. La revisión amplia de calidad sigue pendiente.

## Verificación SEO y de resiliencia local — 2026-11-19

- `npm run build` completó compilación, lint integrado, tipos y 45 páginas generadas. `/og` queda bajo Edge Runtime y Next lo sirve bajo demanda; el build indicó que esa ruta no se prerenderiza por el runtime.
- Preview de producción local: `http://localhost:3104`. `/`, `/nosotros`, un detalle de evento, blog, tienda y `/admin/dashboard` respondieron HTTP 200; los metadatos visibles incluyen `noindex` y no incluyen canonical porque no se configuró dominio.
- `/nosotros`, un detalle de evento, blog y producto incluyen JSON-LD. `/og` respondió `image/png`; una ruta desconocida respondió 404.
- En el build local, `robots.txt` devuelve `Disallow: /` y `sitemap.xml` está vacío; no hay dominio de producción configurado. Esto no verifica el sitemap que servirá Vercel con su entorno de producción.
- El admin responde 200 porque todavía no tiene autenticación ni middleware. No publicar el panel hasta cerrar auth y protección de rutas.

## Rediseño visual de Home — 2026-11-19

- `/` ahora usa una composición editorial de bienvenida, horarios, comunidad, mensaje reciente, agenda, ministerios y primera visita. Reutiliza `churchProfile`, `sermonDetails`, `eventDetails` y `publicPageBlueprints`; `CHURCH_INFO` y `MOCK_*` ya no forman parte de la Home.
- Se retiraron de la portada el mapa simulado de Guayaquil, cifras/inscripciones de muestra y el muro con peticiones personales ficticias. No se añadieron servicios externos ni otra biblioteca UI.
- En el corte de esa revisión, la imagen de fondo local se presentaba como conceptual hasta confirmar procedencia y permiso; posteriormente se integró el video disponible, que aún requiere revisar procedencia y permiso antes de publicarlo.
- `npm run build` completó compilación, lint integrado, tipos y generación de 45 páginas. La revisión visual manual a 390 px y 412 px en móvil y 1440 px en escritorio encontró cero desbordamiento horizontal; también se revisaron los temas claro y oscuro.
- `/` ya está incluido en el sitemap de producción. El preview permanece en `http://127.0.0.1:3104`; el entorno local continúa sin indexación.
- Pulido posterior: la acción “Planifica tu visita” unifica el token dorado de acento en encabezado, portada y menú móvil; los textos descriptivos de horarios en el hero suben de 10 a 12 px y aumentan su opacidad. El azul sigue identificando enlaces y acciones generales.
- Revisión de Servicios: se corrigió una clave React duplicada entre las tarjetas de miércoles y viernes (ambas a las 19:30). Tras el cambio, `/servicios` y `/` muestran 0 errores y 0 advertencias de consola.
- Verificación local final: `npm run build` completó compilación, lint, tipos y 45 páginas; Playwright comprobó 390 px con menú móvil abierto y 1440 px sin desbordamiento, tema claro y oscuro, y contraste del CTA de 6,16:1 en claro / 11,85:1 en oscuro. El build advierte que una página con Edge Runtime no se genera estáticamente. Preview reabierto en `http://127.0.0.1:3104`.

## Apariencia y accesibilidad del carrito — 2026-11-19

- Se unificaron las fichas de producto, el contador y el panel bajo el estado de `CartProvider`. El sistema restaura el carrito `domenica_church_cart`, migra entradas antiguas de `domenica-cart-v1` y espera a cargar localStorage antes de persistir para no vaciarlo durante la hidratación.
- Las variantes se guardan como líneas separadas, con cantidad máxima de 20 por variante. La tarjeta del carrito usa iconos por categoría porque las miniaturas locales disponibles no corresponden a los productos que representan.
- El carrito ahora declara diálogo modal, devuelve el foco al cerrarse, responde a Escape, atrapa Tab y vuelve inerte el fondo. Sus controles tienen nombres accesibles, áreas táctiles de 44 px y estados de foco. Se reemplazó el botón de pago no conectado por una consulta informativa en la sede.
- Teléfono y correo de Contacto usan enlaces `tel:` y `mailto:`. El salto al contenido principal muestra un contorno al recibir foco y los enlaces de tarjetas tienen altura táctil de 44 px.
- Verificación local: `npm run build` pasó con compilación, lint integrado, tipos y 45 páginas generadas. Playwright comprobó Biblia y camiseta en tallas S/M, subtotal coherente, persistencia al cambiar de ruta, cierre con Escape y retorno del foco. A 390 px el panel ocupa 390 px sin desbordamiento; Contacto expone ambos enlaces directos. No se conectaron pedidos ni pagos.

## Pulido visual de páginas interiores — 2026-11-19

- Los titulares de las páginas interiores y sus secciones ahora usan la serif editorial de la Home, conservando el sans para lectura y controles.
- `/servicios` muestra en el panel del hero una nota breve de primera visita, y deja el horario para las tres tarjetas de encuentros de la primera sección.
- Las 16 verdades de `/nosotros` conservan títulos, resúmenes y referencias bíblicas en una lista numerada compacta de dos columnas en escritorio y una en móvil.
- Revisé visualmente `/servicios` y `/nosotros` en el preview local a 390 y 1440 px. No añadí otra biblioteca: shadcn no tiene registros configurados en este proyecto y el componente animado de texto de Magic UI se descartó porque el degradado en movimiento no aporta a estos títulos.

## Pulido visual de Contacto — 2026-11-19

- El hero de `/contacto` ahora orienta a quien quiere visitar Ficoa y deja los horarios fuera de esa tarjeta; el CTA de primera visita permanece como camino principal.
- Dirección, teléfono y correo usan tarjetas compactas con iconos. Teléfono y correo conservan enlaces `tel:` y `mailto:`; el email se reduce en anchos intermedios para evitar quiebres torpes.
- Instagram, Facebook y YouTube tienen una fila visual compacta con sus identificadores. Se presentan como información, no como enlaces, porque el perfil editorial aún no contiene URLs confirmadas.
- Las FAQ pasan a una composición de dos columnas en escritorio y una columna en móvil. La página usa un ritmo vertical más corto y omite el CTA final repetido.
- Las acciones de visita y el cierre compartido usan el token dorado de acento; enlaces de contacto y contenido siguen en azul. El contraste del texto de CTA sobre ese acento es 6,16:1 en claro y 11,85:1 en oscuro.
- El panel lateral del hero dejó de mostrar horarios por defecto en rutas donde no corresponden; ahora aparece solo cuando el blueprint define una nota pertinente. El horario queda en Home, Servicios y el pie global. Revisé `/donaciones` y `/oracion` después del cambio.
- En `/donaciones`, la única tarjeta de aportes presenciales ahora ocupa una llamada horizontal con enlace a Contacto, en vez de quedar aislada en la primera columna de una cuadrícula de tres. Revisé la composición a 390 px en claro/oscuro y a 1440 px en oscuro.
- Revisé localmente `/contacto` a 390 px en claro y oscuro, a 768 px en claro, y a 1440 px en claro y oscuro. La vista previa sigue en `http://127.0.0.1:3104/contacto`. Esta comprobación visual no cierra la revisión integral de accesibilidad ni la fase 14.
- Selección UI: shadcn no expone registros configurados; se inspeccionaron el Bento Grid de Magic UI y la tarjeta de HeroUI v3. Ninguno aportaba a datos de contacto estáticos con enlaces parciales. Se conservaron Tailwind, Lucide y el `details/summary` nativo para FAQ; no se instaló una biblioteca.

## Prioridades y recortes de alcance

1. Primero: navegación, páginas informativas y camino de visita/contacto.
2. Después: sermones, agenda, ministerios y contenido editorial del escenario local.
3. Tienda, pagos, muro público de oración, chat en tiempo real, cursos y métricas solo con necesidad confirmada, reglas de privacidad y operación definidas.
4. El copy inventado está autorizado como ambientación pública del proyecto. No convertirlo en una afirmación verificada sobre una congregación real; tampoco fingir éxito de formularios, pagos, transmisiones, cargas o acciones de administración.

## Regla de avance

Cada etapa debe terminar con un entregable local revisable y una lista corta de datos faltantes. Las integraciones y la publicación esperan las credenciales y la autorización aplicable. Los estados “propuesta”, “contenido pendiente”, “implementado localmente”, “verificado” y “publicado” se mantendrán separados.

## Catálogos más accesibles desde el primer pliegue — 2026-11-19

- El renderer detecta páginas con exploradores y compacta su hero, la ruta de navegación y el espacio antes de la primera herramienta. Se conserva el tamaño legible del título en móvil y una jerarquía editorial en escritorio.
- En Playwright, la primera búsqueda/filtro quedó en `/sermones` a y=641 en móvil de 390 px y y=696 en escritorio de 1440 px; `/eventos` a y=697 / y=692; `/blog` a y=673 / y=696; y `/tienda` a y=597 / y=624. Antes aparecía entre y=737–845 en móvil y y=911–991 en escritorio.
- Las cuatro rutas conservaron el ancho del documento igual al viewport en 390 y 1440 px. La revisión visual confirmó que los títulos, filtros, tarjetas y contenido secundario mantienen su orden y lectura.
- La agenda distribuye sus tres eventos en tres columnas a 1440 px, dos a 768 px y una a 390 px; cada tarjeta conserva el ancho disponible sin desbordamiento.
- Catálogos consultados: Magic UI no ofreció un patrón pertinente para listas de eventos/recursos; shadcn no tiene registros configurados; HeroUI Card v3 se revisó como alternativa, pero agregaría otro sistema sin mejorar estos controles nativos. Se conserva Tailwind y la estructura semántica existente, sin dependencias nuevas.
- La consola del preview reportó un desajuste de hidratación en un atributo `caret-color` del campo de búsqueda. No se atribuye al ajuste de clases y queda por identificar en una revisión del entorno del navegador.
- Esta pasada fue visual en preview local: no se ejecutaron build ni tests. Preview: `http://127.0.0.1:3104`.

## Portadas visuales para Galería — 2026-11-19

- `/galeria` muestra ahora tres imágenes editoriales locales para los encuentros, las actividades entre generaciones y el servicio comunitario. Las tarjetas usan `next/image`, texto alternativo descriptivo, carga optimizada y una composición de tres columnas en escritorio, dos en tablet y una en móvil.
- Los archivos `public/images/gallery/*.png` se generaron para este proyecto con ImageGen; son ambientación visual, no registro documental de reuniones reales. La página no muestra una etiqueta de “proyecto ficticio”, según la decisión de contenido del usuario.
- Vista previa aislada: `http://127.0.0.1:3105/galeria`; el servidor principal en `3104` se mantuvo intacto. Playwright confirmó que las tres imágenes cargan, que el ancho del documento coincide con el viewport en 390, 768 y 1440 px, y que el grid usa dos columnas a 768 y tres a 1440. Revisé 390, 768 y 1440 px en claro y oscuro.
- La vista previa aislada se sincronizó con `src/styles/editorial-home.css` y su importación en `globals.css`; tras reiniciarla, `/galeria` devolvió estado 200 y no presentó errores de consola. El archivo se conserva como parte del trabajo visual compartido.
- Catálogos: shadcn no tiene registros configurados; Magic UI devolvió Bento Grid y patrones de producto, que no aportan a estas portadas editoriales; HeroUI Card v3 se inspeccionó, pero añadiría otro sistema visual. Se conserva Tailwind y `next/image`, sin nuevas dependencias.
- Esta fue una comprobación visual en el preview aislado; no ejecuté una compilación de producción ni pruebas.

## Menos espacio entre verdades en móvil — 2026-11-19

- En `/nosotros`, el espaciado vertical de la lista doctrinal baja a `py-3` en móvil y conserva `sm:py-6` desde tablet. Los 16 títulos, resúmenes y referencias siguen abiertos, completos y en el mismo orden.
- A 390 px, la sección pasó de 3101 a 2845 px de alto: 256 px menos. En 768 px y 1440 px mantiene dos columnas; en 390, 768 y 1440 px el ancho del documento coincide con el viewport en tema claro y oscuro.
- Revisión visual con Playwright en el preview aislado `http://127.0.0.1:3105/nosotros`; la consola no reportó errores tras recargar. No se ejecutaron build ni tests.
- Catálogos consultados: shadcn sigue sin registros configurados; Magic UI no ofreció un patrón pertinente para una lista doctrinal; HeroUI Accordion escondería contenido hasta interacción. Se mantiene la lista semántica y Tailwind sin dependencias nuevas.

## Primer pliegue de Galería — 2026-11-19

- `/galeria` usa `compactHero` para reducir solo el espacio vertical de su portada y adelantar las imágenes. Las demás páginas y el contenido del hero conservan su diseño.
- A 390 × 844 px, la primera imagen pasó de y=828 a y=740; el hero bajó de 453 a 365 px. A 768 × 900 px, la primera imagen aparece en y=755; a 1440 × 900 px, las tres portadas empiezan en y=752. El grid mantiene 1, 2 y 3 columnas según el ancho.
- En la revisión local, las tres imágenes cargaron con texto alternativo, no hubo desbordamiento horizontal y la consola reportó 0 errores y 0 advertencias.
- Se conserva el grid Tailwind y `next/image`. shadcn no tiene registros configurados; Magic UI no mostró una composición fotográfica pertinente; HeroUI Card v3 se revisó y añadiría otro sistema sin mejorar esta galería. No se añadieron dependencias.
- Preview aislado: `http://127.0.0.1:3105/galeria`; el servidor de `3104` quedó intacto. No ejecuté build ni tests.

## Índices de tarjetas más legibles — 2026-11-20

- En `PublicPageRenderer`, los números decorativos de las tarjetas subieron de `text-primary/10` a `text-primary/70`; al pasar el puntero alcanzan `/85`. Conservan `aria-hidden` y no cambian los textos ni el orden de las tarjetas.
- En `/sermones`, revisé el modo oscuro a 1280 × 720 y el modo claro a 390 × 844. Los índices ya se distinguen, no se superponen a los títulos y el ancho del documento sigue en 390 px. En `/nosotros`, la lista de 16 verdades conserva su numeración ámbar independiente y sus textos; no se aplica este ajuste a esa lista.
- La consola del preview aislado `http://127.0.0.1:3105` reportó cero errores y cero advertencias.
- UI revisada: shadcn MCP no tiene registros configurados; inspeccioné el ejemplo Dither Field Card de Magic UI y el componente Card de HeroUI v3. El primero agrega un fondo WebGL animado sin resolver la legibilidad de estos índices; el segundo sumaría otra biblioteca para una tarjeta ya resuelta por Tailwind. Se conserva el sistema actual y no se añaden dependencias.
- Esta es una revisión visual local de `/sermones` y `/nosotros`; no ejecuté build, suite de accesibilidad integral ni pruebas automatizadas. La fase 14 sigue abierta.

## Navegación admin y sermones adaptables — 2026-11-20

- La administración conserva su barra lateral desde 1024 px y usa un drawer móvil con Radix Dialog en anchos menores. El drawer comparte las secciones/rutas, señala la ruta activa, ofrece tema y salida, cierra con Escape y restaura el foco al botón que lo abrió.
- En `/admin/contenido/sermones`, móviles y tablets muestran fichas que contienen título, fecha, duración, pastor, serie, pasaje y vistas; la tabla completa aparece desde 1280 px. El título permanece en una línea desde 768 px. La búsqueda filtra por título, anuncia el total y muestra un estado vacío cuando no hay coincidencias.
- Playwright revisó 390, 768, 1024 y 1280 px: el ancho del documento coincidió con el viewport y se alternaron drawer/tarjetas/tabla según el ancho. A 390 px comprobé apertura, cierre con Escape, retorno de foco, búsqueda sin resultados y lectura de tarjetas. A 1280 px revisé claro y oscuro. Consola: 0 errores y 0 advertencias.
- `npm run lint` (ESLint con `--max-warnings=0`), `npm run type-check` y `git diff --check` pasan. No ejecuté build ni suite de pruebas.
- Selección UI: Radix Dialog se eligió como primitiva porque `@radix-ui/react-dialog` ya está en dependencias y permite mantener la apariencia Tailwind existente con gestión de foco/teclado; el proyecto declara la versión `^1.1.4`. Radix Primitives publica licencia MIT. shadcn MCP no tiene registros configurados; la búsqueda de sidebar en Magic UI no devolvió resultados; HeroUI Drawer v3 se inspeccionó, pero añadirlo sumaría otro sistema/dependencia. No instalé paquetes.
- Preview aislado actualizado: `http://127.0.0.1:3105/admin/contenido/sermones`; el servidor en 3104 quedó intacto. Los registros Ver/Editar/Eliminar y Subir sermón siguen siendo controles visuales de datos mock, no operaciones funcionales.
- El selector compartido `TimePicker` ya consume `value` en formato 24 horas `HH:mm`, emite el mismo formato y expone nombres accesibles; no hay usos conectados en las páginas actuales.
- La fase 14 permanece parcial: lint y chequeo de tipos quedan limpios, pero falta la validación integral definida en los prompts por fases.

## Admin adaptable y harness inicial de fase 14 — 2026-11-20

- Blog, Eventos, Productos, Pedidos, Miembros, Donaciones y Roles ahora presentan fichas en anchos menores a 1280 px y conservan tablas semánticas en escritorio cuando corresponde; Blog ajusta el ancho del editor. Junto con Sermones, la pasada cubre ocho rutas.
- Playwright recorrió las ocho rutas en 390, 768, 1024, 1279 y 1280 px en el preview; el ancho del documento coincidió con el viewport y se observó el cambio entre fichas y tablas. El build aislado de producción generó 45 rutas.
- Se incorporó Vitest con Testing Library y 16 pruebas para URL del sitio y carrito. `npm run test:run`, `npm run lint`, `npm run type-check` y `git diff --check` pasaron.
- Se retiraron dependencias sin uso directo (`maplibre-gl`, `zod`, `@hookform/resolvers`, `react-hook-form`) y se fijó PostCSS al paquete raíz parcheado. La auditoría registrada quedó en 24 moderadas, 0 altas y 0 críticas; el resto se concentra en la cadena BlockNote/Tiptap y uuid, pendiente de decisión compatible.
- La selección para fichas y tablas conserva Tailwind y HTML semántico: shadcn no tiene registros configurados; Magic UI devolvió efectos decorativos sin utilidad para estas listas; HeroUI Card v3 agregaría un segundo sistema. No se añadieron bibliotecas.
- La fase 14 sigue parcial: autenticación/RLS, integración real, flujo end-to-end y auditoría integral de accesibilidad aún no están cerrados.

## Portada del dashboard y acceso administrativo — 2026-11-20

- `/admin/dashboard` presenta un hero de coordinación, el estado de configuración y accesos a los módulos disponibles; las métricas de muestra están identificadas. Mantiene claro que la autenticación y los datos todavía no están conectados.
- El sidebar de escritorio reparte la altura disponible entre identidad, navegación con scroll y pie fijo. En esa pasada el emblema y el nombre identificaban a Iglesia Doménica; la reidentidad a Sendero de la Aurora se registra en la continuación del 21 de noviembre.
- `/login` pasa de un formulario sin autenticación a una pantalla de acceso en preparación que explica que no guarda credenciales y ofrece volver al sitio público.
- Playwright revisó dashboard en 390×844, 1280×720 y 1440×900; a 1280×720 el menú puede desplazarse sin superponer perfil/tema. Login se revisó en 390×844 y 1440×900, en temas oscuro y claro, sin desbordamiento horizontal observado.
- Catálogos para las tarjetas: shadcn no tiene registros configurados; Magic UI sugirió efectos de brillo/fondo que no aportan a estos accesos; HeroUI Card v3 se consultó pero sumaría otra base visual. Se conserva Tailwind y el emblema local, sin nuevas dependencias.
- Verificación del cambio: ESLint focalizado, `npm run type-check` y `git diff --check` pasan. Preview de desarrollo aislado: `http://127.0.0.1:3113`; todavía no es una publicación ni conecta servicios.

## Continuación visual de fase 8 — 2026-11-20

- `/admin/dashboard` ahora reúne cinco indicadores de muestra, gráficos SVG de seis meses, actividad reciente, agenda y accesos rápidos. La propia vista indica que son datos de muestra; el estado de configuración aclara que Supabase y Auth siguen pendientes. No se instaló biblioteca de gráficas.
- `/admin/contenido/blog` muestra publicaciones con búsqueda, filtros por estado y categoría, estados, acciones locales y vistas de tarjeta/tabla según ancho. `/admin/contenido/blog/[id]` ofrece editor Markdown con extracto, metadatos, etiquetas, portada y vista previa. En ese corte, los cambios eran temporales en memoria; la continuación del 2026-11-21 añade autoguardado limitado al navegador, sin conexión de servidor.
- `/admin/contenido/galeria` usa las tres imágenes locales con filtros, búsqueda, visor accesible con navegación y edición temporal de alt text. No implementa carga, Storage ni persistencia. Añadí Galería a navegación lateral y accesos rápidos del dashboard.
- Playwright revisó 390 px y 1440 px para Blog; 390 px para editor y Galería; 1280 px para Dashboard y el dashboard en claro a 1440 px. El documento coincidió con el ancho del viewport, y no hubo errores o advertencias de consola tras la recarga completa del preview.
- ESLint focalizado, `npx tsc --noEmit` y `git diff --check` pasan. No ejecuté build ni pruebas automatizadas en esta pasada.
- Selección UI: se conserva Tailwind/HTML para tarjetas, tabla y editor Markdown; las gráficas usan SVG nativo para estos dos trazos simples. Galería reutiliza Radix Dialog ya instalado. Se consultaron shadcn (sin registros configurados), Magic UI y HeroUI para la galería; no aportaban una solución mejor. Para Blog se revisaron las guías oficiales de TanStack Table, shadcn Data Table, Radix Dropdown Menu y BlockNote; se mantuvieron controles existentes y no se añadió otra dependencia.
- Fase 8 sigue parcial: falta conectar una fuente de datos de servidor, editor de texto rico completo, carga de imágenes a Storage y operaciones durables. El blog conserva borradores en localStorage solo para este navegador; esto no sustituye persistencia compartida. La integración y publicación siguen al final tras credenciales.
- Preview de revisión aislado: `http://127.0.0.1:3113`; sin despliegue ni conexión a servicios externos.

## Continuación visual de fase 9 — 2026-11-20

- `/admin/tienda/productos` ofrece búsqueda por nombre/SKU/categoría, filtros de categoría, existencias y estado, accesos a categorías/inventario y entrada al editor. El SKU es parte del catálogo compartido con Inventario. El editor cubre datos, precio, organización, inventario, productos digitales, etiquetas e imágenes con previsualización local; la descripción aún es texto básico. Su aviso de demostración conserva buen contraste en modo oscuro; el contenido no se persiste ni se sube.
- `/admin/tienda/categorias` permite gestionar un árbol padre/hijo, ajustar el orden con controles accesibles y previsualizar imágenes; el resumen comparte el catálogo de cuatro productos de muestra.
- `/admin/tienda/inventario` ahora deriva sus cuatro artículos de `MOCK_PRODUCTS`, con SKU/umbrales de muestra, ajustes temporales, historial y CSV local. El resumen coincide con el catálogo; los controles táctiles miden 44×44 px en móvil.
- `/admin/tienda/pedidos` enlaza al detalle con datos ficticios consistentes y correos del dominio reservado `.invalid`. El detalle muestra artículos, cliente/dirección de muestra, estados editables localmente, historial y notas temporales.
- `/admin/tienda/pagos` contiene resumen, filtros y transacciones de muestra; importes usan el formato `es-EC` de dólares. La vista indica que no hay pasarela ni cobros procesados.
- La navegación lateral y los accesos del dashboard incorporan las rutas del módulo. El enlace inferior ahora describe su acción como «Ir al sitio público»; no se presenta como cierre de sesión porque Auth aún no existe. Productos muestra el mismo aviso local que el resto del módulo. Los encabezados de tienda comparten escala y jerarquía.
- Playwright revisó pagos, categorías, productos, editor, inventario y detalle de pedido en el preview local a 390 px; el ancho del documento coincidió con el viewport. Pagos se inspeccionó en escritorio claro y oscuro; inventario en claro; el editor de producto y el detalle en oscuro. La consola no mostró errores en las rutas revisadas.
- `npm run type-check`, ESLint focalizado y `git diff --check` pasan. No ejecuté build ni pruebas automatizadas en esta pasada.
- Selección UI: shadcn MCP no tiene registros configurados; Magic UI no ofreció patrones pertinentes; HeroUI se revisó como alternativa de tabla/modal pero añadiría otra base sin ventaja para estas pantallas. Se conservan Tailwind, HTML semántico y controles existentes, sin dependencias nuevas.
- Fase 9 sigue parcial hasta definir autenticación, backend, modelo comercial, carga persistente y pasarela. Preview aislado: `http://127.0.0.1:3113`; sin conexión ni publicación.

## Continuación local de fase 10 — 2026-11-20

- `/admin/miembros` permite buscar y filtrar por estado/ministerio, añadir y editar perfiles temporales, abrir una ficha con contacto y acompañamiento, declarar asistencia/aportes no disponibles y exportar el resultado filtrado a CSV. Los correos usan `example.invalid`; no se introducen teléfonos reales ni notas persistentes.
- `/admin/ministerios` presenta responsable, horario, descripción y perfiles de muestra asignados; crear/editar modifica solo la vista local.
- `/admin/usuarios` cubre búsqueda, filtros de estado, roles de muestra y cambios temporales de estado. Añadir un registro no crea cuenta ni envía invitación; recuperación de contraseñas requiere Auth.
- `/admin/donaciones` filtra por destino y periodo, calcula totales/gráfico desde ocho registros sintéticos y exporta el filtro actual. No hay cobros ni recibos reales.
- `/admin/roles` conserva una matriz independiente para cada rol de muestra con acciones de ver, crear, editar, eliminar, publicar y administrar. El panel deja claro en todas las rutas que Auth/almacenamiento no están conectados; el pie ya no presenta un superadministrador ficticio como sesión real.
- QA local con build de producción: TypeScript, ESLint focalizado y build Next completaron; se generaron 51 rutas. Las páginas de miembros, ministerios, usuarios, donaciones y roles mantuvieron `documentElement.scrollWidth === 390` a 390 px; miembros también se revisó a 1280 px. Los filtros de donaciones actualizaron el conteo de 8 a 5 y el total de muestra a USD 580. No ejecuté suites de tests. El preview mostró una advertencia del navegador sobre precarga de CSS, sin errores de ejecución; el build conserva la advertencia existente de Edge Runtime.
- Sin dependencias nuevas ni conexiones a GitHub, Vercel o Supabase. Se conserva Tailwind/HTML y el diálogo Radix ya instalado.

## Barrido Lighthouse móvil — 2026-11-20

- Lighthouse móvil dio Accesibilidad 100 y Buenas prácticas 100 en 17 rutas representativas: Home, Contacto, Nosotros, Servicios, Eventos, Ministerios, Oración, Galería, índices y fichas de Sermones/Eventos/Blog/Tienda, y Admin/Miembros/Usuarios/Donaciones. Todas también dieron 100 en navegación por agentes tras corregir los casos señalados. La alerta SEO `is-crawlable` corresponde al `noindex,nofollow` intencional del preview local.
- Home mostró contraste 4.12:1 en tres títulos del pie y semántica incompleta en el carrusel de ministerios. Los títulos usan ahora `muted-foreground` completo y el carrusel usa `ul/li`. /nosotros mostró contraste 3.79:1 en referencias y /eventos 4.46:1 en etiquetas; subí referencias a `text-primary` y reduje el fondo de las etiquetas a `bg-primary/5`. Lighthouse repetido en Home, Nosotros y Eventos dio Accesibilidad 100.
- El layout del Admin ahora ofrece “Ir al contenido principal”; comprobé que recibe el primer foco al pulsar Tab. Lighthouse móvil en `/admin/miembros` quedó en Accesibilidad 100, Buenas prácticas 100 y navegación por agentes 100.
- Esta pasada no sustituye la auditoría de todas las rutas, ambos temas, teclado completo y lector de pantalla; la fase 14 permanece parcial.

## Referencias visuales y primera visita en Home — 2026-11-21

- Revisé en vivo `estebanico.com` y `iecejerusalen.com`, y leí sus componentes locales de portada en `CODE/Esteban Nicola/src/pages/public/CinematicHomePage.tsx` y `CODE/Iglesia Jerusalén/src/features/home/components/PremiumHeroVisual.tsx`. Para Doménica tomé la apertura cinematográfica y el camino visible de primera visita como referencias, conservando su fotografía, paleta y tipografía actuales.
- En `/`, el hero ahora concentra el mensaje y las dos acciones. El bloque «Tu primera visita» pasa justo debajo, parcialmente superpuesto al hero; reúne dirección, contacto, los tres horarios con sus descripciones y orientación para visitantes. Retiré los horarios duplicados del hero.
- Referencias consultadas: [ChurchTrac, ejemplos y prácticas de diseño para iglesias](https://www.churchtrac.com/blog/the-best-church-websites) y [REACHRIGHT, sitios de iglesias destacados para 2026](https://reachrightstudios.com/blog/best-church-websites/). Se usaron para evaluar jerarquía de visita, consistencia y foco móvil.
- Selección UI: Magic UI Bento Grid se inspeccionó y descartó para este bloque informativo; el registro de shadcn no tiene catálogos configurados y la Card de HeroUI v3 se revisó como referencia, pero no justifica sumar otra base visual. Se conserva Tailwind y el HTML semántico existente; sin dependencias nuevas.
- Verificación de esa pasada: `npm run lint`, `npm run type-check`, `git diff --check` y `npm run build` pasaron; el build generó 51 rutas y mantuvo la advertencia existente de Edge Runtime. En ese preview local de producción, 390 px y 1440 px conservaron el ancho exacto del viewport; se revisaron los temas claro y oscuro y la consola quedó sin mensajes. Preview usado entonces: `http://localhost:3121`; el estado vigente de preview queda registrado arriba en `http://localhost:3146/`. No se publicó el sitio.

## Horarios visibles antes del scroll en Home — 2026-11-21

- Ajuste de la portada: el hero conserva la fotografía, jerarquía editorial y acciones principales; su altura máxima baja de 46rem a 40rem. La franja accesible muestra los tres horarios directamente desde `churchProfile.schedule`: domingos 09:00 y 11:30, miércoles 19:30 y viernes 19:30. «Tu primera visita» mantiene dirección, contacto y bienvenida, sin repetir la lista.
- En `CODE/Iglesia Jerusalén/src/features/home/components/HomeVisitQuickAccess.tsx` revisé el patrón de acceso rápido a visita. En la portada de `CODE/Esteban Nicola/src/pages/public/CinematicHomePage.tsx` revisé la secuencia cinematográfica. Para Doménica mantuve el tono editorial y fotográfico propios, haciendo visible la información práctica en el hero.
- Ejemplos web revisados: [Faith UCC](https://reachmediaanddesign.com/project/faith-ucc-church-website-design/), [New Hope Church](https://www.webascender.com/work/portfolio/new-hope-church/) y [Grace One Church](https://www.takramerdesigns.com/projects/grace-one-church). La lectura aplicada fue dar prioridad a información práctica y a una ruta de visita fácil de reconocer.
- Catálogos consultados: shadcn MCP no tenía registros configurados; Magic UI Bento Grid y Hero Video Dialog se revisaron como candidatos y se descartaron para este bloque estático; HeroUI Card v3 se revisó, pero no aporta ventaja frente a los componentes existentes. Se conserva Tailwind, HTML semántico y Lucide, sin dependencias nuevas.
- QA local: lint, type-check, build y `git diff --check` completaron; Next generó 51 rutas. Se revisaron 390×844 claro/oscuro, 768×1024 claro y 1440×1000 claro/oscuro con movimiento reducido. No hubo desbordamiento horizontal y los horarios quedaron visibles en el hero. La consola no mostró errores; al redimensionar el preview tras la carga apareció un aviso del navegador sobre la precarga de una variante de la imagen hero. No ejecuté pruebas automatizadas ni publiqué el sitio.

## Compresión local del video de portada — 2026-11-21

- El MP4 de portada se reencodificó con libx264 CRF 18, preset slow, GOP 8, faststart y sin audio. Conserva 1920 × 1080, 24 fps y 5,04 s; su tamaño baja de 13.640.472 a 4.290.098 bytes (68,6 % menos). FFmpeg libvmaf comparó la salida contra el original en 92,854 VMAF.
- Moví el MP4 y poster anteriores a `docs/assets/hero-scrub-original.mp4` y `docs/assets/hero-poster-original.webp`; el hash SHA-256 del video se verificó tras el movimiento. El poster actual vuelve a salir del primer cuadro del MP4 y mide 1280 × 720.
- En la build local, Chrome reprodujo el video y sincronizó el scrub en progreso 0,5 y 0,994. El `Range` inicial respondió con el archivo completo; al buscar, las solicitudes posteriores pidieron sufijos y se solaparon. No medí los bytes agregados de transferencia ni extrapolo el tamaño comprimido a una tasa real de descarga.
- En 390 × 844 con tema oscuro y `prefers-reduced-motion: reduce`, se mostró el poster, el documento no desbordó el viewport y no hubo petición al MP4.
- ESLint, `type-check` en secuencia y `npm run build` completaron; Next generó 51 rutas y mantuvo la advertencia existente de Edge Runtime. No ejecuté pruebas automatizadas. El preview local de producción queda disponible en `http://localhost:3146/`; no se publicó el sitio. La autorización de publicación del clip de Magnific sigue pendiente.

## Editor Markdown de publicaciones — 2026-11-21

- La edición conserva el cuerpo como texto Markdown; su vista previa ahora presenta encabezados H1–H3, negrita, cursiva, subrayado, enlaces permitidos (`http`, `https`, `mailto`, `tel`), listas numeradas y con viñetas, citas, bloques de código y tablas. El render usa nodos React escapados; no inserta HTML arbitrario. El formato del enlace de video se mantiene como enlace y la acción de imagen aclara que selecciona la portada.
- En 390 × 844, el título “Hacer espacio para la esperanza” cabe completo en el campo, el editor conserva el ancho exacto del viewport y la vista previa no fuerza overflow; en 1280 × 720 también se revisaron los formatos. Cero errores de consola; apareció el aviso conocido de precarga de CSS.
- Selección UI: el MCP de shadcn no tiene registros configurados; la búsqueda de Magic UI devolvió animaciones tipográficas, no un editor. Revisé HeroUI Toolbar v3, pero su navegación con flechas requeriría otra base visual y no resolvería el formato Markdown. BlockNote aporta un editor por bloques; en el lockfile local sus paquetes están en 0.23.6 (MPL-2.0), mientras su lanzamiento oficial más reciente consultado es 0.57.0. Su guía requiere escoger paquete de interfaz/tema y su importación de Markdown convierte el contenido a bloques. Elegí conservar el almacenamiento textual actual y no actualizar ni añadir dependencias.
- Fuentes consultadas: [BlockNote React setup](https://www.blocknotejs.org/docs/getting-started), [importación y migración](https://www.blocknotejs.org/docs/features/import), [licencia y releases](https://github.com/TypeCellOS/BlockNote/releases) y [HeroUI Toolbar](https://heroui.com/en/docs/react/components/toolbar). No se ejecutó la suite automatizada ni se cambió la persistencia; un editor WYSIWYG completo y almacenamiento conectado siguen pendientes.
- ESLint, `type-check` y `npm run build` completaron; Next generó 51 rutas y mantuvo la advertencia existente de Edge Runtime. Preview local de producción: `http://localhost:3146/`; sin publicación ni conexión externa.

## Persistencia local del flujo de publicaciones — 2026-11-21

- El editor usa un espacio `localStorage` versionado, separado por ID de publicación. Autoguarda borradores y metadatos, conserva un borrador nuevo sin publicar hasta que se guarde con título, y al guardar lo incorpora a la lista del navegador. El listado vuelve a cargar estos datos, refleja cambios de estado y conserva los registros quitados. Los cambios se limitan a este navegador/origen; no crean ni actualizan contenido público ni una base compartida.
- Las portadas JPG, PNG y WebP de hasta 750 KB se guardan como data URL en el mismo espacio local. La interfaz informa cuando el navegador no puede leer o guardar o cuando se supera ese límite; no se sube ningún archivo.
- Revisión manual en el preview local (3146): escribí un borrador, confirmé el autoguardado en `localStorage`, recargué el editor y recuperé título/extracto/cuerpo, lo guardé y lo vi en la lista. Cambié su estado desde la lista y la escritura persistió. `/blog` no mostró ese artículo local, como corresponde. Una portada WebP del proyecto recargó tras refrescar y su imagen natural fue 900 × 1125; a 390 × 844 el editor y listado mantuvieron `scrollWidth` igual al viewport. Cero errores de consola; permaneció el aviso conocido de precarga CSS.
- Limpié los registros de prueba de los contextos aislados de Playwright al terminar. No se cambió el perfil del navegador del usuario.
- ESLint, `type-check` y `npm run build` pasan; Next generó 51 rutas y mantuvo la advertencia existente de Edge Runtime. No ejecuté suites automatizadas. El preview de producción local queda en `http://localhost:3146/`; no se publicó ni conectó un servicio.
- La persistencia de servidor, Auth/RLS, sincronización con otras cuentas/dispositivos y publicación pública siguen pendientes. No migrar los datos locales automáticamente al integrar backend; primero definir e importar el modelo con revisión.
## QA aislado de imágenes y movimiento reducido — 2026-11-21

- La portada ahora usa cinco fotos WebP existentes a través de `next/image`. El conjunto pasó de 12.174.275 bytes en PNG a 662.958 bytes en WebP (94,6 % menos); Next sirve tamaños responsivos.
- `npm run build` con `NEXT_PREVIEW_DIST_DIR=.next-qa-preview` generó 51 rutas y permitió revisar producción sin compartir `.next` con el servidor de desarrollo. La vista aislada queda en `http://localhost:3146/`. Sigue la advertencia existente de Edge Runtime.
- Playwright en producción: 1280 × 720 y 390 × 844, sin overflow horizontal; las cinco imágenes cargaron. Con `prefers-reduced-motion: reduce` a 1280 × 720, los cuatro bloques narrativos quedan visibles para tecnologías de asistencia y el video no tiene fuentes ni solicitudes. Cero errores de consola.
- Revisión manual del título duplicado: el Admin advierte que ya existe “Hacer espacio para la esperanza”, no reemplaza la publicación y mantiene el borrador sin guardar. Quité la clave del contexto aislado y comprobé que quedan las cinco publicaciones iniciales. Sin datos de prueba en el perfil del usuario.
- `npm run lint`, `npm run type-check` y `git diff --check` completaron. No ejecuté una suite automatizada ni publiqué el sitio.

## Estabilidad visual del hero y controles móviles — 2026-11-21

- Las fuentes Bricolage Grotesque y Source Serif 4 del layout público usan `display: optional` para evitar un cambio tardío de métricas durante la carga. En Lighthouse móvil de la portada, CLS bajó de 0,397 a 0; Accesibilidad, Buenas prácticas y navegación por agentes quedaron en 100. SEO marca 66 porque el preview mantiene `noindex,nofollow` intencionalmente.
- Los cuatro indicadores móviles del hero tienen un objetivo táctil de 44 × 44 px con el punto visual preservado mediante `::before`. A 320 × 844 px el documento queda en 320 px sin scroll horizontal; ocultar la etiqueta secundaria en anchos de 22rem o menos conserva el espacio del dock. El foco de teclado se ve con un contorno de 3 px. La consola del preview actualizado no muestra errores ni advertencias.
- `npm run lint`, `npm run type-check`, build Next y `git diff --check` pasan. La build aislada generó 51 rutas y mantiene la advertencia conocida de Edge Runtime. No se ejecutó una suite automatizada ni se publicó el sitio.
- Vista local de este build: `http://localhost:3147/`; la instancia de referencia anterior sigue en `http://localhost:3146/`. Auth, datos de servidor y auditoría integral de rutas siguen pendientes.

## Borrador local de Configuración Admin — 2026-11-21

- `/admin/configuracion` guarda el formulario únicamente al pulsar «Guardar borrador local», bajo `admin-site-settings-draft:v1` en `localStorage`. Al volver a la ruta, los valores guardados se restauran y se limitan a las claves de configuración conocidas; los valores ausentes usan el perfil inicial. Los errores de almacenamiento muestran un aviso, y el estado de guardado se anuncia a tecnologías de asistencia.
- El texto de ayuda y el aviso global del Admin aclaran que Configuración y Blog guardan solo en este navegador; las otras pantallas usan datos de muestra. El borrador no cambia el perfil público, SEO ni backend.
- QA en build de producción aislada: a 390 × 844 px se guardó y restauró un cambio tras recargar; la portada pública no reflejó el borrador. Eliminé la clave y comprobé que el formulario vuelve al perfil inicial. Ancho del documento = 390 px, cero mensajes de consola. Lighthouse móvil en Configuración: Accesibilidad 100, Buenas prácticas 100 y navegación por agentes 100; SEO 63 por el `noindex,nofollow` intencional del panel.
- `npm run lint`, `npm run type-check`, `npm run test:run` (2 archivos, 16 pruebas), build Next de 51 rutas y `git diff --check` pasan. Permanece el aviso conocido de Edge Runtime. No se publicó el sitio.
- Catálogos: el registro de shadcn no tiene colecciones configuradas; Magic UI Animated List usa animación de lista para notificaciones/eventos y no encaja con un guardado; HeroUI Toast v3 se revisó, pero añadiría una segunda base visual. Se conserva el botón y el estado accesible existentes; sin dependencias nuevas.
- Preview actualizado: `http://localhost:3148/`.
## Variante `dark:` alineada con el selector de tema — 2026-11-21

- `ThemeProvider` usa `next-themes` con `attribute="class"` y el sitio activa `.dark` / `.light`. Tailwind v4 conservaba la variante `dark:` por defecto basada en `prefers-color-scheme`, así que el tema elegido y algunos colores de interfaz podían quedar desincronizados. Añadí `@custom-variant dark (&:where(.dark, .dark *));` en `src/styles/globals.css` para que utilidades como `dark:text-emerald-300` sigan la clase que controla la aplicación.
- La etiqueta «Aprobado» de `/admin/tienda/pagos` tenía contraste 2,97:1 en oscuro. Después del ajuste, Lighthouse móvil da Accesibilidad 100, Buenas prácticas 100 y navegación por agentes 100 en pagos en tema oscuro y claro.
- QA móvil a 390 × 844 y `prefers-reduced-motion: reduce`, en ambos temas: `/admin/dashboard`, `/admin/contenido/blog`, `/admin/tienda/pagos`, `/` y `/nosotros`. Las diez combinaciones dan 100 en Accesibilidad, Buenas prácticas y navegación por agentes; cada documento mide 390 px de ancho. Consola sin errores en los recorridos revisados. SEO marca solo el bloqueo `noindex,nofollow` intencional del preview.
- Catálogos: shadcn no tiene registros configurados; Magic UI no devolvió un patrón de etiqueta pertinente; HeroUI Badge v3 documenta insignias asociadas a avatares y remite etiquetas autónomas a Chip, sin ventaja para los chips actuales. Se conserva Tailwind y HTML semántico, sin dependencias nuevas.
- Fuentes: [modo oscuro de Tailwind](https://tailwindcss.com/docs/dark-mode) confirma la variante manual con clase; [WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) establece 4,5:1 para texto normal.
- `npm run lint`, `npm run type-check`, `npm run test:run` (2 archivos, 16 pruebas), build aislado de 51 rutas y `git diff --check` pasan. Preview local actualizado: `http://localhost:3148/`; sin despliegue.
## QA público adicional en ambos temas — 2026-11-21

- Tras sincronizar `dark:` con la clase del tema, Lighthouse móvil revisó `/servicios`, `/eventos`, `/contacto` y `/tienda` a 390 × 844 en oscuro y claro, con movimiento reducido. Las ocho combinaciones dan Accesibilidad, Buenas prácticas y navegación por agentes 100; el ancho del documento coincide con el viewport. La única auditoría fallida es `is-crawlable` por `noindex,nofollow` del preview local.
- Captura manual del Admin Pagos en oscuro: resumen y aviso local se leen correctamente; etiqueta Aprobado usa texto `emerald-300` con contraste validado por Lighthouse. Consola limpia.
## Referencias de diseño y favicon — 2026-11-21

- Ejemplos web consultados: [ChurchTrac: sitios de iglesias](https://www.churchtrac.com/blog/the-best-church-websites), [Meta Church](https://meta.church/) y [DevSac: diseños para iglesias](https://devsac.com/blog/best-church-websites). Aportan patrones de navegación clara, acción de primera visita, horarios/localización accesibles y contenido visible. Se conserva el estilo propio de Esperanza de Vida y su Home editorial.
- Referencias locales de solo lectura: `CODE/Esteban Nicola/src/pages/public/CinematicHomePage.tsx` y `src/styles/cinematic-home.css` para el hero audiovisual y movimiento adaptativo; `CODE/Iglesia Jerusalén/src/features/home/components/HomeVisitQuickAccess.tsx` para horario, dirección y primera visita en una franja compacta. No se copió marca ni composición completa.
- Reemplacé el favicon SVG que aún identificaba a Doménica por una llama verde vectorial titulada «Iglesia Esperanza de Vida». `src/app/layout.tsx` ya apuntaba a `/favicon.svg`.
- Verificación en el preview local de producción `http://localhost:3148/favicon.svg`: HTTP 200, `image/svg+xml`, título SVG correcto en Chrome. Sin despliegue ni conexiones externas.

## Video con ancho de banda limitado y QA Admin — 2026-11-21

- Medición fría en Chrome local, desktop 1440 × 900 y movimiento normal: `/videos/hero-scrub.mp4` se transfirió una sola vez (4,290,398 bytes; cuerpo 4,290,098); ocho posiciones de scroll usaron el Blob local. No hubo nuevas descargas del archivo.
- Experimento simulado en preview 3148: móvil 390 × 844, CPU 4×, Slow 4G. Network Information reportó `effectiveType=4g`, `downlink=1.6 Mb/s`, `rtt=100 ms`, `saveData=false`; el fetch completo tardó 25,112 ms. El poster y contenido se mantuvieron visibles. Es una emulación local, no una medición de red real.
- En `ScrollScrubHero.tsx`, el poster queda estático con movimiento reducido, `saveData`, `slow-2g`/`2g`/`3g` o downlink <= 2 Mb/s. En navegadores sin `navigator.connection` se conserva el scrubbing existente. El umbral responde al tamaño del clip y a la prueba local; no se presenta como estándar universal. La API tiene disponibilidad limitada: [Network Information API](https://wicg.github.io/netinfo/), [NetworkInformation](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation).
- Preview aislado actualizado: `http://localhost:3149/`. Pruebas manuales del comportamiento a 390 × 844: downlink simulado 1,6 / ahorro de datos activo -> poster y cero solicitud MP4; downlink 12 -> `video-ready` y una descarga; API no disponible -> comportamiento actual conservado.
- Lighthouse móvil: 17 nuevas combinaciones en 12 rutas Admin; Galería, Eventos, Sermones, Ministerios, Categorías, Inventario y Pedidos en tema claro; Productos, Usuarios, Roles, Donaciones y Miembros en ambos temas. Las 17 combinaciones dieron Accesibilidad, Buenas prácticas y navegación por agentes 100. En 17 rutas estáticas Admin, `scrollWidth` de documento/cuerpo fue 390 px a viewport 390 px.
- Se mantiene pendiente el recorrido completo de teclado/lector de pantalla/contraste, rutas dinámicas, validación de red real, procedencia y permiso del clip, además de autenticación, datos conectados y autorización de publicación. `npm run lint`, `npm run type-check`, build aislado de 51 rutas y `git diff --check` pasaron; Next dejó una advertencia conocida de Edge Runtime.

## QA de Admin dinámico — 2026-11-21

- Lighthouse móvil a 390 × 844, movimiento reducido, claro/oscuro: `/admin`, `/admin/contenido/blog/nuevo`, `/admin/tienda/pedidos/1` y `/admin/tienda/productos/1` dieron 100 en Accesibilidad, Buenas prácticas y navegación por agentes. SEO conserva `noindex` intencional; las páginas dinámicas también carecen de descripción SEO, irrelevante para esta vista privada.
- Las cuatro rutas mantuvieron documento/cuerpo a 390 px sin overflow. `/admin` ya está en el barrido de 17 rutas estáticas; se añaden tres rutas de detalle. Total ancho verificado en 20 paths Admin: 17 estáticos y 3 dinámicos.
- Cobertura acumulada documentada: 46 combinaciones móviles en 26 rutas; cuenta las 44 revisiones descritas arriba más dos auditorías repetidas en el build actualizado para el editor de blog y el editor de producto. No equivale a QA integral de teclado, lector de pantalla o todas las rutas públicas.

## Foco de teclado en selectores de archivo — 2026-11-21

- Los inputs de archivo visualmente ocultos tenían tab stops propios aunque ya hubiera un botón visible para abrir el selector. Añadí `tabIndex={-1}` a esos inputs en Galería, Blog y Producto (imágenes y archivo digital); los botones visibles conservan el foco de teclado.
- Verificación en el build aislado `http://localhost:3150/`: los inputs de Galería, Blog nuevo y Producto tienen `tabIndex=-1`. En Producto, la secuencia manual pasa del campo de costo directamente al botón visible de carga, con foco visible, y omite el input oculto. Es una corrección puntual, no una auditoría integral de teclado.
- Lighthouse móvil actualizado en Blog nuevo y Producto, 390 × 844, tema oscuro y movimiento reducido: Accesibilidad 100, Buenas prácticas 100 y navegación por agentes 100. SEO sigue reportando `noindex` local y ausencia de descripción en páginas Admin privadas.
- `npm run lint`, `npm run type-check`, build aislado de 51 rutas y `git diff --check` pasaron tras el cambio. El preview vigente es `http://localhost:3150/`.

## Responsive estrecho y flujos de teclado públicos — 2026-11-21

- En preview local actualizado a 320 × 740, tema claro y movimiento reducido, revisé 46 rutas concretas del manifest de prerender y añadí tres detalles dinámicos Admin: 49 URL en total. Todas conservaron `documentElement.scrollWidth` y `body.scrollWidth` en 320 px, además de título y H1 presentes.
- En la Home recorrí con Tab hasta que el foco volvió al enlace inicial. Los controles y enlaces observados mostraron foco visible. Teclado: el diálogo de notificaciones, el carrito y el menú móvil se abrieron y cerraron con Escape devolviendo el foco al disparador; el visor de Galería cambió al segundo elemento con ArrowRight y Escape devolvió el foco a la tarjeta de origen.
- En Dashboard Admin a 320 px, el primer Tab enfoca «Ir al contenido principal»; el siguiente llega a «Abrir navegación administrativa». El menú abre con Enter, Escape lo cierra y el foco vuelve al disparador; no hay overflow horizontal.
- El recorrido es una muestra amplia de flujos comunes; no prueba todas las secuencias en cada ruta ni sustituye la revisión con lector de pantalla o contraste manual. El catálogo público, las páginas interiores y Admin conservan sus límites de prototipo documentados.
- Fuente de evidencia: Chrome DevTools, preview de producción local `http://localhost:3150/`, 2026-11-21.

## Roles de muestra alineados — 2026-11-21

- `src/config/admin-roles.ts` centraliza los seis IDs de `user_role_enum`. Las pantallas `/admin/usuarios` y `/admin/roles` comparten IDs y etiquetas; los roles de muestra ahora son `super_admin`, `admin`, `editor`, `moderator`, `member` y `visitor`. Se retiraron las opciones `Líder de ministerio` y `Finanzas` porque no existen en el enum ni en el seed actuales.
- La matriz local contempla peticiones de oración, mensajes de contacto, perfil propio y pedidos propios. Añadí `visitor` al seed para completar el vocabulario compartido. La matriz no guarda cambios ni protege rutas; sigue siendo una vista de demostración.
- `npm run type-check`, ESLint focalizado y build de producción aislado pasaron; Next generó 51 rutas. El build detectó que los defaults `accentTheme` y `cueLabel` no quedaban disponibles durante el prerender de la Home; los hice explícitos en la instancia de `ScrollScrubHero`. El preview actualizado está en `http://localhost:3151/`.
- No conecté ni apliqué la migración. Sigue pendiente escoger entre `profiles.role` y `roles`/`user_roles`, dar acceso seguro a las tablas, validar políticas en PostgreSQL y probar cada ruta con Auth real. La migración local carece de grants de Data API en varias tablas; desde el 30 oct 2026 Supabase requiere grants explícitos para tablas nuevas del esquema `public` ([cambio oficial de Supabase](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)).
- Para este ajuste consulté shadcn (sin registros configurados), Magic UI (sin resultados pertinentes) y la lista de HeroUI v3. No añadí una biblioteca: las tarjetas, casillas HTML y estilos existentes resuelven el cambio sin nuevas dependencias.

## Tienda: vista rápida y referencias visuales — 2026-11-21

- Cambié la vista rápida a Radix Dialog, ya presente en las dependencias; `Title`/`Description`, cierre con Escape, foco inicial y devolución del foco al botón disparador se verificaron en Chrome. La apariencia Tailwind existente se conserva y no se añadieron paquetes. Referencias oficiales: [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) y [repositorio/licencia MIT](https://github.com/radix-ui/primitives).
- En móvil, la imagen de la vista rápida usa proporción 4:3 y en escritorio sigue cuadrada. El modal ahora avisa que precios, existencias y ficha son datos de muestra; la cifra de inventario también se etiqueta como muestra. Retiré notas ficticias sobre aportes de cada producto. El aviso general del catálogo continúa indicando que no hay pedidos ni pagos.
- QA del build aislado `http://localhost:3153/tienda`: 390 × 844 y 320 × 740 px sin overflow horizontal; en el modal, Escape devolvió el foco a «Vista rápida». A 1440 × 1000 px el documento coincide con el viewport; sin errores de consola. ESLint focalizado, `npm run type-check` y build Next de 64 rutas completaron. No ejecuté suites de pruebas.
- Referencias visuales locales, solo lectura: los previews de `dist` en `http://127.0.0.1:4177/` (Esteban Nicola) y `http://127.0.0.1:4178/` (Iglesia Jerusalén), revisados a 1440 × 1000; también inspeccioné `CinematicHomePage.tsx`/`cinematic-home.css` y `HomeVisitQuickAccess.tsx`. Se aprovechan como criterio la jerarquía de hero, la acción principal clara y el acceso temprano a horarios/ubicación, manteniendo identidad y contenido propios de Esperanza de Vida. Los previews provienen de builds locales existentes; no certifican el estado público actual de esos dominios.
- Referencias externas consultadas: [REACHRIGHT: sitios de iglesias 2026](https://reachrightstudios.com/blog/best-church-websites/?trk=article-ssr-frontend-pulse_little-text-block) para recorridos de visita, móvil, velocidad y fotografía local; [The Church Shop](https://thechurch.shop/) y su [tienda real de WoodsEdge](https://thechurch.shop/shop/woodsedge/) para organización por categorías y declaración visible del destino de fondos. Son patrones comparativos, no contenido comercial confirmado para esta iglesia.

## Roles de muestra: claridad visual y revisión del esquema — 2026-11-21

- `/admin/roles` ahora organiza la matriz en cuatro áreas, muestra el número de módulos/acciones habilitados para el rol activo y para cada tarjeta, y aclara que las casillas son temporales y no guardan ni asignan permisos. Quité el botón que decía «Aplicar en esta vista» porque no persistía ni realizaba ninguna operación. El aviso final ahora identifica la duplicidad del modelo de roles local.
- Revisión estática de `supabase/migrations/20261119000001_initial_schema.sql`: las políticas consultan `profiles.role`; las tablas `roles` y `user_roles` están creadas pero no tienen políticas ni uso en el cliente. `private.is_admin_or_editor()` incluye `editor`, y ese helper también se usa para pedidos, donaciones, peticiones de oración, contacto, configuración y gestión completa de productos. Si un usuario editor recibiera acceso a estas políticas, la autorización sería más amplia que la matriz visual de «Editor de contenido».
- La migración no declara grants Data API para varias tablas públicas. El acceso efectivo depende también de los grants/configuración del proyecto; no inferí el estado de ningún proyecto remoto ni apliqué SQL. Supabase documenta que grants y RLS son controles distintos y recomienda conceder solo lo necesario, habilitar RLS y probar cada operación. La documentación está actualizada al 19 nov 2026; el cambio de exposición automática alcanzó proyectos existentes el 30 oct 2026 ([seguridad de Data API](https://supabase.com/docs/guides/api/securing-your-api), [guía RLS y pruebas](https://supabase.com/docs/guides/database/postgres/row-level-security), [cambio de grants](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)).
- No se modificó la migración: en este entorno no hay PostgreSQL/Supabase local para validar políticas con la matriz de usuarios. La fuente de roles, grants, políticas por módulo y pruebas de rutas con Auth real siguen pendientes. No se conectó ni cambió un proyecto Supabase externo.
- Catálogos consultados para la pantalla: shadcn respondió sin registros configurados; Magic UI solo encontró Glyph Matrix, que no aporta a una matriz administrativa; HeroUI v3 documenta una tabla desplazable y controles, pero sumaría otra base de componentes. Base UI Checkbox y Radix Checkbox se revisaron como alternativas accesibles; se conservaron los controles nativos y tabla HTML existentes porque ya permiten edición con teclado y etiquetas semánticas sin dependencia nueva. Versiones/licencias vigentes verificadas en [HeroUI v3, MIT](https://github.com/heroui-inc/heroui), [Radix Checkbox 1.3.12](https://www.radix-ui.com/primitives/docs/components/checkbox) y [Radix Primitives, MIT](https://github.com/radix-ui/primitives).
- El refuerzo accesible de la matriz de permisos (etiquetas explícitas y áreas táctiles de 44 px) pasó `npm run build` para exportación de GitHub Pages el 2026-11-21: compilación, lint, tipos y 64 rutas estáticas. No ejecuté suites de pruebas. El cambio de esquema permanece sin implementar y sin aplicar.

## QA de rutas públicas en producción — 2026-11-22

- Revisé las 28 rutas públicas del sitemap en producción a 320 × 740 y 1440 × 1000. Todas cargaron con título y un solo H1; `documentElement` y `body` mantuvieron el ancho del viewport, sin errores de red ni imágenes rotas.
- En el barrido a 320 px no encontré imágenes sin `alt`, botones o enlaces sin nombre accesible, campos sin etiqueta/nombre accesible ni enlaces vacíos `href="#"`.
- El análisis estructural de 30 HTML públicos exportados encontró 1.158 enlaces internos: cero destinos faltantes y cero URLs internas sin el prefijo `/home` requerido por Pages.
- En Home móvil recorrí con teclado el enlace de salto, notificaciones, selector de tema, carrito y menú «Más». Los diálogos y la hoja cerraron con Escape y devolvieron el foco; al elegir «Nosotros», la ruta cambió a `/home/nosotros/` y el foco pasó a `main#main-content`.
- `/contacto`, `/oracion` y `/donaciones` tienen cero formularios y cero botones de envío. Contacto ofrece enlaces directos `mailto:hola@esperanzadevida.ec` y `tel:+593984472651`; no hay captura de solicitudes en las otras dos rutas.
- Alcance: barrido estructural y muestra de interacciones en la web publicada. No equivale a cumplimiento WCAG, auditoría completa de contraste, prueba con lector de pantalla ni recorrido exhaustivo de teclado.

## QA focalizado de formularios Admin — 2026-11-21

- `/admin/miembros` calcula la fecha inicial con el calendario local. En `America/Guayaquil`, el campo mostró `2026-11-21`, mientras UTC ya era `2026-11-22`; se evitó así el desfase de un día en el nuevo perfil de muestra.
- Añadí `id` y `name` a 10 controles de muestra en el editor de blog (6), Galería (1), Donaciones (2) y Usuarios (1). Los inputs de archivo siguen fuera del orden de tabulación y se accionan desde sus botones visibles; no agregué dependencias.
- En el build estático recién generado, recorrí esas cuatro rutas y Miembros a 320 × 740, con movimiento reducido: todas tuvieron un H1, ancho de documento/cuerpo de 320 px, ningún campo sin `id` ni `name`, y cero mensajes de consola. El diálogo de Miembros mostró la fecha local correcta.
- `npm run lint`, `npm run type-check` y `npm run build` para GitHub Pages pasaron; Next generó 64 rutas estáticas. No ejecuté suites de pruebas. El resto de la revisión de Admin, teclado, contraste, lector de pantalla y flujos reales sigue pendiente; los datos y acciones de estas pantallas son de muestra.

## Diálogos Admin: foco al cerrar y formularios dinámicos — 2026-11-21

- Al abrir los diálogos publicados de Usuarios y Ministerios aparecieron siete controles sin `id` ni `name`; Escape también dejaba el foco en `body` en vez de devolverlo al control que abrió la ventana.
- Añadí identificadores a los 7 campos de creación, desactivé el autocompletado en estos formularios de muestra y centralicé el retorno de foco en `src/lib/admin-dialog-focus.ts`. Lo apliqué a Usuarios, Ministerios, altas/edición y perfil de Miembros, y a la vista previa de Galería; allí reemplaza el `setTimeout` de foco por `onCloseAutoFocus` de Radix.
- La revisión se hizo con el build estático aislado a 320 × 740 y movimiento reducido: probé siete estados (crear usuario, crear/editar ministerio, crear/editar miembro, perfil y vista previa). En todos, Escape devolvió el foco al botón de origen; los formularios mostraron 0 campos sin `id` y `name`, el documento no excedió 320 px y no hubo mensajes de consola. Enter abrió los diálogos de usuario y ministerios con foco dentro del modal.
- La interacción de alta expuso un patrón de correo con escapes duplicados en JSX, que rechazaba los correos reservados `.invalid`. Corregí el patrón y repetí los envíos: `qa.dialogo@example.invalid` pasó en Usuarios; `carlos.morales@example.invalid` pasó al editar el miembro de muestra. También guardé cambios en Ministerios y Miembros mientras el registro salía del filtro: ambos diálogos cerraron y el foco volvió a sus campos de búsqueda. La consola mostró una advertencia de CSS precargado al cambiar rutas locales, sin errores ni impacto en los flujos.
- `npm run lint`, `npm run type-check` y `npm run build` pasaron; Next generó 64 rutas. El patrón elegido conserva `@radix-ui/react-dialog` 1.3.1 (MIT) ya instalado y los campos nativos. El MCP de shadcn no tiene registros configurados; consulté su documentación oficial de [Dialog](https://ui.shadcn.com/docs/components/dialog) y [formularios](https://ui.shadcn.com/docs/forms), además de la [referencia Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Consideré [Base UI Dialog](https://base-ui.com/react/components/dialog), que permite configurar `finalFocus`; mantuve Radix porque ya está en el proyecto y ofrece el evento `onCloseAutoFocus` requerido, sin añadir una segunda primitiva. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input) documenta el rol de `name` en la colección del formulario y el uso de `id` para asociar una etiqueta. Los catálogos de animación no aportan a este estado de foco. No se añadió dependencia. No ejecuté suites de pruebas.
- Este cambio mejora la navegación del prototipo local; las pantallas Admin aún no tienen autenticación ni persistencia de servidor. La revisión completa de teclado, contraste y lector de pantalla sigue pendiente.
