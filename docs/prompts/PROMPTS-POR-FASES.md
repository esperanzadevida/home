# Prompts de Desarrollo por Fases

## Instrucciones de uso
Este archivo conserva los 15 prompts originales como material de trabajo; su numeración temática no es el orden operativo del proyecto. Antes de ejecutar un prompt, adáptalo al stack, componentes, decisiones y estado del repositorio actual. La identidad editorial vigente es **Iglesia Esperanza de Vida**. Sendero de la Aurora pertenece a una variante anterior.

### Orden operativo y puertas de salida

1. **Cerrar lo local primero:** revisar y completar las rutas públicas (fases 1–3 solo en lo que haga falta, fase 6 y las piezas de Home de la fase 5). Mantener datos de muestra claramente limitados a prototipos, sin inventar persistencia ni servicios conectados.
2. **Completar el Admin local:** implementar y revisar pantallas y flujos de muestra de las fases 8–10. Tratar las acciones como prototipos mientras no exista autenticación y persistencia.
3. **Temas y herramientas locales:** fase 11 antes del QA; de fase 12, implementar solo calendarios/controles locales que resuelvan una necesidad confirmada. Posponer mapas con ubicación real, upload y cualquier persistencia hasta contar con datos y backend.
4. **QA local:** ejecutar la fase 14 por partes sobre páginas públicas y Admin. Cubrir responsive, navegación por teclado, contraste, nombres/alternativas accesibles, estados de error/carga y ambos temas; dejar un registro explícito de qué rutas y estados se probaron. No declarar puntajes Lighthouse o QA visual completos sin evidencia de esa corrida.
5. **Integraciones después de credenciales:** GitHub Pages ya publica la exportación estática con Actions. Las fases 4, 7 y 13, y las partes de la fase 12 conectadas a servicios, esperan credenciales de Supabase/Vercel y el cierre del modelo, permisos/RLS y alcance. No aplicar migraciones remotas anticipadamente.
6. **Home audiovisual publicada:** la fase 5 integra el video y poster disponibles, sincronizados con la narrativa. Queda pendiente medir redes reales, verificar procedencia/licencia de Magnific y completar QA integral; el fallback respeta movimiento reducido y conexiones limitadas.

Cada bloque debe dejar un resultado local revisable y evidencia acotada; registrar como pendiente aquello que dependa de una credencial, permiso, dato real o revisión que aún no ocurrió. No copies un prompt sin comprobar si contradice este orden.

---

## FASE 1 — Inicialización del proyecto Next.js

```
Inicializa el proyecto Next.js en la carpeta DOMENICA con la siguiente configuración exacta:

1. Ejecuta: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
2. Instala Tailwind CSS v4 (última versión) y configura correctamente
3. Instala las dependencias base:
   - shadcn/ui (inicializa con: npx shadcn@latest init)
   - next-themes (para dark/light mode)
   - lucide-react (iconos)
   - clsx + tailwind-merge (utilidades de className)
   - @supabase/supabase-js @supabase/ssr (Supabase client)
   - zod (validación)
   - react-hook-form @hookform/resolvers (formularios)
   
4. Configura el archivo tailwind.config.ts con los colores del sistema de diseño
   documentado en docs/design/COLOR-SYSTEM.md. Usa CSS variables.
   
5. Crea el archivo src/styles/globals.css con:
   - Variables CSS para light y dark mode
   - La paleta completa de colores (primary, secondary, background, foreground, etc.)
   - Estilos base para tipografía
   - Fuentes: importa de Google Fonts — un display serif (Playfair Display), un body sans-serif (Inter), un mono (JetBrains Mono)

6. Crea src/lib/utils.ts con la función cn() para combinar clases

7. Configura next.config.ts con las opciones básicas de imágenes (dominios permitidos)

8. Crea el archivo .env.local.example con las variables necesarias:
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=

9. Verifica que todo compila sin errores: npm run build
```

---

