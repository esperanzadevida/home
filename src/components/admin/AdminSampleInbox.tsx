"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, Inbox, Mail, MessageCircle, ShieldAlert } from "lucide-react";
import { useAdminAccess } from "@/components/admin/AdminAuthGate";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type InboxKind = "prayer" | "contact";
type InboxEntry = {
  id: string;
  reference: string;
  summary: string;
  submitted: string;
  status: string;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
};

const STATUS_LABELS: Record<InboxKind, Record<string, string>> = {
  prayer: { pending: "Pendiente", praying: "En acompañamiento", answered: "Respondida" },
  contact: { unread: "Nuevo", read: "En revisión", replied: "Respondido", archived: "Archivado" },
};
const PAGE_SIZE = 100;
type InboxCursor = { createdAt: string; id: string };

const SAMPLES: Record<InboxKind, InboxEntry[]> = {
  prayer: [
    { id: "prayer-sample-01", reference: "Petición de muestra 01", summary: "Registro sintético sin nombre ni detalle personal.", submitted: "Fecha de muestra", status: "pending" },
    { id: "prayer-sample-02", reference: "Petición de muestra 02", summary: "Registro sintético sin nombre ni detalle personal.", submitted: "Fecha de muestra", status: "praying" },
  ],
  contact: [
    { id: "contact-sample-01", reference: "Mensaje de muestra 01", summary: "Registro sintético sin correo ni texto recibido.", submitted: "Fecha de muestra", status: "unread" },
    { id: "contact-sample-02", reference: "Mensaje de muestra 02", summary: "Registro sintético sin correo ni texto recibido.", submitted: "Fecha de muestra", status: "read" },
  ],
};

const COPY: Record<InboxKind, { title: string; description: string; itemLabel: string; itemPlural: string }> = {
  prayer: {
    title: "Peticiones de oración",
    description: "Revisa y organiza solicitudes de acompañamiento espiritual.",
    itemLabel: "petición",
    itemPlural: "peticiones",
  },
  contact: {
    title: "Mensajes de contacto",
    description: "Organiza los mensajes recibidos a través del sitio público.",
    itemLabel: "mensaje",
    itemPlural: "mensajes",
  },
};

function formatSubmissionDate(value: unknown) {
  if (typeof value !== "string") return "Fecha no disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-EC", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function getCursor(record: Record<string, unknown> | undefined): InboxCursor | null {
  if (typeof record?.created_at !== "string" || typeof record.id !== "string") return null;
  const timestamp = record.created_at;
  const isIsoTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp);
  const isUuid = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(record.id);
  if (!isIsoTimestamp || Number.isNaN(Date.parse(timestamp)) || !isUuid) return null;
  return { createdAt: timestamp, id: record.id };
}

function mapRecord(kind: InboxKind, record: Record<string, unknown>): InboxEntry {
  if (kind === "prayer") {
    return {
      id: String(record.id),
      reference: String(record.requester_name ?? "Petición recibida"),
      summary: String(record.request ?? ""),
      submitted: formatSubmissionDate(record.created_at),
      status: String(record.status ?? "pending"),
      email: typeof record.requester_email === "string" ? record.requester_email : null,
    };
  }

  return {
    id: String(record.id),
    reference: String(record.name ?? "Mensaje recibido"),
    summary: String(record.message ?? ""),
    submitted: formatSubmissionDate(record.created_at),
    status: String(record.status ?? "unread"),
    email: typeof record.email === "string" ? record.email : null,
    phone: typeof record.phone === "string" ? record.phone : null,
    subject: typeof record.subject === "string" ? record.subject : null,
  };
}

