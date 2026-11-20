-- ==============================================================================
-- Datos Semilla (Seed) - Doménica Iglesia Asambleas de Dios
-- Archivo: supabase/seed/seed.sql
-- ==============================================================================

-- 1. Roles del Sistema
INSERT INTO roles (id, name, description, permissions) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'super_admin', 'Acceso total y configuración del sistema', '{"all": true}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002', 'admin', 'Gestión general de contenido, miembros y tienda', '{"blog": {"all": true}, "sermons": {"all": true}, "events": {"all": true}, "members": {"all": true}, "store": {"all": true}, "donations": {"read": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000003', 'editor', 'Redacción de blog, publicación de sermones y eventos', '{"blog": {"create": true, "edit": true}, "sermons": {"create": true, "edit": true}, "events": {"create": true, "edit": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000004', 'moderator', 'Moderación de peticiones de oración y mensajes de contacto', '{"prayer": {"moderate": true}, "contact": {"read": true, "reply": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000005', 'member', 'Miembro registrado con acceso a comunidad y pedidos', '{"profile": {"edit_self": true}, "orders": {"view_self": true}}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. Configuración Global del Sitio
INSERT INTO site_settings (key, value) VALUES
  ('church_profile', '{
    "name": "Iglesia Doménica",
    "short_name": "Doménica",
    "denomination": "Asambleas de Dios",
    "slogan": "Una fe que se vive en comunidad.",
    "email": "hola@domenicaiglesia.ec",
    "phone": "+593 99 246 3817",
    "address": "Calle Los Arrayanes y avenida de los Guaytambos, sector Ficoa, Ambato",
    "city": "Ambato",
    "region": "Tungurahua",
    "country": "Ecuador",
    "founded": 2014
  }'::jsonb),
  ('service_times', '[
    {"day": "Domingos", "time": "09:00 y 11:30", "name": "Celebración y enseñanza"},
    {"day": "Miércoles", "time": "19:30", "name": "Oración y Palabra"},
    {"day": "Viernes", "time": "19:30", "name": "Embajadores · Jóvenes"}
  ]'::jsonb),
  ('social_links', '[
    {"network": "Instagram", "handle": "@domenica.ambato"},
    {"network": "Facebook", "handle": "Iglesia Doménica Ambato"},
    {"network": "YouTube", "handle": "@iglesiadomenica"}
  ]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Categorías de Blog
INSERT INTO blog_categories (id, name, slug, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Vida Cristiana', 'vida-cristiana', 'Artículos sobre devoción diaria, oración y crecimiento espiritual'),
  ('b0000000-0000-0000-0000-000000000002', 'Doctrina y Teología', 'doctrina-teologia', 'Estudios de las 16 Verdades Fundamentales y la doctrina pentecostal'),
  ('b0000000-0000-0000-0000-000000000003', 'Misiones y Evangelismo', 'misiones-evangelismo', 'Testimonios de plantación de iglesias y obra misionera global'),
  ('b0000000-0000-0000-0000-000000000004', 'Familia y Juventud', 'familia-juventud', 'Principios bíblicos para matrimonios, padres y nuevas generaciones')
ON CONFLICT (slug) DO NOTHING;

-- 4. Series de Sermones
INSERT INTO sermon_series (id, title, slug, description, start_date, status) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'El Poder del Espíritu Santo', 'poder-espiritu-santo', 'Un recorrido por el libro de Hechos y el bautismo en el Espíritu Santo', '2026-10-01', 'active'),
  ('c0000000-0000-0000-0000-000000000002', 'Gracia Inquebrantable', 'gracia-inquebrantable', 'Fundamentos de la salvación y la seguridad eterna en Cristo', '2026-08-01', 'completed')
ON CONFLICT (slug) DO NOTHING;

-- Fixtures editoriales del catálogo público actual; confirmar catálogo y existencias antes de publicar en DB.
-- 5. Categorías de Tienda
INSERT INTO product_categories (id, name, slug, description, order_index) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Lectura', 'lectura', 'Recursos editoriales para explorar pasajes, temas y referencias.', 1),
  ('d0000000-0000-0000-0000-000000000002', 'Hábitos', 'habitos', 'Recursos para acompañar preguntas, gratitud y aprendizajes semanales.', 2),
  ('d0000000-0000-0000-0000-000000000003', 'Comunidad', 'comunidad', 'Recursos con la identidad visual de la comunidad.', 3)
ON CONFLICT (slug) DO NOTHING;

-- 6. Productos editoriales: sin stock, ficha técnica ni imágenes confirmadas.
INSERT INTO products (id, name, slug, description, price, compare_at_price, category_id, stock_quantity, featured, status, images) VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Biblia de estudio',
    'biblia-de-estudio',
    'Una edición de lectura amplia para explorar pasajes, temas y referencias con más contexto.',
    28.00,
    NULL,
    'd0000000-0000-0000-0000-000000000001',
    0,
    FALSE,
    'draft',
    ARRAY[]::TEXT[]
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Cuaderno de reflexión',
    'cuaderno-de-reflexion',
    'Páginas guiadas para anotar preguntas, gratitud y aprendizajes de cada semana.',
    9.00,
    NULL,
    'd0000000-0000-0000-0000-000000000002',
    0,
    FALSE,
    'draft',
    ARRAY[]::TEXT[]
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'Camiseta Doménica',
    'camiseta-domenica',
    'Una prenda sencilla con la identidad visual de la comunidad, disponible en varias tallas.',
    18.00,
    NULL,
    'd0000000-0000-0000-0000-000000000003',
    0,
    FALSE,
    'draft',
    ARRAY[]::TEXT[]
  )
ON CONFLICT (slug) DO NOTHING;

-- 7. Ministerios Oficiales
INSERT INTO ministries (id, name, slug, description, order_index, is_active) VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'Exploradores del Rey',
    'exploradores-del-rey',
    'Programa formativo de liderazgo, carácter cristiano y destrezas al aire libre para niños y muchachos de 5 a 17 años.',
    1,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'Misioneritas',
    'misioneritas',
    'Formación integral para niñas y señoritas con énfasis en misiones, servicio comunitario y vida consagrada.',
    2,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'Embajadores de Cristo',
    'embajadores-de-cristo',
    'Comunidad juvenil dinámica que conecta estudiantes y profesionales jóvenes a través del discipulado bíblico y la comunión.',
    3,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000004',
    'Ministerio de Alabanza y Artes',
    'alabanza-y-artes',
    'Músicos, cantantes y equipo audiovisual dedicados a dirigir a la congregación en una adoración bíblica, sincera y de excelencia.',
    4,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- No sembrar peticiones personales o sensibles inventadas como si provinieran de personas reales.
