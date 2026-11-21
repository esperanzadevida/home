"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  Check,
  ClipboardList,
  Download,
  Eye,
  Heart,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_SAMPLE_MEMBERS,
  downloadCsv,
  formatSampleDate,
  type AdminMember,
  type MemberStatus,
} from "@/lib/admin-sample-data";

type MemberDraft = Omit<AdminMember, "id">;

const EMPTY_DRAFT: MemberDraft = {
  name: "",
  email: "",
  phone: "No asignado",
  ministry: "",
  status: "Visitante",
  isBaptized: false,
  joinDate: new Date().toISOString().slice(0, 10),
};

const statusOptions: MemberStatus[] = ["Activo", "En discipulado", "Visitante"];

function MemberForm({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onSubmit,
  editing,
  ministries,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: MemberDraft;
  onDraftChange: (draft: MemberDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  editing: boolean;
  ministries: string[];
}) {
  const update = <K extends keyof MemberDraft>(key: K, value: MemberDraft[K]) =>
    onDraftChange({ ...draft, [key]: value });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[min(90dvh,48rem)] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold">{editing ? "Editar ficha" : "Registrar miembro de muestra"}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                Los cambios quedan solo en esta vista y se reinician al salir o actualizar.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button type="button" aria-label="Cerrar formulario" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                <span>Nombre completo</span>
                <input required maxLength={100} autoComplete="name" value={draft.name} onChange={(event) => update("name", event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                <span>Correo de ejemplo</span>
                <input required type="email" pattern="^[^@\\s]+@[^@\\s]+\\.invalid$" maxLength={120} autoComplete="off" value={draft.email} onChange={(event) => update("email", event.target.value)} placeholder="nombre@example.invalid" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <span className="block text-xs font-normal text-muted-foreground">Usa el dominio reservado .invalid para esta demostración.</span>
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                <span>Teléfono</span>
                <input maxLength={40} value={draft.phone} onChange={(event) => update("phone", event.target.value)} placeholder="No asignado" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                <span>Ministerio</span>
                <select value={draft.ministry} onChange={(event) => update("ministry", event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Sin asignar</option>
                  {ministries.map((ministry) => <option key={ministry} value={ministry}>{ministry}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                <span>Estado de acompañamiento</span>
                <select value={draft.status} onChange={(event) => update("status", event.target.value as MemberStatus)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label className="space-y-1.5 text-sm font-medium">
                <span>Fecha de ingreso (muestra)</span>
                <input required type="date" value={draft.joinDate} onChange={(event) => update("joinDate", event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </label>
            </div>
            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 text-sm font-medium">
              <input type="checkbox" checked={draft.isBaptized} onChange={(event) => update("isBaptized", event.target.checked)} className="h-4 w-4 rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring" />
              Bautismo en agua registrado en esta muestra
            </label>
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Dialog.Close asChild><Button type="button" variant="outline">Cancelar</Button></Dialog.Close>
              <Button type="submit">{editing ? "Aplicar a esta vista" : "Añadir a esta vista"}</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function AdminMiembrosPage() {
  const [members, setMembers] = useState<AdminMember[]>(ADMIN_SAMPLE_MEMBERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [ministryFilter, setMinistryFilter] = useState("Todos los ministerios");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileMember, setProfileMember] = useState<AdminMember | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(EMPTY_DRAFT);
  const [announcement, setAnnouncement] = useState("");

  const ministries = useMemo(() => [...new Set(members.map((member) => member.ministry).filter(Boolean))].sort(), [members]);
  const filtered = members.filter((member) => {
    const searchMatch = `${member.name} ${member.email} ${member.ministry}`.toLowerCase().includes(query.toLowerCase());
    return searchMatch && (statusFilter === "Todos los estados" || member.status === statusFilter) && (ministryFilter === "Todos los ministerios" || member.ministry === ministryFilter);
  });

  const openNew = () => {
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT, joinDate: new Date().toISOString().slice(0, 10) });
    setDialogOpen(true);
  };

  const openEdit = (member: AdminMember) => {
    setEditingId(member.id);
    setDraft({ name: member.name, email: member.email, phone: member.phone, ministry: member.ministry, status: member.status, isBaptized: member.isBaptized, joinDate: member.joinDate });
    setDialogOpen(true);
  };

  const saveMember = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      setMembers((current) => current.map((member) => member.id === editingId ? { ...draft, id: member.id } : member));
      setAnnouncement("Ficha actualizada en esta vista local.");
    } else {
      setMembers((current) => [{ ...draft, id: `member-${Date.now()}` }, ...current]);
      setAnnouncement("Miembro de muestra añadido a esta vista local.");
    }
    setDialogOpen(false);
  };

  const exportMembers = () => {
    downloadCsv("esperanza-de-vida-miembros-muestra.csv", [
      ["Nombre", "Correo de muestra", "Teléfono", "Ministerio", "Estado", "Bautismo", "Fecha de ingreso"],
      ...filtered.map((member) => [member.name, member.email, member.phone, member.ministry, member.status, member.isBaptized ? "Sí" : "No", member.joinDate]),
    ]);
    setAnnouncement(`CSV local preparado con ${filtered.length} registros de muestra.`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Users aria-hidden="true" className="h-4 w-4" /> Comunidad · muestra local</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Directorio de miembros</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Perfiles de ejemplo para revisar búsquedas, filtros y asignación a ministerios. No contienen registros reales.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={exportMembers} className="min-h-11"><Download aria-hidden="true" className="h-4 w-4" /> Exportar CSV de muestra</Button>
          <Button type="button" onClick={openNew} className="min-h-11"><Plus aria-hidden="true" className="h-4 w-4" /> Añadir perfil</Button>
        </div>
      </div>

      <section aria-label="Filtros del directorio" className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_13rem_15rem_auto] lg:items-end lg:p-4">
        <label className="space-y-1.5 text-xs font-semibold text-foreground">
          <span>Buscar</span>
          <span className="relative block"><Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, correo o ministerio" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></span>
        </label>
        <label className="space-y-1.5 text-xs font-semibold text-foreground"><span>Estado</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Todos los estados</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label className="space-y-1.5 text-xs font-semibold text-foreground"><span>Ministerio</span><select value={ministryFilter} onChange={(event) => setMinistryFilter(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Todos los ministerios</option>{ministries.map((ministry) => <option key={ministry}>{ministry}</option>)}</select></label>
        <p aria-live="polite" className="text-xs text-muted-foreground lg:pb-3">{filtered.length} de {members.length} perfiles de muestra</p>
      </section>

      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Perfiles encontrados">
        {filtered.map((member) => <MemberCard key={member.id} member={member} onEdit={openEdit} onProfile={setProfileMember} />)}
        {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground sm:col-span-2">No hay perfiles que coincidan con estos filtros.</p>}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Directorio de perfiles de muestra</caption>
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th scope="col" className="px-4 py-3">Nombre</th><th scope="col" className="px-4 py-3">Contacto de muestra</th><th scope="col" className="px-4 py-3">Ministerio</th><th scope="col" className="px-4 py-3">Estado</th><th scope="col" className="px-4 py-3">Ingreso</th><th scope="col" className="px-4 py-3 text-right">Acciones</th></tr></thead>
          <tbody className="divide-y divide-border/70">{filtered.map((member) => <tr key={member.id} className="align-middle hover:bg-muted/20"><td className="px-4 py-4"><div className="font-semibold">{member.name}</div><div className="mt-1 text-xs text-muted-foreground">{member.isBaptized ? "Bautismo: registrado en muestra" : "Bautismo: pendiente en muestra"}</div></td><td className="px-4 py-4"><div className="flex items-start gap-2 break-all text-xs"><Mail aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />{member.email}</div><div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Phone aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />{member.phone}</div></td><td className="px-4 py-4 text-xs">{member.ministry || "Sin asignar"}</td><td className="px-4 py-4"><StatusBadge status={member.status} /></td><td className="px-4 py-4 text-xs text-muted-foreground">{formatSampleDate(member.joinDate)}</td><td className="px-4 py-4"><div className="flex justify-end gap-2"><Button type="button" variant="outline" size="sm" onClick={() => setProfileMember(member)}>Ver perfil</Button><Button type="button" variant="ghost" size="icon" aria-label={`Editar ${member.name}`} onClick={() => openEdit(member)}><Pencil aria-hidden="true" className="h-4 w-4" /></Button></div></td></tr>)}{filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No hay perfiles que coincidan con estos filtros.</td></tr>}</tbody>
        </table>
      </div>

      <MemberForm open={dialogOpen} onOpenChange={setDialogOpen} draft={draft} onDraftChange={setDraft} onSubmit={saveMember} editing={Boolean(editingId)} ministries={ministries} />
      <MemberProfileDialog member={profileMember} onClose={() => setProfileMember(null)} />
    </div>
  );
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const styles: Record<MemberStatus, string> = {
    Activo: "bg-success/10 text-success",
    "En discipulado": "bg-warning/15 text-warning",
    Visitante: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}

function MemberCard({ member, onEdit, onProfile }: { member: AdminMember; onEdit: (member: AdminMember) => void; onProfile: (member: AdminMember) => void }) {
  return <article className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words text-base font-bold">{member.name}</h2><p className="mt-1 text-xs text-muted-foreground">Ingreso: {formatSampleDate(member.joinDate)}</p></div><StatusBadge status={member.status} /></div>
    <dl className="mt-4 space-y-3 border-t border-border pt-3 text-xs"><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Correo de muestra</dt><dd className="mt-1 break-all">{member.email}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Ministerio</dt><dd className="mt-1 font-medium">{member.ministry || "Sin asignar"}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Bautismo</dt><dd className="mt-1 inline-flex items-center gap-1.5">{member.isBaptized && <Check aria-hidden="true" className="h-3.5 w-3.5 text-success" />}{member.isBaptized ? "Registrado en muestra" : "Pendiente en muestra"}</dd></div></dl>
    <div className="mt-4 flex gap-2 border-t border-border pt-3"><Button type="button" variant="outline" className="min-h-11 flex-1" onClick={() => onProfile(member)}>Ver perfil</Button><Button type="button" variant="ghost" size="icon" aria-label={`Editar ${member.name}`} onClick={() => onEdit(member)}><Pencil aria-hidden="true" className="h-4 w-4" /></Button></div>
  </article>;
}

function MemberProfileDialog({ member, onClose }: { member: AdminMember | null; onClose: () => void }) {
  const [note, setNote] = useState("");
  return <Dialog.Root open={Boolean(member)} onOpenChange={(open) => { if (!open) { setNote(""); onClose(); } }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[90dvh] w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7"><Dialog.Title className="text-xl font-bold">{member?.name}</Dialog.Title><Dialog.Description className="mt-1 text-sm text-muted-foreground">Perfil de muestra. No corresponde a una persona ni historial real.</Dialog.Description>{member && <div className="mt-6 grid gap-4 sm:grid-cols-2"><section className="rounded-xl border border-border p-4"><div className="flex items-center gap-2 font-semibold"><Mail aria-hidden="true" className="h-4 w-4 text-primary" />Contacto</div><p className="mt-3 break-all text-sm">{member.email}</p><p className="mt-1 text-sm text-muted-foreground">{member.phone}</p><p className="mt-3 text-xs text-muted-foreground">Ingreso: {formatSampleDate(member.joinDate)}</p></section><section className="rounded-xl border border-border p-4"><div className="flex items-center gap-2 font-semibold"><Users aria-hidden="true" className="h-4 w-4 text-primary" />Acompañamiento</div><p className="mt-3 text-sm">{member.status} · {member.ministry || "Sin ministerio asignado"}</p><p className="mt-1 text-xs text-muted-foreground">Bautismo: {member.isBaptized ? "registrado en la muestra" : "pendiente en la muestra"}</p></section><section className="rounded-xl border border-border p-4"><div className="flex items-center gap-2 font-semibold"><CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" />Asistencia</div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">El historial requiere un proceso aprobado y una fuente conectada. No se registra asistencia aquí.</p></section><section className="rounded-xl border border-border p-4"><div className="flex items-center gap-2 font-semibold"><Heart aria-hidden="true" className="h-4 w-4 text-primary" />Aportes</div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">No hay historial financiero vinculado a este perfil de muestra.</p></section><section className="rounded-xl border border-border p-4 sm:col-span-2"><div className="flex items-center gap-2 font-semibold"><ClipboardList aria-hidden="true" className="h-4 w-4 text-primary" />Nota temporal</div><label htmlFor="member-profile-note" className="mt-2 block text-xs leading-relaxed text-muted-foreground">No escribas datos personales, pastorales o sensibles. Se borra al cerrar el perfil.</label><textarea id="member-profile-note" maxLength={300} rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nota de ejemplo…" className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /><p className="mt-1 text-right text-xs text-muted-foreground">{note.length}/300 · solo en memoria</p></section></div>}<div className="mt-5 flex justify-end"><Dialog.Close asChild><Button type="button" variant="outline" className="min-h-11"><Eye aria-hidden="true" className="h-4 w-4" /> Cerrar perfil</Button></Dialog.Close></div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
