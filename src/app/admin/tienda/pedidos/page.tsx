"use client";

import { useState } from "react";
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, AlertCircle, ShoppingBag } from "lucide-react";
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
    customerEmail: "carlos.morales@gmail.com",
    itemsSummary: "Biblia de Estudio Pentecostal (x1)",
    total: 45.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Enviado",
    date: "18 Nov 2026",
  },
  {
    id: "2",
    orderNumber: "PED-1047",
    customerName: "Verónica Sánchez",
    customerEmail: "veronica.s@hotmail.com",
    itemsSummary: "Hoodie 'Gracia & Verdad' (M) (x1)",
    total: 32.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Procesando",
    date: "17 Nov 2026",
  },
  {
    id: "3",
    orderNumber: "PED-1046",
    customerName: "David Andrade",
    customerEmail: "david.andrade@outlook.com",
    itemsSummary: "Cuaderno Devocional en Cuero (x2)",
    total: 30.0,
    paymentStatus: "Pagado",
    fulfillmentStatus: "Entregado",
    date: "15 Nov 2026",
  },
  {
    id: "4",
    orderNumber: "PED-1045",
    customerName: "Mariana Loor",
    customerEmail: "mariana.loor@yahoo.com",
    itemsSummary: "Libro Fuego en Azusa (x1)",
    total: 18.5,
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pedidos y Ventas de la Tienda
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Supervisa compras de literatura bíblica, despachos y estados de pago.
          </p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por #pedido o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "Pagado", "Pendiente"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Todos los Pedidos" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Pedido</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Detalle de Productos</th>
              <th className="p-4">Total</th>
              <th className="p-4">Pago</th>
              <th className="p-4">Envío</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-extrabold text-foreground text-sm">{o.orderNumber}</div>
                  <div className="text-[10px] text-muted-foreground">{o.date}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{o.customerName}</div>
                  <div className="text-[10px] text-muted-foreground">{o.customerEmail}</div>
                </td>
                <td className="p-4 font-medium text-foreground">{o.itemsSummary}</td>
                <td className="p-4 font-extrabold text-sm text-foreground">
                  ${o.total.toFixed(2)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      o.paymentStatus === "Pagado"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {o.paymentStatus === "Pagado" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    {o.fulfillmentStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
