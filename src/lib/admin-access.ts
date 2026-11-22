import type { ProfileRoleId } from "@/config/admin-roles";

const FULL_ADMIN_ROLES: readonly ProfileRoleId[] = ["owner", "super_admin", "admin"];
const EDITOR_PATHS = [
  "/admin/contenido/blog",
  "/admin/contenido/sermones",
  "/admin/contenido/eventos",
  "/admin/contenido/galeria",
] as const;
const MODERATOR_PATHS = ["/admin/oracion", "/admin/mensajes"] as const;
const PASTOR_PATHS = ["/admin/dashboard", "/admin/contenido/sermones", "/admin/miembros", "/admin/ministerios", "/admin/oracion"] as const;
const FINANCE_PATHS = ["/admin/dashboard", "/admin/donaciones"] as const;

function matchesPath(pathname: string, allowedPath: string) {
  return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
}

export function canAccessAdminPath(role: ProfileRoleId, pathname: string) {
  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) return false;
  if (FULL_ADMIN_ROLES.includes(role)) return true;

  if (role === "pastor") return PASTOR_PATHS.some((allowedPath) => matchesPath(pathname, allowedPath));
  if (role === "finance_manager") return FINANCE_PATHS.some((allowedPath) => matchesPath(pathname, allowedPath));

  if (role === "editor") {
    return EDITOR_PATHS.some((allowedPath) => matchesPath(pathname, allowedPath));
  }

  if (role === "moderator") {
    return MODERATOR_PATHS.some((allowedPath) => matchesPath(pathname, allowedPath));
  }

  return false;
}

export function getAdminLandingPath(role: ProfileRoleId) {
  if (FULL_ADMIN_ROLES.includes(role) || role === "pastor" || role === "finance_manager") return "/admin/dashboard";
  if (role === "editor") return "/admin/contenido/blog";
  if (role === "moderator") return "/admin/mensajes";
  return "/";
}
