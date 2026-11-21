"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

type PaymentStatus = "Aprobado" | "Pendiente" | "Reembolsado";
type Payment = {
  id: string;
  order: string;
  customer: string;
  method: string;
  amount: number;
  status: PaymentStatus;
  date: string;
};

const SAMPLE_PAYMENTS: Payment[] = [
  { id: "TX-2048", order: "PED-1048", customer: "Carlos Morales", method: "Tarjeta ···· 1842", amount: 45, status: "Aprobado", date: "18 nov 2026 · 10:14" },
  { id: "TX-2047", order: "PED-1047", customer: "Verónica Sánchez", method: "Transferencia", amount: 32, status: "Aprobado", date: "17 nov 2026 · 16:38" },
  { id: "TX-2046", order: "PED-1046", customer: "David Andrade", method: "Tarjeta ···· 6031", amount: 30, status: "Aprobado", date: "15 nov 2026 · 11:02" },
  { id: "TX-2045", order: "PED-1045", customer: "Mariana Loor", method: "Transferencia", amount: 18.5, status: "Pendiente", date: "14 nov 2026 · 09:27" },
  { id: "TX-2042", order: "PED-1042", customer: "Andrea Paredes", method: "Tarjeta ···· 0294", amount: 22.5, status: "Reembolsado", date: "11 nov 2026 · 13:51" },
];

const filters = ["Todas", "Aprobado", "Pendiente", "Reembolsado"] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);
}

const statusClasses: Record<PaymentStatus, string> = {
  Aprobado: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Pendiente: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  Reembolsado: "bg-muted text-muted-foreground",
};

const summary = [
  { label: "Volumen del mes", value: formatCurrency(4820), detail: "38 cobros registrados", icon: Banknote, tone: "blue" },
  { label: "Cobros aprobados", value: "35", detail: "92 % de aprobación", icon: CheckCircle2, tone: "green" },
  { label: "Por confirmar", value: "02", detail: `${formatCurrency(48.5)} en revisión`, icon: Clock3, tone: "amber" },
  { label: "Devoluciones", value: formatCurrency(22.5), detail: "1 operación este mes", icon: ArrowDownLeft, tone: "violet" },
] as const;

export default function AdminPaymentsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todas");
  const visiblePayments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return SAMPLE_PAYMENTS.filter((payment) => {
      const matchesFilter = activeFilter === "Todas" || payment.status === activeFilter;
      const matchesQuery = !normalizedQuery ||
        `${payment.id} ${payment.order} ${payment.customer} ${payment.method}`.toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            <WalletCards aria-hidden="true" className="h-4 w-4" /> Tienda · Finanzas
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Pagos</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">Consulta el resumen y el estado de las transacciones de la tienda.</p>
        </div>
        <span className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-border bg-card px-3.5 text-xs font-medium text-muted-foreground sm:self-auto">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber-500" /> Vista previa
        </span>
      </header>

      <section aria-labelledby="payments-summary-title" className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-medium text-muted-foreground">Noviembre 2026</p><h2 id="payments-summary-title" className="mt-0.5 text-lg font-semibold text-foreground">Resumen de pagos</h2></div>
          <p className="text-xs text-muted-foreground">Los valores son datos de muestra, no cobros procesados.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map(({ label, value, detail, icon: Icon, tone }) => (
            <article key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  tone === "blue" ? "bg-blue-500/10 text-blue-600 dark:text-blue-300" :
                  tone === "green" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" :
                  tone === "amber" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" :
                  "bg-violet-500/10 text-violet-600 dark:text-violet-300"
                }`}><Icon aria-hidden="true" className="h-4 w-4" /></span>
              </div>
              <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="transactions-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-medium text-muted-foreground">Actividad reciente</p><h2 id="transactions-title" className="mt-0.5 text-lg font-semibold text-foreground">Transacciones</h2></div>
            <p className="text-xs text-muted-foreground">{visiblePayments.length} de {SAMPLE_PAYMENTS.length} operaciones de muestra</p>
          </div>
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-sm">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <label className="sr-only" htmlFor="payment-search">Buscar por transacción, pedido o cliente</label>
              <input id="payment-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar transacción o cliente" className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Filtrar transacciones por estado">
              {filters.map((filter) => {
                const selected = activeFilter === filter;
                return <button key={filter} type="button" aria-pressed={selected} onClick={() => setActiveFilter(filter)} className={`min-h-10 rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{filter}</button>;
              })}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">{visiblePayments.length} transacciones encontradas</p>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr><th scope="col" className="px-5 py-3.5">Transacción</th><th scope="col" className="px-4 py-3.5">Cliente / pedido</th><th scope="col" className="px-4 py-3.5">Método</th><th scope="col" className="px-4 py-3.5">Estado</th><th scope="col" className="px-4 py-3.5">Fecha</th><th scope="col" className="px-5 py-3.5 text-right">Importe</th></tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {visiblePayments.map((payment) => <tr key={payment.id} className="transition-colors hover:bg-muted/20">
                <th scope="row" className="px-5 py-4 font-semibold text-foreground">{payment.id}</th>
                <td className="px-4 py-4"><p className="font-medium text-foreground">{payment.customer}</p><p className="mt-0.5 text-xs text-muted-foreground">Pedido {payment.order}</p></td>
                <td className="px-4 py-4 text-xs text-muted-foreground">{payment.method}</td>
                <td className="px-4 py-4"><PaymentStatusPill status={payment.status} /></td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />{payment.date}</span></td>
                <td className="px-5 py-4 text-right font-semibold tabular-nums text-foreground">{formatCurrency(payment.amount)}</td>
              </tr>)}
              {visiblePayments.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center text-sm text-muted-foreground">No hay transacciones para este filtro.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border/70 xl:hidden">
          {visiblePayments.map((payment) => <article key={payment.id} className="space-y-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="font-semibold text-foreground">{payment.id}</p><p className="mt-0.5 text-xs text-muted-foreground">Pedido {payment.order} · {payment.customer}</p></div>
              <div className="shrink-0 text-right"><p className="font-semibold tabular-nums text-foreground">{formatCurrency(payment.amount)}</p><PaymentStatusPill status={payment.status} /></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><CreditCard aria-hidden="true" className="h-3.5 w-3.5" />{payment.method}</span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />{payment.date}</span>
            </div>
          </article>)}
          {visiblePayments.length === 0 && <p className="px-5 py-12 text-center text-sm text-muted-foreground">No hay transacciones para este filtro.</p>}
        </div>

        <footer className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
          Los filtros son interactivos. No hay una pasarela configurada ni se procesan pagos desde esta pantalla.
        </footer>
      </section>

      <section aria-labelledby="gateway-title" className="grid gap-4 rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck aria-hidden="true" className="h-5 w-5" /></span>
          <div className="min-w-0"><h2 id="gateway-title" className="text-sm font-semibold text-foreground">Pasarela de pago sin configurar</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">Al completar la integración se podrá elegir un proveedor, revisar credenciales en el entorno seguro y validar webhooks. Las transacciones de esta vista no están conectadas a una cuenta real.</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-xs text-muted-foreground"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-muted-foreground/50" />Integración pendiente <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></div>
      </section>
    </div>
  );
}

function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses[status]}`}><span aria-hidden="true" className="mr-1.5 mt-[3px] h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
