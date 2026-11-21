"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Clock3, FileText, Filter, Plus, Search, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_BLOG_STORAGE_EVENT, readAdminBlogWorkspace, removeAdminBlogEntry, updateAdminBlogStatus, type AdminBlogStatus } from "@/lib/admin-blog-storage";

type PostStatus = AdminBlogStatus;
type Post = { id: string; title: string; excerpt: string; author: string; category: string; status: PostStatus; date: string; reading: string };

const INITIAL_POSTS: Post[] = [
  { id: "hacer-espacio-para-la-esperanza", title: "Hacer espacio para la esperanza", excerpt: "Pequeños comienzos que nos ayudan a mirar el día con más ánimo.", author: "María Fernanda López", category: "Vida cotidiana", status: "Publicado", date: "12 nov 2026", reading: "5 min" },
  { id: "adorar-tambien-es-escuchar", title: "Adorar también es aprender a escuchar", excerpt: "La atención y la gratitud pueden convertirse en una forma concreta de cuidar.", author: "María Fernanda López", category: "Adoración", status: "Publicado", date: "05 nov 2026", reading: "4 min" },
  { id: "una-mesa-para-cada-generacion", title: "Una mesa para cada generación", excerpt: "Una comida compartida abre espacio para preguntas, recuerdos y compañía.", author: "Equipo editorial", category: "Familia", status: "Publicado", date: "29 oct 2026", reading: "6 min" },
  { id: "practicar-la-hospitalidad-cotidiana", title: "Practicar la hospitalidad cotidiana", excerpt: "Borrador · ideas para recibir y acompañar a quienes llegan por primera vez.", author: "Ana Belén Torres", category: "Comunidad", status: "Borrador", date: "Sin publicar", reading: "3 min" },
  { id: "notas-de-oracion-en-comunidad", title: "Notas de oración en comunidad", excerpt: "Una guía breve para crear espacios de escucha y oración compartida.", author: "Equipo editorial", category: "Comunidad", status: "Archivado", date: "18 oct 2026", reading: "4 min" },
];

