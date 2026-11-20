# Estructura de la Base de Datos — Supabase / PostgreSQL

## Tablas principales

### Autenticación y usuarios
```sql
-- Supabase Auth maneja la tabla auth.users automáticamente
-- Esta tabla extiende el perfil del usuario

profiles
├── id (uuid, PK, FK → auth.users.id)
├── full_name (text)
├── avatar_url (text, nullable)
├── phone (text, nullable)
├── role (enum: super_admin, admin, editor, moderator, member, visitor)
├── is_active (boolean, default true)
├── created_at (timestamptz)
└── updated_at (timestamptz)

roles
├── id (uuid, PK)
├── name (text, unique)
├── description (text)
├── permissions (jsonb)  -- { "blog.create": true, "blog.edit": true, ... }
├── created_at (timestamptz)
└── updated_at (timestamptz)

user_roles
├── user_id (uuid, FK → profiles.id)
├── role_id (uuid, FK → roles.id)
└── assigned_at (timestamptz)
```

### Miembros de la iglesia
```sql
members
├── id (uuid, PK)
├── user_id (uuid, FK → profiles.id, nullable)
├── first_name (text)
├── last_name (text)
├── email (text, nullable)
├── phone (text, nullable)
├── address (text, nullable)
├── date_of_birth (date, nullable)
├── gender (enum: male, female, other)
├── membership_date (date, nullable)
├── membership_status (enum: active, inactive, visitor, prospect)
├── baptism_date (date, nullable)
├── ministry_ids (uuid[], nullable)
├── notes (text, nullable)
├── photo_url (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Blog / Publicaciones
```sql
blog_posts
├── id (uuid, PK)
├── title (text)
├── slug (text, unique)
├── content (jsonb)  -- BlockNote/Tiptap JSON format
├── excerpt (text, nullable)
├── cover_image (text, nullable)
├── author_id (uuid, FK → profiles.id)
├── category_id (uuid, nullable, FK → blog_categories.id, ON DELETE SET NULL)
├── tags (text[])
├── status (enum: draft, published, archived)
├── published_at (timestamptz, nullable)
├── featured (boolean, default false)
├── views_count (integer, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)

blog_categories
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text, nullable)
└── created_at (timestamptz)
```

### Sermones
```sql
sermons
├── id (uuid, PK)
├── title (text)
├── slug (text, unique)
├── description (text, nullable)
├── content (jsonb, nullable)  -- notas del sermón
├── pastor_id (uuid, nullable, FK → profiles.id, ON DELETE SET NULL)
├── series_id (uuid, FK → sermon_series.id, nullable)
├── audio_url (text, nullable)
├── video_url (text, nullable)
├── cover_image (text, nullable)
├── scripture_reference (text, nullable)
├── date_preached (date)
├── duration_minutes (integer, nullable)
├── tags (text[])
├── status (enum: draft, published, archived)
├── views_count (integer, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)

sermon_series
├── id (uuid, PK)
├── title (text)
├── slug (text, unique)
├── description (text, nullable)
├── cover_image (text, nullable)
├── start_date (date)
├── end_date (date, nullable)
├── status (text, default 'active'; no enum/check constraint in the migration)
└── created_at (timestamptz)
```

### Eventos
```sql
events
├── id (uuid, PK)
├── title (text)
├── slug (text, unique)
├── description (text)
├── content (jsonb, nullable)
├── cover_image (text, nullable)
├── location (text, nullable)
├── latitude (double precision, nullable)  -- coordenadas para MapLibre
├── longitude (double precision, nullable)
├── start_date (timestamptz)
├── end_date (timestamptz, nullable)
├── recurrence (jsonb, nullable)  -- reglas de recurrencia
├── category (enum: worship, youth, children, women, men, outreach, special)
├── max_attendees (integer, nullable)
├── registration_required (boolean, default false)
├── status (enum: draft, published, cancelled, completed)
├── created_by (uuid, nullable, FK → profiles.id, ON DELETE SET NULL)
├── created_at (timestamptz)
└── updated_at (timestamptz)

event_registrations
├── id (uuid, PK)
├── event_id (uuid, FK → events.id)
├── member_id (uuid, FK → members.id, nullable)
├── name (text)
├── email (text)
├── phone (text, nullable)
├── attendees_count (integer, default 1)
├── status (enum: registered, confirmed, cancelled, attended)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Ministerios
```sql
ministries
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text)
├── icon (text, nullable)
├── cover_image (text, nullable)
├── leader_id (uuid, FK → profiles.id, nullable)
├── meeting_schedule (jsonb, nullable)
├── is_active (boolean, default true)
├── order_index (integer, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Tienda
```sql
product_categories
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text, nullable)
├── image_url (text, nullable)
├── parent_id (uuid, FK → product_categories.id, nullable)
├── order_index (integer, default 0)
└── created_at (timestamptz)

