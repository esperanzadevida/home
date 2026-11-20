-- ==============================================================================
-- Schema Inicial de Base de Datos - Doménica Iglesia Asambleas de Dios
-- Archivo: supabase/migrations/20261119000001_initial_schema.sql
-- ==============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Internal helpers belong in an unexposed schema, not in the Data API schema.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

-- 2. Tipos ENUM personalizados
CREATE TYPE user_role_enum AS ENUM (
  'super_admin',
  'admin',
  'editor',
  'moderator',
  'member',
  'visitor'
);

CREATE TYPE gender_enum AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE membership_status_enum AS ENUM (
  'active',
  'inactive',
  'visitor',
  'prospect'
);

CREATE TYPE content_status_enum AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE event_category_enum AS ENUM (
  'worship',
  'youth',
  'children',
  'women',
  'men',
  'outreach',
  'special'
);

CREATE TYPE event_status_enum AS ENUM (
  'draft',
  'published',
  'cancelled',
  'completed'
);

CREATE TYPE registration_status_enum AS ENUM (
  'registered',
  'confirmed',
  'cancelled',
  'attended'
);

CREATE TYPE product_status_enum AS ENUM (
  'draft',
  'active',
  'archived',
  'out_of_stock'
);

CREATE TYPE payment_status_enum AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE order_status_enum AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE donation_type_enum AS ENUM (
  'tithe',
  'offering',
  'special',
  'missions',
  'building'
);

CREATE TYPE prayer_status_enum AS ENUM (
  'pending',
  'praying',
  'answered'
);

CREATE TYPE message_status_enum AS ENUM (
  'unread',
  'read',
  'replied',
  'archived'
);

-- 3. Función auxiliar para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- 4. Perfiles de usuario (extiende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role_enum NOT NULL DEFAULT 'visitor',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- Función y trigger para auto-crear perfil al registrarse en auth.users
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data->>'full_name'), ''),
      NEW.email,
      'Usuario'
    ),
    'visitor'::public.user_role_enum
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();

-- 5. Roles y Permisos granulares
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- 6. Miembros de la Iglesia
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender gender_enum DEFAULT 'other',
  membership_date DATE DEFAULT CURRENT_DATE,
  membership_status membership_status_enum NOT NULL DEFAULT 'visitor',
  baptism_date DATE,
  ministry_ids UUID[] DEFAULT ARRAY[]::UUID[],
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 7. Blog y Categorías
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status content_status_enum NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 8. Series de Sermones y Sermones
CREATE TABLE sermon_series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content JSONB,
  pastor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  series_id UUID REFERENCES sermon_series(id) ON DELETE SET NULL,
  audio_url TEXT,
  video_url TEXT,
  cover_image TEXT,
  scripture_reference TEXT,
  date_preached DATE NOT NULL,
  duration_minutes INTEGER,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status content_status_enum NOT NULL DEFAULT 'draft',
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_sermons_updated_at
  BEFORE UPDATE ON sermons
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 9. Eventos y Registros
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content JSONB,
  cover_image TEXT,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  recurrence JSONB,
  category event_category_enum NOT NULL DEFAULT 'worship',
  max_attendees INTEGER,
  registration_required BOOLEAN NOT NULL DEFAULT FALSE,
  status event_status_enum NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  attendees_count INTEGER NOT NULL DEFAULT 1,
  status registration_status_enum NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_event_registrations_updated_at
  BEFORE UPDATE ON event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 10. Ministerios
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  cover_image TEXT,
  leader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  meeting_schedule JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_ministries_updated_at
  BEFORE UPDATE ON ministries
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 11. Tienda: Categorías, Productos, Pedidos e Items
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content JSONB,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price >= 0),
  cost_price NUMERIC(10,2) CHECK (cost_price >= 0),
  sku TEXT UNIQUE,
  barcode TEXT,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
  is_digital BOOLEAN NOT NULL DEFAULT FALSE,
  digital_file_url TEXT,
  weight NUMERIC(8,2),
  dimensions JSONB,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status product_status_enum NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status_enum NOT NULL DEFAULT 'pending',
  order_status order_status_enum NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Donaciones
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  type donation_type_enum NOT NULL DEFAULT 'tithe',
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  status payment_status_enum NOT NULL DEFAULT 'pending',
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 13. Peticiones de Oración
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_name TEXT NOT NULL,
  requester_email TEXT,
  request TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_answered BOOLEAN NOT NULL DEFAULT FALSE,
  status prayer_status_enum NOT NULL DEFAULT 'pending',
  prayers_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_prayer_requests_updated_at
  BEFORE UPDATE ON prayer_requests
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 14. Mensajes de Contacto
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status message_status_enum NOT NULL DEFAULT 'unread',
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- 15. Configuración del Sitio
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Archivos y Media
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

