"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState, type FormEvent } from "react";
import { Clock3, Edit2, Plus, Search, Users, X } from "lucide-react";
import { MOCK_MINISTRIES } from "@/constants/data";
import { Button } from "@/components/ui/button";
import { ADMIN_SAMPLE_MEMBERS } from "@/lib/admin-sample-data";
import type { Ministry } from "@/types";

type MinistryDraft = Pick<Ministry, "name" | "leader" | "schedule" | "description">;
const EMPTY_DRAFT: MinistryDraft = { name: "", leader: "", schedule: "", description: "" };

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>(MOCK_MINISTRIES);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MinistryDraft>(EMPTY_DRAFT);
  const [announcement, setAnnouncement] = useState("");

  const filtered = useMemo(() => ministries.filter((ministry) => `${ministry.name} ${ministry.leader} ${ministry.schedule}`.toLowerCase().includes(search.toLowerCase())), [ministries, search]);

  const openNew = () => { setEditingId(null); setDraft(EMPTY_DRAFT); setDialogOpen(true); };
  const openEdit = (ministry: Ministry) => {
    setEditingId(ministry.id);
    setDraft({ name: ministry.name, leader: ministry.leader, schedule: ministry.schedule, description: ministry.description });
    setDialogOpen(true);
  };

  const saveMinistry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      setMinistries((current) => current.map((ministry) => ministry.id === editingId ? { ...ministry, ...draft, slug: draft.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : ministry));
      setAnnouncement("Ministerio actualizado en esta vista local.");
    } else {
      const slug = draft.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setMinistries((current) => [{ ...draft, id: `ministry-${Date.now()}`, slug, icon: "Users", coverImage: "" }, ...current]);
      setAnnouncement("Ministerio de muestra añadido a esta vista local.");
    }
    setDialogOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Users aria-hidden="true" className="h-4 w-4" /> Comunidad · muestra local</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Ministerios</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Consulta responsables, horarios de reunión y perfiles asociados. Las modificaciones se mantienen en esta vista.</p>
        </div>
        <Button type="button" onClick={openNew} className="min-h-11 self-start sm:self-auto"><Plus aria-hidden="true" className="h-4 w-4" /> Crear ministerio</Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-end sm:p-4">
        <label htmlFor="ministry-search" className="w-full space-y-1.5 text-xs font-semibold sm:max-w-lg"><span>Buscar por nombre, líder u horario</span><span className="relative block"><Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input id="ministry-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej.: alabanza" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></span></label>
        <p className="text-xs text-muted-foreground sm:pb-3" aria-live="polite">{filtered.length} de {ministries.length} ministerios de muestra</p>
      </div>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-label="Ministerios disponibles">
        {filtered.map((ministry) => {
          const memberCount = ADMIN_SAMPLE_MEMBERS.filter((member) => member.ministry === ministry.name).length;
          return <article key={ministry.id} className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="break-words text-lg font-bold leading-snug">{ministry.name}</h2><p className="mt-1 text-xs text-muted-foreground">Responsable de muestra</p></div><Button type="button" variant="ghost" size="icon" aria-label={`Editar ${ministry.name}`} onClick={() => openEdit(ministry)}><Edit2 aria-hidden="true" className="h-4 w-4" /></Button></div>
            <p className="mt-3 text-sm font-medium">{ministry.leader}</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><Clock3 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{ministry.schedule}</span></p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{ministry.description}</p>
            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><Users aria-hidden="true" className="h-4 w-4" /><span>{memberCount} {memberCount === 1 ? "perfil de muestra asignado" : "perfiles de muestra asignados"}</span></div>
          </article>;
        })}
        {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground md:col-span-2 2xl:col-span-3">No hay ministerios que coincidan con la búsqueda.</p>}
      </section>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] max-h-[90dvh] w-[min(38rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-2xl focus:outline-none sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><Dialog.Title className="text-lg font-bold">{editingId ? "Editar ministerio" : "Crear ministerio de muestra"}</Dialog.Title><Dialog.Description className="mt-1 text-sm text-muted-foreground">Los cambios son temporales y no modifican la información del sitio público.</Dialog.Description></div><Dialog.Close asChild><button type="button" aria-label="Cerrar formulario" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X aria-hidden="true" className="h-4 w-4" /></button></Dialog.Close></div>
            <form onSubmit={saveMinistry} className="mt-6 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium"><span>Nombre</span><input required maxLength={80} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <label className="block space-y-1.5 text-sm font-medium"><span>Líder asignado (muestra)</span><input required maxLength={80} value={draft.leader} onChange={(event) => setDraft({ ...draft, leader: event.target.value })} className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <label className="block space-y-1.5 text-sm font-medium"><span>Horario de reunión</span><input required maxLength={100} value={draft.schedule} onChange={(event) => setDraft({ ...draft, schedule: event.target.value })} placeholder="Día y hora" className="h-11 w-full rounded-xl border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <label className="block space-y-1.5 text-sm font-medium"><span>Descripción</span><textarea required rows={4} maxLength={400} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end"><Dialog.Close asChild><Button type="button" variant="outline">Cancelar</Button></Dialog.Close><Button type="submit">Aplicar en esta vista</Button></div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
