"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Check, MailPlus, RefreshCw, Search, Shield, UserCog, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ROLE_LABELS, type ProfileRoleId } from "@/config/admin-roles";
import { restoreDialogTriggerFocus } from "@/lib/admin-dialog-focus";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type MinistryRole = "leader" | "coordinator" | "musician" | "volunteer" | "member";

interface MinistryAssignment {
  id: string;
  ministryId: string;
  ministryName: string;
  role: MinistryRole;
  isActive: boolean;
}

interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: ProfileRoleId;
  isActive: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  canChangeRole: boolean;
  canToggleActive: boolean;
  ministryAssignments: MinistryAssignment[];
}

interface Ministry {
  id: string;
  name: string;
}

interface UsersResponse {
  users: ManagedUser[];
  ministries: Ministry[];
  assignableRoles: ProfileRoleId[];
}

const ministryRoleOptions: { value: MinistryRole; label: string }[] = [
  { value: "leader", label: ADMIN_ROLE_LABELS.ministry_leader },
  { value: "coordinator", label: ADMIN_ROLE_LABELS.ministry_coordinator },
  { value: "musician", label: ADMIN_ROLE_LABELS.musician },
  { value: "volunteer", label: ADMIN_ROLE_LABELS.ministry_volunteer },
  { value: "member", label: ADMIN_ROLE_LABELS.ministry_member },
];

