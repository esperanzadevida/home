# Panel administrativo — alcance y plan de entrega

**Revisión:** 22 de noviembre de 2026
**Estado:** plan de producto y seguridad; el backend de Doménica aún no está conectado. El modelo local ya distingue roles de cuenta y roles por ministerio, pero no concede accesos reales.

Este documento convierte las pantallas existentes en un plan operativo verificable. Las rutas actuales son principalmente prototipos con datos locales. Login, control de ruta y bandejas de moderación ya tienen una integración preparada, pero no existe un proyecto Supabase de Doménica configurado para validar esas consultas ni la migración.

## Qué debe resolver el Admin

| Área | Funciones necesarias para operar | Estado local |
| --- | --- | --- |
| Inicio | Pendientes por atender, actividad reciente, accesos rápidos, errores de conexión y métricas con fecha/fuente claras | Interfaz demo; no consume datos reales |
| Acceso y seguridad | Iniciar/cerrar sesión, recuperar contraseña, MFA para roles privilegiados, roles mínimos, suspender usuarios, invitaciones seguras y registro de acciones | Login/recuperación y matriz de rutas preparados; MFA, invitación segura, auditoría y validación RLS pendientes |
| Contenido | Blog y sermones con borrador/publicado/archivado, vista previa, slug, metadatos, publicación programada, historial de cambios y restauración | Editores locales/prototipos; sin persistencia remota |
| Eventos y medios | Calendario, estado/visibilidad del evento, ubicación, portada, texto alternativo, archivos con límites y almacenamiento por permisos | Pantallas existentes; sin almacenamiento persistente ni publicación real |
| Oración y contacto | Bandejas, estados, lectura completa, búsqueda/filtros, paginación, asignación de responsable si se necesita, respuesta por correo y regla de retención | Consultas Supabase preparadas; sin proyecto real ni envío de respuestas |
| Miembros y ministerios | Búsqueda, filtros, estados, datos mínimos necesarios, acceso limitado, historial de consentimiento y procedimiento de corrección/eliminación | Prototipos locales; no tratar como directorio real |
| Tienda | Productos/variantes, precio, stock, pedidos, fulfillment, cancelación/devolución, estados de pago, conciliación y trazabilidad de inventario | Prototipos locales; sin catálogo, órdenes ni pagos reales |
| Donaciones | Aportes y recibos, estado del proveedor, conciliación, reembolsos cuando aplique y acceso restringido a importes/donantes | Prototipo local; no procesa ni registra aportes reales |
| Configuración | Datos institucionales, horarios, canales, permisos, plantillas de correo y parámetros no secretos | Interfaz demo; cambios no persisten |
| Operación | Estados de carga/vacío/error/éxito, exportaciones autorizadas, bitácora, monitoreo, respaldos, recuperación y cambios de versión | Incompleto; faltan backend, política de datos y pruebas de recuperación |

## Orden de trabajo y criterios de salida

### P0 — Base segura y decisión de despliegue

1. Confirmar dominio, proveedor/plan, proyecto Supabase y entorno de producción con la propietaria del sitio; mantener secretos fuera del cliente y del repositorio.
2. Elegir una arquitectura coherente. La exportación estática actual permite un cliente de Supabase protegido por Auth/RLS, pero el control visual del navegador no es una barrera de seguridad. Correo, invitaciones, asignación de roles, webhooks de pago y otras acciones privilegiadas deben pasar por una función de servidor (p. ej. Supabase Edge Function) con secretos guardados del lado servidor. Si se requieren middleware o Server Actions de Next, dejar de usar exportación estática para esa entrega.
3. Acordar roles, responsable de asignar/quitar permisos y procedimiento de recuperación de cuenta. Aplicar mínimo privilegio y MFA a administradores.
4. Terminar migración reproducible para cada tabla y bucket: grants mínimos, RLS por operación, políticas Storage, índices para consultas, y vistas públicas que no expongan datos internos.
5. Escribir pruebas negativas y positivas de RLS (anónimo, miembro, editor, moderador y administrador) por tabla y operación; ejecutar migración y suite en entorno de prueba antes de producción.
6. Definir clasificación de datos, campos que se recopilan, aviso/base aplicable, retención, corrección/eliminación, acceso/exportación autorizada y respuesta a incidentes. Revisar el flujo con la responsable del sitio y asesoría competente bajo la LOPDP de Ecuador; este plan no declara cumplimiento legal.
7. Diseñar eventos de auditoría para inicios de sesión, fallos de acceso, asignación de roles, publicación, cambios de pedidos/donaciones y borrados. La bitácora debe generarse en backend y excluir contraseñas, tokens, datos completos de pago y texto privado innecesario.

