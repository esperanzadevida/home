-- The public catalog exposes an explicit projection of active product fields.
-- Run the view with caller privileges so Postgres applies RLS to its source.
ALTER VIEW public.public_products SET (security_invoker = true);

-- Anonymous storefront requests may read only the rows and columns included in
-- the public projection. Authenticated non-admins do not receive this policy;
-- admin access continues through the existing private.is_admin() policy.
CREATE POLICY "Lectura pública de productos activos"
  ON public.products
  FOR SELECT
  TO anon
  USING (status = 'active');

GRANT SELECT (
  id,
  name,
  slug,
  description,
  content,
  price,
  compare_at_price,
  category_id,
  images,
  is_digital,
  weight,
  dimensions,
  tags,
  featured,
  status
)
ON TABLE public.products TO anon;