## FASE 2 — Componentes UI base (Shadcn + Custom)

```
Instala y configura los componentes base de Shadcn/UI y crea los componentes custom.
Referencia: docs/design/COMPONENTS-GUIDE.md

1. Instala estos componentes de Shadcn/UI:
   npx shadcn@latest add button input textarea select checkbox 
   npx shadcn@latest add badge avatar separator skeleton dialog sheet
   npx shadcn@latest add dropdown-menu context-menu tooltip popover
   npx shadcn@latest add tabs accordion toast calendar command
   npx shadcn@latest add card table form label switch radio-group
   npx shadcn@latest add alert-dialog navigation-menu scroll-area
   npx shadcn@latest add breadcrumb pagination sonner

2. Crea variantes personalizadas del Button:
   - default (primary azul), secondary (rojo), outline (borde), ghost (transparente)
   - Tamaños: sm, default, lg, icon
   - Loading state con spinner
   - Todos deben verse bien en light Y dark mode

3. Crea el componente ThemeToggle (src/components/shared/ThemeToggle.tsx):
   - Botón que alterna entre sun/moon icons
   - Usa next-themes
   - Animación suave de transición

4. Crea el componente SearchBar global (src/components/shared/SearchBar.tsx):
   - Input con icono de búsqueda
   - Se expande al hacer focus
   - Debounce de 300ms

5. Crea Breadcrumbs, Pagination, EmptyState, LoadingSpinner, SocialLinks

6. Verifica que TODOS los componentes se ven correctamente en light y dark mode
   probando cada uno con un archivo de test temporal
```

---

## FASE 3 — Layout y navegación

```
Crea los layouts principales: público, auth y admin.

1. Layout público (src/app/(public)/layout.tsx):
   - Navbar responsive con:
     * Logo de la iglesia (placeholder SVG por ahora)
     * Links: Inicio, Nosotros, Servicios, Sermones, Eventos, Blog, Tienda, Contacto
     * Botón "Donar" destacado
     * ThemeToggle
     * Menú hamburguesa para mobile (Sheet component)
     * Efecto de blur/transparencia al hacer scroll
   - Footer con:
     * Logo e info de la iglesia (nombre, dirección, teléfono)
     * Links rápidos organizados en columnas
     * Redes sociales (Facebook, Instagram, YouTube, TikTok)
     * Horarios de servicios
     * Newsletter signup
     * Copyright
     * Diseño responsive (stack en mobile, grid en desktop)

2. Layout auth (src/app/(auth)/layout.tsx):
   - Centrado vertical y horizontal
   - Card con el formulario
   - Fondo con gradiente sutil
   - Logo de la iglesia arriba

3. Layout admin (src/app/(admin)/layout.tsx):
   - Sidebar colapsable con:
     * Logo
     * Avatar del usuario logueado
     * Navegación: Dashboard, Contenido (Blog, Sermones, Eventos, Galería), 
       Tienda (Productos, Categorías, Inventario, Pedidos, Pagos), 
       Miembros, Ministerios, Donaciones, Usuarios, Roles, Configuración
     * Separadores entre secciones
     * Badge con conteo de pendientes
     * Botón de cerrar sesión
   - Header del admin con:
     * Título de la página actual
     * Breadcrumbs
     * SearchBar
     * Notificaciones
     * Avatar con dropdown menu

4. Middleware (src/middleware.ts):
   - Protege rutas /admin/* requiriendo autenticación
   - Redirige /login a /admin/dashboard si ya está logueado
   - Verifica roles para acceso al admin

5. Verifica navegación completa en ambos modos (light/dark)
```

---

## FASE 4 — Supabase: Auth + Database + Storage