export function AdminSampleInbox({ kind }: { kind: InboxKind }) {
  const { demoMode } = useAdminAccess();
  const copy = COPY[kind];
  const [entries, setEntries] = useState<InboxEntry[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<InboxCursor | null>(null);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [attempt, setAttempt] = useState(0);
  const Icon = kind === "prayer" ? Heart : MessageCircle;
  const statusOptions = Object.keys(STATUS_LABELS[kind]);
  const filtered = useMemo(
    () => entries.filter((entry) => filter === "Todos" || entry.status === filter),
    [entries, filter],
  );

  const loadEntries = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError("");
    setHasMore(false);
    setNextCursor(null);

    if (demoMode) {
      setEntries(SAMPLES[kind]);
      setLoading(false);
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) {
      setEntries([]);
      setNextCursor(null);
      setError("La bandeja requiere una conexión Supabase configurada.");
      setLoading(false);
      return;
    }

    try {
      const result = kind === "prayer"
        ? await client.from("prayer_requests").select("id, requester_name, requester_email, request, status, created_at").order("created_at", { ascending: false }).order("id", { ascending: false }).range(0, PAGE_SIZE)
        : await client.from("contact_messages").select("id, name, email, phone, subject, message, status, created_at").order("created_at", { ascending: false }).order("id", { ascending: false }).range(0, PAGE_SIZE);

      if (signal.aborted) return;
      if (result.error) throw result.error;

      const records = (result.data ?? []) as unknown as Record<string, unknown>[];
      const pageRecords = records.slice(0, PAGE_SIZE);
      setEntries(pageRecords.map((record) => mapRecord(kind, record)));
      const cursor = getCursor(pageRecords.at(-1));
      setNextCursor(cursor);
      setHasMore(records.length > PAGE_SIZE && cursor !== null);
    } catch {
      if (!signal.aborted) {
        setEntries([]);
        setNextCursor(null);
        setHasMore(false);
        setError("No se pudo cargar la bandeja. Revisa la conexión y los permisos de base de datos.");
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [demoMode, kind]);

  async function loadMore() {
    const client = getSupabaseBrowserClient();
    if (!client || demoMode || loadingMore || !hasMore) return;

    const cursor = nextCursor;
    if (!cursor) return;
    setLoadingMore(true);
    setError("");
    try {
      const result = kind === "prayer"
        ? await client.from("prayer_requests").select("id, requester_name, requester_email, request, status, created_at").or(`created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`).order("created_at", { ascending: false }).order("id", { ascending: false }).range(0, PAGE_SIZE)
        : await client.from("contact_messages").select("id, name, email, phone, subject, message, status, created_at").or(`created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`).order("created_at", { ascending: false }).order("id", { ascending: false }).range(0, PAGE_SIZE);

      if (result.error) throw result.error;
      const records = (result.data ?? []) as unknown as Record<string, unknown>[];
      const pageRecords = records.slice(0, PAGE_SIZE);
      setEntries((current) => [...current, ...pageRecords.map((record) => mapRecord(kind, record))]);
      const next = getCursor(pageRecords.at(-1));
      setNextCursor(next);
      setHasMore(records.length > PAGE_SIZE && next !== null);
      setAnnouncement(pageRecords.length === 0
        ? "No hay registros más antiguos."
        : `Se cargaron ${pageRecords.length} ${pageRecords.length === 1 ? copy.itemLabel : copy.itemPlural} adicionales.`);
    } catch {
      setError("No se pudieron cargar los registros anteriores. Puedes volver a intentarlo.");
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadEntries(controller.signal);
    return () => controller.abort();
  }, [attempt, loadEntries]);

  async function updateStatus(id: string, status: string) {
    if (demoMode) {
      setEntries((current) => current.map((entry) => entry.id === id ? { ...entry, status } : entry));
      setAnnouncement(`Estado de muestra actualizado a ${STATUS_LABELS[kind][status]}. No se modificó un registro real.`);
      return;
    }

    const client = getSupabaseBrowserClient();
    if (!client) return;

    setUpdatingId(id);
    setError("");
    setAnnouncement("");
    try {
      const table = kind === "prayer" ? "prayer_requests" : "contact_messages";
      const { data, error: updateError } = await client
        .from(table)
        .update({ status })
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (updateError || !data) throw updateError ?? new Error("Registro no disponible");
      setEntries((current) => current.map((entry) => entry.id === id ? { ...entry, status } : entry));
      setAnnouncement(`Estado actualizado a ${STATUS_LABELS[kind][status]}.`);
    } catch {
      setError("No se guardó el cambio. Puede que el registro ya no exista o que tu rol no permita actualizarlo.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Icon aria-hidden="true" className="h-4 w-4" />Moderación</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy.description}</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Inbox aria-hidden="true" className="h-3.5 w-3.5" />{filtered.length} de {entries.length} {entries.length === 1 ? `${copy.itemLabel} cargada` : `${copy.itemPlural} cargadas`}</span>
      </header>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm leading-5 text-foreground" role="note">
        <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p>{demoMode ? "Esta vista usa registros sintéticos y cambios temporales que se pierden al recargar." : "Los mensajes se cargan en lotes de 100 para personas con rol de administración o moderación. Responder desde aquí todavía no envía correos."}</p>
      </aside>

      <div className="grid gap-3 sm:grid-cols-[minmax(14rem,20rem)_1fr] sm:items-end">
        <label htmlFor={`${kind}-status-filter`} className="space-y-1.5 text-xs font-semibold">
          <span>Filtrar por estado</span>
          <select id={`${kind}-status-filter`} name={`${kind}-status-filter`} value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="Todos">Todos</option>
            {statusOptions.map((status) => <option key={status} value={status}>{STATUS_LABELS[kind][status]}</option>)}
          </select>
        </label>
        <p className="text-xs text-muted-foreground" aria-live="polite">{demoMode ? "Los cambios de muestra no se guardan." : `Los cambios de estado se guardan en Supabase con las políticas de tu rol. El filtro cubre los ${entries.length} registros cargados.`}</p>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p>{error}</p>
          {!demoMode && <button type="button" onClick={() => setAttempt((value) => value + 1)} className="inline-flex min-h-11 w-fit items-center rounded-lg border border-border px-3 font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Reintentar</button>}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      {loading ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground" role="status">Cargando bandeja…</p>
      ) : filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <Inbox aria-hidden="true" className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">{error ? "No hay datos disponibles" : `No hay ${copy.itemPlural} en este estado`}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error ? "Revisa la configuración de Supabase y las políticas de acceso." : "Prueba otro filtro para ver más registros."}</p>
        </section>
      ) : (
        <section className="grid gap-3 xl:grid-cols-2" aria-label={copy.title}>
          {filtered.map((entry) => (
            <article key={entry.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <h2 className="break-words font-semibold">{entry.reference}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.submitted}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{STATUS_LABELS[kind][entry.status] ?? "Estado desconocido"}{demoMode ? " · muestra" : ""}</span>
              </div>
              {entry.subject && <p className="mt-3 text-sm font-semibold">{entry.subject}</p>}
              <p className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-muted/40 p-3 text-sm leading-6 text-foreground">{entry.summary || "Sin texto"}</p>
              {(entry.email || entry.phone) && (
                <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  {entry.email && <div className="min-w-0"><dt className="font-semibold text-muted-foreground">Correo</dt><dd className="break-all">{entry.email}</dd></div>}
                  {entry.phone && <div className="min-w-0"><dt className="font-semibold text-muted-foreground">Teléfono</dt><dd>{entry.phone}</dd></div>}
                </dl>
              )}
              <label htmlFor={`${entry.id}-status`} className="mt-4 block space-y-1.5 text-xs font-semibold">
                <span>{demoMode ? "Cambiar estado local" : "Actualizar estado"}</span>
                <select id={`${entry.id}-status`} name={`${entry.id}-status`} value={entry.status} disabled={updatingId === entry.id} onChange={(event) => void updateStatus(entry.id, event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
                  {statusOptions.map((status) => <option key={status} value={status}>{STATUS_LABELS[kind][status]}</option>)}
                </select>
              </label>
            </article>
          ))}
        </section>
      )}
      {!loading && hasMore && (
        <div className="flex flex-col items-center gap-2">
          <button type="button" onClick={() => void loadMore()} disabled={loadingMore} className="min-h-11 rounded-xl border border-border px-5 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-wait disabled:opacity-60">
            {loadingMore ? "Cargando registros…" : `Cargar ${PAGE_SIZE} registros anteriores`}
          </button>
          <p className="text-xs text-muted-foreground">El filtro por estado se aplica a los registros cargados.</p>
        </div>
      )}
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><Mail aria-hidden="true" className="h-3.5 w-3.5" />{demoMode ? "Esta bandeja no conserva datos reales." : "No se envían correos ni se toman decisiones automáticas."}</p>
    </div>
  );
}
