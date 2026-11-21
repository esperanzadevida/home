"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, CheckCircle2, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsSummary: string;
  total: number;
  paymentStatus: "Pagado" | "Pendiente" | "Reembolsado";
  fulfillmentStatus: "Entregado" | "Enviado" | "Procesando";
  date: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "PED-1048",
    customerName: "Carlos Morales",
    customerEmail: "carlos.morales@example.invalid",
    itemsSummary: "Biblia de estudio (x1)",
    total: 28.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Enviado",
    date: "18 Nov 2026",
  },
  {
    id: "2",
    orderNumber: "PED-1047",
    customerName: "Verónica Sánchez",
    customerEmail: "veronica.sanchez@example.invalid",
    itemsSummary: "Camiseta Esperanza de Vida (M) (x1)",
    total: 18.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Procesando",
    date: "17 Nov 2026",
  },
  {
    id: "3",
    orderNumber: "PED-1046",
    customerName: "David Andrade",
    customerEmail: "david.andrade@example.invalid",
    itemsSummary: "Cuaderno de reflexión (x2)",
    total: 18.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Entregado",
    date: "15 Nov 2026",
  },
  {
    id: "4",
    orderNumber: "PED-1045",
    customerName: "Mariana Loor",
    customerEmail: "mariana.loor@example.invalid",
    itemsSummary: "Biblia de estudio · Cuaderno de reflexión",
    total: 37.0,
    paymentStatus: "Pendiente",
    fulfillmentStatus: "Procesando",
    date: "14 Nov 2026",
  },
];

export default function AdminPedidosPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "all" || o.paymentStatus === filter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Pedidos y Ventas de la Tienda
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Supervisa compras de literatura bíblica, despachos y estados de pago.
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative w-full sm:max-w-80">
          <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <label htmlFor="admin-order-search" className="sr-only">
            Buscar pedidos por número o cliente
          </label>
          <input
            id="admin-order-search"
            type="search"
            placeholder="Buscar por #pedido o cliente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
          />
        </div>

        <div role="group" aria-label="Filtrar por estado de pago" className="flex flex-wrap gap-2">
          {["all", "Pagado", "Pendiente"].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos los Pedidos" : f}
            </button>
          ))}
        </div>
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          Mostrando {filtered.length} de {orders.length} pedidos
        </span>
      </div>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:hidden" aria-label="Lista de pedidos">
        {filtered.length > 0 ? filtered.map((o) => (
          <article key={o.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-extrabold text-foreground">{o.orderNumber}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">{o.date}</p>
              </div>
              <p className="shrink-0 font-extrabold tabular-nums text-sm text-foreground">${o.total.toFixed(2)}</p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/70 pt-3 text-xs">
              <div className="col-span-2 min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Cliente</dt>
                <dd className="mt-1 break-words font-semibold text-foreground">{o.customerName}</dd>
                <dd className="mt-0.5 break-all text-[11px] text-muted-foreground">{o.customerEmail}</dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Detalle de Productos</dt>
                <dd className="mt-1 break-words font-medium text-foreground">{o.itemsSummary}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pago</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${o.paymentStatus === "Pagado" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {o.paymentStatus === "Pagado" ? (
                      <CheckCircle2 aria-hidden="true" className="h-3 w-3 shrink-0" />
                    ) : (
                      <Clock aria-hidden="true" className="h-3 w-3 shrink-0" />
                    )}
                    {o.paymentStatus}
                  </span>
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Envío</dt>
                <dd className="mt-1 inline-flex items-center gap-1 break-words font-medium text-muted-foreground">
                  <Truck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {o.fulfillmentStatus}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex justify-end border-t border-border/70 pt-2">
              <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                <Link href={`/admin/tienda/pedidos/${o.id}`} aria-label={`Ver pedido ${o.orderNumber}`}><Eye aria-hidden="true" className="h-4 w-4" /></Link>
              </Button>
            </div>
          </article>
        )) : (
          <p className="sm:col-span-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No hay pedidos que coincidan con esos filtros.
          </p>
        )}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="p-4">Pedido</th>
              <th scope="col" className="p-4">Cliente</th>
              <th scope="col" className="p-4">Detalle de Productos</th>
              <th scope="col" className="p-4">Total</th>
              <th scope="col" className="p-4">Pago</th>
              <th scope="col" className="p-4">Envío</th>
              <th scope="col" className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length > 0 ? filtered.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-muted/30">
                <th scope="row" className="p-4 text-left font-normal">
                  <div className="font-extrabold text-sm text-foreground">{o.orderNumber}</div>
                  <div className="text-[10px] text-muted-foreground">{o.date}</div>
                </th>
                <td className="max-w-56 p-4">
                  <div className="font-semibold text-foreground">{o.customerName}</div>
                  <div className="break-all text-[10px] text-muted-foreground">{o.customerEmail}</div>
                </td>
                <td className="max-w-64 break-words p-4 font-medium text-foreground">{o.itemsSummary}</td>
                <td className="whitespace-nowrap p-4 font-extrabold tabular-nums text-sm text-foreground">${o.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${o.paymentStatus === "Pagado" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {o.paymentStatus === "Pagado" ? (
                      <CheckCircle2 aria-hidden="true" className="h-3 w-3 shrink-0" />
                    ) : (
                      <Clock aria-hidden="true" className="h-3 w-3 shrink-0" />
                    )}
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Truck aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {o.fulfillmentStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                    <Link href={`/admin/tienda/pedidos/${o.id}`} aria-label={`Ver pedido ${o.orderNumber}`}><Eye aria-hidden="true" className="h-4 w-4" /></Link>
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No hay pedidos que coincidan con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