```
Configura Supabase completamente.

1. Crea el cliente de Supabase:
   - src/lib/supabase/client.ts (browser client)
   - src/lib/supabase/server.ts (server client con cookies)
   - src/lib/supabase/admin.ts (service role client)
   - src/lib/supabase/middleware.ts (middleware client)

2. Crea las migraciones SQL (supabase/migrations/):
   Referencia: docs/guides/DATABASE-SCHEMA.md
   - 001_profiles.sql — tabla profiles + trigger para crear perfil automáticamente
   - 002_roles.sql — tabla roles + user_roles + roles iniciales (super_admin, admin, editor, member)
   - 003_members.sql — tabla members
   - 004_blog.sql — blog_posts + blog_categories
   - 005_sermons.sql — sermons + sermon_series
   - 006_events.sql — events + event_registrations
   - 007_ministries.sql — ministries
   - 008_store.sql — product_categories + products + orders + order_items
   - 009_donations.sql — donations
   - 010_prayer_requests.sql — prayer_requests
   - 011_contact.sql — contact_messages
   - 012_site_settings.sql — site_settings
   - 013_media.sql — media
   - 014_rls_policies.sql — TODAS las Row Level Security policies

3. Crea seed data (supabase/seed/seed.sql):
   - Roles iniciales
   - Configuración inicial del sitio (nombre, dirección, etc.)
   - Categorías de blog iniciales
   - Ministerios base (Jóvenes, Niños, Mujeres, Adoración, Misiones)

4. Crea TypeScript types auto-generados:
   - Ejecuta: npx supabase gen types typescript --local > src/types/database.ts
   - O crea manualmente los types basándote en el schema

5. Crea hooks reutilizables:
   - src/hooks/useAuth.ts — estado de autenticación, login, logout, registro
   - src/hooks/useProfile.ts — perfil del usuario actual
   - src/hooks/useRole.ts — verificación de rol y permisos
```

---

## FASE 5 — Página de inicio (Home) con hero cinématico

```
Crea la página de inicio con diseño cinématico (10k-websites approach).

1. Hero Section (src/components/sections/HeroSection.tsx):
   - Video de fondo o imagen hero a pantalla completa
   - Overlay con gradiente oscuro (opacity variable)
   - Título principal: nombre de la iglesia (tipografía display, grande)
   - Subtítulo: lema o versículo bíblico
   - CTA buttons: "Únete a nosotros" (primary) + "Ver servicios" (outline)
   - Scroll indicator animado
   - Efecto parallax sutil al scroll
   - En mobile: imagen estática optimizada en lugar de video
   - Animaciones de entrada con framer-motion o CSS animations

2. Sección "Bienvenidos" / About preview:
   - Texto breve sobre la iglesia
   - Imagen del pastor o del templo
   - Botón "Conoce más" → /nosotros
   - Animación fade-in al entrar en viewport

3. Sección Horarios de Servicios:
   - Cards con día, hora, tipo de servicio
   - Icono representativo para cada servicio
   - Efecto hover sutil
   - Próximo servicio destacado con countdown

4. Sección Últimos Sermones (3 cards):
   - SermonCard con imagen, título, pastor, fecha
   - Botón play para audio/video
   - Link "Ver todos" → /sermones

5. Sección Próximos Eventos (3 cards):
   - EventCard con fecha (día grande), título, descripción breve
   - Botón "Registrarse" o "Ver más"
   - Link "Ver todos" → /eventos

6. Sección Ministerios (grid):
   - MinistryCard con icono, nombre, breve descripción
   - Hover effect con color accent
   - Link a cada ministerio

7. Sección de Donaciones CTA:
   - Fondo con gradiente o imagen
   - Texto motivacional
   - Botón "Donar ahora" destacado
   - Iconos de métodos de pago

8. Sección de Testimonio:
   - Carousel de testimonios
   - Foto, nombre, cita

9. Sección Contacto rápido:
   - Mapa con MapLibre mostrando ubicación
   - Info de contacto (dirección, teléfono, email)
   - Horarios
   - Mini formulario de contacto

10. TODAS las secciones deben tener:
    - Scroll animations (fade-in, slide-up)
    - Responsive design (mobile-first)
    - Funcionar perfectamente en light y dark mode
    - Usar los tokens de color del sistema de diseño
```

