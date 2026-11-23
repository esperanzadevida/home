import { createClient, type User } from "npm:@supabase/supabase-js@2.119.2";

const allowedOrigins = new Set([
  "https://esperanzadevida.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const profileRoles = [
  "owner",
  "super_admin",
  "admin",
  "pastor",
  "finance_manager",
  "editor",
  "moderator",
  "member",
  "visitor",
] as const;

const ministryRoles = ["leader", "coordinator", "musician", "volunteer", "member"] as const;

type ProfileRole = (typeof profileRoles)[number];
type MinistryRole = (typeof ministryRoles)[number];
type ManagerRole = Extract<ProfileRole, "owner" | "super_admin" | "admin">;

type Action =
  | "bootstrap_owner"
  | "list"
  | "invite"
  | "update_profile_role"
  | "set_user_active"
  | "assign_ministry_role"
  | "deactivate_ministry_role";

type RequestBody = {
  action?: Action;
  email?: string;
  fullName?: string;
  role?: ProfileRole;
  profileId?: string;
  isActive?: boolean;
  ministryId?: string;
  ministryRole?: MinistryRole;
  assignmentId?: string;
};

type ProfileRecord = {
  id: string;
  full_name: string;
  role: ProfileRole;
  is_active: boolean;
  created_at: string;
};

type AssignmentRecord = {
  id: string;
  profile_id: string;
  ministry_id: string;
  role: MinistryRole;
  is_active: boolean;
  ministry: { name: string } | { name: string }[] | null;
};

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function getServiceKey() {
  const directKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SECRET_KEY");
  if (directKey) return directKey;

  const namedKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (namedKeys) {
    try {
      const keys = JSON.parse(namedKeys) as Record<string, string>;
      if (keys.default) return keys.default;
    } catch {
      // Continue to the configuration error below.
    }
  }

  throw new Error("Supabase server key is not configured.");
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured.");

const service = createClient(supabaseUrl, getServiceKey(), {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

function json(
  request: Request,
  body: Record<string, unknown>,
  status = 200,
) {
  const origin = request.headers.get("Origin");
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  if (origin && allowedOrigins.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "authorization, apikey, x-client-info, content-type");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Vary", "Origin");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function isProfileRole(value: unknown): value is ProfileRole {
  return typeof value === "string" && profileRoles.includes(value as ProfileRole);
}

function isMinistryRole(value: unknown): value is MinistryRole {
  return typeof value === "string" && ministryRoles.includes(value as MinistryRole);
}

function isManagerRole(role: ProfileRole): role is ManagerRole {
  return role === "owner" || role === "super_admin" || role === "admin";
}

function canManageTarget(actorRole: ProfileRole, targetRole: ProfileRole) {
  if (actorRole === "owner") return true;
  if (actorRole === "super_admin") return targetRole !== "owner" && targetRole !== "super_admin";
  return (
    actorRole === "admin" &&
    (targetRole === "editor" ||
      targetRole === "moderator" ||
      targetRole === "member" ||
      targetRole === "visitor")
  );
}

function canAssignRole(actorRole: ProfileRole, nextRole: ProfileRole) {
  if (actorRole === "owner") return true;
  if (actorRole === "super_admin") return nextRole !== "owner" && nextRole !== "super_admin";
  return (
    actorRole === "admin" &&
    (nextRole === "editor" ||
      nextRole === "moderator" ||
      nextRole === "member" ||
      nextRole === "visitor")
  );
}

function assignableRoles(actorRole: ManagerRole): ProfileRole[] {
  return profileRoles.filter((role) => canAssignRole(actorRole, role));
}

function asEmail(value: unknown) {
  if (typeof value !== "string") throw new HttpError(400, "Escribe un correo válido.");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Escribe un correo válido.");
  }
  return email;
}

async function getProfiles(): Promise<ProfileRecord[]> {
  const pageSize = 1000;
  const profiles: ProfileRecord[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await service
      .from("profiles")
      .select("id, full_name, role, is_active, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw new HttpError(500, "No se pudieron cargar los perfiles.");
    profiles.push(...(data as ProfileRecord[]));
    if (!data || data.length < pageSize) break;
  }

  return profiles;
}

async function getAuthUsers() {
  const pageSize = 1000;
  const users: User[] = [];

  for (let page = 1; ; page += 1) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: pageSize });
    if (error) throw new HttpError(500, "No se pudieron cargar las cuentas.");
    users.push(...data.users);
    if (data.users.length < pageSize) break;
  }

  return users;
}

async function getMinistryAssignments(): Promise<AssignmentRecord[]> {
  const pageSize = 1000;
  const assignments: AssignmentRecord[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await service
      .from("ministry_role_assignments")
      .select("id, profile_id, ministry_id, role, is_active, ministry:ministries(name)")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw new HttpError(500, "No se pudieron cargar los cargos ministeriales.");
    assignments.push(...(data as AssignmentRecord[]));
    if (!data || data.length < pageSize) break;
  }

  return assignments;
}

async function recordAudit(
  actorId: string,
  action: string,
  targetId: string | null,
  details: Record<string, unknown> = {},
) {
  const { error } = await service.from("admin_audit_logs").insert({
    actor_profile_id: actorId,
    action,
    target_profile_id: targetId,
    details,
  });
  if (error) console.error("Admin audit record failed:", error.code);
}

async function getTargetProfile(profileId: unknown) {
  if (typeof profileId !== "string" || !/^[0-9a-f-]{36}$/i.test(profileId)) {
    throw new HttpError(400, "Selecciona una cuenta válida.");
  }

  const { data, error } = await service
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", profileId)
    .maybeSingle();

  if (error) throw new HttpError(500, "No se pudo verificar la cuenta.");
  if (!data || !isProfileRole(data.role)) throw new HttpError(404, "La cuenta ya no está disponible.");
  return data as Pick<ProfileRecord, "id" | "role" | "is_active">;
}

async function loadCaller(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) throw new HttpError(401, "Inicia sesión para continuar.");

  const token = authorization.slice("Bearer ".length);
  const { data, error } = await service.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, "Tu sesión expiró. Inicia sesión otra vez.");

  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("id, role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) throw new HttpError(500, "No se pudo verificar tu perfil.");
  if (!profile || profile.is_active !== true || !isProfileRole(profile.role)) {
    throw new HttpError(403, "Tu cuenta no tiene acceso activo.");
  }

  return {
    user: data.user,
    profile: profile as Pick<ProfileRecord, "id" | "role" | "is_active">,
  };
}

