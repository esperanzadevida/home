"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit3, Trash2, Eye } from "lucide-react";
import { MOCK_SERMONS } from "@/constants/data";
import { Button } from "@/components/ui/button";

export default function AdminSermonesPage() {
  const [sermons] = useState(MOCK_SERMONS);
  const [search, setSearch] = useState("");

  const filtered = sermons.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestión de Sermones y Mensajes
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sube predicaciones dominicales, series temáticas, notas en PDF y enlaces de video/audio.
          </p>
        </div>
        <Button className="font-semibold gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Subir Nuevo Sermón
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="relative w-full sm:w-80">
          <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <label htmlFor="admin-sermon-search" className="sr-only">
            Buscar sermones por título
          </label>
          <input
            id="admin-sermon-search"
            type="search"
            placeholder="Buscar por título..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {filtered.length} de {sermons.length} sermones
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Sermón</th>
              <th className="p-4">Pastor</th>
              <th className="p-4">Serie</th>
              <th className="p-4">Pasaje Bíblico</th>
              <th className="p-4">Vistas</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={s.coverImage}
                      alt={s.title}
                      width={48}
                      height={32}
                      className="w-12 h-8 rounded-lg object-cover border border-border"
                    />
                    <div>
                      <div className="font-bold text-foreground text-sm line-clamp-1">{s.title}</div>
                      <div className="text-[10px] text-muted-foreground">{s.date} • {s.duration}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-semibold text-foreground">{s.pastor}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px]">
                    {s.series}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground font-medium">{s.scripture}</td>
                <td className="p-4 text-foreground font-semibold">{s.viewsCount}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
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
