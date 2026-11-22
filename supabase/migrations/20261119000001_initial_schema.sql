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
  'owner',
  'super_admin',
  'admin',
  'pastor',
  'finance_manager',
  'editor',
  'moderator',
  'member',
  'visitor'
);

-- A person may serve in multiple ministries and hold a different scoped role
-- in each one; these assignments never replace the account-wide profile role.
CREATE TYPE ministry_role_enum AS ENUM (
  'leader',
  'coordinator',
  'musician',
  'volunteer',
  'member'
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

-- There is one account owner; ownership changes require a protected workflow.
CREATE UNIQUE INDEX idx_profiles_single_owner
  ON profiles (role)
  WHERE role = 'owner';

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

CREATE TABLE ministry_role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  role ministry_role_enum NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (profile_id, ministry_id, role)
);

CREATE INDEX idx_ministry_roles_profile ON ministry_role_assignments(profile_id, is_active);
CREATE INDEX idx_ministry_roles_ministry ON ministry_role_assignments(ministry_id, role, is_active);

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
ALTER TABLE ministry_role_assignments ENABLE ROW LEVEL SECURITY;

-- Internal role checks. Keep SECURITY DEFINER helpers outside exposed schemas,
-- pin their search path, and qualify every application object they reference.
CREATE OR REPLACE FUNCTION private.is_admin()
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
      AND profile.role IN ('owner', 'super_admin', 'admin')
      AND profile.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.is_owner()
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
      AND profile.role = 'owner'
      AND profile.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.is_pastor()
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
      AND profile.role = 'pastor'
      AND profile.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.is_finance_manager()
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
      AND profile.role = 'finance_manager'
      AND profile.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.has_ministry_role(
  _ministry_id UUID,
  _allowed_roles public.ministry_role_enum[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ministry_role_assignments AS assignment
    WHERE assignment.profile_id = (SELECT auth.uid())
      AND assignment.ministry_id = _ministry_id
      AND assignment.role = ANY(_allowed_roles)
      AND assignment.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.is_content_manager()
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
      AND profile.role IN ('owner', 'super_admin', 'admin', 'editor')
      AND profile.is_active IS TRUE
  );
$$;

CREATE OR REPLACE FUNCTION private.is_moderator()
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
      AND profile.role IN ('owner', 'super_admin', 'admin', 'moderator')
      AND profile.is_active IS TRUE
  );
$$;

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_owner() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_pastor() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_finance_manager() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.has_ministry_role(UUID, public.ministry_role_enum[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_content_manager() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_moderator() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_pastor() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_finance_manager() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_ministry_role(UUID, public.ministry_role_enum[]) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_content_manager() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_moderator() TO authenticated;

-- Revoke implicit Data API access, then grant only operations covered by an
-- explicit RLS policy. Public catalog products are exposed through a safe view.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

GRANT SELECT ON TABLE public.ministry_role_assignments TO authenticated;

GRANT SELECT ON TABLE public.blog_categories, public.blog_posts, public.sermon_series,
  public.sermons, public.events, public.ministries, public.product_categories,
  public.products, public.orders, public.order_items, public.event_registrations,
  public.donations, public.prayer_requests, public.contact_messages,
  public.site_settings, public.media TO authenticated;
GRANT SELECT ON TABLE public.blog_categories, public.blog_posts, public.sermon_series,
  public.sermons, public.events, public.ministries, public.product_categories,
  public.site_settings TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.members TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.blog_categories, public.blog_posts,
  public.sermon_series, public.sermons, public.events, public.ministries,
  public.product_categories, public.products, public.site_settings, public.media
  TO authenticated;
GRANT UPDATE ON TABLE public.orders, public.donations, public.prayer_requests,
  public.contact_messages TO authenticated;

-- Never expose internal product cost, stock details, barcodes, or digital file
-- URLs through the public catalog endpoint.
CREATE VIEW public.public_products WITH (security_invoker = false) AS
SELECT id, name, slug, description, content, price, compare_at_price, category_id,
  images, is_digital, weight, dimensions, tags, featured
FROM public.products
WHERE status = 'active';
GRANT SELECT ON TABLE public.public_products TO anon, authenticated;
GRANT SELECT ON TABLE public.public_products TO service_role;

-- A profile is readable only by its owner or an active administrator.
-- Client-side profile edits are limited to non-privileged columns; role changes
-- and account activation must be performed by a trusted server-side workflow.
REVOKE ALL PRIVILEGES ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
REVOKE UPDATE (role, is_active) ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
-- Restore only the self-service profile operations that the RLS policies below govern.
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, phone) ON TABLE public.profiles TO authenticated;
CREATE POLICY "Usuarios leen su propio perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Administradores leen perfiles"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Usuarios actualizan campos básicos de su perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Administradores leen miembros"
  ON members FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Administradores crean miembros"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Administradores editan miembros"
  ON members FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Propietario elimina miembros"
  ON members FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Pastores consultan el directorio pastoral"
  ON members FOR SELECT
  TO authenticated
  USING ((SELECT private.is_pastor()));

CREATE POLICY "Usuarios consultan sus asignaciones ministeriales"
  ON ministry_role_assignments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = profile_id);

CREATE POLICY "Administradores consultan asignaciones ministeriales"
  ON ministry_role_assignments FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

-- Public reads are status-only. Private role checks are only used by authenticated policies.
CREATE POLICY "Lectura pública de blog publicados"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Personal editorial lee todo el blog"
  ON blog_posts FOR SELECT
  TO authenticated
  USING ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial crea entradas"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita entradas"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina entradas"
  ON blog_posts FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Personal editorial crea categorías"
  ON blog_categories FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita categorías"
  ON blog_categories FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina categorías"
  ON blog_categories FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Lectura pública de sermones publicados"
  ON sermons FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Personal editorial lee todos los sermones"
  ON sermons FOR SELECT
  TO authenticated
  USING ((SELECT private.is_content_manager()));

