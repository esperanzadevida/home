# Guía de Componentes Reutilizables

## Filosofía
Los componentes siguen un sistema estricto: pocos estilos, bien categorizados, fáciles de
reutilizar en cualquier parte de la página (pública o admin).

## Categorías de Componentes

### 1. UI Base (src/components/ui/)
Componentes atómicos basados en Shadcn/UI + customizados:
- `Button` — máximo 4 variantes: default, secondary, outline, ghost
- `Input` — texto, email, password, number, search
- `Textarea` — con autosize opcional
- `Select` — dropdown con búsqueda
- `Checkbox` / `Radio` / `Switch`
- `Badge` — status, categoría, etiquetas
- `Avatar` — usuario, pastor, miembro
- `Separator` — línea horizontal/vertical
- `Skeleton` — loading states
- `Dialog` / `Modal` — confirmaciones, formularios
- `Sheet` — panel lateral (mobile menu, filtros)
- `Dropdown Menu` / `Context Menu`
- `Tooltip` / `Popover`
- `Tabs` — navegación interna
- `Accordion` — FAQ, contenido colapsable
- `Toast` / `Sonner` — notificaciones
- `Calendar` (react-day-picker) — selección de fechas
- `Time Picker` — selección de hora
- `Command` — command palette (Ctrl+K)

### 2. Layout (src/components/layout/)
- `Navbar` — navegación pública con menú responsive
- `Footer` — info de la iglesia, links, redes sociales
- `Sidebar` — navegación del admin panel
- `PageHeader` — header de cada sección con breadcrumbs
- `Container` — wrapper con max-width
- `Section` — wrapper de sección con padding y fondo opcionales
- `AdminLayout` — layout wrapper del panel admin

### 3. Sections (src/components/sections/)
Secciones de página completas y reutilizables:
- `HeroSection` — hero principal con video/imagen
- `AboutSection` — sobre la iglesia
- `ServicesSection` — horarios de servicios
- `SermonsSection` — últimos sermones
- `EventsSection` — próximos eventos
- `MinistriesSection` — ministerios
- `TestimonialsSection` — testimonios
- `CTASection` — llamada a la acción
- `StatsSection` — estadísticas
- `GallerySection` — galería de fotos
- `BlogSection` — últimos posts
- `ContactSection` — formulario de contacto
- `DonationSection` — sección de donaciones
- `MapSection` — mapa con MapLibre
- `LiveStreamSection` — transmisión en vivo

### 4. Cards (src/components/cards/)
- `EventCard` — evento con fecha, título, descripción, lugar
- `SermonCard` — sermón con título, pastor, fecha, play button
- `BlogCard` — post con imagen, título, extracto, fecha
- `ProductCard` — producto de tienda con imagen, precio, CTA
- `MinistryCard` — ministerio con icono, nombre, descripción
- `MemberCard` — miembro/pastor con foto, nombre, rol
- `TestimonialCard` — testimonio con foto, nombre, cita
- `PrayerRequestCard` — petición de oración

### 5. Forms (src/components/forms/)
- `ContactForm` — nombre, email, mensaje
- `PrayerForm` — petición de oración
- `DonationForm` — monto, método de pago
- `RegistrationForm` — registro de miembro
- `EventRegistrationForm` — inscripción a evento
- `LoginForm` — email + password
- `ProductForm` (admin) — crear/editar producto
- `BlogPostForm` (admin) — editor de blog con BlockNote
- `SermonForm` (admin) — subir sermón
- `EventForm` (admin) — crear/editar evento

### 6. Media (src/components/media/)
- `VideoPlayer` — reproductor de video (sermones, en vivo)
- `AudioPlayer` — reproductor de audio (sermones, podcast)
- `ImageGallery` — galería con lightbox
- `ImageEditor` — editor de imagen para admin
- `FileUploader` — subida de archivos con drag & drop
- `MapView` — mapa interactivo con MapLibre GL JS

### 7. Admin (src/components/admin/)
- `DataTable` — tabla con sort, filter, pagination
- `StatsCard` — card de estadística para dashboard
- `ChartWidget` — gráficos para reportes
- `RichTextEditor` — editor Tiptap/BlockNote
- `MediaManager` — gestor de archivos
- `RoleSelector` — selector de rol/permisos
- `UserList` — lista de usuarios con acciones

### 8. Shared (src/components/shared/)
- `ThemeToggle` — switch dark/light mode
- `SearchBar` — barra de búsqueda global
- `Pagination` — paginación
- `Breadcrumbs` — ruta de navegación
- `EmptyState` — estado vacío con ilustración
- `ErrorBoundary` — manejo de errores
- `LoadingSpinner` — indicador de carga
- `SocialLinks` — links a redes sociales
- `ShareButtons` — compartir contenido

### 9. Icons (src/components/icons/)
- Iconos SVG personalizados de la iglesia
- Re-exports de Lucide icons
