"use client";

import { useState } from "react";
import { Plus, Search, User, Phone, Mail, CheckCircle2, Shield, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  ministry: string;
  status: "Activo" | "En Discipulado" | "Visitante";
  isBaptized: boolean;
  joinDate: string;
}

const MOCK_MEMBERS_LIST: Member[] = [
  {
    id: "1",
    name: "Carlos Morales",
    email: "carlos.morales@gmail.com",
    phone: "+593 98 123 4567",
    ministry: "Embajadores de Cristo",
    status: "Activo",
    isBaptized: true,
    joinDate: "Enero 2024",
  },
  {
    id: "2",
    name: "Verónica Sánchez",
    email: "veronica.s@hotmail.com",
    phone: "+593 99 876 5432",
    ministry: "Sociedad de Damas",
    status: "Activo",
    isBaptized: true,
    joinDate: "Marzo 2023",
  },
  {
    id: "3",
    name: "David Andrade",
    email: "david.andrade@outlook.com",
    phone: "+593 97 456 7890",
    ministry: "Alabanza & Adoración",
    status: "Activo",
    isBaptized: true,
    joinDate: "Septiembre 2024",
  },
  {
    id: "4",
    name: "Doménica Salazar",
    email: "domenica.salazar@unemi.edu.ec",
    phone: "+593 99 111 2233",
    ministry: "Medios & Producción",
    status: "En Discipulado",
    isBaptized: false,
    joinDate: "Noviembre 2026",
  },
];

export default function AdminMiembrosPage() {
  const [members] = useState<Member[]>(MOCK_MEMBERS_LIST);
  const [search, setSearch] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.ministry.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Directorio de Miembros y Liderazgo
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gestión pastoral de congregantes, bautismos, células y asignación a ministerios.
          </p>
        </div>
        <Button className="font-semibold gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Registrar Nuevo Miembro
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ministerio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold">
          Total congregación activa: <strong className="text-primary">{members.length} registros</strong>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Miembro</th>
              <th className="p-4">Contacto</th>
              <th className="p-4">Ministerio</th>
              <th className="p-4">Bautismo</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">{m.name}</div>
                      <div className="text-[10px] text-muted-foreground">Ingreso: {m.joinDate}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 space-y-0.5">
                  <div className="text-foreground flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-muted-foreground" /> {m.email}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3 h-3 text-muted-foreground" /> {m.phone}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-md bg-muted text-foreground font-semibold">
                    {m.ministry}
                  </span>
                </td>
                <td className="p-4">
                  {m.isBaptized ? (
                    <span className="flex items-center gap-1 text-success font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bautizado en Agua
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Pendiente</span>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      m.status === "Activo"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
