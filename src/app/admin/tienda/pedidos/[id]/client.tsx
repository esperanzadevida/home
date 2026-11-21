"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  MessageSquareText,
  Package,
  PackageCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type FulfillmentStatus = "Procesando" | "Preparando" | "Enviado" | "Entregado";
type PaymentStatus = "Pagado" | "Pendiente" | "Reembolsado";
type OrderLine = { name: string; detail: string; quantity: number; unitPrice: number };
type TimelineEntry = { title: string; detail: string; date: string; complete: boolean };
type InternalNote = { id: number; content: string; date: string };
type OrderFixture = {
  id: string;
  number: string;
  date: string;
  customer: string;
  email: string;
  payment: PaymentStatus;
  fulfillment: FulfillmentStatus;
  items: OrderLine[];
  address: string[];
  timeline: TimelineEntry[];
  notes: InternalNote[];
};

const MOCK_ORDERS: Record<string, OrderFixture> = {
  "1": {
    id: "1", number: "PED-1048", date: "18 nov 2026 · 10:32", customer: "Carlos Morales", email: "carlos.morales@example.invalid", payment: "Pagado", fulfillment: "Enviado",
    items: [{ name: "Biblia de estudio", detail: "Tapa dura · Negro", quantity: 1, unitPrice: 28 }],
    address: ["Dirección ficticia para demostración", "Calle Los Arrayanes 123 y Las Orquídeas", "Sector Ficoa · Ambato, Tungurahua", "Ecuador"],
    timeline: [
      { title: "Pedido recibido", detail: "Registro de demostración", date: "18 nov · 10:32", complete: true },
      { title: "Pago marcado como pagado", detail: "Estado de muestra; no hay transacción real", date: "18 nov · 10:33", complete: true },
      { title: "Pedido enviado", detail: "Sin transportista ni guía conectados", date: "19 nov · 15:10", complete: true },
    ],
    notes: [{ id: 1, content: "Muestra: confirmar disponibilidad de empaque antes del despacho.", date: "18 nov 2026 · 10:40" }],
  },
  "2": {
    id: "2", number: "PED-1047", date: "17 nov 2026 · 15:05", customer: "Verónica Sánchez", email: "veronica.sanchez@example.invalid", payment: "Pagado", fulfillment: "Procesando",
    items: [{ name: "Camiseta Esperanza de Vida", detail: "Talla M", quantity: 1, unitPrice: 18 }],
    address: ["Dirección ficticia para demostración", "Pasaje de los Cedros 456", "Sector Ficoa · Ambato, Tungurahua", "Ecuador"],
    timeline: [{ title: "Pedido recibido", detail: "Registro de demostración", date: "17 nov · 15:05", complete: true }, { title: "Pago marcado como pagado", detail: "Estado de muestra; no hay transacción real", date: "17 nov · 15:06", complete: true }],
    notes: [],
  },
  "3": {
    id: "3", number: "PED-1046", date: "15 nov 2026 · 09:18", customer: "David Andrade", email: "david.andrade@example.invalid", payment: "Pagado", fulfillment: "Entregado",
    items: [{ name: "Cuaderno de reflexión", detail: "Edición de muestra · A5", quantity: 2, unitPrice: 9 }],
    address: ["Dirección ficticia para demostración", "Av. de los Capulíes 789", "Sector Ficoa · Ambato, Tungurahua", "Ecuador"],
    timeline: [{ title: "Pedido recibido", detail: "Registro de demostración", date: "15 nov · 09:18", complete: true }, { title: "Pago marcado como pagado", detail: "Estado de muestra; no hay transacción real", date: "15 nov · 09:19", complete: true }, { title: "Pedido enviado", detail: "Sin transportista ni guía conectados", date: "16 nov · 13:10", complete: true }, { title: "Entrega registrada", detail: "Estado de muestra", date: "17 nov · 11:42", complete: true }],
    notes: [{ id: 3, content: "Muestra: paquete recibido; no se obtuvo confirmación de entrega externa.", date: "17 nov 2026 · 11:45" }],
  },
  "4": {
    id: "4", number: "PED-1045", date: "14 nov 2026 · 12:41", customer: "Mariana Loor", email: "mariana.loor@example.invalid", payment: "Pendiente", fulfillment: "Procesando",
    items: [{ name: "Biblia de estudio", detail: "Tapa dura · Negro", quantity: 1, unitPrice: 28 }, { name: "Cuaderno de reflexión", detail: "Edición de muestra · A5", quantity: 1, unitPrice: 9 }],
    address: ["Dirección ficticia para demostración", "Calle Las Dalias 246", "Sector Ficoa · Ambato, Tungurahua", "Ecuador"],
    timeline: [{ title: "Pedido recibido", detail: "Registro de demostración", date: "14 nov · 12:41", complete: true }, { title: "Pago pendiente", detail: "No se ha iniciado ni consultado una pasarela", date: "14 nov · 12:42", complete: true }],
    notes: [],
  },
};

