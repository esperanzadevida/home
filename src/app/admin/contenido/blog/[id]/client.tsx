"use client";

import Link from "next/link";
import Image from "@/components/shared/SiteImage";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bold, ChevronDown, Code2, Eye, Heading1, Heading2, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Save, Send, Table2, Underline, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminBlogEntry, NEW_ADMIN_BLOG_DRAFT_ID, readAdminBlogDraft, saveAdminBlogDraft, type AdminBlogDraft, type AdminBlogStatus } from "@/lib/admin-blog-storage";

type EditorStatus = AdminBlogStatus;
type Draft = AdminBlogDraft;

const SEED: Record<string, Draft> = {
  "hacer-espacio-para-la-esperanza": {
    title: "Hacer espacio para la esperanza", excerpt: "A veces un nuevo comienzo no llega con ruido. Puede aparecer en una conversación, una pausa o una decisión pequeña que nos ayuda a mirar el día con más ánimo.", author: "María Fernanda López", category: "Vida cotidiana", tags: "Esperanza, Nuevos comienzos", status: "Publicado", date: "2026-11-12", cover: "",
    content: "A veces un nuevo comienzo no llega con ruido. Puede aparecer en una conversación, una pausa o una decisión pequeña que nos ayuda a mirar el día con más ánimo.\n\n## Pequeños comienzos\n\nEsperar no siempre significa quedarse inmóvil. También puede ser cuidar una relación, volver a una tarea con calma o pedir apoyo cuando algo pesa demasiado.\n\n> La esperanza nos ayuda a prestar atención a los pasos que ocurren en medio del camino.\n\n## Una práctica para esta semana\n\nElige una cosa pequeña que te gustaría cultivar. Escríbela, compártela con alguien de confianza y decide cuál puede ser tu siguiente paso posible.",
  },
  "adorar-tambien-es-escuchar": {
    title: "Adorar también es aprender a escuchar", excerpt: "La gratitud y la atención cambian la manera en que miramos a las personas que están cerca.", author: "María Fernanda López", category: "Adoración", tags: "Escucha, Gratitud", status: "Publicado", date: "2026-11-05", cover: "",
    content: "La gratitud y la atención cambian la manera en que miramos a las personas que están cerca. Escuchar puede convertirse en una forma concreta de cuidar.\n\n## La atención como regalo\n\nEscuchar con tiempo, sin preparar una respuesta antes de comprender, comunica que la experiencia de otra persona importa.\n\n## Hacer una pregunta sincera\n\nPuedes empezar con algo simple: ¿cómo ha sido tu semana? Después, deja que la respuesta marque el ritmo de la conversación.",
  },
  "una-mesa-para-cada-generacion": {
    title: "Una mesa para cada generación", excerpt: "Crear momentos para escucharnos puede acercar a niños, jóvenes y adultos en medio de la rutina.", author: "María Fernanda López", category: "Familia", tags: "Familia, Comunidad", status: "Publicado", date: "2026-10-29", cover: "",
    content: "Crear momentos para escucharnos puede acercar a niños, jóvenes y adultos en medio de la rutina. Una mesa compartida abre espacio para preguntas y recuerdos.\n\n## Conversaciones sin apuro\n\nCada generación trae experiencias y preguntas distintas. Cuando dejamos que todas tengan espacio, la conversación se vuelve más rica y más honesta.\n\n## Una idea para empezar\n\nPropón una pregunta que todos puedan responder: ¿qué momento bueno recuerdas de esta semana? Escucha cada respuesta sin corregirla ni compararla.",
  },
};

const NEW_DRAFT: Draft = { title: "", excerpt: "", author: "Equipo editorial", category: "Vida cotidiana", tags: "", content: "", status: "Borrador", date: "", cover: "" };
const categories = ["Vida cotidiana", "Adoración", "Familia", "Comunidad", "Fe y reflexión"];

