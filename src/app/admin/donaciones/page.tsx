"use client";

import { useMemo, useState } from "react";
import { Download, HandCoins, Heart, ReceiptText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCsv, formatSampleDate } from "@/lib/admin-sample-data";

type DonationFund = "Diezmo" | "Ofrenda" | "Misiones" | "Edificación";
interface DonationRecord {
  id: string;
  donor: string;
  amount: number;
  fund: DonationFund;
  method: string;
  date: string;
}

const sampleDonations: DonationRecord[] = [
  { id: "gift-01", donor: "Aporte de muestra 01", amount: 150, fund: "Diezmo", method: "Registro simulado", date: "2026-11-18" },
  { id: "gift-02", donor: "Aporte anónimo de muestra", amount: 100, fund: "Misiones", method: "Método no definido", date: "2026-11-17" },
  { id: "gift-03", donor: "Aporte de muestra 02", amount: 80, fund: "Ofrenda", method: "Registro simulado", date: "2026-11-16" },
  { id: "gift-04", donor: "Aporte de muestra 03", amount: 200, fund: "Edificación", method: "Método no definido", date: "2026-11-15" },
  { id: "gift-05", donor: "Aporte de muestra 04", amount: 50, fund: "Diezmo", method: "Registro simulado", date: "2026-11-14" },
  { id: "gift-06", donor: "Aporte de muestra 05", amount: 75, fund: "Ofrenda", method: "Método no definido", date: "2026-10-27" },
  { id: "gift-07", donor: "Aporte de muestra 06", amount: 120, fund: "Misiones", method: "Registro simulado", date: "2026-10-12" },
  { id: "gift-08", donor: "Aporte de muestra 07", amount: 45, fund: "Diezmo", method: "Método no definido", date: "2026-09-02" },
];
const funds: DonationFund[] = ["Diezmo", "Ofrenda", "Misiones", "Edificación"];
const money = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });

export default function AdminDonacionesPage() {
  const [fundFilter, setFundFilter] = useState("Todos los destinos");
  const [periodFilter, setPeriodFilter] = useState("Todos los periodos");
  const [announcement, setAnnouncement] = useState("");

  const filtered = useMemo(() => sampleDonations.filter((record) => {
    const matchesFund = fundFilter === "Todos los destinos" || record.fund === fundFilter;
    const ageDays = (Date.UTC(2026, 10, 20) - Date.parse(`${record.date}T12:00:00Z`)) / 86_400_000;
    const matchesPeriod = periodFilter === "Todos los periodos" || (periodFilter === "Este mes" ? record.date.startsWith("2026-11") : ageDays <= 90);
    return matchesFund && matchesPeriod;
  }), [fundFilter, periodFilter]);
  const filteredTotal = filtered.reduce((sum, record) => sum + record.amount, 0);
  const fundTotals = funds.map((fund) => ({ fund, total: filtered.filter((record) => record.fund === fund).reduce((sum, record) => sum + record.amount, 0) }));
  const maxTotal = Math.max(1, ...fundTotals.map((item) => item.total));

  const exportReport = () => {
    downloadCsv("esperanza-de-vida-aportes-muestra.csv", [
      ["Donante de muestra", "Monto de muestra USD", "Destino", "Método", "Fecha"],
      ...filtered.map((record) => [record.donor, record.amount.toFixed(2), record.fund, record.method, record.date]),
    ]);
    setAnnouncement(`CSV local preparado con ${filtered.length} registros de muestra.`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><HandCoins aria-hidden="true" className="h-4 w-4" /> Administración · muestra local</p><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Aportes y donaciones</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Registros sintéticos para revisar filtros, resumen y exportación local. No representan transacciones ni contabilidad real.</p></div>
        <Button type="button" variant="outline" onClick={exportReport} className="min-h-11 self-start sm:self-auto"><Download aria-hidden="true" className="h-4 w-4" /> Exportar CSV de muestra</Button>
      </div>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground"><ReceiptText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><p><strong>Sin datos financieros reales.</strong> No se reciben aportes, no se procesan pagos y no se generan recibos. Para operar esta sección se requieren procesos aprobados, controles de acceso y una fuente de datos conectada.</p></aside>

      <section aria-label="Filtros del reporte de muestra" className="grid gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_14rem_auto] lg:items-end lg:p-4">
        <label className="space-y-1.5 text-xs font-semibold"><span>Destino del aporte</span><select id="donations-fund-filter" name="donations-fund-filter" value={fundFilter} onChange={(event) => setFundFilter(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Todos los destinos</option>{funds.map((fund) => <option key={fund}>{fund}</option>)}</select></label>
        <label className="space-y-1.5 text-xs font-semibold"><span>Periodo de muestra</span><select id="donations-period-filter" name="donations-period-filter" value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Todos los periodos</option><option>Este mes</option><option>Últimos 90 días</option></select></label>
        <p aria-live="polite" className="pb-2 text-xs text-muted-foreground">{filtered.length} de {sampleDonations.length} aportes de muestra</p>
      </section>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-muted-foreground">Total del filtro</p><p className="mt-2 text-3xl font-bold tabular-nums">{money.format(filteredTotal)}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Heart aria-hidden="true" className="h-5 w-5" /></span></div><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp aria-hidden="true" className="h-3.5 w-3.5" />Suma calculada únicamente sobre la muestra visible</p></article>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm" aria-labelledby="fund-chart-title"><div className="flex items-start justify-between gap-3"><div><h2 id="fund-chart-title" className="font-bold">Distribución por destino</h2><p className="mt-1 text-xs text-muted-foreground">Importes de la muestra filtrada</p></div><span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">No contable</span></div><div className="mt-5 space-y-3">{fundTotals.map(({ fund, total }) => <div key={fund} className="grid grid-cols-[6.2rem_minmax(2rem,1fr)_5.5rem] items-center gap-2 text-xs sm:grid-cols-[7.5rem_minmax(3rem,1fr)_6rem]"><span className="font-medium">{fund}</span><div role="img" aria-label={`${fund}: ${money.format(total)}`} className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(total > 0 ? 5 : 0, total / maxTotal * 100)}%` }} /></div><span className="text-right tabular-nums text-muted-foreground">{money.format(total)}</span></div>)}</div></section>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Aportes de muestra">
        {filtered.map((record) => <article key={record.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{record.donor}</h2><p className="mt-1 text-xs text-muted-foreground">{formatSampleDate(record.date)}</p></div><p className="text-lg font-bold tabular-nums">{money.format(record.amount)}</p></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs"><div><dt className="text-muted-foreground">Destino</dt><dd className="mt-1 font-semibold">{record.fund}</dd></div><div><dt className="text-muted-foreground">Método de muestra</dt><dd className="mt-1">{record.method}</dd></div></dl></article>)}
        {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground sm:col-span-2">No hay registros en este filtro.</p>}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block"><table className="w-full text-left text-sm"><caption className="sr-only">Aportes sintéticos incluidos en el filtro actual</caption><thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground"><tr><th scope="col" className="px-4 py-3">Aporte</th><th scope="col" className="px-4 py-3">Monto de muestra</th><th scope="col" className="px-4 py-3">Destino</th><th scope="col" className="px-4 py-3">Método</th><th scope="col" className="px-4 py-3 text-right">Fecha</th></tr></thead><tbody className="divide-y divide-border/70">{filtered.map((record) => <tr key={record.id} className="hover:bg-muted/20"><td className="px-4 py-4 font-medium">{record.donor}</td><td className="px-4 py-4 font-bold tabular-nums">{money.format(record.amount)}</td><td className="px-4 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{record.fund}</span></td><td className="px-4 py-4 text-xs text-muted-foreground">{record.method}</td><td className="px-4 py-4 text-right text-xs text-muted-foreground">{formatSampleDate(record.date)}</td></tr>)}{filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No hay registros en este filtro.</td></tr>}</tbody></table></div>
    </div>
  );
}