products
├── id (uuid, PK)
├── name (text)
├── slug (text, unique)
├── description (text)
├── content (jsonb, nullable)  -- descripción rica
├── price (decimal(10,2))
├── compare_at_price (decimal(10,2), nullable)
├── cost_price (decimal(10,2), nullable)
├── sku (text, nullable)
├── barcode (text, nullable)
├── category_id (uuid, nullable, FK → product_categories.id, ON DELETE SET NULL)
├── images (text[])
├── stock_quantity (integer, default 0)
├── track_inventory (boolean, default true)
├── is_digital (boolean, default false)
├── digital_file_url (text, nullable)
├── weight (decimal, nullable)
├── dimensions (jsonb, nullable)
├── tags (text[])
├── status (enum: draft, active, archived, out_of_stock)
├── featured (boolean, default false)
├── created_at (timestamptz)
└── updated_at (timestamptz)

orders
├── id (uuid, PK)
├── order_number (text, unique)
├── customer_id (uuid, FK → profiles.id, nullable)
├── customer_name (text)
├── customer_email (text)
├── customer_phone (text, nullable)
├── shipping_address (jsonb, nullable)
├── items (jsonb)  -- snapshot de items al momento del pedido
├── subtotal (decimal(10,2))
├── tax (decimal(10,2), default 0)
├── shipping_cost (decimal(10,2), default 0)
├── discount (decimal(10,2), default 0)
├── total (decimal(10,2))
├── payment_method (text, nullable)
├── payment_status (enum: pending, paid, failed, refunded)
├── order_status (enum: pending, confirmed, processing, shipped, delivered, cancelled)
├── notes (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)

order_items
├── id (uuid, PK)
├── order_id (uuid, FK → orders.id)
├── product_id (uuid, FK → products.id)
├── quantity (integer)
├── unit_price (decimal(10,2))
├── total_price (decimal(10,2))
└── created_at (timestamptz)
```

### Donaciones
```sql
donations
├── id (uuid, PK)
├── donor_id (uuid, FK → profiles.id, nullable)
├── donor_name (text)
├── donor_email (text, nullable)
├── amount (decimal(10,2))
├── currency (text, default 'USD')
├── type (enum: tithe, offering, special, missions, building)
├── payment_method (text)
├── payment_reference (text, nullable)
├── status (payment_status_enum: pending, paid, failed, refunded)
├── is_anonymous (boolean, default false)
├── notes (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Peticiones de oración
```sql
prayer_requests
├── id (uuid, PK)
├── requester_name (text)
├── requester_email (text, nullable)
├── request (text)
├── is_public (boolean, default false)
├── is_answered (boolean, default false)
├── status (enum: pending, praying, answered)
├── prayers_count (integer, NOT NULL, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Contacto
```sql
contact_messages
├── id (uuid, PK)
├── name (text)
├── email (text)
├── phone (text, nullable)
├── subject (text, nullable)
├── message (text)
├── status (enum: unread, read, replied, archived)
├── replied_at (timestamptz, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### Configuración del sitio
```sql
site_settings
├── id (uuid, PK)
├── key (text, unique)
├── value (jsonb)
├── updated_by (uuid, nullable, FK → profiles.id, ON DELETE SET NULL)
└── updated_at (timestamptz)

-- RLS permite lectura pública únicamente de las claves:
-- church_profile, service_times, social_links.
-- Esta allowlist limita la lectura pública, no los valores almacenables.
```

### Media / Archivos
```sql
media
├── id (uuid, PK)
├── filename (text)
├── original_filename (text)
├── mime_type (text)
├── size_bytes (bigint)
├── url (text)
├── storage_path (text)
├── alt_text (text, nullable)
├── uploaded_by (uuid, nullable, FK → profiles.id, ON DELETE SET NULL)
├── folder (text, nullable)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## Límites de acceso definidos por RLS

- `site_settings`: la lectura pública está limitada a `church_profile`, `service_times` y `social_links`; administradores o editores autorizados pueden leer y gestionar toda la tabla.
- `prayer_requests`: `is_public = true` no hace que una petición sea públicamente legible. La migración solo permite SELECT y UPDATE a administradores o editores autorizados; no define una política de INSERT para visitantes o usuarios autenticados.
- `event_registrations`: solo permite SELECT a administradores o editores autorizados; no define una política de INSERT para registrar asistentes.

Los envíos de peticiones de oración e inscripciones requieren un flujo de servidor revisado antes de habilitarse. Las columnas `is_public` y `registration_required` no conceden acceso por sí solas.