function formatDate(value: string | null) {
  if (!value) return "Sin acceso registrado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin acceso registrado";
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(date);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [assignableRoles, setAssignableRoles] = useState<ProfileRoleId[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<ProfileRoleId>("visitor");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [ministryId, setMinistryId] = useState("");
  const [ministryRole, setMinistryRole] = useState<MinistryRole>("member");
  const inviteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const assignmentTriggerRef = useRef<HTMLButtonElement | null>(null);

  const loadUsers = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("La conexión con Supabase no está configurada.");
      setLoading(false);
      return;
    }

    setError("");
    const { data, error: requestError } = await client.functions.invoke<UsersResponse>(
      "admin-users",
      { body: { action: "list" } },
    );
    if (requestError || !data) {
      setError("No se pudieron cargar las cuentas. Confirma que la migración y la función protegida estén publicadas.");
      setLoading(false);
      return;
    }

    setUsers(data.users);
    setMinistries(data.ministries);
    setAssignableRoles(data.assignableRoles);
    setInviteRole((current) => data.assignableRoles.includes(current) ? current : (data.assignableRoles.includes("visitor") ? "visitor" : (data.assignableRoles[0] ?? "visitor")));
    setMinistryId((current) => data.ministries.some((ministry) => ministry.id === current) ? current : (data.ministries[0]?.id ?? ""));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filtered = useMemo(() => users.filter((user) => {
    const matchesSearch = (user.fullName + " " + user.email + " " + ADMIN_ROLE_LABELS[user.role])
      .toLocaleLowerCase("es")
      .includes(query.toLocaleLowerCase("es"));
    return matchesSearch && (
      statusFilter === "Todos" ||
      (statusFilter === "Activos" ? user.isActive : !user.isActive)
    );
  }), [users, query, statusFilter]);

  async function runAction(
    action: Record<string, unknown>,
    busyKey: string,
    successMessage: string,
  ) {
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError("La conexión con Supabase no está configurada.");
      return false;
    }

    setBusyId(busyKey);
    setError("");
    const { data, error: requestError } = await client.functions.invoke<{ error?: string }>(
      "admin-users",
      { body: action },
    );
    setBusyId("");
    if (requestError || data?.error) {
      setError(data?.error ?? "No se pudo completar el cambio. Inténtalo otra vez.");
      await loadUsers();
      return false;
    }

    setAnnouncement(successMessage);
    await loadUsers();
    return true;
  }

  async function inviteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invited = await runAction(
      { action: "invite", email: inviteEmail, fullName: inviteName, role: inviteRole },
      "invite",
      "Invitación enviada. La persona podrá aceptar el acceso con su correo.",
    );
    if (!invited) return;
    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
  }

  async function updateRole(user: ManagedUser, nextRole: ProfileRoleId) {
    if (nextRole === user.role) return;
    const updated = await runAction(
      { action: "update_profile_role", profileId: user.id, role: nextRole },
      user.id,
      "Rol actualizado para " + user.fullName + ".",
    );
    if (updated) {
      setUsers((current) => current.map((entry) => entry.id === user.id ? { ...entry, role: nextRole } : entry));
    }
  }

  async function toggleActive(user: ManagedUser) {
    const nextActive = !user.isActive;
    const updated = await runAction(
      { action: "set_user_active", profileId: user.id, isActive: nextActive },
      user.id,
      (nextActive ? "Acceso activado para " : "Acceso desactivado para ") + user.fullName + ".",
    );
    if (updated) {
      setUsers((current) => current.map((entry) => entry.id === user.id ? { ...entry, isActive: nextActive } : entry));
    }
  }

  async function assignMinistry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser || !ministryId) return;
    const assigned = await runAction(
      {
        action: "assign_ministry_role",
        profileId: selectedUser.id,
        ministryId,
        ministryRole,
      },
      selectedUser.id,
      "Cargo ministerial asignado a " + selectedUser.fullName + ".",
    );
    if (assigned) {
      setAssignmentOpen(false);
      setSelectedUser(null);
    }
  }

  async function removeMinistryRole(user: ManagedUser, assignment: MinistryAssignment) {
    await runAction(
      { action: "deactivate_ministry_role", assignmentId: assignment.id },
      user.id,
      "Cargo ministerial retirado de " + user.fullName + ".",
    );
  }

  function openAssignment(user: ManagedUser, trigger: HTMLButtonElement) {
    assignmentTriggerRef.current = trigger;
    setSelectedUser(user);
    setAssignmentOpen(true);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <Shield aria-hidden="true" className="h-4 w-4" /> Administración · cuentas reales
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Usuarios y perfiles</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Invita personas, administra el rol general y asigna responsabilidades ministeriales por separado.
          </p>
        </div>
        <Button
          type="button"
          disabled={assignableRoles.length === 0}
          onClick={(event) => {
            inviteTriggerRef.current = event.currentTarget;
            setInviteOpen(true);
          }}
          className="min-h-11 self-start sm:self-auto"
        >
          <MailPlus aria-hidden="true" className="h-4 w-4" /> Invitar persona
        </Button>
      </div>

      <aside className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
        <Shield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <strong>Los permisos se validan en Supabase.</strong> Los cambios de rol y estado pasan por una función autenticada; el perfil solo permite editar nombre, teléfono y foto.
        </p>
      </aside>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      )}
      <p role="status" aria-live="polite" className="sr-only">{announcement}</p>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[minmax(14rem,1fr)_12rem_auto] sm:items-end sm:p-4">
        <label htmlFor="users-search" className="space-y-1.5 text-xs font-semibold">
          <span>Buscar personas</span>
          <span className="relative block">
            <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              id="users-search"
              name="usersSearch"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre, correo o rol"
              className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </span>
        </label>
        <label htmlFor="users-status-filter" className="space-y-1.5 text-xs font-semibold">
          <span>Estado de acceso</span>
          <select
            id="users-status-filter"
            name="usersStatusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option>Todos</option>
            <option>Activos</option>
            <option>Inactivos</option>
          </select>
        </label>
        <div className="flex items-center justify-between gap-3 pb-1 sm:justify-end">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {loading ? "Cargando…" : filtered.length + " de " + users.length + " cuentas"}
          </p>
          <Button type="button" variant="outline" size="icon" onClick={() => void loadUsers()} disabled={loading} aria-label="Actualizar lista de usuarios">
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground" role="status">
          Cargando usuarios y asignaciones…
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Cuentas encontradas">
            {filtered.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                busy={busyId === user.id}
                assignableRoles={assignableRoles}
                ministriesAvailable={ministries.length > 0}
                onRoleChange={(nextRole) => void updateRole(user, nextRole)}
                onToggleActive={() => void toggleActive(user)}
                onAssign={(event) => openAssignment(user, event.currentTarget)}
                onRemoveAssignment={(assignment) => void removeMinistryRole(user, assignment)}
              />
            ))}
          </section>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Cuentas, perfiles y asignaciones ministeriales</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">Persona</th>
                  <th scope="col" className="px-4 py-3">Rol general</th>
                  <th scope="col" className="px-4 py-3">Ministerios</th>
                  <th scope="col" className="px-4 py-3">Último acceso</th>
                  <th scope="col" className="px-4 py-3">Estado</th>
                  <th scope="col" className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.map((user) => (
                  <tr key={user.id} className="align-top hover:bg-muted/20">
                    <td className="max-w-64 px-4 py-4">
                      <div className="break-words font-semibold">{user.fullName}</div>
                      <div className="mt-1 break-all text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="min-w-48 px-4 py-4">
                      <RoleSelect user={user} assignableRoles={assignableRoles} busy={busyId === user.id} onChange={(nextRole) => void updateRole(user, nextRole)} />
                    </td>
                    <td className="max-w-72 px-4 py-4">
                      <AssignmentList user={user} busyId={busyId} onRemove={(assignment) => void removeMinistryRole(user, assignment)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">{formatDate(user.lastSignInAt)}</td>
                    <td className="px-4 py-4"><UserStatus active={user.isActive} /></td>
                    <td className="min-w-52 px-4 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" disabled={!ministries.length || busyId === user.id} onClick={(event) => openAssignment(user, event.currentTarget)}>
                          Asignar ministerio
                        </Button>
                        {user.canToggleActive && (
                          <Button type="button" variant="outline" size="sm" disabled={busyId === user.id} onClick={() => void toggleActive(user)}>
                            {user.isActive ? "Desactivar" : "Activar"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No hay cuentas que coincidan con los filtros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && users.length > 0 && (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground xl:hidden">
              No hay cuentas que coincidan con los filtros.
            </p>
          )}
          {users.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <UserRound aria-hidden="true" className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 font-semibold">Aún no hay perfiles</h2>
              <p className="mt-1 text-sm text-muted-foreground">Cuando una persona inicie sesión o acepte una invitación, aparecerá aquí.</p>
            </div>
          )}
        </>
      )}

      <Dialog.Root open={inviteOpen} onOpenChange={setInviteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" />
          <Dialog.Content
            onCloseAutoFocus={(event) => restoreDialogTriggerFocus(event, inviteTriggerRef.current)}
            className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[90dvh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-bold">Invitar persona</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Se enviará un enlace a su correo. El nuevo perfil inicia con el rol seleccionado; nunca se asigna por datos editables de Google.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Cerrar formulario" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <form autoComplete="off" onSubmit={inviteUser} className="mt-6 space-y-4">
              <label htmlFor="invite-name" className="block space-y-1.5 text-sm font-medium">
                <span>Nombre completo</span>
                <input id="invite-name" name="inviteName" autoComplete="name" required maxLength={100} value={inviteName} onChange={(event) => setInviteName(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label htmlFor="invite-email" className="block space-y-1.5 text-sm font-medium">
                <span>Correo electrónico</span>
                <input id="invite-email" name="inviteEmail" autoComplete="email" required type="email" maxLength={254} value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label htmlFor="invite-role" className="block space-y-1.5 text-sm font-medium">
                <span>Rol general</span>
                <select id="invite-role" name="inviteRole" required value={inviteRole} onChange={(event) => setInviteRole(event.target.value as ProfileRoleId)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {assignableRoles.map((item) => <option key={item} value={item}>{ADMIN_ROLE_LABELS[item]}</option>)}
                </select>
                <span className="block text-xs font-normal text-muted-foreground">Los cargos de ministerio se asignan después, con su propio alcance.</span>
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Dialog.Close asChild><Button type="button" variant="outline">Cancelar</Button></Dialog.Close>
                <Button type="submit" disabled={busyId === "invite"}><MailPlus aria-hidden="true" className="h-4 w-4" /> Enviar invitación</Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root
        open={assignmentOpen}
        onOpenChange={(open) => {
          setAssignmentOpen(open);
          if (!open) setSelectedUser(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" />
          <Dialog.Content
            onCloseAutoFocus={(event) => restoreDialogTriggerFocus(event, assignmentTriggerRef.current)}
            className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[90dvh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-bold">Asignar función ministerial</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {selectedUser ? selectedUser.fullName : "Selecciona una persona"} · Esta asignación no cambia su rol general.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" aria-label="Cerrar formulario" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>
            <form onSubmit={assignMinistry} className="mt-6 space-y-4">
              <label htmlFor="assignment-ministry" className="block space-y-1.5 text-sm font-medium">
                <span>Ministerio</span>
                <select id="assignment-ministry" name="assignmentMinistry" required value={ministryId} onChange={(event) => setMinistryId(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {ministries.map((ministry) => <option key={ministry.id} value={ministry.id}>{ministry.name}</option>)}
                </select>
              </label>
              <label htmlFor="assignment-role" className="block space-y-1.5 text-sm font-medium">
                <span>Función</span>
                <select id="assignment-role" name="assignmentRole" required value={ministryRole} onChange={(event) => setMinistryRole(event.target.value as MinistryRole)} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {ministryRoleOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Dialog.Close asChild><Button type="button" variant="outline">Cancelar</Button></Dialog.Close>
                <Button type="submit" disabled={!ministries.length || !selectedUser || busyId === selectedUser?.id}>
                  <Check aria-hidden="true" className="h-4 w-4" /> Guardar asignación
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function UserCard({
  user,
  busy,
  assignableRoles,
  ministriesAvailable,
  onRoleChange,
  onToggleActive,
  onAssign,
  onRemoveAssignment,
}: {
  user: ManagedUser;
  busy: boolean;
  assignableRoles: ProfileRoleId[];
  ministriesAvailable: boolean;
  onRoleChange: (role: ProfileRoleId) => void;
  onToggleActive: () => void;
  onAssign: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveAssignment: (assignment: MinistryAssignment) => void;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="h-4 w-4" /></span>
          <div className="min-w-0">
            <h2 className="break-words font-bold">{user.fullName}</h2>
            <p className="mt-1 break-all text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <UserStatus active={user.isActive} />
      </div>
      <div className="mt-4 space-y-3 border-t border-border pt-3">
        <RoleSelect user={user} assignableRoles={assignableRoles} busy={busy} onChange={onRoleChange} />
        <div>
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Asignaciones ministeriales</h3>
          <AssignmentList user={user} busyId={busy ? user.id : ""} onRemove={onRemoveAssignment} />
        </div>
        <p className="text-xs text-muted-foreground">Último acceso: {formatDate(user.lastSignInAt)}</p>
      </div>
      <div className="mt-4 grid gap-2 border-t border-border pt-3">
        <Button type="button" variant="outline" className="min-h-11 w-full" disabled={!ministriesAvailable || busy} onClick={onAssign}>
          <UserCog aria-hidden="true" className="h-4 w-4" /> Asignar ministerio
        </Button>
        {user.canToggleActive && (
          <Button type="button" variant="outline" className="min-h-11 w-full" disabled={busy} onClick={onToggleActive}>
            {user.isActive ? "Desactivar acceso" : "Activar acceso"}
          </Button>
        )}
      </div>
    </article>
  );
}

function RoleSelect({
  user,
  assignableRoles,
  busy,
  onChange,
}: {
  user: ManagedUser;
  assignableRoles: ProfileRoleId[];
  busy: boolean;
  onChange: (role: ProfileRoleId) => void;
}) {
  const options = user.canChangeRole ? assignableRoles : [user.role];
  return (
    <label className="block space-y-1.5 text-xs font-semibold">
      <span>Rol general</span>
      <select
        id={"user-role-" + user.id}
        name={"userRole-" + user.id}
        aria-label={"Rol general de " + user.fullName}
        value={user.role}
        disabled={!user.canChangeRole || busy}
        onChange={(event) => onChange(event.target.value as ProfileRoleId)}
        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
      >
        {options.map((item) => <option key={item} value={item}>{ADMIN_ROLE_LABELS[item]}</option>)}
      </select>
    </label>
  );
}

function AssignmentList({
  user,
  busyId,
  onRemove,
}: {
  user: ManagedUser;
  busyId: string;
  onRemove: (assignment: MinistryAssignment) => void;
}) {
  const activeAssignments = user.ministryAssignments.filter((assignment) => assignment.isActive);
  if (activeAssignments.length === 0) {
    return <p className="text-xs text-muted-foreground">Sin asignaciones</p>;
  }
  return (
    <ul className="space-y-2">
      {activeAssignments.map((assignment) => {
        const ministryLabel = ADMIN_ROLE_LABELS[
          assignment.role === "leader" ? "ministry_leader" :
          assignment.role === "coordinator" ? "ministry_coordinator" :
          assignment.role === "musician" ? "musician" :
          assignment.role === "volunteer" ? "ministry_volunteer" :
          "ministry_member"
        ];
        return (
          <li key={assignment.id} className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-muted/50 px-2.5 py-2 text-xs">
            <span className="min-w-0 break-words">
              <strong>{ministryLabel}</strong>
              <span className="text-muted-foreground"> · {assignment.ministryName}</span>
            </span>
            <button
              type="button"
              aria-label={"Retirar " + ministryLabel + " de " + assignment.ministryName + " para " + user.fullName}
              disabled={busyId === user.id || busyId === user.id + assignment.id}
              onClick={() => onRemove(assignment)}
              className="min-h-11 shrink-0 rounded-lg px-2 text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-destructive disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Retirar
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function UserStatus({ active }: { active: boolean }) {
  return (
    <span className={"inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold " + (active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}
