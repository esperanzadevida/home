"use client";

import { useState } from "react";
import Image from "@/components/shared/SiteImage";
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
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Gestión de Eventos y Calendario
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Consulta fechas y contenido de muestra. Las inscripciones en línea todavía no están habilitadas.
          </p>
        </div>
        <Button className="font-semibold gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Crear Nuevo Evento
        </Button>
      </div>

      <div className="flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="relative w-full sm:w-80">
          <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <label htmlFor="admin-event-search" className="sr-only">
            Buscar eventos por título o categoría
          </label>
          <input
            id="admin-event-search"
            type="search"
            placeholder="Buscar por título o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
          />
        </div>
        <span aria-live="polite" aria-atomic="true" className="shrink-0 text-xs font-semibold text-muted-foreground">
          {filtered.length} de {events.length} eventos
        </span>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Lista de eventos">
        {filtered.length > 0 ? filtered.map((e) => (
          <article key={e.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={e.coverImage}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">{e.title}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">{e.date} <span aria-hidden="true">·</span> {e.time}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/70 pt-3 text-xs">
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Categoría</dt>
                <dd className="mt-1 break-words font-medium text-foreground">{e.category}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Lugar</dt>
                <dd className="mt-1 break-words font-medium text-foreground">{e.location}</dd>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Registro</dt>
                <dd className="inline-flex items-center gap-1 font-semibold tabular-nums text-foreground">
                  <Users aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent" />
                  No habilitado
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex justify-end gap-1 border-t border-border/70 pt-2">
              <Button variant="ghost" size="icon" aria-label={`Editar ${e.title}`} className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                <Edit3 aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Eliminar ${e.title}`} className="h-10 w-10 rounded-lg text-destructive hover:bg-destructive/10">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </article>
        )) : (
          <p className="sm:col-span-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No hay eventos que coincidan con esa búsqueda.
          </p>
        )}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
        <table aria-label="Eventos registrados" className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4">Evento</th>
              <th scope="col" className="p-4">Categoría</th>
              <th scope="col" className="p-4">Fecha y Hora</th>
              <th scope="col" className="p-4">Lugar</th>
              <th scope="col" className="p-4">Registro</th>
              <th scope="col" className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length > 0 ? filtered.map((e) => (
              <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                <th scope="row" className="p-4 text-left font-normal">
                  <div className="flex items-center gap-3">
                    <Image
                      src={e.coverImage}
                      alt=""
                      width={48}
                      height={32}
                      className="w-12 h-8 rounded-lg object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0 break-words text-sm font-bold text-foreground line-clamp-2">
                      {e.title}
                    </div>
                  </div>
                </th>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary font-bold text-[10px]">
                    {e.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-foreground">{e.date}</div>
                  <div className="text-[10px] text-muted-foreground">{e.time}</div>
                </td>
                <td className="max-w-xs break-words p-4 text-muted-foreground">{e.location}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Users className="w-3.5 h-3.5 text-accent" /> No habilitado
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Editar ${e.title}`} className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                      <Edit3 aria-hidden="true" className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Eliminar ${e.title}`} className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10">
                      <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No hay eventos que coincidan con esa búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
