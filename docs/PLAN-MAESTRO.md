# Plan maestro operativo — Doménica, Asambleas de Dios

**Actualizado:** 2026-11-19  
**Estado:** páginas interiores ampliadas y comprobadas localmente; quedan pendientes activos aprobados, revisión manual completa y funciones que dependen de servicios. Home/video e integraciones externas aplazados.  
**Alcance de esta etapa:** trabajo local. Sin conexión a Supabase, GitHub o Vercel.

## Fuentes y decisiones confirmadas

- La ficha de Obsidian `03 Proyectos/22 Doménica Iglesia AoG/Doménica Iglesia AoG.md` define el proyecto como un sitio para una congregación de Asambleas de Dios y registra Next.js App Router, TypeScript, Tailwind CSS, Supabase, Vercel y GitHub como tecnologías previstas.
- `docs/prompts/PROMPTS-POR-FASES.md` contiene 15 prompts y es el único plan de ejecución encontrado. No se encontró un documento separado llamado “plan maestro”. Esta guía ordena el trabajo y conserva los prompts como referencia, no como una secuencia que deba ejecutarse sin revisar dependencias.
- La página de inicio y el video de fondo quedan aplazados para una fase posterior, por indicación de Nicola. Ahora se preparan rutas, navegación y estructura para que la futura Home pueda integrarse sin rehacer el sitio.
- Las credenciales de Supabase, GitHub y Vercel se recibirán después de completar las páginas. No se conectarán esos servicios antes.
- Nicola autorizó crear una identidad, historia, horarios, contacto, redes y copy editoriales inventados para el proyecto, con presentación normal en el sitio y sin una etiqueta pública que los describa como ficticios. La fuente canónica del copy y el perfil está en `src/config/church-profile.ts` y `src/config/public-pages.ts`; son decisiones de ambientación creativa del proyecto, no datos verificados de una congregación real.
- Los datos de contacto y redes son texto de presentación. No se conectaron formularios, mapas, compra, aportes, reproductores ni transmisiones; no hay envíos o pagos funcionales.
- El monograma D y el favicon de esta etapa son provisionales. Las imágenes locales siguen en revisión de origen y permiso.

## Estado observado del proyecto

- El workspace tiene un esqueleto Next.js 15 / React 19 / TypeScript / Tailwind 4 y algunas dependencias UI.
- Existen una Home de prototipo, layouts público/auth/admin, login y dashboard. Las doce secciones interiores tienen copy editorial, metadatos, navegación y una plantilla visual común; existen quince fichas de detalle (seis sermones, tres eventos, tres artículos y tres recursos). Se añadieron controles locales de búsqueda/filtros, ordenamiento, calendario/lista de eventos, preguntas frecuentes, cronología/equipo y el índice doctrinal. Autenticación y flujos de contenido no están implementados.
- La Home conserva su prototipo anterior y requiere revisión completa después de cerrar las páginas interiores. Su horario actual (09:00 y 11:30 el domingo, 19:30 el miércoles y viernes) se toma como referencia de consistencia hasta trabajar esa página.
- No había `components.json`, lockfile, `node_modules` ni repositorio Git al comenzar la revisión. La instalación local creó `package-lock.json` y `node_modules`; el workspace sigue sin repositorio Git ni historial local.
- Hay un conjunto de imágenes y vectores en `docs/assets/` y `public/images/`. La guía visual los llama oficiales/descargados, pero no registra enlaces ni licencias. El SVG del logo es un dibujo vectorial local y el JPG premium es ilustrativo; su origen institucional no está verificado. Mantenerlos como referencia, no como identidad aprobada.
- El informe denominacional mezcla fuentes oficiales y secundarias. Verificar cada dato histórico/doctrinal con una fuente primaria antes de usarlo en copy público.
- La nota de Obsidian marca de forma contradictoria los 15 prompts como completados y pendientes. El archivo sí existe; el estado de ejecución de cada fase requiere actualizarse con evidencia.
- El esquema de datos es un borrador amplio. Antes de aplicarlo hay que resolver el modelo duplicado de roles/pedidos, concretar permisos RLS y validar qué módulos necesita la iglesia.

