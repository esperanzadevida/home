"use client";

import { useState } from "react";
import { LockKeyhole, Shield } from "lucide-react";
import { ADMIN_ROLES, type AdminRoleId } from "@/config/admin-roles";

type ActionKey = "view" | "create" | "edit" | "delete" | "publish" | "manage";

interface RolePermission {
  module: string;
  actions: Record<ActionKey, boolean>;
}

const actionLabels: Record<ActionKey, string> = {
  view: "Ver",
  create: "Crear",
  edit: "Editar",
  delete: "Eliminar",
  publish: "Publicar",
  manage: "Administrar",
};

const actionKeys = Object.keys(actionLabels) as ActionKey[];

const permissionGroups = [
  {
    label: "Contenido",
    description: "Publicaciones, recursos y actividades de la iglesia.",
    modules: ["Sermones", "Blog y noticias", "Eventos", "Galería", "Productos", "Ministerios"],
  },
  {
    label: "Comunidad",
    description: "Miembros y espacios personales.",
    modules: ["Miembros", "Mi perfil", "Pedidos propios"],
  },
  {
    label: "Operación",
    description: "Pedidos, configuración del sitio y cuentas.",
    modules: ["Pedidos y pagos", "Configuración", "Usuarios"],
  },
  {
    label: "Atención y datos privados",
    description: "Donaciones, peticiones de oración y mensajes recibidos.",
    modules: ["Donaciones", "Peticiones de oración", "Mensajes de contacto"],
  },
] as const;

const modules = permissionGroups.flatMap((group) => group.modules);

function createRolePermissions(roleId: AdminRoleId): RolePermission[] {
  return modules.map((module) => {
    let actions: Record<ActionKey, boolean> = {
      view: false,
      create: false,
      edit: false,
      delete: false,
      publish: false,
      manage: false,
    };

    if (roleId === "super_admin") {
      actions = { view: true, create: true, edit: true, delete: true, publish: true, manage: true };
    }

    if (roleId === "admin") {
      actions = { view: true, create: true, edit: true, delete: false, publish: true, manage: true };
    }

    if (roleId === "editor" && ["Sermones", "Blog y noticias", "Eventos", "Galería"].includes(module)) {
      actions = { view: true, create: true, edit: true, delete: false, publish: module === "Blog y noticias", manage: false };
    }

    if (roleId === "editor" && module === "Productos") actions.view = true;

    if (roleId === "moderator" && ["Peticiones de oración", "Mensajes de contacto"].includes(module)) {
      actions = { view: true, create: false, edit: true, delete: false, publish: false, manage: false };
    }

    if (roleId === "member" && module === "Mi perfil") {
      actions = { view: true, create: false, edit: true, delete: false, publish: false, manage: false };
    }

    if (roleId === "member" && module === "Pedidos propios") actions.view = true;

    return { module, actions };
  });
}

function countGrantedModules(permissions: RolePermission[] = []) {
  return permissions.filter((permission) => Object.values(permission.actions).some(Boolean)).length;
}

function countGrantedActions(permissions: RolePermission[] = []) {
  return permissions.reduce(
    (total, permission) => total + Object.values(permission.actions).filter(Boolean).length,
    0,
  );
}

