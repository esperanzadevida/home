# Estructura prevista de Home y video — Doménica

**Estado:** arquitectura editorial para una fase posterior. La portada existente no se ha cambiado y el video aún no se ha producido.

## Propósito de la portada

Ayudar a alguien que todavía no conoce la iglesia a entender rápidamente quiénes son, cuándo reunirse y cómo planificar una primera visita. El recorrido principal termina en **Planifica tu visita** (`/servicios`). Los mensajes, la agenda y los ministerios quedan como rutas secundarias para quien quiera conocer más antes de ir.

## Recorrido propuesto

1. **Hero de bienvenida.** Video ambiental a pantalla completa con poster, nombre y lema. CTA principal a `/servicios`; CTA secundario a `/nosotros`. La copia se mantiene en HTML, separada del archivo de video.
2. **Próximo encuentro.** Horarios semanales tomados de `churchProfile`, con enlace directo a ubicación y primera visita.
3. **Una comunidad para cada generación.** Introducción breve a la historia, misión y vida comunitaria; enlace a `/nosotros`.
4. **Mensajes para la semana.** Hasta tres sermones del contenido editorial; enlace a `/sermones`.
5. **Agenda próxima.** Hasta tres encuentros ordenados por fecha; enlace a `/eventos`.
6. **Encuentra tu espacio.** Una selección de ministerios y edades; enlace a `/ministerios`.
7. **Fe que se convierte en cuidado.** Una invitación breve a conocer la oración, el servicio y la generosidad, sin introducir pagos, peticiones o formularios que todavía no tengan operación conectada.
8. **Ven a conocernos.** Dirección y vías de contacto de `churchProfile`; enlace a `/contacto` y `/servicios`. El mapa se añade cuando exista una ubicación comprobada.
9. **Footer compartido.** Se conserva el footer del layout público, con horarios, contacto, rutas y redes de la misma fuente central.

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

## Criterios para abrir esta fase

1. Cerrar primero el contenido interior y mantener un perfil editorial canónico.
2. Confirmar la ruta principal y el texto final de Home con Nicola.
3. Preparar el storyboard y el paquete de diseño antes de producir imágenes/video.
4. Revisar el poster y cada segmento antes de incorporarlo.
5. Integrar la Home, hacer el recorrido de calidad local y solicitar revisión visual antes de publicación.

## Datos de código que habrá que reconciliar

La Home actual consume `CHURCH_INFO` y datos de muestra en `src/constants/data.ts`, que no coinciden con el perfil editorial central ni con las rutas interiores. Cuando Nicola autorice abrir esta fase, migrar esos módulos de manera dirigida a `src/config/church-profile.ts` y las colecciones editoriales reutilizables. La nota y el plan de discrepancias ya están en `docs/PLAN-MAESTRO.md`. No editar la Home durante el cierre actual de páginas interiores.
