"use client";

import { useState } from "react";
import Image from "@/components/shared/SiteImage";
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:whitespace-nowrap">
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
        <span aria-live="polite" aria-atomic="true" className="shrink-0 text-xs font-semibold text-muted-foreground">
          {filtered.length} de {sermons.length} sermones
        </span>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:hidden" aria-label="Lista de sermones">
        {filtered.length > 0 ? filtered.map((s) => (
          <article key={s.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={s.coverImage}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">{s.title}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.date} <span aria-hidden="true">·</span> {s.duration}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/70 pt-3 text-xs">
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pastor</dt>
                <dd className="mt-1 truncate font-medium text-foreground" title={s.pastor}>{s.pastor}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Serie</dt>
                <dd className="mt-1 truncate font-medium text-foreground" title={s.series}>{s.series}</dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Pasaje bíblico</dt>
                <dd className="mt-1 truncate font-medium text-foreground" title={s.scripture}>{s.scripture}</dd>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vistas</dt>
                <dd className="font-semibold tabular-nums text-foreground">{s.viewsCount.toLocaleString("es-EC")}</dd>
              </div>
            </dl>

            <div className="mt-3 flex justify-end gap-1 border-t border-border/70 pt-2">
              <Button variant="ghost" size="icon" aria-label={`Ver ${s.title}`} className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                <Eye aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Editar ${s.title}`} className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                <Edit3 aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Eliminar ${s.title}`} className="h-10 w-10 rounded-lg text-destructive hover:bg-destructive/10">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </article>
        )) : (
          <p className="sm:col-span-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No hay sermones que coincidan con esa búsqueda.
          </p>
        )}
      </section>

      <div className="hidden rounded-2xl border border-border bg-card overflow-hidden shadow-sm xl:block">
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
            {filtered.length > 0 ? filtered.map((s) => (
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
                <td className="p-4 text-foreground font-semibold">{s.viewsCount.toLocaleString("es-EC")}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Ver ${s.title}`} className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                      <Eye aria-hidden="true" className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Editar ${s.title}`} className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground">
                      <Edit3 aria-hidden="true" className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Eliminar ${s.title}`} className="w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10">
                      <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No hay sermones que coincidan con esa búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