## Secuencia de trabajo

| Etapa | Entregable | Estado / condición de salida |
|---|---|---|
| 0. Reconocimiento | Comparar Obsidian, prompts, código y dependencias. Separar decisiones de propuestas. | Completada en esta revisión. |
| 1. Base del sitio | Stack, tokens, metadatos, configuración de Next, navegación responsive y perfil editorial. | Parcial: stack, estilos y perfil existen; faltan cierres de configuración y validar la consistencia de datos con la Home aplazada. |
| 2. Componentes UI base | Controles pertinentes, tema, búsqueda, estados vacíos y navegación. | Parcial: Button y tema existen; se agregan controles nativos de búsqueda/filtro para las listas que los necesitan. No hay catálogo de componentes shadcn configurado. |
| 3. Layout y navegación | Layout público, auth/admin y protección de rutas. | Parcial: layouts y navegación existen; no hay autenticación ni middleware de protección implementados. |
| 4. Modelo y seguridad | Reducir esquema, definir permisos, migraciones, RLS y clientes Supabase. | Pendiente de cerrar páginas y recibir credenciales; el esquema actual es solo un borrador. |
| 5. Home y video | Recorrido, storyboard, copy, poster/video y mapa de secciones. | Aplazada expresamente por Nicola para una etapa posterior. La Home de prototipo no se está editando. |
| 6. Páginas públicas interiores | Requisitos de contenido e interacciones por ruta, más detalles editoriales. | Parcial: 12 secciones y 15 fichas de detalle están implementadas. Búsqueda, filtros, calendario, divulgaciones y carrito local se comprobaron en navegador en el alcance descrito abajo. Formularios, mapa, medios, registro, pago y transmisión no tienen destino real conectado. |
| 7. Autenticación | Supabase Auth, recuperación, sesión y middleware de protección. | Pendiente de modelo y credenciales. El login existente es UI de prototipo, no una sesión real. |
| 8. Admin de contenido | Dashboard, CMS para blog/sermones/eventos/galería. | Pendiente de modelo, permisos y credenciales. Las vistas actuales no son CMS conectado. |
| 9. Admin de tienda | Productos, categorías, inventario, pedidos y pagos. | Pendiente de backend y operación comercial confirmada. |
| 10. Miembros y administración | Miembros, ministerios, donaciones, roles y configuración. | Pendiente de backend, permisos y procesos aprobados. |
| 11. Temas | Revisar color, contraste y modo claro/oscuro. | Base claro/oscuro y toggle presentes; la revisión completa se hará sobre páginas y Home terminadas. |
| 12. Herramientas avanzadas | Mapas, editores, calendario, time picker e imágenes. | Parcial: calendario público local listo; mapas, editores y uploads esperan ubicación, activos y backend. |
| 13. API y servidor | API de auth, contenido, registros, tienda, donaciones, miembros y uploads. | Pendiente de modelo, permisos y credenciales; no hay endpoints de servicio implementados. |
| 14. Calidad | SEO, accesibilidad, responsive, rendimiento y pruebas. | Parcial: revisión inicial anterior de build/rutas/nav/móvil/tema/consola. Sitemap, robots, JSON-LD y revisión completa aún pendientes. |
| 15. Publicación | Repositorio, CI/CD, Supabase, Vercel y verificación de producción. | Pendiente de repositorio y credenciales. |

## Orden ajustado de los 15 prompts

Los prompts originales están organizados por tema, pero su orden literal adelanta Home e integraciones antes de cerrar las páginas y definir la seguridad. Se ejecutarán así:

