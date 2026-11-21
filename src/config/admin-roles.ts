/**
 * Shared role vocabulary for the local admin demo.
 * IDs follow user_role_enum and the roles.name seed values. This catalog does
 * not implement or enforce server permissions.
 */
export const ADMIN_ROLES = [
  {
    id: "super_admin",
    label: "Administrador principal",
    description: "Control completo de la plataforma y su configuración.",
  },
  {
    id: "admin",
    label: "Administrador",
    description: "Gestiona contenido y operación general.",
  },
  {
    id: "editor",
    label: "Editor de contenido",
    description: "Prepara publicaciones y recursos editoriales.",
  },
  {
    id: "moderator",
    label: "Moderador",
    description: "Atiende peticiones de oración y mensajes de contacto.",
  },
  {
    id: "member",
    label: "Miembro",
    description: "Cuenta de comunidad con acceso a sus propios datos.",
  },
  {
    id: "visitor",
    label: "Visitante",
    description: "Cuenta registrada sin permisos administrativos.",
  },
] as const;

export type AdminRoleId = (typeof ADMIN_ROLES)[number]["id"];

export const ADMIN_ROLE_LABELS: Record<AdminRoleId, string> = Object.fromEntries(
  ADMIN_ROLES.map(({ id, label }) => [id, label]),
) as Record<AdminRoleId, string>;