const statusStyle: Record<PostStatus, string> = {
  Publicado: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Borrador: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  Archivado: "bg-muted text-muted-foreground",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const syncPosts = () => {
      const workspace = readAdminBlogWorkspace();
      if (!workspace.ok) {
        setNotice("No se pudo leer el almacenamiento local. La lista muestra los datos iniciales de esta sesión.");
        return;
      }

      const seededIds = new Set(INITIAL_POSTS.map((post) => post.id));
      const storedPosts = INITIAL_POSTS.flatMap((post) => {
        const override = workspace.entries[post.id];
        if (override?.deleted) return [];
        if (!override) return [post];
        return [{
          ...post,
          title: override.title ?? post.title,
          excerpt: override.excerpt ?? post.excerpt,
          author: override.author ?? post.author,
          category: override.category ?? post.category,
          status: override.status ?? post.status,
          date: override.date ? formatAdminDate(override.date) : post.date,
        }];
      });
      const customPosts: Post[] = Object.entries(workspace.entries)
        .filter(([id, entry]) => !seededIds.has(id) && id !== "__new_blog_draft__" && entry.custom && !entry.deleted)
        .map(([id, entry]) => ({
          id,
          title: entry.title?.trim() || "Publicación sin título",
          excerpt: entry.excerpt ?? "",
          author: entry.author ?? "Equipo editorial",
          category: entry.category ?? "Vida cotidiana",
          status: entry.status ?? "Borrador",
          date: entry.date ? formatAdminDate(entry.date) : "Sin publicar",
          reading: formatReadingTime(entry.content ?? ""),
        }));

      setPosts([...customPosts, ...storedPosts]);
      setNotice("");
    };

    syncPosts();
    window.addEventListener("storage", syncPosts);
    window.addEventListener(ADMIN_BLOG_STORAGE_EVENT, syncPosts);
    return () => {
      window.removeEventListener("storage", syncPosts);
      window.removeEventListener(ADMIN_BLOG_STORAGE_EVENT, syncPosts);
    };
  }, []);

  const categories = useMemo(() => Array.from(new Set(posts.map((post) => post.category)),), [posts]);
  const filtered = useMemo(() => posts.filter((post) => {
    const matchesQuery = `${post.title} ${post.author} ${post.category}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"));
    return matchesQuery && (statusFilter === "Todos" || post.status === statusFilter) && (categoryFilter === "Todas" || post.category === categoryFilter);
  }), [posts, query, statusFilter, categoryFilter]);
  const published = posts.filter((post) => post.status === "Publicado").length;
  const drafts = posts.filter((post) => post.status === "Borrador").length;

  function togglePublish(post: Post) {
    const nextStatus: PostStatus = post.status === "Publicado" ? "Borrador" : "Publicado";
    if (!updateAdminBlogStatus(post.id, nextStatus)) {
      setNotice("No se pudo guardar el estado en este navegador. Revisa el espacio disponible.");
      return;
    }
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, status: nextStatus } : item));
    setNotice(nextStatus === "Publicado" ? "Marcada como publicada en este navegador; no cambia el sitio público." : "Marcada como borrador en este navegador.");
  }

  function removePost(post: Post) {
    if (!window.confirm(`Quitar “${post.title}” de la lista guardada en este navegador?`)) return;
    if (!removeAdminBlogEntry(post.id)) {
      setNotice("No se pudo quitar la publicación de este navegador. Revisa el espacio disponible.");
      return;
    }
    setPosts((current) => current.filter((item) => item.id !== post.id));
    setNotice("La publicación se quitó de la lista de este navegador; el contenido público no cambió.");
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Contenido · Publicaciones</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Blog</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">Organiza artículos, reflexiones y noticias de la comunidad. Los cambios se guardan solo en este navegador.</p>
        </div>
        <Button asChild className="min-h-11 gap-2 self-start rounded-xl px-4 sm:self-auto">
          <Link href="/admin/contenido/blog/nuevo"><Plus aria-hidden="true" className="h-4 w-4" />Nuevo post</Link>
        </Button>
      </header>

      <section aria-label="Resumen de publicaciones" className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Publicadas" value={published} icon={<Send aria-hidden="true" className="h-4 w-4" />} detail="marcadas así en Admin" />
        <SummaryCard label="Borradores" value={drafts} icon={<FileText aria-hidden="true" className="h-4 w-4" />} detail="pendientes de revisión" />
        <SummaryCard label="Artículos" value={posts.length} icon={<Clock3 aria-hidden="true" className="h-4 w-4" />} detail="en esta colección local" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Todas las publicaciones</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Busca y filtra por estado o categoría.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(180px,1fr)_160px_170px] lg:w-auto lg:min-w-[610px]">
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="blog-search" className="sr-only">Buscar publicaciones</label>
              <input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar título o autor" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <FilterSelect label="Estado" value={statusFilter} onChange={setStatusFilter} values={["Todos", "Publicado", "Borrador", "Archivado"]} />
            <FilterSelect label="Categoría" value={categoryFilter} onChange={setCategoryFilter} values={["Todas", ...categories]} />
          </div>
        </div>

        {notice && <div role="status" className="flex items-center gap-2 border-b border-border bg-primary/5 px-4 py-2.5 text-xs text-foreground"><Check aria-hidden="true" className="h-4 w-4 text-primary" />{notice}<button type="button" onClick={() => setNotice("")} className="ml-auto rounded px-2 py-1 font-medium text-muted-foreground hover:text-foreground">Cerrar</button></div>}
        <p className="sr-only" aria-live="polite" aria-atomic="true">{filtered.length} publicaciones encontradas</p>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/35 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr><th scope="col" className="px-5 py-3.5">Publicación</th><th scope="col" className="px-4 py-3.5">Autor</th><th scope="col" className="px-4 py-3.5">Categoría</th><th scope="col" className="px-4 py-3.5">Estado</th><th scope="col" className="px-4 py-3.5">Fecha</th><th scope="col" className="px-4 py-3.5 text-right">Acciones</th></tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filtered.map((post) => <tr key={post.id} className="transition-colors hover:bg-muted/20">
                <td className="max-w-[390px] px-5 py-4"><Link href={`/admin/contenido/blog/${post.id}`} className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="block truncate font-semibold text-foreground group-hover:text-primary">{post.title}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{post.excerpt}</span></Link></td>
                <td className="px-4 py-4 text-xs text-foreground">{post.author}</td><td className="px-4 py-4"><span className="rounded-md border border-border/80 bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">{post.category}</span></td>
                <td className="px-4 py-4"><StatusPill status={post.status} /></td><td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">{post.date}<span className="mt-1 block text-[10px]">{post.reading} de lectura</span></td>
                <td className="px-4 py-4"><div className="flex items-center justify-end gap-1"><Button asChild variant="ghost" size="icon" aria-label={`Editar ${post.title}`} className="h-9 w-9 rounded-lg"><Link href={`/admin/contenido/blog/${post.id}`}><FileText aria-hidden="true" className="h-4 w-4" /></Link></Button><Button variant="ghost" size="icon" aria-label={post.status === "Publicado" ? `Despublicar ${post.title}` : `Publicar ${post.title}`} onClick={() => togglePublish(post)} className="h-9 w-9 rounded-lg text-primary"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Eliminar ${post.title}`} onClick={() => removePost(post)} className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 aria-hidden="true" className="h-4 w-4" /></Button></div></td>
              </tr>)}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center"><Filter aria-hidden="true" className="mx-auto h-5 w-5 text-muted-foreground" /><p className="mt-2 text-sm font-medium text-foreground">No hay publicaciones con estos filtros</p><p className="mt-1 text-xs text-muted-foreground">Prueba otra búsqueda o cambia el estado seleccionado.</p></td></tr>}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-border/70 md:hidden">
          {filtered.map((post) => <article key={post.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={`/admin/contenido/blog/${post.id}`} className="block font-semibold leading-snug text-foreground hover:text-primary">{post.title}</Link><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p></div><StatusPill status={post.status} /></div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground"><span>{post.author}</span><span aria-hidden="true">·</span><span>{post.category}</span><span aria-hidden="true">·</span><span>{post.date}</span></div>
            <div className="flex items-center justify-end gap-1 border-t border-border/60 pt-2"><Button asChild variant="outline" size="sm" className="mr-auto h-9 rounded-lg"><Link href={`/admin/contenido/blog/${post.id}`}>Editar</Link></Button><Button variant="ghost" size="icon" aria-label={post.status === "Publicado" ? `Despublicar ${post.title}` : `Publicar ${post.title}`} onClick={() => togglePublish(post)} className="h-10 w-10 rounded-lg text-primary"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Eliminar ${post.title}`} onClick={() => removePost(post)} className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 aria-hidden="true" className="h-4 w-4" /></Button></div>
          </article>)}
          {filtered.length === 0 && <p className="px-5 py-12 text-center text-sm text-muted-foreground">No hay publicaciones con estos filtros.</p>}
        </div>
        <footer className="flex flex-col gap-2 border-t border-border bg-muted/15 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5"><span>Mostrando {filtered.length} de {posts.length} publicaciones</span><span>Guardado local en este navegador · No se sincroniza con el sitio público</span></footer>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, icon, detail }: { label: string; value: number; icon: React.ReactNode; detail: string }) {
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">{label}</span><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span></div><div className="mt-3 flex items-baseline gap-2"><span className="text-2xl font-bold tabular-nums text-foreground">{value}</span><span className="text-[11px] text-muted-foreground">{detail}</span></div></div>;
}

function FilterSelect({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  return <div className="relative"><label className="sr-only" htmlFor={`blog-filter-${label}`}>{label}</label><select id={`blog-filter-${label}`} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-3 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">{values.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></div>;
}

function StatusPill({ status }: { status: PostStatus }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle[status]}`}><span className="mr-1.5 mt-[3px] h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function formatAdminDate(value: string) {
  const date = new Date(`${value}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(date)
    .replaceAll(".", "");
}

function formatReadingTime(content: string) {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  return `${Math.max(1, Math.ceil(words / 220))} min`;
}