**Salida P0:** ambiente de prueba identificado; modelo de acceso aprobado; migración aplicada en prueba; pruebas RLS pasan; MFA y procedimiento de recuperación ensayados; exportación/despliegue elegidos; riesgos de datos documentados.

### P1 — Moderación y contacto

1. Conectar formularios públicos y revisar validación, antiabuso, límites de frecuencia y tratamiento de errores sin filtrar información privada.
2. Terminar bandejas con cursor estable, filtros que indiquen su alcance, estados permitidos y actualización con confirmación de escritura.
3. Añadir respuesta de correo por función servidor solo si el flujo y remitente están definidos; guardar estado/fecha de respuesta y resultado, no credenciales ni contenido completo en logs.
4. Definir quién ve peticiones de oración, cuánto tiempo se conservan y cómo se atienden solicitudes de retiro/eliminación. No mezclar mensajes sensibles con métricas públicas.

**Salida P1:** formularios reales llegan una sola vez; el rol correcto puede leer/actualizar; roles ajenos y anónimos reciben denegación; respuesta funciona o queda claramente desactivada; retención y fallos son visibles.

### P2 — CMS, eventos y medios

1. Unificar esquema editorial de entradas, sermones, eventos y galerías: autor, estado, fecha de publicación, slug, texto alternativo y relaciones necesarias.
2. Añadir borrador/preview/publicación/archivo, validación de URL/slug, historial de cambios y publicación programada con una tarea del backend confiable.
3. Subir archivos a buckets privados o públicos según el uso, con tipos/tamaños permitidos, nombres no sensibles, políticas por rol y transformación/optimización definida.

**Salida P2:** una edición se guarda, previsualiza, publica y puede revertirse; los cambios se reflejan en las rutas públicas; medios no autorizados quedan inaccesibles.

### P3 — Miembros, usuarios y permisos

1. Separar perfil de acceso (`profiles`) del registro pastoral/directorio de miembros; el rol de acceso nunca debe editarse desde un formulario cliente ordinario.
2. Implementar invitación, desactivación y cambio de rol mediante función protegida que valida al actor y registra la acción.
3. Hacer búsqueda, filtros y paginación en servidor; ocultar por defecto teléfonos/correos/datos pastorales a roles sin necesidad operativa.
4. Incorporar estados vacíos, duplicados, corrección de datos y exportación solo con permiso y registro de auditoría.

**Salida P3:** un editor/moderador no puede elevar privilegios ni leer el directorio completo; cada rol y sus denegaciones están probados.

#### Modelo de roles preparado localmente

- **Roles de cuenta:** propietario (único), administrador principal, administrador, pastor, tesorería, editor, moderador pastoral, miembro y visitante. El borrador limita los borrados al propietario; los administradores y editores pueden crear/editar dentro de sus áreas. Propietario conserva transferencia de propiedad; los roles de máxima autoridad no se asignan desde el selector normal de usuarios.
- **Roles por ministerio:** líder, coordinador, músico, voluntario e integrante. Se guardan como asignaciones separadas de `profiles.role`, por persona y ministerio; una cuenta puede servir en distintos equipos con funciones diferentes.
- **Alcance previsto:** visitantes ven el sitio público; miembros consultan su perfil y sus pedidos; editores trabajan contenido; moderadores atienden oración y contacto; pastores consultan el directorio, ministerios, sermones y peticiones de oración; tesorería solo consulta donaciones; administradores operan el panel; propietario administra transferencia y borrados.
- **Límite de ministerios:** líderes, coordinadores y músicos no reciben acceso global por tener ese cargo. El borrador RLS permite consultar solo ministerios donde existe una asignación activa. Todavía no hay un espacio ministerial conectado, agenda/repertorio persistente ni flujo protegido para alta y baja de asignaciones.
- La pantalla de Roles muestra una matriz temporal; las casillas no se guardan y no autorizan consultas. La pantalla Usuarios solo enseña roles globales de muestra. La migración evita editar `profiles.role` desde el navegador y limita tesorería a lectura de donaciones.
- **Pendiente antes de activar:** definir quién puede asignar cada rol; implementar función protegida y auditoría; confirmar si el propietario es una persona/entidad y cómo recuperar la cuenta; añadir interfaces y permisos por operación; ejecutar pruebas positivas y negativas de RLS contra una base de prueba.

### P4 — Tienda y donaciones