const FULFILLMENT_ORDER: FulfillmentStatus[] = ["Procesando", "Preparando", "Enviado", "Entregado"];

function currency(value: number) {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);
}

function timestamp() {
  return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function statusIcon(status: FulfillmentStatus) {
  if (status === "Enviado") return Truck;
  if (status === "Entregado") return PackageCheck;
  return status === "Preparando" ? Package : Clock3;
}

export default function AdminPedidoDetallePage({ id }: { id: string }) {
  const order = MOCK_ORDERS[id];
  const [fulfillment, setFulfillment] = useState<FulfillmentStatus>(order?.fulfillment ?? "Procesando");
  const [payment, setPayment] = useState<PaymentStatus>(order?.payment ?? "Pendiente");
  const [timeline, setTimeline] = useState<TimelineEntry[]>(order?.timeline ?? []);
  const [notes, setNotes] = useState<InternalNote[]>(order?.notes ?? []);
  const [noteDraft, setNoteDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [savedStatus, setSavedStatus] = useState<FulfillmentStatus>(order?.fulfillment ?? "Procesando");
  const subtotal = useMemo(() => order?.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) ?? 0, [order]);

  if (!order) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Pedidos · Muestra local</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground">No encontramos ese pedido</h1>
        <p className="mt-2 text-sm text-muted-foreground">El identificador no corresponde a los pedidos de muestra de esta pantalla.</p>
        <Button asChild variant="outline" className="mt-6"><Link href="/admin/tienda/pedidos"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver a pedidos</Link></Button>
      </section>
    );
  }

  function saveFulfillment() {
    if (fulfillment === savedStatus) return;
    const time = timestamp();
    setTimeline((current) => [...current, { title: `Envío actualizado: ${fulfillment}`, detail: "Cambio temporal en esta página; no se notificó al cliente.", date: time, complete: true }]);
    setSavedStatus(fulfillment);
    setAnnouncement(`Estado de envío actualizado a ${fulfillment}. Solo se conserva mientras la página esté abierta.`);
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = noteDraft.trim();
    if (!content) return;
    setNotes((current) => [{ id: Date.now(), content, date: timestamp() }, ...current]);
    setNoteDraft("");
    setAnnouncement("Nota interna añadida de forma temporal.");
  }

  const StatusIcon = statusIcon(fulfillment);
  const progressIndex = FULFILLMENT_ORDER.indexOf(fulfillment);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-w-0 space-y-6">
      <header className="space-y-4">
        <Link href="/admin/tienda/pedidos" className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Pedidos y ventas</Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Detalle · Pedido de muestra</p><h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{order.number}</h1><p className="mt-1 text-sm text-muted-foreground">Recibido el {order.date}</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"><StatusIcon aria-hidden="true" className="h-4 w-4" />{fulfillment}</span>
        </div>
      </header>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground" aria-label="Aviso sobre el pedido de demostración">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p><strong>Pedido de demostración.</strong> Cliente, correo, dirección, pago, productos y eventos son datos ficticios. Los cambios de estado y notas solo viven en memoria; no se guardan, no se envían mensajes y no se consulta ni procesa ningún pago.</p>
      </aside>

      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
        <div className="min-w-0 space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby="items-title">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5"><div><h2 id="items-title" className="text-lg font-bold text-foreground">Artículos del pedido</h2><p className="mt-1 text-xs text-muted-foreground">{itemCount} {itemCount === 1 ? "unidad" : "unidades"}</p></div><span className="rounded-xl bg-primary/10 p-2 text-primary"><Package aria-hidden="true" className="h-4 w-4" /></span></div>
            <ul className="divide-y divide-border/70">{order.items.map((item) => <li key={item.name} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><h3 className="break-words font-semibold text-foreground">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.detail}</p><p className="mt-1 text-xs text-muted-foreground">Cantidad: {item.quantity}</p></div><div className="flex items-center justify-between gap-4 text-sm sm:flex-col sm:items-end sm:gap-1"><span className="text-muted-foreground">{currency(item.unitPrice)} c/u</span><strong className="tabular-nums text-foreground">{currency(item.quantity * item.unitPrice)}</strong></div></li>)}</ul>
            <dl className="space-y-2 border-t border-border bg-muted/20 px-4 py-4 text-sm sm:px-5"><div className="flex justify-between gap-3 text-muted-foreground"><dt>Subtotal</dt><dd className="tabular-nums">{currency(subtotal)}</dd></div><div className="flex justify-between gap-3 text-muted-foreground"><dt>Envío</dt><dd>Incluido · muestra</dd></div><div className="flex justify-between gap-3 border-t border-border pt-3 font-bold text-foreground"><dt>Total</dt><dd className="tabular-nums">{currency(subtotal)}</dd></div></dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="fulfillment-title">
            <div className="flex items-start justify-between gap-3"><div><h2 id="fulfillment-title" className="text-lg font-bold text-foreground">Estado del envío</h2><p className="mt-1 text-xs text-muted-foreground">La actualización se guarda solo en esta vista.</p></div><Truck aria-hidden="true" className="h-5 w-5 text-primary" /></div>
            <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={`Progreso del pedido: ${fulfillment}`}>
              {FULFILLMENT_ORDER.map((status, index) => { const done = index <= progressIndex; const Icon = statusIcon(status); return <li key={status} className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold ${done ? "border-primary/30 bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${done ? "bg-primary/10" : "bg-muted"}`}>{done ? <Check aria-hidden="true" className="h-4 w-4" /> : <Icon aria-hidden="true" className="h-4 w-4" />}</span>{status}</li>; })}
            </ol>
            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><label htmlFor="fulfillment-status" className="mb-1.5 block text-xs font-semibold text-muted-foreground">Cambiar estado</label><select id="fulfillment-status" value={fulfillment} onChange={(event) => setFulfillment(event.target.value as FulfillmentStatus)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{FULFILLMENT_ORDER.map((status) => <option key={status} value={status}>{status}</option>)}</select></div><Button type="button" className="w-full sm:w-auto" disabled={fulfillment === savedStatus} onClick={saveFulfillment}>Actualizar estado</Button></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby="timeline-title">
            <div className="border-b border-border px-4 py-4 sm:px-5"><h2 id="timeline-title" className="text-lg font-bold text-foreground">Historial del pedido</h2><p className="mt-1 text-xs text-muted-foreground">Actividad de muestra y cambios de esta sesión</p></div>
            <ol className="space-y-0 px-4 py-2 sm:px-5">{timeline.map((entry, index) => <li key={`${entry.title}-${index}`} className="relative flex gap-3 py-4"><span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 aria-hidden="true" className="h-4 w-4" />{index < timeline.length - 1 && <span aria-hidden="true" className="absolute left-1/2 top-8 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-border" />}</span><div className="min-w-0"><p className="text-sm font-semibold text-foreground">{entry.title}</p><p className="mt-1 text-xs text-muted-foreground">{entry.detail}</p><time className="mt-1 block text-[11px] text-muted-foreground">{entry.date}</time></div></li>)}</ol>
          </section>
        </div>

        <aside className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="customer-title">
            <h2 id="customer-title" className="text-lg font-bold text-foreground">Cliente de muestra</h2>
            <div className="mt-4"><p className="font-semibold text-foreground">{order.customer}</p><p className="mt-1 break-all text-sm text-muted-foreground">{order.email}</p></div>
            <div className="mt-5 border-t border-border pt-4"><h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><MapPin aria-hidden="true" className="h-4 w-4 text-primary" /> Dirección de envío ficticia</h3><address className="mt-2 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">{order.address.map((line) => <p key={line}>{line}</p>)}</address></div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="payment-title">
            <div className="flex items-start justify-between gap-3"><div><h2 id="payment-title" className="text-lg font-bold text-foreground">Estado del pago</h2><p className="mt-1 text-xs text-muted-foreground">Etiqueta de muestra; sin pasarela</p></div><CreditCard aria-hidden="true" className="h-5 w-5 text-muted-foreground" /></div>
            <label htmlFor="payment-status" className="sr-only">Estado de pago de demostración</label>
            <select id="payment-status" value={payment} onChange={(event) => { const value = event.target.value as PaymentStatus; setPayment(value); setAnnouncement(`Etiqueta local de pago: ${value}. No se consultó ni ejecutó un cobro.`); }} className="mt-4 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="Pagado">Pagado · muestra</option><option value="Pendiente">Pendiente · muestra</option><option value="Reembolsado">Reembolsado · muestra</option></select>
            <p className="mt-2 text-xs text-muted-foreground">El selector solo cambia la etiqueta visible mientras esta página permanece abierta.</p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="notes-title">
            <div className="flex items-start justify-between gap-3"><div><h2 id="notes-title" className="text-lg font-bold text-foreground">Notas internas</h2><p className="mt-1 text-xs text-muted-foreground">No visibles para el cliente</p></div><MessageSquareText aria-hidden="true" className="h-5 w-5 text-primary" /></div>
            <form onSubmit={addNote} className="mt-4 space-y-3"><label htmlFor="internal-note" className="sr-only">Escribir una nota interna temporal</label><textarea id="internal-note" rows={3} maxLength={400} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Añade una nota para esta revisión…" className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /><div className="flex items-center justify-between gap-3"><span className="text-[11px] text-muted-foreground">{noteDraft.length}/400 · temporal</span><Button type="submit" size="sm" disabled={!noteDraft.trim()}>Añadir nota</Button></div></form>
            <ul className="mt-4 space-y-3">{notes.map((note) => <li key={note.id} className="rounded-xl border border-border bg-muted/30 p-3"><p className="whitespace-pre-wrap break-words text-sm text-foreground">{note.content}</p><time className="mt-2 block text-[11px] text-muted-foreground">{note.date}</time></li>)}</ul>
            <p aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