---

## FASE 6 — Páginas públicas interiores

```
Crea todas las páginas públicas interiores.

1. /nosotros — Sobre la iglesia:
   - Historia de la iglesia
   - Visión, misión, valores
   - Declaración de fe (16 verdades fundamentales de AoG)
   - Equipo pastoral (MemberCards)
   - Galería de fotos
   - Timeline de la historia

2. /servicios — Servicios y horarios:
   - Lista detallada de todos los servicios
   - Horarios por día
   - Ubicación con mapa
   - Qué esperar en tu primera visita
   - FAQ (Accordion)

3. /sermones — Archivo de sermones:
   - Grid/lista de SermonCards con filtros
   - Filtrar por: serie, pastor, fecha, etiqueta
   - Búsqueda
   - Reproductor de audio/video inline
   - Paginación

4. /sermones/[slug] — Detalle de sermón:
   - Reproductor principal (video o audio)
   - Notas del sermón (contenido rico)
   - Info del pastor
   - Referencia bíblica
   - Sermones relacionados
   - Botones de compartir

5. /eventos — Calendario de eventos:
   - Vista de calendario mensual (Calendar component)
   - Vista de lista con EventCards
   - Filtrar por categoría
   - Toggle entre vistas

6. /eventos/[slug] — Detalle de evento:
   - Imagen del evento
   - Fecha, hora, lugar
   - Descripción completa
   - Mapa de ubicación
   - Formulario de registro
   - Compartir

7. /blog — Blog:
   - Grid de BlogCards
   - Filtrar por categoría
   - Búsqueda
   - Posts destacados (featured)

8. /blog/[slug] — Artículo:
   - Contenido rico renderizado desde BlockNote/Tiptap
   - Autor con avatar
   - Fecha, categoría, tags
   - Tabla de contenidos (TOC)
   - Posts relacionados
   - Compartir

9. /ministerios — Ministerios:
   - Grid de MinistryCards
   - Detalle de cada ministerio
   - Horarios de reunión
   - Líder del ministerio
   - Formulario para unirse

10. /tienda — Tienda online:
    - Grid de ProductCards
    - Filtrar por categoría, precio
    - Búsqueda
    - Ordenar por: precio, nuevo, popular

11. /tienda/[id] — Detalle de producto:
    - Galería de imágenes con zoom
    - Nombre, precio, descripción
    - Selector de cantidad
    - Botón "Agregar al carrito"
    - Productos relacionados
    - Reviews/valoraciones

12. /galeria — Galería de fotos:
    - Grid masonry de fotos
    - Lightbox para ver en grande
    - Filtrar por álbum/categoría

13. /contacto — Contacto:
    - Formulario completo (nombre, email, teléfono, asunto, mensaje)
    - Mapa grande con ubicación
    - Info de contacto completa
    - Redes sociales
    - FAQ

14. /donaciones — Donaciones:
    - Tipos de donación (diezmo, ofrenda, misiones, especial)
    - Montos predeterminados + personalizado
    - Formulario de pago
    - Historial de donaciones (si está logueado)
    - Versículo bíblico motivacional

15. /oracion — Peticiones de oración:
    - Formulario para enviar petición
    - Muro de oración (peticiones públicas)
    - Opción de orar anónimamente

16. /en-vivo — Transmisión en vivo:
    - Embed de YouTube/Facebook Live
    - Chat en tiempo real (Supabase Realtime)
    - Countdown para próximo servicio
    - Notas del servicio actual
```

---

## FASE 7 — Sistema de autenticación completo

