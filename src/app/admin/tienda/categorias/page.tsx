"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  ImagePlus,
  Layers3,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/constants/data";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  active: boolean;
  imagePreview: string | null;
};

type CategoryDraft = Omit<Category, "id">;

const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-lectura", name: "Lectura", slug: "lectura", description: "Recursos editoriales para explorar pasajes, temas y referencias.", parentId: null, active: true, imagePreview: null },
  { id: "cat-habitos", name: "Hábitos", slug: "habitos", description: "Recursos para acompañar preguntas, gratitud y aprendizajes semanales.", parentId: null, active: true, imagePreview: null },
  { id: "cat-comunidad", name: "Comunidad", slug: "comunidad", description: "Recursos con la identidad visual de la comunidad.", parentId: null, active: true, imagePreview: null },
];

const INITIAL_PRODUCT_COUNTS: Record<string, number> = {
  "cat-lectura": 1,
  "cat-habitos": 1,
  "cat-comunidad": 1,
};

type TreeCategory = Category & {
  productCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
  _children: TreeCategory[];
};

const EMPTY_DRAFT: CategoryDraft = {
  name: "",
  slug: "",
  description: "",
  parentId: null,
  active: true,
  imagePreview: null,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function descendantsOf(categoryId: string, categories: Category[]): Set<string> {
  const descendants = new Set<string>();
  const visit = (parentId: string) => {
    categories.filter((category) => category.parentId === parentId).forEach((child) => {
      if (!descendants.has(child.id)) {
        descendants.add(child.id);
        visit(child.id);
      }
    });
  };
  visit(categoryId);
  return descendants;
}

function CategoryRow({
  category,
  depth,
  productCount,
  canMoveUp,
  canMoveDown,
  onMove,
  onEdit,
  onDelete,
}: {
  category: TreeCategory;
  depth: number;
  productCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category._children.length > 0;

  return (
    <>
      <article className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-border/70 px-3 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_7rem_7rem_auto] sm:items-center sm:px-4">
        <div className="flex min-w-0 items-center gap-2" style={{ paddingInlineStart: `${depth * 20}px` }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-label={`${expanded ? "Contraer" : "Expandir"} ${category.name}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {expanded ? <ChevronDown aria-hidden="true" className="h-4 w-4" /> : <ChevronRight aria-hidden="true" className="h-4 w-4" />}
            </button>
          ) : (
            <span aria-hidden="true" className="h-9 w-9 shrink-0" />
          )}
          {category.imagePreview ? (
            // Preview is a local data URL selected in this browser; it is never uploaded.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.imagePreview} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
              <Folder aria-hidden="true" className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold text-foreground">{category.name}</h3>
            <p className="truncate text-xs text-muted-foreground">/{category.slug}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:hidden">{productCount} productos · {category.active ? "Activa" : "Inactiva"}</p>
          </div>
        </div>

        <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">{productCount} <span className="text-xs">productos</span></span>
        <span className={`hidden w-fit rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex ${category.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
          {category.active ? "Activa" : "Inactiva"}
        </span>

        <div className="col-span-2 flex items-center justify-end gap-1 border-t border-border/60 pt-2 sm:col-span-1 sm:border-0 sm:pt-0">
          <Button variant="ghost" size="icon" aria-label={`Subir ${category.name}`} title="Subir categoría" disabled={!canMoveUp} onClick={() => onMove(-1)} className="h-11 w-11 rounded-lg sm:h-9 sm:w-9">
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Bajar ${category.name}`} title="Bajar categoría" disabled={!canMoveDown} onClick={() => onMove(1)} className="h-11 w-11 rounded-lg sm:h-9 sm:w-9">
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Editar ${category.name}`} onClick={onEdit} className="h-11 w-11 rounded-lg sm:h-9 sm:w-9">
            <Pencil aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Eliminar ${category.name}`} onClick={onDelete} className="h-11 w-11 rounded-lg text-destructive hover:bg-destructive/10 sm:h-9 sm:w-9">
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </article>
      {expanded && category._children.map((child) => (
        <CategoryRow key={child.id} category={child} depth={depth + 1} productCount={child.productCount} canMoveUp={child.canMoveUp} canMoveDown={child.canMoveDown} onMove={child.onMove} onEdit={child.onEdit} onDelete={child.onDelete} />
      ))}
    </>
  );
}

export default function AdminCategoriasTiendaPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const productCounts = INITIAL_PRODUCT_COUNTS;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState("");
  const editorTriggerRef = useRef<HTMLElement | null>(null);
  const newCategoryButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (draft !== null || !editorTriggerRef.current) return;

    const trigger = editorTriggerRef.current;
    editorTriggerRef.current = null;
    const focusTarget = trigger.isConnected ? trigger : newCategoryButtonRef.current;
    focusTarget?.focus({ preventScroll: true });
  }, [draft]);

  const visibleIds = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    const matches = new Set(
      categories
        .filter((category) => {
          const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? category.active : !category.active);
          const matchesQuery = !normalizedQuery || `${category.name} ${category.slug}`.toLocaleLowerCase("es").includes(normalizedQuery);
          return matchesStatus && matchesQuery;
        })
        .map((category) => category.id),
    );

    // Keep ancestors visible so a filtered child retains its place in the hierarchy.
    for (const id of [...matches]) {
      let parentId = categories.find((category) => category.id === id)?.parentId ?? null;
      while (parentId) {
        matches.add(parentId);
        parentId = categories.find((category) => category.id === parentId)?.parentId ?? null;
      }
    }
    return matches;
  }, [categories, query, statusFilter]);

  const activeCount = categories.filter((category) => category.active).length;
  const totalProducts = MOCK_PRODUCTS.length;
  const flatVisible = categories.filter((category) => visibleIds.has(category.id));

  const openCreate = () => {
    const activeElement = document.activeElement;
    editorTriggerRef.current = activeElement instanceof HTMLElement ? activeElement : newCategoryButtonRef.current;
    setEditingId(null);
    setDraft({ ...EMPTY_DRAFT });
    setFeedback("");
  };

  const openEdit = (category: Category) => {
    const activeElement = document.activeElement;
    editorTriggerRef.current = activeElement instanceof HTMLElement ? activeElement : newCategoryButtonRef.current;
    setEditingId(category.id);
    setDraft({ ...category });
    setFeedback("");
  };

  const closeEditor = () => {
    setDraft(null);
    setEditingId(null);
  };

  const saveCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft || !draft.name.trim()) return;
    const cleanDraft = { ...draft, name: draft.name.trim(), slug: (draft.slug.trim() || slugify(draft.name)).replace(/^\/+|\/+$/g, "") };

    if (editingId) {
      setCategories((items) => items.map((item) => item.id === editingId ? { ...item, ...cleanDraft } : item));
      setFeedback(`“${cleanDraft.name}” se actualizó en esta vista local.`);
    } else {
      const id = `local-${Date.now()}`;
      setCategories((items) => [...items, { id, ...cleanDraft }]);
      setFeedback(`“${cleanDraft.name}” se creó en esta vista local.`);
    }
    closeEditor();
  };

  const moveCategory = (categoryId: string, direction: -1 | 1) => {
    setCategories((items) => {
      const category = items.find((item) => item.id === categoryId);
      if (!category) return items;
      const siblings = items.filter((item) => item.parentId === category.parentId);
      const index = siblings.findIndex((item) => item.id === categoryId);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= siblings.length) return items;
      const otherId = siblings[nextIndex].id;
      const categoryIndex = items.findIndex((item) => item.id === categoryId);
      const otherIndex = items.findIndex((item) => item.id === otherId);
      const next = [...items];
      [next[categoryIndex], next[otherIndex]] = [next[otherIndex], next[categoryIndex]];
      return next;
    });
    setFeedback("Orden actualizado. Los controles subir y bajar funcionan con teclado.");
  };

  const confirmDelete = () => {
    if (!deleteCandidate) return;
    const descendants = descendantsOf(deleteCandidate.id, categories);
    const removedIds = new Set([deleteCandidate.id, ...descendants]);
    setCategories((items) => items.filter((item) => !removedIds.has(item.id)));
    setDeleteCandidate(null);
    setFeedback("La categoría y sus subcategorías se quitaron de esta vista local. Los productos de muestra no se modificaron.");
  };

  const buildTree = (parentId: string | null): TreeCategory[] => {
    const siblings = categories.filter((category) => category.parentId === parentId && visibleIds.has(category.id));
    return siblings.map((category) => {
      const siblingIndex = siblings.findIndex((item) => item.id === category.id);
      return {
        ...category,
        productCount: productCounts[category.id] ?? 0,
        canMoveUp: siblingIndex > 0,
        canMoveDown: siblingIndex < siblings.length - 1,
        onMove: (direction) => moveCategory(category.id, direction),
        onEdit: () => openEdit(category),
        onDelete: () => setDeleteCandidate(category),
        _children: buildTree(category.id),
      };
    });
  };

  const updateImagePreview = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback("Elige un archivo de imagen para ver la vista previa.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDraft((current) => current ? { ...current, imagePreview: typeof reader.result === "string" ? reader.result : null } : current);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <ShoppingBag aria-hidden="true" className="h-4 w-4" /> Tienda · Organización
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Categorías</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Organiza la tienda por niveles, revisa cuántos productos de muestra hay en cada sección y ajusta el orden con controles accesibles.</p>
        </div>
        <Button ref={newCategoryButtonRef} onClick={openCreate} className="self-start gap-2 sm:self-auto">
          <Plus aria-hidden="true" className="h-4 w-4" /> Nueva categoría
        </Button>
      </div>

      <section aria-label="Resumen de categorías" className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Categorías</p>
          <p className="mt-2 flex items-baseline gap-2 text-2xl font-bold tabular-nums text-foreground">{categories.length}<span className="text-xs font-medium text-muted-foreground">en total</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Activas</p>
          <p className="mt-2 flex items-baseline gap-2 text-2xl font-bold tabular-nums text-foreground">{activeCount}<span className="text-xs font-medium text-muted-foreground">visibles en el catálogo</span></p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Productos de muestra</p>
          <p className="mt-2 flex items-baseline gap-2 text-2xl font-bold tabular-nums text-foreground">{totalProducts}<span className="text-xs font-medium text-muted-foreground">del catálogo local</span></p>
        </div>
      </section>

      <div role="note" className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-5 text-foreground">
        <Layers3 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p><span className="font-semibold">Vista local de demostración.</span> Categorías y conteos son datos de muestra; los cambios viven solo en esta página y se reinician al recargar. Las imágenes seleccionadas se previsualizan en el navegador, sin subirse.</p>
      </div>

      {feedback && <p role="status" aria-live="polite" className="rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-sm text-foreground">{feedback}</p>}

      {draft && (
        <section aria-labelledby="category-editor-title" className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Editor local</p>
              <h2 id="category-editor-title" className="mt-1 text-lg font-bold text-foreground">{editingId ? "Editar categoría" : "Crear categoría"}</h2>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Cerrar editor" onClick={closeEditor}>
              <X aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={saveCategory} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.7fr)]">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="category-name" className="text-sm font-semibold text-foreground">Nombre <span aria-hidden="true" className="text-destructive">*</span></label>
                <input id="category-name" required maxLength={70} autoFocus value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, slug: editingId ? draft.slug : slugify(event.target.value) })} placeholder="Ej. Biblias" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="category-slug" className="text-sm font-semibold text-foreground">Slug</label>
                <input id="category-slug" maxLength={90} value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} placeholder="biblias" className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                <p className="text-xs text-muted-foreground">Se genera desde el nombre y puedes ajustarlo.</p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="category-description" className="text-sm font-semibold text-foreground">Descripción</label>
                <textarea id="category-description" rows={3} maxLength={220} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Describe qué reúne esta categoría." className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="category-parent" className="text-sm font-semibold text-foreground">Categoría padre</label>
                <select id="category-parent" value={draft.parentId ?? ""} onChange={(event) => setDraft({ ...draft, parentId: event.target.value || null })} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Sin categoría padre (nivel principal)</option>
                  {categories.filter((category) => category.id !== editingId && !descendantsOf(editingId ?? "", categories).has(category.id)).map((category) => (
                    <option key={category.id} value={category.id}>{category.parentId ? `↳ ${category.name}` : category.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-3 sm:col-span-2">
                <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="h-4 w-4 accent-primary" />
                <span className="text-sm font-medium text-foreground">Categoría activa</span>
              </label>
            </div>

            <div className="space-y-3">
              <label htmlFor="category-image" className="block text-sm font-semibold text-foreground">Imagen de categoría</label>
              <label htmlFor="category-image" className="group flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/30 text-center transition-colors hover:bg-muted/60 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring">
                {draft.imagePreview ? (
                  // Preview is a local data URL selected in this browser; it is never uploaded.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imagePreview} alt="Vista previa de la imagen elegida" className="h-44 w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-2 px-4 py-7 text-muted-foreground">
                    <ImagePlus aria-hidden="true" className="h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Selecciona una imagen</span>
                    <span className="text-xs">JPG, PNG o WebP · solo vista previa local</span>
                  </span>
                )}
                <input id="category-image" type="file" accept="image/*" onChange={(event) => updateImagePreview(event.target.files?.[0])} className="sr-only" />
              </label>
              {draft.imagePreview && <Button type="button" variant="outline" size="sm" onClick={() => setDraft({ ...draft, imagePreview: null })}>Quitar vista previa</Button>}
              <p className="text-xs leading-5 text-muted-foreground">La selección no se guarda ni se envía a ningún servicio.</p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeEditor}>Cancelar</Button>
              <Button type="submit" className="gap-2"><Check aria-hidden="true" className="h-4 w-4" />{editingId ? "Guardar cambios" : "Crear categoría"}</Button>
            </div>
          </form>
        </section>
      )}

      <section aria-labelledby="category-list-title" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="category-list-title" className="text-lg font-bold text-foreground">Árbol de categorías</h2>
            <p className="mt-1 text-xs text-muted-foreground">Usa las flechas para cambiar la posición entre categorías del mismo nivel.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <label htmlFor="category-search" className="sr-only">Buscar categoría por nombre o slug</label>
              <input id="category-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar categoría..." className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div>
              <label htmlFor="category-status" className="sr-only">Filtrar categorías por estado</label>
              <select id="category-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-40">
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_7rem_7rem_auto] gap-3 bg-muted/40 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
          <span>Categoría</span><span>Productos</span><span>Estado</span><span className="text-right">Orden y acciones</span>
        </div>
        {flatVisible.length > 0 ? buildTree(null).map((category) => (
          <CategoryRow key={category.id} category={category} depth={0} productCount={category.productCount} canMoveUp={category.canMoveUp} canMoveDown={category.canMoveDown} onMove={category.onMove} onEdit={category.onEdit} onDelete={category.onDelete} />
        )) : (
          <div className="px-4 py-12 text-center">
            <Folder aria-hidden="true" className="mx-auto h-8 w-8 text-muted-foreground/70" />
            <p className="mt-3 text-sm font-semibold text-foreground">No hay categorías para mostrar</p>
            <p className="mt-1 text-xs text-muted-foreground">Prueba otro filtro o crea una categoría nueva.</p>
          </div>
        )}
        <div className="border-t border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
          Mostrando {flatVisible.length} de {categories.length} categorías
        </div>
      </section>

      {deleteCandidate && (
        <section aria-labelledby="delete-category-title" aria-describedby="delete-category-description" className="rounded-2xl border border-destructive/30 bg-card p-5 shadow-sm">
            <h2 id="delete-category-title" className="text-lg font-bold text-foreground">Eliminar “{deleteCandidate.name}”</h2>
            <p id="delete-category-description" className="mt-2 text-sm leading-6 text-muted-foreground">También se quitarán sus subcategorías de la demostración. Los productos de muestra no se modifican y esta acción no se guarda al recargar.</p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setDeleteCandidate(null)}>Cancelar</Button>
              <Button variant="default" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}><Trash2 aria-hidden="true" className="h-4 w-4" />Eliminar categoría</Button>
            </div>
        </section>
      )}
    </div>
  );
}
