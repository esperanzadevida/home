/**
 * Roles de cuenta y asignaciones por ministerio.
 * Los roles por ministerio nunca sustituyen ni elevan el rol de cuenta.
 */
export const PROFILE_ROLES = [
  {
    id: "owner",
    label: "Propietario",
    description: "Control máximo; puede transferir propiedad y nombrar administradores principales.",
    scope: "Cuenta",
  },
  {
    id: "super_admin",
    label: "Administrador principal",
    description: "Administra el sitio y sus operaciones; no puede transferir la propiedad.",
    scope: "Cuenta",
  },
  {
    id: "admin",
    label: "Administrador",
    description: "Gestiona contenido, comunidad y operación general.",
    scope: "Cuenta",
  },
  {
    id: "pastor",
    label: "Pastor",
    description: "Acompaña la comunidad y consulta personas, ministerios y bandejas pastorales.",
    scope: "Cuenta",
  },
  {
    id: "finance_manager",
    label: "Tesorería",
    description: "Consulta donaciones para conciliación; los cambios financieros requieren un flujo protegido.",
    scope: "Cuenta",
  },
  {
    id: "editor",
    label: "Editor de contenido",
    description: "Prepara publicaciones y recursos editoriales.",
    scope: "Cuenta",
  },
  {
    id: "moderator",
    label: "Moderador pastoral",
    description: "Atiende peticiones de oración y mensajes de contacto.",
    scope: "Cuenta",
  },
  {
    id: "member",
    label: "Miembro",
    description: "Gestiona su perfil y consulta sus propios pedidos.",
    scope: "Cuenta",
  },
  {
    id: "visitor",
    label: "Visitante",
    description: "Consulta las páginas públicas; no tiene acceso al Admin.",
    scope: "Cuenta",
  },
] as const;

export const MINISTRY_ROLES = [
  {
    id: "ministry_leader",
    label: "Líder de ministerio",
    description: "Coordina integrantes, reuniones y actividades de los ministerios que tiene asignados.",
    scope: "Ministerios asignados",
  },
  {
    id: "ministry_coordinator",
    label: "Coordinador de ministerio",
    description: "Apoya la agenda y organización del ministerio asignado, sin cambiar responsables ni permisos.",
    scope: "Ministerios asignados",
  },
  {
    id: "musician",
    label: "Músico",
    description: "Consulta agenda y repertorio y actualiza su disponibilidad en el equipo asignado.",
    scope: "Equipo de alabanza asignado",
  },
  {
    id: "ministry_volunteer",
    label: "Voluntario de ministerio",
    description: "Consulta horarios e indicaciones de los equipos donde colabora.",
    scope: "Ministerios asignados",
  },
  {
    id: "ministry_member",
    label: "Integrante de ministerio",
    description: "Consulta las actividades y datos básicos de sus propios equipos.",
    scope: "Ministerios asignados",
  },
] as const;

export const ADMIN_ROLES = [...PROFILE_ROLES, ...MINISTRY_ROLES] as const;

export type ProfileRoleId = (typeof PROFILE_ROLES)[number]["id"];
export type MinistryRoleId = (typeof MINISTRY_ROLES)[number]["id"];
export type AdminRoleId = ProfileRoleId | MinistryRoleId;

/** Los roles de máxima autoridad solo se asignan mediante un flujo protegido. */
export const ASSIGNABLE_PROFILE_ROLES = PROFILE_ROLES.filter(
  ({ id }) => id !== "owner" && id !== "super_admin",
);

export const ADMIN_ROLE_LABELS: Record<AdminRoleId, string> = Object.fromEntries(
  ADMIN_ROLES.map(({ id, label }) => [id, label]),
) as Record<AdminRoleId, string>;