```
Implementa el sistema de autenticación con Supabase Auth.

1. Página de Login (/login):
   - Email + Password
   - Botón "Iniciar sesión"
   - Link "¿Olvidaste tu contraseña?"
   - Link "Crear cuenta"
   - Opcionalmente: login con Google
   - Validación con zod + react-hook-form
   - Loading state
   - Error handling con toast

2. Página de Registro (/registro):
   - Nombre completo, email, password, confirmar password
   - Términos y condiciones checkbox
   - Validación de password (mín 8 chars, mayúscula, número)
   - Email de confirmación

3. Página de Recuperación (/recuperar):
   - Input de email
   - Envío de link de recuperación
   - Página de reset password

4. Auth Provider (src/providers/AuthProvider.tsx):
   - Context con estado de auth
   - Auto-refresh de sesión
   - Listener de cambios de auth

5. Middleware de protección:
   - Rutas protegidas: /admin/*
   - Verificación de roles
   - Redirect a login si no autenticado
   - Redirect a dashboard si ya autenticado

6. Gestión de sesión:
   - Cookies httpOnly para SSR
   - Refresh token automático
   - Logout limpio
```

---

## FASE 8 — Panel Admin: Dashboard y gestión de contenido

```
Crea el dashboard y las páginas de gestión de contenido del admin.

1. Dashboard (/admin/dashboard):
   - Cards de estadísticas: miembros totales, eventos este mes, 
     sermones publicados, donaciones del mes, pedidos pendientes
   - Gráfico de donaciones últimos 6 meses
   - Gráfico de miembros nuevos
   - Actividad reciente (timeline)
   - Accesos rápidos
   - Próximos eventos

2. Gestión de Blog (/admin/contenido/blog):
   - DataTable con posts: título, autor, categoría, estado, fecha, acciones
   - Botón "Nuevo post"
   - Filtros: estado (borrador/publicado/archivado), categoría
   - Acciones: editar, publicar/despublicar, eliminar
   
3. Editor de Blog (/admin/contenido/blog/[id]):
   - Editor BlockNote/Tiptap completo con:
     * Headings, bold, italic, underline
     * Listas, quotes, code blocks
     * Imágenes (upload a Supabase Storage)
     * Videos embebidos
     * Tablas
   - Sidebar con: título, slug (auto-generado), categoría, tags,
     cover image (upload), extracto, estado, fecha de publicación
   - Preview en vivo
   - Autoguardado (draft)

4. Gestión de Sermones (/admin/contenido/sermones):
   - Similar a blog pero con campos específicos:
     * Referencia bíblica, serie, pastor
     * Upload de audio/video a Supabase Storage
     * Duración

5. Gestión de Eventos (/admin/contenido/eventos):
   - DataTable + formulario con:
     * Fecha/hora inicio y fin (Calendar + TimePicker)
     * Ubicación + mapa para seleccionar coordenadas
     * Recurrencia
     * Máximo de asistentes
     * Registros (ver quién se inscribió)

6. Gestión de Galería (/admin/contenido/galeria):
   - Upload múltiple de imágenes
   - Crear álbumes
   - Editor de imagen inline
   - Drag & drop para reordenar
   - Alt text para accesibilidad
```

---

## FASE 9 — Panel Admin: Tienda completa

```
Implementa la tienda completa en el admin.

1. Productos (/admin/tienda/productos):
   - DataTable: nombre, SKU, precio, stock, estado, acciones
   - Filtros: categoría, estado, stock bajo
   - Búsqueda

2. Editor de Producto (/admin/tienda/productos/[id]):
   - Formulario completo:
     * Nombre, slug, descripción (editor rico)
     * Precio, precio de comparación, costo
     * SKU, código de barras
     * Categoría
     * Imágenes (upload múltiple, drag to reorder)
     * Inventario: cantidad, rastrear inventario, alertas
     * Producto digital: archivo descargable
     * Peso y dimensiones
     * Tags
     * Estado: borrador, activo, archivado
     * Producto destacado
   - Preview del producto

3. Categorías (/admin/tienda/categorias):
   - Árbol de categorías (parent/child)
   - CRUD de categorías
   - Imagen de categoría
   - Reordenar con drag & drop

4. Inventario (/admin/tienda/inventario):
   - Vista de inventario completo
   - Alertas de stock bajo
   - Ajuste de cantidades
   - Historial de movimientos
   - Exportar a CSV

5. Pedidos (/admin/tienda/pedidos):
   - DataTable: #pedido, cliente, total, estado pago, estado envío, fecha
   - Filtros por estado
   - Detalle de pedido (/admin/tienda/pedidos/[id]):
     * Items del pedido
     * Info del cliente
     * Dirección de envío
     * Cambiar estado
     * Notas internas
     * Timeline de estados

6. Pagos (/admin/tienda/pagos):
   - Resumen de pagos
   - Transacciones recientes
   - Integración con pasarela de pago (configurar después)
```

