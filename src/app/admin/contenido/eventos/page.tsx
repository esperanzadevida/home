"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Users, Edit3, Trash2 } from "lucide-react";
import { MOCK_EVENTS } from "@/constants/data";
import { Button } from "@/components/ui/button";

export default function AdminEventosPage() {
  const [events] = useState(MOCK_EVENTS);
  const [search, setSearch] = useState("");

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestión de Eventos y Calendario
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Crea congresos, campamentos, vigilias y gestiona inscripciones en línea.
          </p>
        </div>
        <Button className="font-semibold gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Crear Nuevo Evento
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por título o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Evento</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Fecha y Hora</th>
              <th className="p-4">Lugar</th>
              <th className="p-4">Inscritos</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={e.coverImage}
                      alt={e.title}
                      width={48}
                      height={32}
                      className="w-12 h-8 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="font-bold text-foreground text-sm line-clamp-1">
                      {e.title}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary font-bold text-[10px]">
                    {e.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{e.date}</div>
                  <div className="text-[10px] text-muted-foreground">{e.time}</div>
                </td>
                <td className="p-4 text-muted-foreground max-w-xs truncate">{e.location}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Users className="w-3.5 h-3.5 text-accent" /> {e.registeredCount}
                    {e.maxAttendees && ` / ${e.maxAttendees}`}
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
