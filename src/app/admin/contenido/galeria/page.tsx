"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "@/components/shared/SiteImage";
import { churchGalleryItems } from "@/config/gallery";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Images,
  Search,
  Upload,
  X,
} from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  album: string;
  description: string;
  src: string;
  alt: string;
  year: string;
  local?: boolean;
};

const MAX_LOCAL_IMAGES = 10;
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const INITIAL_ITEMS: GalleryItem[] = churchGalleryItems.map((item) => ({ ...item }));

export default function AdminGalleryPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [activeAlbum, setActiveAlbum] = useState("Todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrls = useRef(new Set<string>());

  const albumNames = useMemo(() => ["Todos", ...new Set(items.map((item) => item.album))], [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return items.filter((item) => {
      const matchesAlbum = activeAlbum === "Todos" || item.album === activeAlbum;
      const matchesSearch = !query ||
        `${item.title} ${item.album} ${item.description} ${item.alt}`.toLocaleLowerCase("es").includes(query);
      return matchesAlbum && matchesSearch;
    });
  }, [activeAlbum, items, search]);

  const selectedIndex = filteredItems.findIndex((item) => item.id === selectedId);
  const selectedItem = selectedIndex >= 0 ? filteredItems[selectedIndex] : null;

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    setAltDraft(selectedItem.alt);
  }, [selectedItem]);

  const closePreview = useCallback(() => {
    setSelectedId(null);
    window.setTimeout(() => {
      if (lastTrigger.current?.isConnected) lastTrigger.current.focus();
      else addButtonRef.current?.focus();
    }, 0);
  }, []);
  const moveSelection = useCallback((step: number) => {
    if (selectedIndex < 0 || filteredItems.length < 2) return;
    const nextIndex = (selectedIndex + step + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[nextIndex].id);
  }, [filteredItems, selectedIndex]);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelection(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelection(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveSelection, selectedItem]);

  function saveAltText() {
    if (!selectedItem) return;
    setItems((current) => current.map((item) =>
      item.id === selectedItem.id ? { ...item, alt: altDraft.trim() } : item,
    ));
    setAnnouncement(`Texto alternativo actualizado en esta vista para ${selectedItem.title}.`);
  }

  function addImages(fileList: FileList | null) {
    if (!fileList?.length) return;
    const selectedFiles = Array.from(fileList);
    const validFiles = selectedFiles.filter((file) => IMAGE_TYPES.has(file.type) && file.size <= MAX_IMAGE_SIZE);
    const availableSlots = Math.max(0, MAX_LOCAL_IMAGES - items.filter((item) => item.local).length);
    const acceptedFiles = validFiles.slice(0, availableSlots);
    const rejectedCount = selectedFiles.length - acceptedFiles.length;
    const newItems: GalleryItem[] = acceptedFiles.map((file, index) => {
      const src = URL.createObjectURL(file);
      objectUrls.current.add(src);
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Imagen de muestra";
      return {
        id: `local-${crypto.randomUUID()}-${index}`,
        title,
        album: "Nuevas imágenes",
        description: "Archivo seleccionado en este navegador. Todavía no se ha subido.",
        src,
        alt: "",
        year: String(new Date().getFullYear()),
        local: true,
      };
    });

    if (newItems.length) {
      setItems((current) => [...newItems, ...current]);
      setActiveAlbum("Nuevas imágenes");
      setAnnouncement(`${newItems.length} ${newItems.length === 1 ? "imagen añadida" : "imágenes añadidas"} solo en esta vista. Completa su texto alternativo antes de usarla.`);
    } else {
      setAnnouncement("No se añadieron imágenes. Usa JPG, PNG o WebP de hasta 8 MB y deja espacio en la biblioteca local.");
    }
    if (rejectedCount > 0 && newItems.length) {
      setAnnouncement(`${newItems.length} imágenes añadidas localmente; ${rejectedCount} no se aceptaron por formato, tamaño o límite de cantidad.`);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function removeImage(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    if (item.local) {
      URL.revokeObjectURL(item.src);
      objectUrls.current.delete(item.src);
    }
    setItems((current) => current.filter((entry) => entry.id !== id));
    if (selectedId === id) closePreview();
    setAnnouncement(`${item.title} se quitó de esta vista local.`);
  }

  function moveImage(id: string, direction: -1 | 1) {
    setItems((current) => {
      const from = current.findIndex((item) => item.id === id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= current.length) return current;
      const reordered = [...current];
      [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
      return reordered;
    });
    const label = direction < 0 ? "arriba" : "abajo";
    setAnnouncement(`Orden temporal actualizado: ${items.find((item) => item.id === id)?.title ?? "Imagen"} movida ${label}.`);
  }

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Images aria-hidden="true" className="h-4 w-4" /> Archivo visual
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Galería</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Explora las imágenes organizadas por álbum y revisa su descripción accesible.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex min-h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
            Biblioteca local · {items.length} imágenes
          </span>
          <button ref={addButtonRef} type="button" onClick={() => imageInputRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Upload aria-hidden="true" className="h-4 w-4" /> Añadir imágenes
          </button>
        </div>
      </header>

      <input id="gallery-image-files" name="gallery-image-files" ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label="Seleccionar imágenes para previsualización local" tabIndex={-1} onChange={(event) => addImages(event.target.files)} />
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-label="Biblioteca de imágenes">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="gallery-search" className="sr-only">Buscar imágenes por título, álbum o descripción</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="gallery-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar imágenes o álbumes…"
              className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex min-w-0 flex-wrap gap-2" role="group" aria-label="Filtrar por álbum">
            {albumNames.map((album) => {
              const active = album === activeAlbum;
              return (
                <button
                  key={album}
                  type="button"
                  onClick={() => setActiveAlbum(album)}
                  aria-pressed={active}
                  className={`min-h-10 rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {album}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
          <h2 className="text-sm font-semibold text-foreground">Imágenes</h2>
          <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite" aria-atomic="true">
            {filteredItems.length} de {items.length} imágenes
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
            {filteredItems.map((item, index) => {
              const orderIndex = items.findIndex((entry) => entry.id === item.id);
              return (
              <article key={item.id} className="group min-w-0 overflow-hidden rounded-xl border border-border bg-background">
                <button
                  type="button"
                  onClick={(event) => {
                    lastTrigger.current = event.currentTarget;
                    setSelectedId(item.id);
                  }}
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring"
                >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1280px) 31vw, (min-width: 640px) 48vw, 100vw"
                      priority={index < 2}
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 pt-14 text-white">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{item.title}</span>
                        <span className="mt-1 block text-xs text-white/80">{item.album} · {item.year}</span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 rounded-full border border-white/40 bg-black/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">Ver</span>
                    </span>
                </button>
                <div className="space-y-3 p-4">
                  <p className="line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">{item.description}</p>
                  <div className="flex items-start gap-2 border-t border-border pt-3 text-[11px] leading-4 text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
                    <span className="line-clamp-2">Alt: {item.alt || "Sin texto alternativo · pendiente de completar"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
                    <span className="min-w-0 truncate text-[10px] text-muted-foreground">{item.local ? "Solo esta sesión" : "Archivo del sitio"}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button type="button" disabled={orderIndex === 0} aria-label={`Mover ${item.title} hacia arriba`} onClick={() => moveImage(item.id, -1)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowUp aria-hidden="true" className="h-4 w-4" /></button>
                      <button type="button" disabled={orderIndex === items.length - 1} aria-label={`Mover ${item.title} hacia abajo`} onClick={() => moveImage(item.id, 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
                      {item.local && <button type="button" aria-label={`Quitar ${item.title} de la vista`} onClick={() => removeImage(item.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X aria-hidden="true" className="h-4 w-4" /></button>}
                    </div>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-4 my-5 rounded-xl border border-dashed border-border px-5 py-12 text-center sm:mx-5">
            <Images aria-hidden="true" className="mx-auto h-8 w-8 text-muted-foreground/70" />
            <p className="mt-3 text-sm font-semibold text-foreground">No encontramos imágenes</p>
            <p className="mt-1 text-xs text-muted-foreground">Prueba otra palabra o elige un álbum distinto.</p>
          </div>
        )}
        <p className="border-t border-border bg-muted/40 px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
          Los archivos que añadas se previsualizan solo en este navegador; admite JPG, PNG y WebP de hasta 8 MB. No se suben ni se guardan. Las imágenes de esta maqueta se sirven desde <code className="rounded bg-background px-1.5 py-0.5">public/images/esperanza-de-vida</code>.
        </p>
      </section>

      <Dialog.Root open={Boolean(selectedItem)} onOpenChange={(open) => !open && closePreview()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/75 backdrop-blur-sm" />
          <Dialog.Content
            aria-describedby="gallery-preview-description"
            className="fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] flex max-h-[min(92dvh,900px)] w-[min(96vw,1100px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/15 bg-card text-foreground shadow-2xl focus:outline-none"
          >
            {selectedItem && (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                  <div className="min-w-0">
                    <Dialog.Title className="truncate text-sm font-semibold sm:text-base">{selectedItem.title}</Dialog.Title>
                    <Dialog.Description id="gallery-preview-description" className="mt-0.5 text-xs text-muted-foreground">
                      {selectedItem.album} · {selectedIndex + 1} de {filteredItems.length}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" aria-label="Cerrar previsualización" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black/90 p-3 sm:p-6">
                  <Image src={selectedItem.src} alt={selectedItem.alt} width={1600} height={1200} priority className="max-h-[58dvh] w-auto max-w-full rounded-lg object-contain" />
                  {filteredItems.length > 1 && (
                    <>
                      <button type="button" onClick={() => moveSelection(-1)} aria-label="Imagen anterior" className="absolute left-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:left-5">
                        <ArrowLeft aria-hidden="true" className="h-5 w-5" />
                      </button>
                      <button type="button" onClick={() => moveSelection(1)} aria-label="Imagen siguiente" className="absolute right-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-5">
                        <ArrowRight aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-[1fr_minmax(16rem,0.8fr)] sm:items-end sm:px-5">
                  <p className="text-xs leading-5 text-muted-foreground" id="gallery-preview-description-copy">{selectedItem.description}</p>
                  <form onSubmit={(event) => { event.preventDefault(); saveAltText(); }} className="space-y-2">
                    <label htmlFor="gallery-alt-text" className="block text-xs font-semibold text-foreground">Texto alternativo</label>
                    <div className="flex gap-2">
                      <input
                        id="gallery-alt-text"
                        value={altDraft}
                        onChange={(event) => setAltDraft(event.target.value)}
                        className="h-11 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <button type="submit" className="min-h-11 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Aplicar</button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">El cambio se conserva solo mientras esta página esté abierta.</p>
                  </form>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