---

## FASE 10 — Panel Admin: Miembros, ministerios, donaciones

```
Implementa las secciones restantes del admin.

1. Miembros (/admin/miembros):
   - DataTable: nombre, email, teléfono, estado, fecha ingreso
   - Filtros: estado de membresía, ministerio
   - Perfil de miembro:
     * Info personal
     * Ministerios en los que participa
     * Historial de asistencia (futuro)
     * Donaciones realizadas
     * Notas privadas
   - Importar/exportar CSV
   - Comunicación masiva (futuro)

2. Ministerios (/admin/ministerios):
   - Lista de ministerios con líder asignado
   - Crear/editar ministerio
   - Asignar líder
   - Ver miembros del ministerio
   - Horarios de reunión

3. Donaciones (/admin/donaciones):
   - DataTable: donante, monto, tipo, método, estado, fecha
   - Filtros: tipo, período
   - Resumen total por período
   - Gráfico de donaciones
   - Generar recibos
   - Exportar reportes

4. Usuarios del sistema (/admin/usuarios):
   - DataTable: nombre, email, rol, último acceso, estado
   - Crear nuevo usuario
   - Editar rol
   - Activar/desactivar
   - Resetear contraseña

5. Roles y permisos (/admin/roles):
   - Lista de roles
   - Editor de permisos por módulo:
     * Blog: ver, crear, editar, eliminar, publicar
     * Sermones: ver, crear, editar, eliminar
     * Eventos: ver, crear, editar, eliminar
     * Tienda: ver productos, crear, editar, eliminar, ver pedidos, gestionar pagos
     * Miembros: ver, crear, editar, eliminar
     * Donaciones: ver, crear, generar reportes
     * Configuración: acceder, modificar
     * Usuarios: ver, crear, editar roles, eliminar

6. Configuración (/admin/configuracion):
   - Info de la iglesia (nombre, dirección, teléfono, email)
   - Horarios de servicios
   - Redes sociales
   - Contenido del hero (título, subtítulo, CTA)
   - Logo y favicon
   - SEO defaults (meta title, description)
   - Integrations (APIs de pago, email, etc.)
```

---

## FASE 11 — Dark/Light mode y sistema de temas

```
Perfecciona el sistema de dark/light mode.

1. Verifica CADA componente en ambos modos:
   - Navbar, Footer, Sidebar, todas las cards
   - Formularios, tablas, modales
   - Botones, badges, tooltips
   - Editores de texto
   - Mapas
   - Gráficos del dashboard

2. Ajusta colores problemáticos:
   - Asegura contraste WCAG AA mínimo
   - Verifica legibilidad de texto sobre imágenes
   - Gradientes que funcionen en ambos modos
   - Sombras apropiadas para cada modo
   - Bordes visibles en ambos modos

3. Transiciones suaves:
   - Transición de color-scheme sin flash
   - next-themes con attribute="class"
   - suppressHydrationWarning en html tag
   - Script de blocking para evitar flash

4. Componentes especiales:
   - MapLibre: tema claro y oscuro del mapa
   - Editores de texto: tema del editor
   - Gráficos: colores adaptados
   - Imágenes: considerar filtros para dark mode si es necesario

5. Test exhaustivo en:
   - Desktop (1920px, 1440px, 1280px)
   - Tablet (768px, 1024px)
   - Mobile (375px, 390px, 414px)
   - Cada breakpoint en light Y dark
```

