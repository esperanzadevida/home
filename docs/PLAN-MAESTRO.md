# Plan maestro operativo — Doménica, Asambleas de Dios

**Actualizado:** 2026-11-20

**Estado:** páginas interiores y Home rediseñadas localmente; se corrigieron el carrito y varios controles de accesibilidad. Quedan pendientes imágenes aprobadas, revisión integral y funciones que dependen de servicios. La producción del video y las integraciones externas siguen aplazadas.
**Alcance de esta etapa:** trabajo local. Sin conexión a Supabase, GitHub o Vercel.

## Fuentes y decisiones confirmadas

- La ficha de Obsidian `03 Proyectos/22 Doménica Iglesia AoG/Doménica Iglesia AoG.md` define el proyecto como un sitio para una congregación de Asambleas de Dios y registra Next.js App Router, TypeScript, Tailwind CSS, Supabase, Vercel y GitHub como tecnologías previstas.
- `docs/prompts/PROMPTS-POR-FASES.md` contiene los 15 prompts originales por fases. Este archivo es el plan maestro separado: conserva esos prompts como referencia y ordena la ejecución según dependencias, alcance y evidencia.
- Nicola aplazó inicialmente la Home junto con el video. Después pidió abrir la página y continuar mejorando su apariencia, por lo que se rehízo localmente con una imagen estática; el video de fondo sigue reservado para después.
- Las credenciales de Supabase, GitHub y Vercel se recibirán después de completar las páginas. No se conectarán esos servicios antes.
- Nicola autorizó crear una identidad, historia, horarios, contacto, redes y copy editoriales inventados para el proyecto, con presentación normal en el sitio y sin una etiqueta pública que los describa como ficticios. La fuente canónica del copy y el perfil está en `src/config/church-profile.ts` y `src/config/public-pages.ts`; son decisiones de ambientación creativa del proyecto, no datos verificados de una congregación real.
- Los datos de contacto y redes son texto de presentación. No se conectaron formularios, mapas, compra, aportes, reproductores ni transmisiones; no hay envíos o pagos funcionales.
- El monograma D y el favicon de esta etapa son provisionales. Las imágenes locales siguen en revisión de origen y permiso.

## Estado observado del proyecto

- El workspace tiene un esqueleto Next.js 15 / React 19 / TypeScript / Tailwind 4 y algunas dependencias UI.
- La Home usa `churchProfile`, `sermonDetails`, `eventDetails` y `publicPageBlueprints` para bienvenida, horarios, mensaje reciente, agenda, ministerios y visita. La imagen hero local es conceptual y su procedencia/licencia no está verificada. Autenticación y flujos de contenido no están implementados.
- Al comenzar la revisión no había `components.json`, lockfile, `node_modules` ni repositorio Git. Ahora hay `package-lock.json`, dependencias instaladas y un repositorio local `main` con commits; `git remote -v` está vacío, así que todavía no existe remoto GitHub conectado.
- Hay un conjunto de imágenes y vectores en `docs/assets/` y `public/images/`. La guía visual los llama oficiales/descargados, pero no registra enlaces ni licencias. El SVG del logo es un dibujo vectorial local y el JPG premium es ilustrativo; su origen institucional no está verificado. Mantenerlos como referencia, no como identidad aprobada.
- El informe denominacional mezcla fuentes oficiales y secundarias. Verificar cada dato histórico/doctrinal con una fuente primaria antes de usarlo en copy público.
- La nota de Obsidian marca de forma contradictoria los 15 prompts como completados y pendientes. El archivo sí existe; el estado de ejecución de cada fase requiere actualizarse con evidencia.
- Existe una migración SQL y un seed locales, pero no se han aplicado ni validado contra PostgreSQL/Supabase. La auditoría estática detectó y corrigió localmente la asignación de privilegios desde `user_metadata`, el acceso público a perfiles y configuración sensible, y las inserciones abiertas. El seed se alineó con Doménica/Ambato y se retiraron cuentas/identificadores financieros y peticiones personales inventados. Siguen pendientes la validación en una base, la normalización del modelo de roles y reconciliar el catálogo sembrado con el contenido público antes de conectar servicios.

## Secuencia de trabajo

