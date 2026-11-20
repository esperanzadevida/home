# Estructura prevista de Home y video — Doménica

**Estado al 2026-11-19:** Home rediseñada con imagen estática local y datos editoriales centrales. El video de fondo, su storyboard y el asset final siguen aplazados.

## Propósito de la portada

Ayudar a alguien que todavía no conoce la iglesia a entender rápidamente quiénes son, cuándo reunirse y cómo planificar una primera visita. El recorrido principal termina en **Planifica tu visita** (`/servicios`). Los mensajes, la agenda y los ministerios quedan como rutas secundarias para quien quiera conocer más antes de ir.

## Recorrido propuesto

1. **Hero de bienvenida.** Imagen estática local, titular en HTML, lema, CTA a `/servicios` y `/nosotros`, y horarios de `churchProfile`.
2. **Una comunidad para caminar juntos.** Tres ideas editoriales de comunidad, fe cotidiana y servicio.
3. **Mensaje reciente.** Primer mensaje de `sermonDetails`, enlazado a su ficha y al índice `/sermones`.
4. **Próximos encuentros.** Hasta tres eventos de `eventDetails`, con fecha, resumen y enlace a `/eventos`.
5. **Vida en comunidad.** Tres ministerios de `publicPageBlueprints`, enlazados a `/ministerios`.
6. **Ven a conocernos.** Ciudad, dirección y horario dominical de `churchProfile`, con CTA a `/servicios`.
7. **Footer compartido.** Se conserva el footer del layout público, con horarios, contacto, rutas y redes de la misma fuente central.

No se necesita publicar en Home cifras, testimonios, mapas, cuentas bancarias ni transiciones de servicio que no estén respaldados por contenido o integraciones funcionales. Cada bloque debe reutilizar las rutas y datos centrales, sin otra copia independiente de horarios, eventos o perfiles.

## Dirección narrativa del video

Idea de trabajo: **llegar, encontrar un lugar, compartir y servir**. La secuencia puede mostrar detalles de bienvenida y preparación, conversaciones entre generaciones, música y un plano amplio de comunidad. La dirección final se decidirá al preparar el storyboard y revisar los assets disponibles.

- El metraje acompaña el ambiente; los titulares, el lema y los botones se maquetan en la página.
- Evitar carteles, texto generado, logotipos inventados dentro del video y detalles arquitectónicos que se quieran presentar como una sede real específica.
- Componer el inicio y el cierre con encuadres compatibles para que un loop no se sienta cortado.
- Crear un poster legible para la variante estática y revisar el encuadre en móvil antes de generar/exportar.
- El comportamiento se elige después de revisar el storyboard: loop breve de fondo si el metraje funciona como ambiente; secuencia ligada al scroll solo si hay momentos claros y el flick test lo confirma.

## Implementación prevista

- Mantener Next.js, Tailwind y los tokens/componentes actuales.
- Cargar el video silenciado, en línea y de forma diferida; proveer poster desde el primer render.
- En móvil, conexión limitada o `prefers-reduced-motion: reduce`, mostrar el poster sin forzar reproducción.
- Pausar cuando la pestaña no esté visible. No depender del video para entender el mensaje o completar una acción.
- Probar teclado, contraste de la copia sobre el peor fotograma, controles de movimiento reducido, carga con el video ausente y tamaños de teléfono/escritorio.
- No pedir créditos ni enviar material a un generador hasta elegir herramienta, comprobar costo y revisar el storyboard.

## Estado de implementación local

- La Home dejó de usar `CHURCH_INFO`, tarjetas de datos de muestra, mapa simulado, contadores y publicaciones personales de oración. Ahora comparte perfil, eventos, sermones y ministerios con las páginas interiores.
- La portada usa `next/image` con carga prioritaria y un diseño que funciona sin video. El archivo de imagen existente es conceptual; su procedencia y permiso siguen sin comprobarse.
- Los metadatos públicos de `/` usan `createPageMetadata`; la ruta se añade al sitemap de producción y local/preview continúa sin indexación según la configuración existente.
- La revisión visual se hizo a 390 px y 412 px en móvil y 1440 px en escritorio; no se observó desbordamiento horizontal. Se comprobó la lectura en modo claro y oscuro. El recorrido amplio de teclado/lector y la aprobación del origen de la imagen siguen pendientes.

## Siguiente fase de video

1. Cerrar y revisar storyboard antes de producir imágenes o video.
2. Seleccionar herramientas y assets, confirmando costos y permisos.
3. Preparar un poster legible que pueda usarse como portada estática.
4. Integrar el video solo si mejora el relato y conserva una alternativa accesible sin movimiento.
5. Revisar teclado, contraste, movimiento reducido, carga sin video y tamaños móvil/escritorio.

## Datos de código que habrá que reconciliar

`src/constants/data.ts` conserva datos de muestra usados en prototipos administrativos, pero la Home ya no los consume. No retirar esas constantes sin revisar las demás rutas que puedan depender de ellas.
