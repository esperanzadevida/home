"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { Check, MailPlus, Search, Shield, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLES, ADMIN_ROLE_LABELS, type AdminRoleId } from "@/config/admin-roles";
import { restoreDialogTriggerFocus } from "@/lib/admin-dialog-focus";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRoleId;
  lastAccess: string;
  active: boolean;
}

const SAMPLE_USERS: AdminUser[] = [
  { id: "user-01", name: "Samuel Andrade", email: "samuel.andrade@example.invalid", role: "admin", lastAccess: "18 nov 2026", active: true },
  { id: "user-02", name: "María Fernanda", email: "maria.fernanda@example.invalid", role: "editor", lastAccess: "17 nov 2026", active: true },
  { id: "user-03", name: "Jonathan Dowdy", email: "jonathan.dowdy@example.invalid", role: "moderator", lastAccess: "12 nov 2026", active: true },
  { id: "user-04", name: "Ana Zambrano", email: "ana.zambrano@example.invalid", role: "member", lastAccess: "Sin acceso registrado", active: false },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRoleId>("editor");
  const [announcement, setAnnouncement] = useState("");

  const filtered = useMemo(() => users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${ADMIN_ROLE_LABELS[user.role]}`.toLowerCase().includes(query.toLowerCase());
    return matchesSearch && (statusFilter === "Todos" || (statusFilter === "Activos" ? user.active : !user.active));
  }), [users, query, statusFilter]);

  const createUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsers((current) => [{ id: `user-${Date.now()}`, name, email, role, lastAccess: "Invitación no enviada", active: false }, ...current]);
    setAnnouncement("Usuario de muestra añadido a esta vista. No se envió ninguna invitación.");
    setName("");
    setEmail("");
    setRole("editor");
    setDialogOpen(false);
  };

  const toggleActive = (user: AdminUser) => {
    setUsers((current) => current.map((entry) => entry.id === user.id ? { ...entry, active: !entry.active } : entry));
    setAnnouncement(`Estado de muestra actualizado para ${user.name}. No se modificó una cuenta real.`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Shield aria-hidden="true" className="h-4 w-4" /> Administración · muestra local</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Usuarios del sistema</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Revisa los niveles de acceso de ejemplo. La autenticación, invitaciones y cambios de contraseña requieren configurar el servicio de identidad.</p></div>
        <Button type="button" onClick={(event) => { dialogTriggerRef.current = event.currentTarget; setDialogOpen(true); }} className="min-h-11 self-start sm:self-auto"><MailPlus aria-hidden="true" className="h-4 w-4" /> Añadir usuario de muestra</Button>
      </div>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground"><Shield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><p><strong>Acceso sin conectar.</strong> Los usuarios, roles y estados de esta página son ficticios. Activar/desactivar solo cambia esta vista; no se envían invitaciones ni se alteran cuentas.</p></aside>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[minmax(14rem,1fr)_12rem_auto] sm:items-end sm:p-4">
        <label htmlFor="users-search" className="space-y-1.5 text-xs font-semibold"><span>Buscar usuarios de muestra</span><span className="relative block"><Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input id="users-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, correo o rol" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></span></label>
        <label className="space-y-1.5 text-xs font-semibold"><span>Estado</span><select id="users-status-filter" name="users-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Todos</option><option>Activos</option><option>Inactivos</option></select></label>
        <p aria-live="polite" className="pb-2 text-xs text-muted-foreground">{filtered.length} de {users.length} usuarios de muestra</p>
      </div>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Usuarios encontrados">
        {filtered.map((user) => <article key={user.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-4 w-4" /></span><div className="min-w-0"><h2 className="break-words font-bold">{user.name}</h2><p className="mt-1 break-all text-xs text-muted-foreground">{user.email}</p></div></div><UserStatus active={user.active} /></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs"><div><dt className="text-muted-foreground">Rol de muestra</dt><dd className="mt-1 font-semibold">{ADMIN_ROLE_LABELS[user.role]}</dd></div><div><dt className="text-muted-foreground">Último acceso</dt><dd className="mt-1">{user.lastAccess}</dd></div></dl><Button type="button" variant="outline" className="mt-4 min-h-11 w-full" onClick={() => toggleActive(user)}>{user.active ? "Desactivar en esta vista" : "Activar en esta vista"}</Button></article>)}
        {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground sm:col-span-2">No hay usuarios que coincidan con los filtros.</p>}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block"><table className="w-full text-left text-sm"><caption className="sr-only">Usuarios de ejemplo y estado de acceso</caption><thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th scope="col" className="px-4 py-3">Usuario</th><th scope="col" className="px-4 py-3">Rol de muestra</th><th scope="col" className="px-4 py-3">Último acceso</th><th scope="col" className="px-4 py-3">Estado</th><th scope="col" className="px-4 py-3 text-right">Acción local</th></tr></thead><tbody className="divide-y divide-border/70">{filtered.map((user) => <tr key={user.id} className="hover:bg-muted/20"><td className="px-4 py-4"><div className="font-semibold">{user.name}</div><div className="mt-1 break-all text-xs text-muted-foreground">{user.email}</div></td><td className="px-4 py-4 text-sm">{ADMIN_ROLE_LABELS[user.role]}</td><td className="px-4 py-4 text-xs text-muted-foreground">{user.lastAccess}</td><td className="px-4 py-4"><UserStatus active={user.active} /></td><td className="px-4 py-4 text-right"><Button type="button" variant="outline" size="sm" onClick={() => toggleActive(user)}>{user.active ? "Desactivar muestra" : "Activar muestra"}</Button></td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No hay usuarios que coincidan con los filtros.</td></tr>}</tbody></table></div>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" />
          <Dialog.Content
            onCloseAutoFocus={(event) => restoreDialogTriggerFocus(event, dialogTriggerRef.current)}
            className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[90dvh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-bold">Añadir usuario de muestra</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Solo aparecerá en esta lista local. No se crea una cuenta.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Cerrar formulario" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <form autoComplete="off" onSubmit={createUser} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium">
                <span>Nombre</span>
                <input id="sample-user-name" name="sampleUserName" autoComplete="off" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                <span>Correo de muestra</span>
                <input id="sample-user-email" name="sampleUserEmail" autoComplete="off" required type="email" pattern="^[^@\s]+@[^@\s]+\.invalid$" maxLength={120} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@example.invalid" className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <span className="block text-xs font-normal text-muted-foreground">Usa una dirección terminada en .invalid para evitar envíos.</span>
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                <span>Rol de muestra</span>
                <select id="sample-user-role" name="sampleUserRole" value={role} onChange={(event) => setRole(event.target.value as AdminRoleId)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {ADMIN_ROLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Dialog.Close asChild><Button type="button" variant="outline">Cancelar</Button></Dialog.Close>
                <Button type="submit"><Check aria-hidden="true" className="h-4 w-4" /> Añadir a esta vista</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function UserStatus({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{active ? "Activo · muestra" : "Inactivo · muestra"}</span>;
}