| Etapa | Entregable | Estado / condición de salida |
|---|---|---|
| 0. Reconocimiento | Comparar Obsidian, prompts, código y dependencias. Separar decisiones de propuestas. | Completada en esta revisión. |
| 1. Base del sitio | Stack, tokens, metadatos, configuración de Next, navegación responsive y perfil editorial. | Parcial: perfil y metadatos por página, Open Graph/Twitter y canonical condicional están implementados. El sitio usa `NEXT_PUBLIC_SITE_URL` o el dominio estable de producción de Vercel; falta configurar el dominio definitivo. |
| 2. Componentes UI base | Controles pertinentes, tema, búsqueda, estados vacíos y navegación. | Parcial: Button y tema existen; se agregan controles nativos de búsqueda/filtro para las listas que los necesitan. No hay catálogo de componentes shadcn configurado. |
| 3. Layout y navegación | Layout público, auth/admin y protección de rutas. | Parcial: layouts y navegación existen; no hay autenticación ni middleware de protección implementados. |
| 4. Modelo y seguridad | Reducir esquema, definir permisos, migraciones, RLS y clientes Supabase. | La corrección estática de privilegios, perfiles, configuración pública e inserciones se incorporó a la migración local. Pendientes: validar SQL/RLS con Supabase, confirmar que `private` no esté expuesto por el Data API, reducir roles duplicados y reconciliar productos/ministerios. No conectar ni aplicar SQL hasta cerrar estos puntos. |
| 5. Home y video | Recorrido, storyboard, copy, poster/video y mapa de secciones. | Parcial: Home estática rediseñada, conectada al contenido editorial central y revisada en móvil/escritorio. Video y storyboard siguen aplazados; el origen/licencia de la imagen local debe aprobarse antes de publicar. |
| 6. Páginas públicas interiores | Requisitos de contenido e interacciones por ruta, más detalles editoriales. | Parcial: 12 secciones y 15 fichas de detalle están implementadas. Búsqueda, filtros, calendario, divulgaciones y carrito local se comprobaron en navegador en el alcance descrito abajo. Formularios, mapa, medios, registro, pago y transmisión no tienen destino real conectado. |
| 7. Autenticación | Supabase Auth, recuperación, sesión y middleware de protección. | Pendiente de modelo y credenciales. El login existente es UI de prototipo, no una sesión real. |
| 8. Admin de contenido | Dashboard, CMS para blog/sermones/eventos/galería. | Pendiente de modelo, permisos y credenciales. Las vistas actuales no son CMS conectado. |
| 9. Admin de tienda | Productos, categorías, inventario, pedidos y pagos. | Pendiente de backend y operación comercial confirmada. |
| 10. Miembros y administración | Miembros, ministerios, donaciones, roles y configuración. | Pendiente de backend, permisos y procesos aprobados. |
| 11. Temas | Revisar color, contraste y modo claro/oscuro. | Base claro/oscuro y toggle presentes; el salto al contenido ahora conserva un indicador visible. Falta el recorrido completo de contraste, teclado y lector de pantalla en páginas y Home. |
| 12. Herramientas avanzadas | Mapas, editores, calendario, time picker e imágenes. | Parcial: calendario público local listo; mapas, editores y uploads esperan ubicación, activos y backend. |
| 13. API y servidor | API de auth, contenido, registros, tienda, donaciones, miembros y uploads. | Pendiente de modelo, permisos y credenciales; no hay endpoints de servicio implementados. |
| 14. Calidad | SEO, accesibilidad, responsive, rendimiento y pruebas. | Parcial: metadatos sociales/canónicos, imagen OG generada, sitemap, robots, JSON-LD en fichas, rutas 404/error/loading, etiquetas accesibles y `next/image` en tarjetas públicas y Home implementados. Este avance verificó diálogo y teclado del carrito, enlaces de contacto, foco del salto y 390 px sin desbordamiento. Local y preview quedan no indexables; el sitemap de producción incluye `/` y `/galeria`. Contraste completo, teclado/lector, imágenes aprobadas y revisión integral siguen pendientes. |
| 15. Publicación | Repositorio, CI/CD, Supabase, Vercel y verificación de producción. | Repositorio Git local `main`, sin remoto ni despliegue. Se requiere dominio/credenciales después de cerrar las páginas y revisar modelo y permisos. |

## Orden ajustado de los 15 prompts

