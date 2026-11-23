-- Keep OAuth identity data separate from authorization data.
-- A Google sign-in creates an ordinary visitor profile; only a trusted
-- server-side workflow may grant an administrative role.
CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _display_name TEXT;
  _avatar_url TEXT;
BEGIN
  _display_name := COALESCE(
    NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(pg_catalog.btrim(NEW.email), ''),
    'Usuario'
  );

  _avatar_url := COALESCE(
    NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data->>'avatar_url'), ''),
    NULLIF(pg_catalog.btrim(NEW.raw_user_meta_data->>'picture'), '')
  );

  IF _avatar_url !~* '^https://' THEN
    _avatar_url := NULL;
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, _display_name, _avatar_url, 'visitor'::public.user_role_enum);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Administrative account changes are written only by the Edge Function.
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (
    action IN (
      'bootstrap_owner',
      'invite_user',
      'update_profile_role',
      'set_user_active',
      'assign_ministry_role',
      'deactivate_ministry_role'
    )
  ),
  target_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.admin_audit_logs FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT ON TABLE public.admin_audit_logs TO service_role;

-- Serialize first-owner setup and all operations that could remove the last
-- active owner. These functions are callable only by the trusted Edge Function.
CREATE OR REPLACE FUNCTION public.bootstrap_initial_owner(target_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(1195724621, 1);

  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE role = 'owner'::public.user_role_enum
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET role = 'owner'::public.user_role_enum,
      is_active = TRUE
  WHERE id = target_profile_id;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_profile_role(
  target_profile_id UUID,
  next_role public.user_role_enum
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(1195724621, 1);

  IF EXISTS (
    SELECT 1
    FROM public.profiles AS target
    WHERE target.id = target_profile_id
      AND target.role = 'owner'::public.user_role_enum
      AND target.is_active
      AND next_role <> 'owner'::public.user_role_enum
      AND NOT EXISTS (
        SELECT 1
        FROM public.profiles AS other_owner
        WHERE other_owner.role = 'owner'::public.user_role_enum
          AND other_owner.is_active
          AND other_owner.id <> target_profile_id
      )
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET role = next_role
  WHERE id = target_profile_id;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_profile_active(
  target_profile_id UUID,
  next_is_active BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(1195724621, 1);

  IF EXISTS (
    SELECT 1
    FROM public.profiles AS target
    WHERE target.id = target_profile_id
      AND target.role = 'owner'::public.user_role_enum
      AND target.is_active
      AND NOT next_is_active
      AND NOT EXISTS (
        SELECT 1
        FROM public.profiles AS other_owner
        WHERE other_owner.role = 'owner'::public.user_role_enum
          AND other_owner.is_active
          AND other_owner.id <> target_profile_id
      )
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET is_active = next_is_active
  WHERE id = target_profile_id;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_initial_owner(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_update_profile_role(UUID, public.user_role_enum) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_set_profile_active(UUID, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_initial_owner(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_profile_role(UUID, public.user_role_enum) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_set_profile_active(UUID, BOOLEAN) TO service_role;
