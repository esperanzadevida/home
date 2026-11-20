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
    "name": "Iglesia Cristiana Asambleas de Dios",
    "short_name": "Asambleas de Dios",
    "denomination": "CEADE - Confraternidad Evangélica de las Asambleas de Dios del Ecuador",
    "slogan": "Una iglesia apasionada por la presencia de Dios y el poder del Espíritu Santo",
    "email": "contacto@asambleasdedios.ec",
    "phone": "+593 99 123 4567",
    "whatsapp": "+593991234567",
    "address": "Av. de las Américas y 10 de Agosto, Guayaquil, Ecuador",
    "city": "Guayaquil",
    "country": "Ecuador",
    "coordinates": {"lat": -2.1894, "lng": -79.8891}
  }'::jsonb),
  ('service_times', '[
    {"day": "Domingo", "time": "09:00", "name": "Primer Culto de Celebración", "description": "Alabanza contemporánea y predicación expositiva"},
    {"day": "Domingo", "time": "11:30", "name": "Segundo Culto de Celebración", "description": "Servicio general con Escuela Dominical para niños"},
    {"day": "Miércoles", "time": "19:30", "name": "Noche de Intercesión y Doctrina", "description": "Estudio bíblico sistemático y clamor por sanidad divina"},
    {"day": "Sábado", "time": "18:00", "name": "Embajadores de Cristo (Jóvenes)", "description": "Encuentro de jóvenes universitarios y adolescentes"}
  ]'::jsonb),
  ('social_links', '{
    "youtube": "https://youtube.com/@asambleasdedios",
    "instagram": "https://instagram.com/asambleasdedios",
    "facebook": "https://facebook.com/asambleasdediosec",
    "spotify": "https://open.spotify.com/show/asambleasdedios"
  }'::jsonb),
  ('donation_accounts', '[
    {
      "bank": "Banco Pichincha",
      "account_type": "Corriente",
      "account_number": "2100123456",
      "beneficiary": "Iglesia Asambleas de Dios",
      "tax_id": "0991234567001",
      "email": "tesoreria@asambleasdedios.ec"
    },
    {
      "bank": "Banco Guayaquil",
      "account_type": "Ahorros",
      "account_number": "0034567891",
      "beneficiary": "Iglesia Asambleas de Dios",
      "tax_id": "0991234567001",
      "email": "tesoreria@asambleasdedios.ec"
    }
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

-- 5. Categorías de Tienda
INSERT INTO product_categories (id, name, slug, description, order_index) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Biblias de Estudio', 'biblias', 'Biblias Reina-Valera 1960, NVI y ediciones de estudio pentecostal', 1),
  ('d0000000-0000-0000-0000-000000000002', 'Libros y Teología', 'libros', 'Literatura sobre doctrina, vida devocional e historia cristiana', 2),
  ('d0000000-0000-0000-0000-000000000003', 'Streetwear y Ropa', 'streetwear', 'Polerones, camisetas minimalistas y gorras con mensajes de fe', 3),
  ('d0000000-0000-0000-0000-000000000004', 'Papelería y Cuadernos', 'papeleria', 'Cuadernos de sermón en eco-cuero, bolígrafos y planners devocionales', 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Productos Destacados
INSERT INTO products (id, name, slug, description, price, compare_at_price, category_id, stock_quantity, featured, status, images) VALUES
  (
    'e0000000-0000-0000-0000-000000000001',
    'Biblia de Estudio Pentecostal RVR 1960',
    'biblia-estudio-pentecostal-rvr1960',
    'Edición especial de lujo con encuadernación en símil piel marrón, notas doctrinales de las 16 verdades fundamentales, concordancia amplia y mapas a todo color.',
    45.00,
    55.00,
    'd0000000-0000-0000-0000-000000000001',
    35,
    TRUE,
    'active',
    ARRAY['/images/hero/hero-9.jpg']
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    'Cuaderno de Sermón en Cuero Vegano',
    'cuaderno-sermon-cuero-vegano',
    'Journal premium tamaño A5 de 200 páginas punteadas en papel marfil de 100g. Diseñado para tomar notas dominicales y registrar reflexiones y oraciones contestadas.',
    18.50,
    22.00,
    'd0000000-0000-0000-0000-000000000004',
    80,
    TRUE,
    'active',
    ARRAY['/images/hero/hero-6.jpg']
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    'Hoodie Minimalista "Fuego y Gracia"',
    'hoodie-minimalista-fuego-y-gracia',
    'Buzo con capucha oversize confeccionado en 100% algodón pesado (380 GSM). Tipografía limpia en pecho y símbolo sutil de la llama en el puño.',
    38.00,
    45.00,
    'd0000000-0000-0000-0000-000000000003',
    50,
    TRUE,
    'active',
    ARRAY['/images/hero/hero-5.jpg']
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    'Taza Cerámica Mate "Sabbath Rest"',
    'taza-ceramica-mate-sabbath-rest',
    'Taza artesanal de 380ml en acabado mate negro obsidiana con base de corcho natural. Apta para café matutino durante tu tiempo devocional diario.',
    12.00,
    15.00,
    'd0000000-0000-0000-0000-000000000004',
    100,
    FALSE,
    'active',
    ARRAY['/images/hero/hero-7.jpg']
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

-- 8. Peticiones de Oración Iniciales
INSERT INTO prayer_requests (requester_name, request, is_public, is_answered, prayers_count, status) VALUES
  ('Familia Mendoza', 'Pedimos respaldo en oración por la sanidad física de nuestra abuelita y fortaleza para todo el hogar durante su recuperación médica.', TRUE, FALSE, 28, 'praying'),
  ('David & Sofía', 'Damos gracias a Dios por abrir puertas de empleo en este nuevo mes. Oramos por sabiduría en la nueva etapa universitaria de nuestros hijos.', TRUE, FALSE, 19, 'praying'),
  ('Ministerio Misionero', 'Intercesión por el viaje misionero a las comunidades de la Amazonía ecuatoriana el próximo mes, que el evangelio alcance vidas.', TRUE, FALSE, 42, 'praying');