CREATE POLICY "Pastores consultan sermones"
  ON sermons FOR SELECT
  TO authenticated
  USING ((SELECT private.is_pastor()));

CREATE POLICY "Personal editorial crea sermones"
  ON sermons FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita sermones"
  ON sermons FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina sermones"
  ON sermons FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Lectura pública de categorías"
  ON blog_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Lectura pública de series de sermones"
  ON sermon_series FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Personal editorial crea series"
  ON sermon_series FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita series"
  ON sermon_series FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina series"
  ON sermon_series FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

-- Events and registrations
CREATE POLICY "Lectura pública de eventos publicados"
  ON events FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Personal editorial lee todos los eventos"
  ON events FOR SELECT
  TO authenticated
  USING ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial crea eventos"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita eventos"
  ON events FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina eventos"
  ON events FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

-- Event registration INSERT stays unavailable until a validated server API exists.
CREATE POLICY "Administradores leen registros"
  ON event_registrations FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

-- Ministries
CREATE POLICY "Lectura pública de ministerios activos"
  ON ministries FOR SELECT
  TO anon, authenticated
  USING (is_active IS TRUE);

CREATE POLICY "Administradores leen todos los ministerios"
  ON ministries FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Pastores consultan ministerios"
  ON ministries FOR SELECT
  TO authenticated
  USING ((SELECT private.is_pastor()));

CREATE POLICY "Integrantes consultan sus ministerios asignados"
  ON ministries FOR SELECT
  TO authenticated
  USING (
    (SELECT private.has_ministry_role(
      id,
      ARRAY['leader', 'coordinator', 'musician', 'volunteer', 'member']::public.ministry_role_enum[]
    ))
  );

CREATE POLICY "Administradores crean ministerios"
  ON ministries FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Administradores editan ministerios"
  ON ministries FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Propietario elimina ministerios"
  ON ministries FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

-- Product categories are public. Product details use a safe view so the public
-- API never exposes internal cost, exact stock, barcode, or download fields.
CREATE POLICY "Lectura pública de categorías de productos"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Administradores crean categorías de productos"
  ON product_categories FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Administradores editan categorías de productos"
  ON product_categories FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Propietario elimina categorías de productos"
  ON product_categories FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Administradores leen todos los productos"
  ON products FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Administradores crean productos"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Administradores editan productos"
  ON products FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Propietario elimina productos"
  ON products FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

-- Client order/item INSERT stays unavailable until a validated server API exists.
CREATE POLICY "Clientes leen sus pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = customer_id);

CREATE POLICY "Administradores leen todos los pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Admin actualiza pedidos"
  ON orders FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

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
  USING ((SELECT private.is_admin()));

-- Prayer and contact records contain personal information; moderators and
-- administrators may process them, while editors cannot access these modules.
CREATE POLICY "Moderadores leen peticiones de oración"
  ON prayer_requests FOR SELECT
  TO authenticated
  USING ((SELECT private.is_moderator()));

CREATE POLICY "Pastores leen peticiones de oración"
  ON prayer_requests FOR SELECT
  TO authenticated
  USING ((SELECT private.is_pastor()));

CREATE POLICY "Admin actualiza peticiones de oración"
  ON prayer_requests FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_moderator()))
  WITH CHECK ((SELECT private.is_moderator()));

CREATE POLICY "Pastores actualizan peticiones de oración"
  ON prayer_requests FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_pastor()))
  WITH CHECK ((SELECT private.is_pastor()));

-- Donation writes remain unavailable until a validated payment/server workflow exists.
CREATE POLICY "Donantes leen sus donaciones"
  ON donations FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = donor_id);

CREATE POLICY "Administradores leen donaciones"
  ON donations FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Tesorería lee donaciones"
  ON donations FOR SELECT
  TO authenticated
  USING ((SELECT private.is_finance_manager()));

CREATE POLICY "Admin actualiza donaciones"
  ON donations FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

-- Contact form writes remain unavailable until a validated server API exists.
CREATE POLICY "Moderadores leen mensajes de contacto"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((SELECT private.is_moderator()));

CREATE POLICY "Moderadores actualizan mensajes de contacto"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_moderator()))
  WITH CHECK ((SELECT private.is_moderator()));

-- Public site settings are allow-listed; admins have a separate full path.
CREATE POLICY "Lectura pública de configuraciones permitidas"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (key IN ('church_profile', 'service_times', 'social_links'));

CREATE POLICY "Administradores leen toda la configuración"
  ON site_settings FOR SELECT
  TO authenticated
  USING ((SELECT private.is_admin()));

CREATE POLICY "Administradores crean configuración"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Administradores editan configuración"
  ON site_settings FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_admin()))
  WITH CHECK ((SELECT private.is_admin()));

CREATE POLICY "Propietario elimina configuración"
  ON site_settings FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));

CREATE POLICY "Personal editorial lee media"
  ON media FOR SELECT
  TO authenticated
  USING ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial sube media"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Personal editorial edita media"
  ON media FOR UPDATE
  TO authenticated
  USING ((SELECT private.is_content_manager()))
  WITH CHECK ((SELECT private.is_content_manager()));

CREATE POLICY "Propietario elimina media"
  ON media FOR DELETE
  TO authenticated
  USING ((SELECT private.is_owner()));
