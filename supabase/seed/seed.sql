-- ==============================================================================
-- Datos Semilla (Seed) - Iglesia Esperanza de Vida, Asambleas de Dios
-- Archivo: supabase/seed/seed.sql
-- ==============================================================================

-- 1. Roles del Sistema
INSERT INTO roles (id, name, description, permissions) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'super_admin', 'Acceso total y configuración del sistema', '{"all": true}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002', 'admin', 'Gestión general de contenido, miembros y tienda', '{"blog": {"all": true}, "sermons": {"all": true}, "events": {"all": true}, "members": {"all": true}, "store": {"all": true}, "donations": {"read": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000003', 'editor', 'Redacción de blog, publicación de sermones y eventos', '{"blog": {"create": true, "edit": true}, "sermons": {"create": true, "edit": true}, "events": {"create": true, "edit": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000004', 'moderator', 'Moderación de peticiones de oración y mensajes de contacto', '{"prayer": {"moderate": true}, "contact": {"read": true, "reply": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000005', 'member', 'Miembro registrado con acceso a comunidad y pedidos', '{"profile": {"edit_self": true}, "orders": {"view_self": true}}'::jsonb),
  ('a0000000-0000-0000-0000-000000000006', 'visitor', 'Cuenta registrada sin permisos administrativos', '{"profile": {"edit_self": true}}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. Configuración Global del Sitio
INSERT INTO site_settings (key, value) VALUES
  ('church_profile', '{
    "name": "Iglesia Esperanza de Vida",
    "short_name": "Esperanza de Vida",
    "denomination": "Asambleas de Dios",
    "lead_pastor": "Samuel Andrade",
    "signature": "Caminamos en la luz, crecemos en comunidad.",
    "email": "hola@esperanzadevida.ec",
    "phone": "+593 98 447 2651",
    "address": "Avenida Miraflores y calle Los Arrayanes, sector Ficoa, Ambato",
    "city": "Ambato",
    "region": "Tungurahua",
    "country": "Ecuador",
    "founded": 2014
  }'::jsonb),
  ('service_times', '[
    {"days": "Domingos", "time": "09:00 y 11:30", "title": "Celebración y enseñanza"},
    {"days": "Miércoles", "time": "19:30", "title": "Oración y Palabra"},
    {"days": "Viernes", "time": "19:30", "title": "Embajadores · Jóvenes"}
  ]'::jsonb),
  ('social_links', '[
    {"network": "Instagram", "handle": "@esperanza.vida.ambato"},
    {"network": "Facebook", "handle": "Iglesia Esperanza de Vida"},
    {"network": "YouTube", "handle": "@esperanzadevida"}
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
    'Camiseta Esperanza de Vida',
    'camiseta-esperanza-de-vida',
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

-- 7. Ministerios de la comunidad
INSERT INTO ministries (id, name, slug, description, order_index, is_active) VALUES
  (
    'f0000000-0000-0000-0000-000000000001',
    'Exploradores',
    'exploradores',
    'Un espacio para descubrir historias de fe, hacer preguntas y aprender jugando en un ambiente cercano.',
    1,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000002',
    'Embajadores',
    'embajadores',
    'Jóvenes que construyen amistades, conversan sobre su vida y buscan servir con propósito.',
    2,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000003',
    'Adoración',
    'adoracion',
    'Voces y músicos que acompañan a la iglesia en tiempos de alabanza, escucha y reflexión.',
    3,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000004',
    'Oración',
    'oracion',
    'Personas que reservan un tiempo para orar, escuchar y sostenerse mutuamente.',
    4,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000005',
    'Familias',
    'familias',
    'Encuentros para fortalecer vínculos y compartir ideas para la vida en casa y en comunidad.',
    5,
    TRUE
  ),
  (
    'f0000000-0000-0000-0000-000000000006',
    'Bienvenida y cuidado',
    'bienvenida-y-cuidado',
    'Un equipo que ayuda a cada persona a sentirse orientada y recibida desde su primera visita.',
    6,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- No sembrar peticiones personales o sensibles inventadas como si provinieran de personas reales.