export default function AdminBlogEditorPage({ id }: { id: string }) {
  const router = useRouter();
  const isNew = id === "nuevo" || id === "new";
  const [draft, setDraft] = useState<Draft>(() => isNew ? NEW_DRAFT : SEED[id] ?? { ...NEW_DRAFT, title: "Publicación de ejemplo" });
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const slug = useMemo(() => slugify(draft.title), [draft.title]);
  const wordCount = draft.content.trim() ? draft.content.trim().split(/\s+/).length : 0;

  useEffect(() => {
    setLoaded(false);
    const fallback = isNew ? NEW_DRAFT : SEED[id] ?? { ...NEW_DRAFT, title: "Publicación de ejemplo" };
    const stored = readAdminBlogDraft(isNew ? NEW_ADMIN_BLOG_DRAFT_ID : id);
    setDraft(stored.draft ? { ...fallback, ...stored.draft } : fallback);
    setSavedAt(stored.draft ? new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }) : "");
    setNotice(stored.ok ? "" : "No se pudo leer el almacenamiento local de este navegador.");
    setLoaded(true);
  }, [id, isNew]);

  useEffect(() => {
    if (!loaded) return;
    if (isNew && !draft.title.trim() && !draft.content.trim()) return;

    const timer = window.setTimeout(() => {
      const storageId = isNew ? NEW_ADMIN_BLOG_DRAFT_ID : id;
      const saved = saveAdminBlogDraft(storageId, draft, !isNew && !SEED[id]);
      if (saved) {
        setSavedAt(new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }));
      } else {
        setNotice("No se pudo guardar en este navegador. Revisa el espacio disponible y vuelve a intentarlo.");
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draft, id, isNew, loaded]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function insertAround(prefix: string, suffix = prefix, placeholder = "texto") {
    const field = editorRef.current;
    if (!field) return;
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const selected = draft.content.slice(start, end) || placeholder;
    const next = `${draft.content.slice(0, start)}${prefix}${selected}${suffix}${draft.content.slice(end)}`;
    update("content", next);
    requestAnimationFrame(() => { field.focus(); field.setSelectionRange(start + prefix.length, start + prefix.length + selected.length); });
  }

  function addTag() {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    const existing = draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    if (!existing.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) update("tags", [...existing, nextTag].join(", "));
    setTagInput("");
  }

  function save(status = draft.status) {
    if (isNew && !slug) {
      setNotice("Escribe un título antes de guardar esta publicación local.");
      return;
    }

    const nextDraft = { ...draft, status };
    const storageId = isNew ? slug : id;
    if (isNew && (SEED[storageId] || readAdminBlogDraft(storageId).draft?.custom)) {
      setNotice("Ya existe una publicación local con ese título. Elige otro título para evitar reemplazarla.");
      return;
    }
    const custom = isNew || !SEED[storageId];
    if (!saveAdminBlogDraft(storageId, nextDraft, custom)) {
      setNotice("No se pudo guardar en este navegador. Revisa el espacio disponible y vuelve a intentarlo.");
      return;
    }

    setDraft(nextDraft);
    setSavedAt(new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }));
    setNotice(status === "Publicado" ? "Marcado como publicado en este navegador; el sitio público no cambió." : "Borrador guardado en este navegador.");

    if (isNew) {
      clearAdminBlogEntry(NEW_ADMIN_BLOG_DRAFT_ID);
      router.replace(`/admin/contenido/blog/${storageId}`);
    }
  }

  function attachImage(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("Elige una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > 750 * 1024) {
      setNotice("Para guardar la portada en este navegador, elige un archivo de hasta 750 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setNotice("No se pudo preparar la imagen para la vista local.");
        return;
      }
      update("cover", reader.result);
      setNotice("Imagen guardada para esta vista local. No se ha subido al sitio.");
    };
    reader.onerror = () => setNotice("No se pudo leer la imagen seleccionada.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Volver a publicaciones" className="h-10 w-10 shrink-0 rounded-xl"><Link href="/admin/contenido/blog"><ArrowLeft aria-hidden="true" className="h-4 w-4" /></Link></Button>
          <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Editor de blog</p><h1 className="truncate text-lg font-bold text-foreground sm:text-xl">{isNew ? "Nueva publicación" : "Editar publicación"}</h1></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-muted-foreground sm:inline" aria-live="polite">{savedAt ? `Guardado en este navegador · ${savedAt}` : "Cambios sin guardar"}</span>
          <Button variant="outline" onClick={() => save("Borrador")} className="h-10 rounded-xl px-3"><Save aria-hidden="true" className="mr-2 h-4 w-4" />Guardar</Button>
          <Button onClick={() => save("Publicado")} className="h-10 rounded-xl px-3"><Send aria-hidden="true" className="mr-2 h-4 w-4" />Marcar publicado</Button>
        </div>
      </div>

      {notice && <div role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground">{notice}</div>}
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <main className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <label htmlFor="post-title" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">Título de la publicación</label>
            <input id="post-title" value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="Escribe un título claro y descriptivo" className="w-full border-0 bg-transparent p-0 text-base font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-0 sm:text-3xl" />
            <p className="mt-3 break-all text-xs text-muted-foreground">/blog/{slug || "tu-titulo-aqui"}</p>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/20 px-3 py-2.5 sm:px-4">
              <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Formato de texto">
                <ToolbarButton label="Negrita" onClick={() => insertAround("**")}><Bold aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Cursiva" onClick={() => insertAround("*")}><Italic aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Subrayado" onClick={() => insertAround("<u>", "</u>")}><Underline aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
                <ToolbarButton label="Encabezado 1" onClick={() => insertAround("# ", "", "Título") }><Heading1 aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Encabezado 2" onClick={() => insertAround("## ", "", "Subtítulo") }><Heading2 aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Lista con viñetas" onClick={() => insertAround("- ", "", "Elemento de lista")}><List aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Lista numerada" onClick={() => insertAround("1. ", "", "Elemento de lista")}><ListOrdered aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Cita" onClick={() => insertAround("> ", "", "Cita") }><Quote aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Bloque de código" onClick={() => insertAround("```\n", "\n```", "código")}><Code2 aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
                <ToolbarButton label="Insertar enlace" onClick={() => insertAround("[", "](https://)", "texto del enlace")}><Link2 aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Insertar tabla" onClick={() => insertAround("\n| Encabezado | Encabezado |\n| --- | --- |\n| Celda | Celda |\n", "", "")}><Table2 aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Insertar enlace de video" onClick={() => insertAround("\n[Video](", ")\n", "https://" )}><Video aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton label="Elegir imagen de portada" onClick={() => imageInputRef.current?.click()}><ImagePlus aria-hidden="true" className="h-4 w-4" /></ToolbarButton>
                <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Elegir imagen de portada" tabIndex={-1} onChange={(event) => { attachImage(event.target.files?.[0]); event.currentTarget.value = ""; }} />
              </div>
              <Button variant={preview ? "secondary" : "ghost"} size="sm" aria-pressed={preview} onClick={() => setPreview((value) => !value)} className="h-9 rounded-lg px-3"><Eye aria-hidden="true" className="mr-2 h-4 w-4" />{preview ? "Editar" : "Vista previa"}</Button>
            </div>
            {preview ? <article aria-label="Vista previa de la publicación" className="min-h-[480px] px-5 py-6 text-[15px] leading-7 text-foreground sm:px-8"><MarkdownPreview content={draft.content || "La vista previa aparecerá aquí mientras escribes."} /></article> : <div className="p-4 sm:p-7"><label htmlFor="post-content" className="sr-only">Contenido de la publicación en Markdown</label><textarea id="post-content" ref={editorRef} value={draft.content} onChange={(event) => update("content", event.target.value)} rows={20} aria-describedby="post-content-help" placeholder="Empieza a escribir tu publicación…\n\nPuedes usar la barra para aplicar formato Markdown." className="min-h-[480px] w-full resize-y rounded-lg bg-transparent text-[15px] leading-7 text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring" /><p id="post-content-help" className="sr-only">Admite encabezados, negrita, cursiva, subrayado, listas, citas, bloques de código, enlaces y tablas.</p></div>}
            <div className="flex items-center justify-between border-t border-border bg-muted/15 px-4 py-2.5 text-[11px] text-muted-foreground sm:px-6"><span>Editor de texto con formato Markdown</span><span>{wordCount} palabras · {Math.max(1, Math.ceil(wordCount / 220))} min</span></div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <label htmlFor="post-excerpt" className="mb-2 block text-sm font-semibold text-foreground">Extracto</label><textarea id="post-excerpt" value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} rows={3} maxLength={220} placeholder="Resume la idea principal en unas pocas líneas…" className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /><p className="mt-1 text-right text-[10px] text-muted-foreground">{draft.excerpt.length}/220</p>
          </section>
        </main>

        <aside className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Publicación</h2><span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">{draft.status}</span></div>
            <div className="space-y-4">
              <label className="block text-xs font-medium text-foreground">Estado<select value={draft.status} onChange={(event) => update("status", event.target.value as EditorStatus)} className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>Borrador</option><option>Publicado</option><option>Archivado</option></select></label>
              <label className="block text-xs font-medium text-foreground">Fecha de publicación<input type="date" value={draft.date} onChange={(event) => update("date", event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <label className="block text-xs font-medium text-foreground">Autor<input value={draft.author} onChange={(event) => update("author", event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
              <label className="block text-xs font-medium text-foreground">Categoría<span className="relative mt-1.5 block"><select value={draft.category} onChange={(event) => update("category", event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-input bg-background px-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></span></label>
              <label className="block text-xs font-medium text-foreground">Etiquetas<div className="mt-1.5 flex gap-2"><input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="Añadir etiqueta" className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /><Button type="button" variant="outline" onClick={addTag} className="h-10 rounded-xl px-3">Añadir</Button></div><span className="mt-2 block text-[11px] text-muted-foreground">{draft.tags || "Sin etiquetas"}</span></label>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Imagen de portada</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Una imagen horizontal ayuda a identificar el artículo en el listado.</p>
            {draft.cover ? <div className="mt-3 overflow-hidden rounded-xl border border-border"><div className="relative aspect-[16/9]"><Image src={draft.cover} alt="Vista previa local de portada" fill unoptimized sizes="(max-width: 1280px) 100vw, 330px" className="object-cover" /></div><button type="button" onClick={() => update("cover", "")} className="w-full border-t border-border py-2 text-xs font-medium text-muted-foreground hover:text-destructive">Quitar imagen de vista previa</button></div> : <button type="button" onClick={() => imageInputRef.current?.click()} className="mt-3 flex min-h-32 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/15 px-4 text-center transition hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ImagePlus aria-hidden="true" className="h-5 w-5 text-muted-foreground" /><span className="mt-2 text-xs font-semibold text-foreground">Seleccionar imagen</span><span className="mt-1 text-[10px] text-muted-foreground">JPG, PNG o WebP · hasta 750 KB · solo este navegador</span></button>}
          </section>

          <section className="rounded-2xl border border-border bg-muted/20 p-4"><h2 className="text-xs font-semibold text-foreground">Estado de edición</h2><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground" aria-live="polite">{savedAt ? `Guardado en este navegador a las ${savedAt}.` : "El autoguardado local se activa después de editar."} No se sincroniza ni modifica el sitio público.</p><Button variant="ghost" asChild className="mt-2 h-9 rounded-lg px-2 text-xs"><Link href="/admin/contenido/blog"><ArrowLeft aria-hidden="true" className="mr-2 h-3.5 w-3.5" />Volver a publicaciones</Link></Button></section>
        </aside>
      </div>
    </div>
  );
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{children}</button>;
}

function MarkdownPreview({ content }: { content: string }) {
  return <div className="space-y-5">{splitMarkdownBlocks(content).map((block, index) => {
    const lines = block.split("\n");
    const firstLine = lines[0] ?? "";
    const lastLine = lines.at(-1) ?? "";

    if (firstLine.startsWith("```")) {
      const codeLines = lines.slice(1);
      if (lastLine.startsWith("```")) codeLines.pop();
      return <pre key={index} className="overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 font-mono text-sm leading-6"><code>{codeLines.join("\n")}</code></pre>;
    }

    const heading = firstLine.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const title = renderInline(heading[2]);
      const followingLines = lines.slice(1);
      const continuation = followingLines.length > 0 ? <div className="mt-3"><MarkdownPreview content={followingLines.join("\n")} /></div> : null;
      if (heading[1].length === 1) return <div key={index}><h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground">{title}</h1>{continuation}</div>;
      if (heading[1].length === 2) return <div key={index}><h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">{title}</h2>{continuation}</div>;
      return <div key={index}><h3 className="font-display text-xl font-semibold leading-snug text-foreground">{title}</h3>{continuation}</div>;
    }

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(firstLine.trim())) {
      return <hr key={index} className="border-border" />;
    }

    if (lines.every((line) => /^\s*>/.test(line))) {
      return <blockquote key={index} className="rounded-r-xl border-l-2 border-primary/70 bg-muted/30 px-4 py-3 italic text-muted-foreground"><p>{renderParagraphLines(lines.map((line) => line.replace(/^\s*>\s?/, "")))}</p></blockquote>;
    }

    const tableSeparator = lines[1] ? splitTableRow(lines[1]) : [];
    const isTable = firstLine.includes("|") && tableSeparator.length > 0 && tableSeparator.every((cell) => /^:?-{3,}:?$/.test(cell));
    if (isTable) {
      const headers = splitTableRow(firstLine);
      const rows = lines.slice(2).filter((line) => line.includes("|")).map(splitTableRow);
      return <div key={index} className="overflow-x-auto rounded-xl border border-border"><table className="min-w-full border-collapse text-left text-sm"><thead className="bg-muted/45"><tr>{headers.map((cell, cellIndex) => <th key={cellIndex} scope="col" className="border-b border-border px-3 py-2.5 font-semibold text-foreground">{renderInline(cell)}</th>)}</tr></thead><tbody className="divide-y divide-border/70">{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex} className="px-3 py-2.5 align-top text-foreground/90">{renderInline(row[cellIndex] ?? "")}</td>)}</tr>)}</tbody></table></div>;
    }

    const listItems = lines.map((line) => line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.*)$/));
    if (listItems.every(Boolean)) {
      const isOrdered = Boolean(listItems[0]?.[2]);
      const ListTag = isOrdered ? "ol" : "ul";
      return <ListTag key={index} className={`space-y-2 pl-6 text-foreground/90 ${isOrdered ? "list-decimal" : "list-disc"}`}>{listItems.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item?.[3] ?? "")}</li>)}</ListTag>;
    }

    return <p key={index} className="whitespace-pre-wrap break-words text-foreground/90">{renderParagraphLines(lines)}</p>;
  })}</div>;
}