---

## FASE 12 — MapLibre, Calendar, Editores avanzados

```
Integra las herramientas especializadas.

1. MapLibre GL JS:
   - Instalar: npm install maplibre-gl
   - Componente MapView reutilizable con:
     * Ubicación de la iglesia con marker personalizado
     * Popup con info
     * Controles de zoom
     * Estilo claro y oscuro
     * Responsive
   - Usar en: contacto, eventos, nosotros
   - Usar en admin: selector de coordenadas para eventos

2. Calendar (react-day-picker o @schedule-x/react):
   - Componente Calendar con:
     * Vista mensual, semanal
     * Eventos marcados en el calendario
     * Click en fecha para ver eventos
     * Navegación entre meses
     * Responsive
   - Usar en: /eventos (público), /admin/contenido/eventos

3. Time Picker:
   - Componente para seleccionar hora
   - Formato 12h con AM/PM
   - Integrado con react-hook-form
   - Usar en: formulario de eventos

4. Context Menu:
   - Menu contextual (click derecho) en:
     * DataTables del admin (editar, eliminar, duplicar)
     * Galería (descargar, editar, eliminar)

5. Editor de Texto Rico (Tiptap o BlockNote):
   - Configurar editor completo con:
     * Toolbar personalizada
     * Headings (H1-H4)
     * Bold, italic, underline, strikethrough
     * Listas (ordered, unordered, checklist)
     * Blockquotes, code blocks
     * Links, imágenes, videos
     * Tablas
     * Mention / embed
     * Slash commands (/)
   - Upload de imágenes a Supabase Storage
   - Serialización JSON para guardar en DB
   - Renderizador de contenido para la vista pública

6. Editor de Imagen:
   - Crop, rotate, resize
   - Filtros básicos
   - Ajuste de brillo/contraste
   - Usar para: foto de perfil, thumbnails, productos
```

---

## FASE 13 — API Routes y lógica de servidor

```
Crea todas las API routes necesarias.

1. API de autenticación:
   - POST /api/auth/signup — registro
   - POST /api/auth/login — login
   - POST /api/auth/logout — logout
   - POST /api/auth/forgot-password — recuperar contraseña
   - POST /api/auth/reset-password — resetear contraseña

2. API de blog:
   - GET /api/blog — listar posts (con paginación, filtros)
   - GET /api/blog/[slug] — obtener post
   - POST /api/blog — crear post (admin)
   - PUT /api/blog/[id] — actualizar post (admin)
   - DELETE /api/blog/[id] — eliminar post (admin)

3. API de sermones:
   - GET /api/sermones — listar sermones
   - GET /api/sermones/[slug] — obtener sermón
   - POST /api/sermones — crear sermón (admin)
   - PUT /api/sermones/[id] — actualizar (admin)
   - DELETE /api/sermones/[id] — eliminar (admin)

4. API de eventos:
   - GET /api/eventos — listar eventos
   - GET /api/eventos/[slug] — obtener evento
   - POST /api/eventos — crear evento (admin)
   - PUT /api/eventos/[id] — actualizar (admin)
   - DELETE /api/eventos/[id] — eliminar (admin)
   - POST /api/eventos/[id]/register — registrarse

5. API de tienda:
   - GET /api/tienda/productos — listar productos
   - GET /api/tienda/productos/[id] — obtener producto
   - POST /api/tienda/productos — crear (admin)
   - PUT /api/tienda/productos/[id] — actualizar (admin)
   - DELETE /api/tienda/productos/[id] — eliminar (admin)
   - GET /api/tienda/categorias — listar categorías
   - POST /api/tienda/pedidos — crear pedido
   - GET /api/tienda/pedidos — listar pedidos (admin)
   - PUT /api/tienda/pedidos/[id] — actualizar estado (admin)

6. API de donaciones:
   - POST /api/donaciones — crear donación
   - GET /api/donaciones — listar (admin)
   - GET /api/donaciones/resumen — resumen (admin)

7. API de miembros:
   - GET /api/miembros — listar (admin)
   - POST /api/miembros — crear (admin)
   - PUT /api/miembros/[id] — actualizar (admin)
   - DELETE /api/miembros/[id] — eliminar (admin)

8. API de upload:
   - POST /api/upload — upload de archivos a Supabase Storage
   - DELETE /api/upload/[id] — eliminar archivo

9. API de contacto:
   - POST /api/contact — enviar mensaje de contacto
   - GET /api/contact — listar mensajes (admin)

10. Todas las rutas admin deben:
    - Verificar autenticación
    - Verificar rol/permisos
    - Validar input con zod
    - Retornar errores consistentes
    - Manejar paginación, búsqueda, filtros
```