async function bootstrapOwner(
  user: User,
  profile: Pick<ProfileRecord, "id" | "role" | "is_active">,
) {
  if (profile.role === "owner") return { role: "owner", alreadyOwner: true };

  const allowedEmails = (Deno.env.get("BOOTSTRAP_OWNER_EMAILS") ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const email = user.email?.toLowerCase();

  if (!email || !user.email_confirmed_at || !allowedEmails.includes(email)) {
    throw new HttpError(403, "Esta cuenta no está autorizada para iniciar la configuración.");
  }

  const { data: promoted, error } = await service.rpc("bootstrap_initial_owner", {
    target_profile_id: user.id,
  });
  if (error) throw new HttpError(500, "No se pudo completar la configuración inicial.");
  if (promoted !== true) {
    throw new HttpError(409, "La configuración inicial ya fue completada. Solicita acceso a un propietario.");
  }

  await recordAudit(user.id, "bootstrap_owner", user.id);
  return { role: "owner", alreadyOwner: false };
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  if (origin && !allowedOrigins.has(origin)) {
    return json(request, { error: "Origen no autorizado." }, 403);
  }

  if (request.method === "OPTIONS") return json(request, {}, 204);
  if (request.method !== "POST") return json(request, { error: "Método no permitido." }, 405);

  try {
    const { user, profile } = await loadCaller(request);
    const body = (await request.json()) as RequestBody;
    if (!body.action) throw new HttpError(400, "Indica una acción válida.");

    if (body.action === "bootstrap_owner") {
      return json(request, await bootstrapOwner(user, profile));
    }

    if (!isManagerRole(profile.role)) {
      throw new HttpError(403, "Tu rol no puede gestionar cuentas.");
    }

    if (body.action === "list") {
      const [profiles, authUsers, assignments, ministriesResult] = await Promise.all([
        getProfiles(),
        getAuthUsers(),
        getMinistryAssignments(),
        service
          .from("ministries")
          .select("id, name")
          .eq("is_active", true)
          .order("name"),
      ]);
      if (ministriesResult.error) throw new HttpError(500, "No se pudieron cargar los ministerios.");

      const authById = new Map(authUsers.map((authUser) => [authUser.id, authUser]));
      const assignmentsByProfile = new Map<string, AssignmentRecord[]>();
      for (const assignment of assignments) {
        const current = assignmentsByProfile.get(assignment.profile_id) ?? [];
        current.push(assignment);
        assignmentsByProfile.set(assignment.profile_id, current);
      }

      const users = profiles.flatMap((item) => {
        const authUser = authById.get(item.id);
        if (!authUser) return [];
        return [{
          id: item.id,
          fullName: item.full_name,
          email: authUser.email ?? "",
          role: item.role,
          isActive: item.is_active,
          createdAt: item.created_at,
          lastSignInAt: authUser.last_sign_in_at,
          canChangeRole: item.id !== user.id && canManageTarget(profile.role, item.role),
          canToggleActive: item.id !== user.id && canManageTarget(profile.role, item.role),
          ministryAssignments: (assignmentsByProfile.get(item.id) ?? []).map((assignment) => ({
            id: assignment.id,
            ministryId: assignment.ministry_id,
            ministryName: (Array.isArray(assignment.ministry) ? assignment.ministry[0] : assignment.ministry)?.name ?? "Ministerio",
            role: assignment.role,
            isActive: assignment.is_active,
          })),
        }];
      });

      return json(request, {
        users,
        ministries: ministriesResult.data ?? [],
        assignableRoles: assignableRoles(profile.role),
      });
    }

    if (body.action === "invite") {
      if (!isProfileRole(body.role) || !canAssignRole(profile.role, body.role)) {
        throw new HttpError(403, "Tu rol no puede asignar ese nivel de acceso.");
      }

      const email = asEmail(body.email);
      const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 100) : "";
      if (!fullName) throw new HttpError(400, "Escribe el nombre de la persona.");

      const { data, error } = await service.auth.admin.inviteUserByEmail(email, {
        redirectTo: "https://esperanzadevida.github.io/home/login/",
        data: { full_name: fullName },
      });
      if (error || !data.user) throw new HttpError(400, "No se pudo enviar la invitación. Revisa si el correo ya tiene una cuenta.");

      const { data: updatedProfile, error: updateError } = await service
        .from("profiles")
        .update({ full_name: fullName, role: body.role, is_active: true })
        .eq("id", data.user.id)
        .select("id")
        .maybeSingle();
      if (updateError || !updatedProfile) {
        throw new HttpError(500, "La invitación se envió, pero no se pudo aplicar el rol. Revisa la cuenta desde Usuarios.");
      }

      await recordAudit(user.id, "invite_user", data.user.id, { role: body.role });
      return json(request, { invited: true, userId: data.user.id });
    }

    if (body.action === "update_profile_role") {
      if (!isProfileRole(body.role)) throw new HttpError(400, "Selecciona un rol válido.");
      const target = await getTargetProfile(body.profileId);
      if (target.id === user.id || !canManageTarget(profile.role, target.role)) {
        throw new HttpError(403, "Tu rol no puede modificar esta cuenta.");
      }
      if (!canAssignRole(profile.role, body.role)) {
        throw new HttpError(403, "Tu rol no puede asignar ese nivel de acceso.");
      }
      const { data: updated, error } = await service.rpc("admin_update_profile_role", {
        target_profile_id: target.id,
        next_role: body.role,
      });
      if (error) throw new HttpError(500, "No se pudo actualizar el rol.");
      if (updated !== true) throw new HttpError(409, "El cambio no se aplicó. Debe permanecer al menos un propietario activo.");

      await recordAudit(user.id, "update_profile_role", target.id, {
        from: target.role,
        to: body.role,
      });
      return json(request, { updated: true });
    }

    if (body.action === "set_user_active") {
      if (typeof body.isActive !== "boolean") throw new HttpError(400, "Indica el estado de la cuenta.");
      const target = await getTargetProfile(body.profileId);
      if (target.id === user.id || !canManageTarget(profile.role, target.role)) {
        throw new HttpError(403, "Tu rol no puede modificar esta cuenta.");
      }
      const { data: updated, error } = await service.rpc("admin_set_profile_active", {
        target_profile_id: target.id,
        next_is_active: body.isActive,
      });
      if (error) throw new HttpError(500, "No se pudo actualizar el estado.");
      if (updated !== true) throw new HttpError(409, "El cambio no se aplicó. Debe permanecer al menos un propietario activo.");

      await recordAudit(user.id, "set_user_active", target.id, { isActive: body.isActive });
      return json(request, { updated: true });
    }

    if (body.action === "assign_ministry_role") {
      if (!isMinistryRole(body.ministryRole)) throw new HttpError(400, "Selecciona un cargo ministerial válido.");
      if (typeof body.ministryId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.ministryId)) {
        throw new HttpError(400, "Selecciona un ministerio válido.");
      }
      const target = await getTargetProfile(body.profileId);
      if (!canManageTarget(profile.role, target.role)) {
        throw new HttpError(403, "Tu rol no puede asignar cargos a esta cuenta.");
      }

      const { data, error } = await service
        .from("ministry_role_assignments")
        .upsert(
          {
            profile_id: target.id,
            ministry_id: body.ministryId,
            role: body.ministryRole,
            is_active: true,
            assigned_by: user.id,
          },
          { onConflict: "profile_id,ministry_id,role" },
        )
        .select("id")
        .single();
      if (error || !data) throw new HttpError(500, "No se pudo asignar el cargo ministerial.");

      await recordAudit(user.id, "assign_ministry_role", target.id, {
        ministryId: body.ministryId,
        role: body.ministryRole,
      });
      return json(request, { assignmentId: data.id });
    }

    if (body.action === "deactivate_ministry_role") {
      if (typeof body.assignmentId !== "string" || !/^[0-9a-f-]{36}$/i.test(body.assignmentId)) {
        throw new HttpError(400, "Selecciona una asignación válida.");
      }
      const { data: assignment, error: lookupError } = await service
        .from("ministry_role_assignments")
        .select("id, profile_id, ministry_id, role")
        .eq("id", body.assignmentId)
        .maybeSingle();
      if (lookupError) throw new HttpError(500, "No se pudo verificar la asignación.");
      if (!assignment) throw new HttpError(404, "La asignación ya no está disponible.");

      const target = await getTargetProfile(assignment.profile_id);
      if (!canManageTarget(profile.role, target.role)) {
        throw new HttpError(403, "Tu rol no puede retirar cargos de esta cuenta.");
      }

      const { error } = await service
        .from("ministry_role_assignments")
        .update({ is_active: false })
        .eq("id", assignment.id);
      if (error) throw new HttpError(500, "No se pudo retirar el cargo ministerial.");

      await recordAudit(user.id, "deactivate_ministry_role", target.id, {
        ministryId: assignment.ministry_id,
        role: assignment.role,
      });
      return json(request, { updated: true });
    }

    throw new HttpError(400, "La acción no está disponible.");
  } catch (error) {
    if (error instanceof HttpError) return json(request, { error: error.message }, error.status);
    console.error("admin-users request failed:", error instanceof Error ? error.name : "UnknownError");
    return json(request, { error: "No se pudo completar la operación." }, 500);
  }
});