1. Completar catálogo/variantes y movimientos de inventario con registro de actor y cambio; definir reservas, stock bajo, cancelación y devolución.
2. Elegir pasarela disponible para Ecuador y confirmar moneda, costos, recibos, conciliación, reembolsos y requisitos del proveedor antes de programar el flujo.
3. Confirmar pagos desde webhook verificado de servidor; la pantalla nunca decide que un pedido está pagado por el retorno del navegador.
4. Usar una página/tokenización alojada por la pasarela cuando sea viable. No almacenar CVV; el proveedor y la implementación determinan el alcance PCI.
5. Restringir reportes de donantes/importes; auditar ajustes, reembolsos y exportaciones.

**Salida P4:** pruebas de pago usan sandbox; webhooks repetidos no duplican órdenes; conciliación compara proveedor y DB; flujo de reembolso/cancelación queda probado antes de cobrar en vivo.

### P5 — Dashboard y operación diaria

1. Sustituir cada cifra de muestra por consultas agregadas con período y zona horaria `America/Guayaquil`; enlazar la métrica al listado que la explica.
2. Mostrar pendientes y fallos accionables, no números inventados. Si la fuente falla, distinguir “sin datos” de “no se pudo cargar”.
3. Definir monitoreo de errores, límites de Auth/antiabuso, políticas de respaldo según plan y ensayar restauración en entorno separado.
4. Preparar checklist de publicación: migraciones revisadas, pruebas de roles/RLS, build, pruebas responsive/teclado, variables, plan de reversión y verificación posterior.

**Salida P5:** métricas reconciliables, alerta probada, respaldo restaurado en ensayo y despliegue con evidencia de rutas críticas.

## Requisitos compartidos para cada pantalla

- Permiso aplicado en la base/función, además del control de navegación; error de permiso no debe convertirse en éxito visual.
- Estados de carga, vacío, error, reintento y éxito; paginación para listas; filtro con alcance explícito.
- Teclado, foco visible, etiquetas, mensajes anunciados a tecnologías de asistencia, contraste y controles táctiles cómodos. Revisar WCAG 2.2 en todos los breakpoints y con movimiento reducido.
- No mostrar datos sensibles en URLs, notificaciones, analítica, logs, capturas ni datos de muestra.
- Confirmación para acciones irreversibles, historial de cambios para acciones críticas y opción de cancelar cuando corresponda.
- Cero contenido ficticio en producción. Si faltan credenciales o datos, mostrar el estado de configuración solo en Admin.

## Evidencia y límites actuales

- `/admin/mensajes` y `/admin/oracion` son las únicas bandejas preparadas para consultas directas; no están conectadas a una base real. Las otras pantallas principales de CMS, miembros, tienda, donaciones, usuarios y configuración siguen siendo demostraciones locales.
- El login/recuperación, guardas de ruta, roles, configuración Supabase y migración inicial fueron añadidos localmente. La migración no ha sido aplicada y la matriz de políticas todavía necesita pruebas ejecutadas contra PostgreSQL.
- El proyecto no tiene credenciales/proyecto Supabase de Doménica en esta sesión. No se puede confirmar entrega de correos, permisos efectivos, retención, pago, respaldo ni restauración.
- El flujo de GitHub Pages puede producir exportación estática; la documentación de Next indica que una exportación estática carece de runtime para funciones de servidor. La conexión navegador-Supabase solo es aceptable si RLS protege cada acceso.

## Investigación consultada — 22-11-2026

- [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — grants, políticas por operación y pruebas pgTAP.
- [Supabase: producción segura](https://supabase.com/docs/guides/security/production-checklist) y [lista de producción](https://supabase.com/docs/guides/deployment/going-into-prod) — Auth, red, organización, base de datos, rendimiento y disponibilidad.
- [Supabase: MFA](https://supabase.com/docs/guides/auth/auth-mfa) — inscripción, reto y nivel de garantía de sesión.
- [Next.js: exportación estática](https://nextjs.org/docs/app/guides/static-exports) — funciones con runtime que no están disponibles en ese modo.
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) — foco, objetivos de interacción y estados accesibles.
- [Registro Oficial / Asamblea Nacional: LOPDP](https://www.asambleanacional.gob.ec/es/multimedios-legislativos/63464-ley-organica-de-proteccion-de-datos) — fuente legal ecuatoriana para revisión competente del tratamiento.
- [PCI SSC: CVV/CVC](https://www.pcisecuritystandards.org/faqs/are-merchants-allowed-to-request-card-verification-codes-values-from-cardholders/) — el código de verificación no se conserva después de autorizar.