1. **Prompts 1–3 (base y layout):** completar solo las piezas locales necesarias para las pantallas en alcance; no instalar un catálogo completo por adelantado.
2. **Prompt 6 (páginas públicas):** cerrar contenido y controles que funcionan localmente, con estados honestos para datos/servicios aún no conectados.
3. **Prompt 14 (calidad por etapas):** comprobar la UI pública a medida que se cierra y completar SEO/calidad antes de publicar.
4. **Prompt 5 (Home y video):** iniciar después, por decisión expresa de Nicola; reutilizar el perfil y las rutas ya estabilizadas.
5. **Prompt 4 (modelo Supabase):** definir el alcance de datos a partir de páginas ya cerradas y conectar cuando Nicola proporcione credenciales.
6. **Prompts 7–13 (auth, administración, integraciones y API):** implementar en dependencias reales, evitando formularios, compras, aportes, carga de archivos, chat o transmisión que aparenten guardar o procesar información.
7. **Prompt 15 (publicación):** conectar GitHub/Vercel/Supabase después de recibir credenciales y cerrar páginas e integraciones acordadas.

La paleta institucional de `COLOR-SYSTEM.md` y la guía de componentes son propuestas iniciales. Se conservan como tokens editables para esta ambientación; el monograma, el logo y las fotografías no están aprobados como identidad oficial. Los prototipos actuales no fijan el diseño final.

## Activos y herramientas revisados

- El catálogo Magic UI no devolvió un patrón de navegación móvil pertinente. shadcn MCP respondió sin registros configurados para este proyecto; no se creó `components.json` solo para buscar.
- Se revisaron las guías oficiales de Base UI y Radix para menús de navegación. 21st.dev ofrece variantes con animación y dependencias adicionales, pero la navegación del proyecto es una lista simple de enlaces. Se eligió HTML nativo (`nav` y `details/summary`) y no se añadió otra biblioteca.
- Los assets locales se mantienen para una decisión visual posterior. No se han generado ni integrado imágenes o video en esta etapa.
- Se corrigió la configuración PostCSS de Tailwind 4. El build había pasado sin la configuración, pero el preview cargaba solo el reset y no aplicaba utilidades. `postcss.config.mjs` activa `@tailwindcss/postcss` y ahora las clases se generan.
- Se eligieron controles HTML nativos para listas/calendario: el registro de Magic UI no ofreció un filtro pertinente, shadcn no tiene registros configurados y las opciones revisadas de HeroUI eran un sistema adicional innecesario para estas interacciones.
- El índice doctrinal usa títulos y paráfrasis propias basadas en la declaración en español de Assemblies of God (EE. UU.). La página enlaza y atribuye la fuente; no se presenta como confirmación de una redacción oficial de la organización ecuatoriana.

## Estructura pública prevista

- `/` — inicio cinematográfico, reservado para la fase posterior de Home/video; su estructura futura está en `docs/ESTRUCTURA-HOME-Y-VIDEO.md`.
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
- La Home `/` sigue mostrando su prototipo previo y contenidos distintos. No se alineó ni rediseñó porque Nicola reservó Home y el video de fondo para la fase posterior.

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

## Prioridades y recortes de alcance

1. Primero: navegación, páginas informativas y camino de visita/contacto.
2. Después: sermones, agenda, ministerios y contenido editorial del escenario local.
3. Tienda, pagos, muro público de oración, chat en tiempo real, cursos y métricas solo con necesidad confirmada, reglas de privacidad y operación definidas.
4. El copy inventado está autorizado como ambientación pública del proyecto. No convertirlo en una afirmación verificada sobre una congregación real; tampoco fingir éxito de formularios, pagos, transmisiones, cargas o acciones de administración.

## Regla de avance

Cada etapa debe terminar con un entregable local revisable y una lista corta de datos faltantes. Las integraciones y la publicación esperan las credenciales y la autorización aplicable. Los estados “propuesta”, “contenido pendiente”, “implementado localmente”, “verificado” y “publicado” se mantendrán separados.