export default function AdminRolesPage() {
  const [activeRole, setActiveRole] = useState<AdminRoleId>("editor");
  const [permissionsByRole, setPermissionsByRole] = useState<Record<string, RolePermission[]>>(() =>
    Object.fromEntries(ADMIN_ROLES.map((role) => [role.id, createRolePermissions(role.id)])),
  );

  const activeRoleData = ADMIN_ROLES.find((role) => role.id === activeRole);
  const activeRoleLabel = activeRoleData?.label ?? activeRole;
  const permissions = permissionsByRole[activeRole] ?? [];
  const grantedModuleCount = countGrantedModules(permissions);
  const grantedActionCount = countGrantedActions(permissions);

  const togglePermission = (moduleIndex: number, key: ActionKey) => {
    setPermissionsByRole((current) => ({
      ...current,
      [activeRole]: current[activeRole].map((permission, index) => index === moduleIndex
        ? { ...permission, actions: { ...permission.actions, [key]: !permission.actions[key] } }
        : permission),
    }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Shield aria-hidden="true" className="h-4 w-4" /> Administración
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Roles y permisos</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Compara el acceso de cada rol por área y acción.
            </p>
          </div>
          <span className="inline-flex min-h-9 w-fit items-center rounded-full border border-warning/30 bg-warning/5 px-3 text-xs font-semibold text-foreground">
            Muestra local · sin conexión a cuentas
          </span>
        </div>

        <p className="max-w-3xl rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Las casillas solo cambian esta vista temporalmente. No asignan permisos, no guardan cambios y no protegen las rutas.
        </p>
      </header>

      <section aria-label="Seleccionar rol de muestra" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_ROLES.map((role) => {
          const isActive = activeRole === role.id;
          const roleModuleCount = countGrantedModules(permissionsByRole[role.id]);

          return (
            <button
              key={role.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveRole(role.id)}
              className={`flex min-h-32 flex-col rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted/50"}`}
            >
              <span className="flex items-center gap-2 font-bold text-foreground">
                <Shield aria-hidden="true" className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {role.label}
              </span>
              <span className="mt-2 block text-xs leading-relaxed">{role.description}</span>
              <span className="mt-auto pt-3 text-xs font-semibold text-muted-foreground">
                {roleModuleCount} de {modules.length} módulos con acceso
              </span>
            </button>
          );
        })}
      </section>

      <section aria-labelledby="active-role-heading" className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista seleccionada</p>
          <h2 id="active-role-heading" className="mt-1 text-lg font-bold">{activeRoleLabel}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{activeRoleData?.description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 sm:min-w-64">
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">Módulos habilitados</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums">{grantedModuleCount}<span className="text-sm font-medium text-muted-foreground"> / {modules.length}</span></dd>
          </div>
          <div className="rounded-xl bg-muted/40 px-3 py-2.5">
            <dt className="text-xs text-muted-foreground">Acciones activas</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums">{grantedActionCount}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-6 xl:hidden" aria-label={`Permisos de ${activeRoleLabel}`}>
        {permissionGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            <div>
              <h3 className="text-base font-bold">{group.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.modules.map((module) => {
                const moduleIndex = modules.indexOf(module);
                const permission = permissions[moduleIndex];

                return (
                  <article key={module} className="rounded-2xl border border-border bg-card p-4">
                    <h4 className="font-semibold">{module}</h4>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {actionKeys.map((key) => {
                        const inputId = `mobile-permission-${activeRole}-${moduleIndex}-${key}`;

                        return (
                          <label key={key} htmlFor={inputId} className="flex min-h-11 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-xs font-medium">
                            <input
                              id={inputId}
                              aria-label={`${module}: ${actionLabels[key]}`}
                              type="checkbox"
                              checked={permission.actions[key]}
                              onChange={() => togglePermission(moduleIndex, key)}
                              className="h-4 w-4 shrink-0 rounded accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {actionLabels[key]}
                          </label>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-4">
          <div>
            <h3 className="font-bold">Permisos por módulo</h3>
            <p className="mt-1 text-xs text-muted-foreground">Marca las acciones disponibles para el rol seleccionado.</p>
          </div>
          <span className="rounded-full bg-background px-3 py-1.5 text-xs text-muted-foreground">
            Editando: <strong className="text-primary">{activeRoleLabel}</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-xs">
            <caption className="sr-only">Matriz local de permisos por módulo y rol</caption>
            <thead className="border-b border-border/60 bg-muted/20 text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Módulo</th>
                {actionKeys.map((key) => <th key={key} scope="col" className="px-3 py-3 text-center">{actionLabels[key]}</th>)}
              </tr>
            </thead>
            {permissionGroups.map((group) => (
              <tbody key={group.label} className="divide-y divide-border/60">
                <tr className="bg-muted/30">
                  <th scope="rowgroup" colSpan={actionKeys.length + 1} className="px-4 py-2.5 text-left">
                    <span className="block font-bold">{group.label}</span>
                    <span className="mt-0.5 block font-normal text-muted-foreground">{group.description}</span>
                  </th>
                </tr>
                {group.modules.map((module) => {
                  const moduleIndex = modules.indexOf(module);
                  const permission = permissions[moduleIndex];

                  return (
                    <tr key={module} className="hover:bg-muted/20">
                      <th scope="row" className="px-4 py-3 font-semibold">{module}</th>
                      {actionKeys.map((key) => {
                        const inputId = `desktop-permission-${activeRole}-${moduleIndex}-${key}`;

                        return (
                          <td key={key} className="px-3 py-3 text-center">
                            <label
                              htmlFor={inputId}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                            >
                              <input
                                id={inputId}
                                aria-label={`${module}: ${actionLabels[key]}`}
                                type="checkbox"
                                checked={permission.actions[key]}
                                onChange={() => togglePermission(moduleIndex, key)}
                                className="h-4 w-4 rounded accent-primary"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </div>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground">
        <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>
          <strong>Autorización pendiente.</strong> El esquema local usa <code>profiles.role</code> en sus políticas; las tablas <code>roles</code> y <code>user_roles</code> todavía no están conectadas a esta matriz. Antes de habilitar cuentas reales hay que definir una sola fuente de roles y probar permisos de base de datos y rutas.
        </p>
      </aside>
    </div>
  );
}