Los prompts originales están organizados por tema, pero su orden literal adelanta Home e integraciones antes de cerrar las páginas y definir la seguridad. Se ejecutarán así:

1. **Prompts 1–3 (base y layout):** completar solo las piezas locales necesarias para las pantallas en alcance; no instalar un catálogo completo por adelantado.
2. **Prompt 6 (páginas públicas):** cerrar contenido y controles que funcionan localmente, con estados honestos para datos/servicios aún no conectados.
3. **Prompt 14 (calidad por etapas):** completar ahora el cierre local de calidad: SEO configurable, accesibilidad base, imágenes, estados de ruta y verificación de páginas interiores.
4. **Prompt 5 (Home y video):** la Home estática ya se abrió después de la solicitud de continuar su apariencia; el video y storyboard quedan para una fase posterior. Mantener el perfil común y los enlaces a rutas estabilizadas.
5. **Prompt 4 (modelo Supabase):** auditar y simplificar el esquema/seed después de cerrar las páginas; conectar cuando Nicola proporcione credenciales.
6. **Prompts 7–13 (auth, administración, integraciones y API):** desarrollar sobre el modelo y los permisos revisados; credenciales y operación real se agregan después. No presentar formularios, compras, aportes, cargas, chat o transmisión como funcionales antes de conectarlos.
7. **Prompt 15 (publicación):** conectar GitHub/Vercel/Supabase después de recibir credenciales y cerrar páginas e integraciones acordadas.

La paleta institucional de `COLOR-SYSTEM.md` y la guía de componentes son propuestas iniciales. Se conservan como tokens editables para esta ambientación; el monograma, el logo y las fotografías no están aprobados como identidad oficial. Los prototipos actuales no fijan el diseño final.

## Activos y herramientas revisados

- El catálogo Magic UI no devolvió un patrón de navegación móvil pertinente. shadcn MCP respondió sin registros configurados para este proyecto; no se creó `components.json` solo para buscar.
- Se revisaron las guías oficiales de Base UI y Radix para menús de navegación. 21st.dev ofrece variantes con animación y dependencias adicionales, pero la navegación del proyecto es una lista simple de enlaces. Se eligió HTML nativo (`nav` y `details/summary`) y no se añadió otra biblioteca.
- La Home reutiliza una imagen local conceptual como fondo estático. No se generó ni integró un video; procedencia y licencia de las imágenes continúan pendientes.
- Se corrigió la configuración PostCSS de Tailwind 4. El build había pasado sin la configuración, pero el preview cargaba solo el reset y no aplicaba utilidades. `postcss.config.mjs` activa `@tailwindcss/postcss` y ahora las clases se generan.
- Se eligieron controles HTML nativos para listas/calendario: el registro de Magic UI no ofreció un filtro pertinente, shadcn no tiene registros configurados y las opciones revisadas de HeroUI eran un sistema adicional innecesario para estas interacciones.
- Para el diálogo del carrito se consultó la documentación oficial HeroUI Drawer v3.2.7. shadcn informó que el proyecto no tiene registros configurados; la búsqueda de Magic UI devolvió un diálogo de video, no un panel de compra. Se conservó React/Tailwind propio para mantener el sistema visual y evitar una dependencia adicional.
- La capa SEO local obtiene el dominio de `NEXT_PUBLIC_SITE_URL` o `VERCEL_PROJECT_PRODUCTION_URL`; el sitio solo publica sitemap en builds de producción y bloquea la indexación en local/preview. No se fijó un dominio provisional. El sitemap lista `/`, páginas interiores y detalles disponibles. `robots.txt` no protege el Admin.
- Se añadieron Open Graph/Twitter, URLs canónicas cuando hay origen configurado, imagen social generada en `/og`, JSON-LD para iglesia/eventos/artículos/productos y metadata indexable condicional para la Home; admin/login y los entornos local/preview permanecen sin indexación. Los productos no anuncian compra en JSON-LD mientras no exista checkout.
- Se añadieron estados de 404, error y carga; se asociaron las etiquetas del login a sus campos. El enlace de recuperación conduce a contacto mientras no exista `/recuperar` ni auth real; el formulario no simula una sesión.
- Las tarjetas públicas de sermones, eventos y productos, y el carrito usan `next/image` con tamaños responsivos. La optimización no aprueba ni verifica el origen/licencia de los assets.
- El seed SQL se alineó con `src/config/church-profile.ts` y se retiraron cuentas bancarias, RUC y peticiones personales inventadas. La migración reforzó localmente RLS, acceso a perfiles y settings, y funciones privilegiadas; las peticiones de oración quedan solo para administradores. No aplicar todavía: validar con Supabase, decidir una sola fuente de roles y reconciliar el catálogo de productos/ministerios. La revisión continúa estática, sin conexión ni query a una base.
- El índice doctrinal usa títulos y paráfrasis propias basadas en la declaración en español de Assemblies of God (EE. UU.). La página enlaza y atribuye la fuente; no se presenta como confirmación de una redacción oficial de la organización ecuatoriana.