---

## FASE 14 — SEO, Performance, Accesibilidad, Testing

```
Optimiza el sitio para producción.

1. SEO:
   - Metadata dinámica para cada página (generateMetadata)
   - OpenGraph images para compartir en redes
   - Sitemap.xml dinámico
   - robots.txt
   - JSON-LD structured data (Church, Event, Article, Product)
   - Canonical URLs
   - Meta description para cada página

2. Performance:
   - Optimizar imágenes con next/image
   - Lazy loading de componentes pesados
   - Code splitting automático
   - Preload de fuentes críticas
   - Comprimir assets
   - Medir con Lighthouse (target: 90+ en todas las categorías)
   - ISR (Incremental Static Regeneration) para contenido dinámico
   - Caché de Supabase queries

3. Accesibilidad:
   - ARIA labels en todos los elementos interactivos
   - Navegación por teclado completa
   - Skip to content link
   - Alt text en todas las imágenes
   - Focus visible styles
   - Screen reader friendly
   - Contraste de colores verificado
   - reduced-motion media query

4. Testing:
   - Configurar Vitest + React Testing Library
   - Tests unitarios para utils y hooks
   - Tests de componentes clave
   - Tests de API routes
   - E2E básicos con Playwright (login, navegación, formularios)

5. Error handling:
   - error.tsx en cada layout group
   - not-found.tsx personalizado
   - Loading states consistentes
   - Offline fallback
```

---

## FASE 15 — Deployment, CI/CD y entrega

```
Despliega el proyecto en producción.

1. GitHub:
   - Crear repositorio
   - Configurar .gitignore
   - Branch strategy: main (producción), develop (desarrollo)
   - Pull request template
   - GitHub Actions:
     * Lint + type check en cada PR
     * Build test en cada PR
     * Deploy automático a Vercel en merge a main

2. Supabase (producción):
   - Crear proyecto en Supabase
   - Ejecutar todas las migraciones
   - Ejecutar seed data
   - Configurar Storage buckets (images, audio, video, documents)
   - Configurar RLS policies
   - Configurar email templates (confirmación, reset password)
   - Variables de entorno en Vercel

3. Vercel:
   - Conectar con GitHub
   - Configurar variables de entorno
   - Configurar dominio personalizado (si lo tienen)
   - Preview deployments para PRs
   - Analytics
   - Edge functions si es necesario

4. Post-deployment checks:
   - Verificar todas las páginas
   - Verificar formularios
   - Verificar auth flow completo
   - Verificar dark/light mode
   - Verificar mobile
   - Verificar SEO (meta tags, OpenGraph)
   - Speed test con Lighthouse
   - Verificar imágenes y assets

5. Documentación de entrega:
   - Guía de uso del panel admin
   - Credenciales de acceso
   - Cómo agregar contenido
   - Cómo gestionar la tienda
   - Contacto para soporte
```
