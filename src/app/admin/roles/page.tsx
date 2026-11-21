"use client";

import { useMemo, useState } from "react";
import { Check, LockKeyhole, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
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
const modules = ["Sermones", "Blog y noticias", "Eventos", "Galería", "Productos", "Pedidos y pagos", "Pedidos propios", "Miembros", "Ministerios", "Donaciones", "Peticiones de oración", "Mensajes de contacto", "Mi perfil", "Configuración", "Usuarios"];

function createRolePermissions(roleId: AdminRoleId): RolePermission[] {
  return modules.map((module) => {
    let actions: Record<ActionKey, boolean> = { view: false, create: false, edit: false, delete: false, publish: false, manage: false };
    if (roleId === "super_admin") actions = { view: true, create: true, edit: true, delete: true, publish: true, manage: true };
    if (roleId === "admin") actions = { view: true, create: true, edit: true, delete: false, publish: true, manage: true };
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
    if (roleId === "member" && module === "Pedidos propios") {
      actions.view = true;
    }
    return { module, actions };
  });
}

export default function AdminRolesPage() {
  const [activeRole, setActiveRole] = useState<AdminRoleId>("editor");
  const [permissionsByRole, setPermissionsByRole] = useState<Record<string, RolePermission[]>>(() =>
    Object.fromEntries(ADMIN_ROLES.map((role) => [role.id, createRolePermissions(role.id)])),
  );
  const [notice, setNotice] = useState("");
  const activeRoleLabel = ADMIN_ROLES.find((role) => role.id === activeRole)?.label ?? activeRole;
  const permissions = useMemo(() => permissionsByRole[activeRole] ?? [], [permissionsByRole, activeRole]);

  const togglePermission = (moduleIndex: number, key: ActionKey) => {
    setPermissionsByRole((current) => ({
      ...current,
      [activeRole]: current[activeRole].map((permission, index) => index === moduleIndex
        ? { ...permission, actions: { ...permission.actions, [key]: !permission.actions[key] } }
        : permission),
    }));
    setNotice("");
  };

  const saveView = () => {
    setNotice("Matriz actualizada solo en esta vista. No se cambiaron permisos de cuentas reales.");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Shield aria-hidden="true" className="h-4 w-4" /> Administración · muestra local</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Roles y permisos</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Compara permisos por módulo. Estas reglas no protegen rutas ni se aplican a usuarios hasta conectar y validar autenticación.</p></div>
        <Button type="button" onClick={saveView} className="min-h-11 self-start sm:self-auto"><Check aria-hidden="true" className="h-4 w-4" /> Aplicar en esta vista</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Seleccionar rol de muestra">
        {ADMIN_ROLES.map((role) => <button key={role.id} type="button" aria-pressed={activeRole === role.id} onClick={() => { setActiveRole(role.id); setNotice(""); }} className={`min-h-28 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeRole === role.id ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted/50"}`}><span className="flex items-center gap-2 font-bold text-foreground"><Shield aria-hidden="true" className={`h-4 w-4 ${activeRole === role.id ? "text-primary" : "text-muted-foreground"}`} />{role.label}</span><span className="mt-2 block text-xs leading-relaxed">{role.description}</span></button>)}
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-success">{notice}</p>

      <section className="space-y-3 xl:hidden" aria-label={`Permisos de ${activeRoleLabel}`}>
        {permissions.map((permission, index) => <article key={permission.module} className="rounded-2xl border border-border bg-card p-4"><h2 className="font-semibold">{permission.module}</h2><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{actionKeys.map((key) => { const inputId = `permission-${activeRole}-${index}-${key}`; return <label key={key} htmlFor={inputId} className="flex min-h-11 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-xs font-medium"><input id={inputId} type="checkbox" checked={permission.actions[key]} onChange={() => togglePermission(index, key)} className="h-4 w-4 shrink-0 rounded accent-primary focus-visible:ring-2 focus-visible:ring-ring" />{actionLabels[key]}</label>; })}</div></article>)}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block"><div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 p-4"><span className="text-xs font-bold uppercase tracking-wide">Permisos por módulo</span><span className="text-xs text-muted-foreground">Editando: <strong className="text-primary">{activeRoleLabel}</strong></span></div><div className="overflow-x-auto"><table className="w-full min-w-[880px] text-left text-xs"><caption className="sr-only">Matriz local de permisos por módulo y rol</caption><thead className="border-b border-border/60 bg-muted/20 text-muted-foreground"><tr><th scope="col" className="px-4 py-3">Módulo</th>{actionKeys.map((key) => <th key={key} scope="col" className="px-3 py-3 text-center">{actionLabels[key]}</th>)}</tr></thead><tbody className="divide-y divide-border/60">{permissions.map((permission, index) => <tr key={permission.module} className="hover:bg-muted/20"><th scope="row" className="px-4 py-3 font-semibold">{permission.module}</th>{actionKeys.map((key) => <td key={key} className="px-3 py-3 text-center"><input aria-label={`${permission.module}: ${actionLabels[key]}`} type="checkbox" checked={permission.actions[key]} onChange={() => togglePermission(index, key)} className="h-4 w-4 rounded accent-primary focus-visible:ring-2 focus-visible:ring-ring" /></td>)}</tr>)}</tbody></table></div></div>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground"><LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><p><strong>Seguridad pendiente.</strong> Una matriz visual no sustituye políticas del servidor. Antes de conectar cuentas hay que unificar el modelo de roles y validar permisos en la base y en cada ruta.</p></aside>
    </div>
  );
}