## Estructura pública prevista

- `/` — portada con imagen estática, bienvenida, horarios, comunidad, sermón, eventos, ministerios y visita; el video se mantiene en la fase futura. Recorrido y criterios en `docs/ESTRUCTURA-HOME-Y-VIDEO.md`.
- `/nosotros` — historia, misión, visión y vida de comunidad.
- `/servicios` — horarios, ubicación y primera visita.
- `/sermones` y `/sermones/[slug]` — archivo y detalle editorial de seis mensajes; no hay reproductor.
- `/eventos` y `/eventos/[slug]` — agenda y detalle de tres actividades; no hay inscripción.
- `/ministerios` — ministerios y formas de participar.
- `/blog` y `/blog/[slug]` — índice y tres artículos editoriales.
- `/tienda` y `/tienda/[slug]` — catálogo y fichas informativas; compra y pago requieren una operación comercial conectada.
- `/galeria` — secciones gráficas editoriales; no se usan las fotografías locales sin revisar su origen y permisos.
- `/contacto` — información editorial de contacto; el formulario espera un destino de envío.
- `/donaciones` — información editorial; no hay cuentas, botones de aporte ni pago configurados.
- `/oracion` — información de acompañamiento; no recoge solicitudes ni datos sensibles.
- `/en-vivo` — sección editorial sin reproductor, emisión o chat conectados.

## Cobertura actual de fase 6

| Ruta | Implementado localmente | Falta del prompt o depende de integración/datos |
|---|---|---|
| `/nosotros` | Historia, misión/visión/valores, equipo, cronología y 16 resúmenes con referencias bíblicas y atribución. | Galería fotográfica con activos y permiso confirmados. |
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
| `/galeria` | Tres tarjetas editoriales sin fotos institucionales. | Álbumes, imágenes autorizadas, masonry y lightbox. |
| `/contacto` | Dirección/texto de contacto y FAQ. | Destinos confirmados, formulario de envío y mapa. |
| `/donaciones` | Información editorial. | Montos/destino confirmados, pago e historial con cuenta real. |
| `/oracion` | Información de acompañamiento. | Envío/muro: requiere backend, controles de privacidad y consentimiento. |
| `/en-vivo` | Página editorial que no afirma tener emisión activa. | Fuente real, reproductor, agenda/countdown y chat moderado. |

## Revisión inicial de rutas (base antes de ampliar los sermones) — 2026-11-19

- `npm run build` completó la compilación de producción y generó 35 páginas estáticas contando el resto de las rutas de la aplicación.
- Las 12 rutas públicas interiores y sus 12 detalles respondieron HTTP 200, con título y H1. Esto verifica su renderizado base, no que todos los requisitos de los 15 prompts estén completos. La revisión confirmó que estas páginas no incluyen formularios ni reproductores embebidos.
- La navegación móvil muestra todas las secciones y no desborda a 390 px; el menú “Más” funciona en escritorio; el cambio de tema claro/oscuro funciona; el CTA del encabezado es un único enlace interactivo; la consola del navegador no reportó errores.
- `/en-vivo` conserva su ruta editorial, pero ahora anuncia futuras transmisiones en vez de afirmar que hay emisiones activas; los mensajes enlazan a sus detalles.
- En la revisión inicial, Home todavía mostraba el prototipo anterior, con datos distintos y bloques simulados. La solicitud posterior de continuar la apariencia abrió esa parte: ahora consume el perfil editorial y las colecciones centrales; el video permanece aplazado.

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
- La imagen de fondo local se presenta como conceptual hasta confirmar procedencia y permiso. El video y el storyboard siguen aplazados.
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
