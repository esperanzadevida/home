"use client";

import { useState } from "react";
import { Heart, TrendingUp, DollarSign, Download, Filter, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationRecord {
  id: string;
  donor: string;
  amount: number;
  fund: "Diezmo" | "Ofrenda" | "Misiones" | "Edificación";
  method: "Tarjeta" | "Transferencia";
  date: string;
  isAnonymous: boolean;
}

const MOCK_DONATIONS: DonationRecord[] = [
  { id: "1", donor: "Carlos Morales", amount: 150.0, fund: "Diezmo", method: "Transferencia", date: "18 Nov 2026", isAnonymous: false },
  { id: "2", donor: "Anónimo", amount: 100.0, fund: "Misiones", method: "Tarjeta", date: "17 Nov 2026", isAnonymous: true },
  { id: "3", donor: "Elena de Morales", amount: 80.0, fund: "Ofrenda", method: "Tarjeta", date: "16 Nov 2026", isAnonymous: false },
  { id: "4", donor: "Familia Zambrano", amount: 200.0, fund: "Edificación", method: "Transferencia", date: "15 Nov 2026", isAnonymous: false },
  { id: "5", donor: "Anónimo", amount: 50.0, fund: "Diezmo", method: "Tarjeta", date: "14 Nov 2026", isAnonymous: true },
];

export default function AdminDonacionesPage() {
  const [records] = useState<DonationRecord[]>(MOCK_DONATIONS);

  const totalMonth = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Finanzas y Mayordomía
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Reportes contables de diezmos, ofrendas misioneras y fondos pro-templo.
          </p>
        </div>
        <Button variant="outline" className="font-semibold gap-1.5 self-start text-xs">
          <Download className="w-4 h-4" /> Exportar a Excel (CSV)
        </Button>
      </div>

      {/* Tarjetas de Métricas Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Total Recaudado (Mes)</span>
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">${totalMonth.toFixed(2)}</div>
          <div className="text-[11px] text-success mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +8% vs mes anterior
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Fondo de Misiones Mundiales</span>
            <Heart className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">$100.00</div>
          <div className="text-[11px] text-muted-foreground mt-1">Destinado a misioneros transculturales</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Fondo Pro-Templo / Edificación</span>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">$200.00</div>
          <div className="text-[11px] text-muted-foreground mt-1">Mejoras de santuario y sonido</div>
        </div>
      </div>

      {/* Tabla de Donaciones */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/40 border-b border-border font-bold text-xs uppercase tracking-wider text-foreground">
          Historial de Diezmos y Ofrendas Recientes
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/20 border-b border-border/60 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Donante</th>
              <th className="p-4">Monto</th>
              <th className="p-4">Fondo Destinado</th>
              <th className="p-4">Método</th>
              <th className="p-4 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    {r.isAnonymous ? "Donante Anónimo" : r.donor}
                  </div>
                </td>
                <td className="p-4 font-extrabold text-foreground text-sm">
                  ${r.amount.toFixed(2)}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {r.fund}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-medium">{r.method}</td>
                <td className="p-4 text-right text-muted-foreground">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