-- ==============================================================================
-- Índices para Rendimiento y Búsqueda
-- ==============================================================================
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status_published_at ON blog_posts(status, published_at DESC);
CREATE INDEX idx_sermons_slug ON sermons(slug);
CREATE INDEX idx_sermons_date_preached ON sermons(date_preached DESC);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date ASC);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_prayer_requests_is_public ON prayer_requests(is_public, created_at DESC);

-- ==============================================================================
-- Configuración de Seguridad: Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermon_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Internal role check. Keep SECURITY DEFINER helpers outside exposed schemas,
-- pin their search path, and qualify every application object they reference.
CREATE OR REPLACE FUNCTION private.is_admin_or_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = (SELECT auth.uid())
      AND profile.role IN ('super_admin', 'admin', 'editor')
      AND profile.is_active IS TRUE
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin_or_editor() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin_or_editor() TO authenticated;

-- A profile is readable only by its owner or an active admin/editor.
-- Client-side profile edits are limited to non-privileged columns; role changes
-- and account activation must be performed by a trusted server-side workflow.
REVOKE ALL PRIVILEGES ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE UPDATE (role, is_active) ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, phone) ON TABLE public.profiles TO authenticated;

CREATE POLICY "Usuarios leen su propio perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Administradores leen perfiles"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Usuarios actualizan campos básicos de su perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Public reads are status-only. Admin access is a separate authenticated path,
-- so anonymous requests never need EXECUTE on the private role helper.
CREATE POLICY "Lectura pública de blog publicados"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Administradores leen todo el blog"
  ON blog_posts FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin gestión total de blog"
  ON blog_posts FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Lectura pública de sermones publicados"
  ON sermons FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Administradores leen todos los sermones"
  ON sermons FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin gestión total de sermones"
  ON sermons FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Lectura pública de categorías"
  ON blog_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Lectura pública de series de sermones"
  ON sermon_series FOR SELECT
  TO anon, authenticated
  USING (true);

-- Events and registrations
CREATE POLICY "Lectura pública de eventos publicados"
  ON events FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Administradores leen todos los eventos"
  ON events FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin gestión total de eventos"
  ON events FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Event registration INSERT stays unavailable until a validated server API exists.
CREATE POLICY "Administradores leen registros"
  ON event_registrations FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

-- Ministries
CREATE POLICY "Lectura pública de ministerios activos"
  ON ministries FOR SELECT
  TO anon, authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Administradores leen todos los ministerios"
  ON ministries FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin gestión total de ministerios"
  ON ministries FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Products retain their existing fields and data model; public reads and the
-- admin path are separated so anon only evaluates the public status predicate.
CREATE POLICY "Lectura pública de categorías de productos"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Lectura pública de productos activos"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Administradores leen todos los productos"
  ON products FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin gestión total de productos"
  ON products FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Client order/item INSERT stays unavailable until a validated server API exists.
CREATE POLICY "Clientes leen sus pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = customer_id);

CREATE POLICY "Administradores leen todos los pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin actualiza pedidos"
  ON orders FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Clientes leen items de sus pedidos"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.orders AS customer_order
      WHERE customer_order.id = order_items.order_id
        AND customer_order.customer_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Administradores leen items de pedidos"
  ON order_items FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

-- Prayer requests can contain sensitive information. Keep them private until
-- a reviewed public testimony workflow exists; only admins can read them.
CREATE POLICY "Administradores leen todas las peticiones"
  ON prayer_requests FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin actualiza peticiones de oración"
  ON prayer_requests FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Donation writes remain unavailable until a validated payment/server workflow exists.
CREATE POLICY "Donantes leen sus donaciones"
  ON donations FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = donor_id);

CREATE POLICY "Administradores leen donaciones"
  ON donations FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Admin actualiza donaciones"
  ON donations FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Contact form writes remain unavailable until a validated server API exists.
CREATE POLICY "Solo administradores leen mensajes de contacto"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Solo administradores actualizan mensajes de contacto"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

-- Public site settings are allow-listed; admins have a separate full path.
CREATE POLICY "Lectura pública de configuraciones permitidas"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (key IN ('church_profile', 'service_times', 'social_links'));

CREATE POLICY "Administradores leen toda la configuración"
  ON site_settings FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Solo administradores editan configuración"
  ON site_settings FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));

CREATE POLICY "Lectura pública de media"
  ON media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Solo administradores gestionan media"
  ON media FOR ALL
  TO authenticated
  USING ((SELECT private.is_admin_or_editor()))
  WITH CHECK ((SELECT private.is_admin_or_editor()));