function splitMarkdownBlocks(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: string[][] = [];
  let current: string[] = [];
  let insideCode = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      if (!insideCode && current.length > 0) {
        blocks.push(current);
        current = [];
      }
      current.push(line);
      if (insideCode) {
        blocks.push(current);
        current = [];
      }
      insideCode = !insideCode;
      continue;
    }

    if (!insideCode && !line.trim()) {
      if (current.length > 0) blocks.push(current);
      current = [];
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) blocks.push(current);
  return blocks.map((block) => block.join("\n"));
}

function renderParagraphLines(lines: string[]) {
  return lines.flatMap((line, index) => index < lines.length - 1
    ? [<span key={`line-${index}`}>{renderInline(line)}</span>, <br key={`break-${index}`} />]
    : [<span key={`line-${index}`}>{renderInline(line)}</span>]);
}

function splitTableRow(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function renderInline(text: string): ReactNode[] {
  const pattern = /\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|<u>([^<\n]+)<\/u>|`([^`\n]+)`|\[([^\]\n]+)\]\(([^)\s]+)\)/g;
  const parts: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    const key = `inline-${parts.length}`;
    if (match[1]) parts.push(<strong key={key} className="font-semibold text-foreground">{match[1]}</strong>);
    else if (match[2]) parts.push(<em key={key}>{match[2]}</em>);
    else if (match[3]) parts.push(<u key={key}>{match[3]}</u>);
    else if (match[4]) parts.push(<code key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">{match[4]}</code>);
    else if (match[5]) {
      const href = safeMarkdownHref(match[6] ?? "");
      parts.push(href
        ? <a key={key} href={href} className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">{match[5]}</a>
        : match[5]);
    }
    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function safeMarkdownHref(value: string) {
  if (!value || /[\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const url = new URL(value, "https://preview.invalid");
    if (!["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) return null;
    if (url.username || url.password) return null;
    return value;
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
