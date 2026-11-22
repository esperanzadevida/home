"use client";

import Image from "@/components/shared/SiteImage";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDown, ArrowLeft, ArrowUp, Barcode, Box, Check, ChevronDown,
  CircleAlert, CloudOff, Eye, FileDown, ImagePlus, Info, Package, Plus,
  Save, Star, Tag, Upload, X, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/constants/data";

type ProductStatus = "Borrador" | "Activo" | "Archivado";
type ProductImage = { id: string; src: string; name: string };
type ProductDraft = {
  name: string; slug: string; description: string; price: string;
  compareAtPrice: string; cost: string; sku: string; barcode: string;
  category: string; images: ProductImage[]; stock: string; trackInventory: boolean;
  lowStockThreshold: string; tags: string[]; isDigital: boolean; status: ProductStatus;
  featured: boolean; weight: string; length: string; width: string; height: string;
};

const fieldClass = "mt-1.5 h-11 w-full min-w-0 rounded-xl border border-input bg-background px-3.5 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring";
const labelClass = "block text-xs font-semibold text-foreground";
const categories = ["Lectura", "Hábitos", "Comunidad"];

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Section({ icon: Icon, title, description, children }: { icon: LucideIcon; title: string; description?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 border-b border-border px-4 py-4 sm:px-5">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-4 w-4" /></span>
        <div className="min-w-0"><h2 className="text-sm font-bold text-foreground">{title}</h2>{description && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>}</div>
      </div>
      <div className="space-y-5 p-4 sm:p-5">{children}</div>
    </section>
  );
}

function ToggleRow({ title, detail, checked, onChange, disabled = false }: { title: string; detail: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`flex min-h-14 cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background px-3.5 py-3 ${disabled ? "opacity-55" : ""}`}>
      <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">{title}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{detail}</span></span>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 ${checked ? "bg-primary after:translate-x-5" : "bg-muted-foreground/35"}`} />
    </label>
  );
}

export default function AdminProductEditorPage({ id }: { id: string }) {
  const isNew = id === "nuevo" || id === "new";
  const initial = useMemo<ProductDraft>(() => {
    const product = MOCK_PRODUCTS.find((item) => item.id === id) ?? MOCK_PRODUCTS[0];
    return {
      name: isNew ? "" : product.name,
      slug: isNew ? "" : product.slug,
      description: isNew ? "" : product.description,
      price: isNew ? "" : String(product.price),
      compareAtPrice: isNew ? "" : String(product.compareAtPrice ?? ""),
      cost: isNew ? "" : "21.50",
      sku: isNew ? "" : `DOM-${product.id.padStart(3, "0")}-BIB`,
      barcode: isNew ? "" : "7861001200458",
      category: isNew ? "Lectura" : product.category,
      images: isNew ? [] : [{ id: "cover", src: product.coverImage, name: "Imagen principal" }, { id: "detail", src: "/images/hero/christian-books-bible-store.jpg", name: "Vista de detalle" }],
      stock: isNew ? "0" : String(product.stock),
      trackInventory: true,
      lowStockThreshold: "5",
      tags: isNew ? [] : ["Lectura", "Fe", "Recurso de estudio"],
      isDigital: false,
      status: isNew ? "Borrador" : "Activo",
      featured: !isNew && Boolean(product.featured),
      weight: isNew ? "" : "0.85",
      length: isNew ? "" : "24",
      width: isNew ? "" : "17",
      height: isNew ? "" : "4",
    };
  }, [id, isNew]);
  const [draft, setDraft] = useState(initial);
  const [tagInput, setTagInput] = useState("");
  const [digitalFile, setDigitalFile] = useState("");
  const [notice, setNotice] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const temporaryUrls = useRef<string[]>([]);
  const dragIndex = useRef<number | null>(null);
  const previewPrice = Number.parseFloat(draft.price) || 0;
  const margin = previewPrice && Number.parseFloat(draft.cost) ? Math.round(((previewPrice - Number(draft.cost)) / previewPrice) * 100) : null;

  useEffect(() => () => temporaryUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);
  useEffect(() => {
    setDraft(initial);
    setDigitalFile("");
    setSavedAt("");
    setNotice("");
  }, [initial]);

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function addImages(files: FileList | null) {
    if (!files?.length) return;
    const accepted = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const next = accepted.map((file) => {
      const src = URL.createObjectURL(file);
      temporaryUrls.current.push(src);
      return { id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`, src, name: file.name };
    });
    update("images", [...draft.images, ...next]);
    setNotice(`${next.length} imagen${next.length === 1 ? "" : "es"} añadida${next.length === 1 ? "" : "s"} a la vista previa local. No se ha subido ningún archivo.`);
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= draft.images.length) return;
    const images = [...draft.images];
    const moved = images[index];
    if (!moved) return;
    [images[index], images[target]] = [images[target], images[index]];
    update("images", images);
    setNotice(`La imagen «${moved.name}» pasó a la posición ${target + 1} de ${images.length}.`);
    const nextDirection = target === 0 ? 1 : target === images.length - 1 ? -1 : direction;
    requestAnimationFrame(() => {
      const moveButton = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-image-order-id]"))
        .find((button) => button.dataset.imageOrderId === moved.id && button.dataset.imageOrderDirection === String(nextDirection));
      moveButton?.focus();
    });
  }

  function dropImage(index: number) {
    const source = dragIndex.current;
    dragIndex.current = null;
    if (source === null || source === index) return;
    const images = [...draft.images];
    if (source < 0 || source >= images.length || index < 0 || index >= images.length) return;
    const [moved] = images.splice(source, 1);
    if (!moved) return;
    images.splice(index, 0, moved);
    update("images", images);
    setNotice(`La imagen «${moved.name}» pasó a la posición ${index + 1} de ${images.length}.`);
  }

  function addTag() {
    const next = tagInput.trim();
    if (!next || draft.tags.some((tag) => tag.toLowerCase() === next.toLowerCase())) return setTagInput("");
    update("tags", [...draft.tags, next]);
    setTagInput("");
  }

  function saveLocal(status = draft.status) {
    update("status", status);
    const time = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });
    setSavedAt(time);
    setNotice(`Vista local actualizada a las ${time}. Este producto no se guardó en una base de datos.`);
  }

  const slugValue = draft.slug || slugify(draft.name);
  const lowStock = draft.trackInventory && Number(draft.stock) <= Number(draft.lowStockThreshold);

  return (
    <div className="mx-auto w-full max-w-[1480px] min-w-0 space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Volver a productos" className="mt-0.5 h-10 w-10 shrink-0 rounded-xl"><Link href="/admin/tienda/productos"><ArrowLeft aria-hidden="true" className="h-4 w-4" /></Link></Button>
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Tienda · Catálogo</p><h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{isNew ? "Nuevo producto" : "Editar producto"}</h1><p className="mt-1 text-xs text-muted-foreground">Completa la ficha, inventario y presentación del artículo.</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-[52px] sm:pl-0">
          <span className="hidden text-[11px] text-muted-foreground lg:inline" aria-live="polite">{savedAt ? `Vista local · ${savedAt}` : "Sin guardar"}</span>
          <Button variant="outline" onClick={() => saveLocal("Borrador")} className="h-10 rounded-xl px-3"><Save aria-hidden="true" className="h-4 w-4" /><span>Guardar borrador</span></Button>
          <Button onClick={() => saveLocal(draft.status === "Borrador" ? "Activo" : draft.status)} className="h-10 rounded-xl px-3"><Check aria-hidden="true" className="h-4 w-4" /><span>Guardar cambios</span></Button>
        </div>
      </div>

      <div role="note" className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3.5 text-foreground">
        <CloudOff aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div className="min-w-0"><p className="text-xs font-bold">Modo de demostración</p><p className="mt-0.5 text-xs leading-relaxed opacity-90">Los productos y cambios son datos de muestra en esta vista. No se guardan en Supabase y las imágenes o archivos seleccionados permanecen solo en este navegador.</p></div>
      </div>

      {notice && <div role="status" aria-live="polite" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground">{notice}</div>}

      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <Section icon={Package} title="Información del producto" description="Nombre, URL y descripción visible en la ficha de la tienda.">
            <div><label htmlFor="product-name" className={labelClass}>Nombre del producto <span className="text-destructive">*</span></label><input id="product-name" value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Ej. Biblia de estudio" className={fieldClass} /></div>
            <div><label htmlFor="product-slug" className={labelClass}>Slug</label><div className="mt-1.5 flex min-w-0 items-center overflow-hidden rounded-xl border border-input bg-background"><span className="hidden shrink-0 pl-3 text-xs text-muted-foreground sm:block">/tienda/</span><input id="product-slug" value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder={slugify(draft.name) || "nombre-del-producto"} className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><p className="mt-1 text-[11px] text-muted-foreground">Vista previa: /tienda/{slugValue || "nombre-del-producto"}</p></div>
            <div><label htmlFor="product-description" className={labelClass}>Descripción</label><textarea id="product-description" rows={6} value={draft.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe el contenido, materiales o uso del producto…" className="mt-1.5 w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /><p className="mt-1 text-right text-[11px] text-muted-foreground">{draft.description.length} caracteres · formato básico de texto</p></div>
          </Section>

          <Section icon={Tag} title="Precio y costo" description="Valores de referencia en dólares estadounidenses.">
            <div className="grid gap-4 sm:grid-cols-3">
              <label htmlFor="product-price" className={labelClass}>Precio de venta <span className="text-destructive">*</span><span className="relative mt-1.5 block"><span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><input id="product-price" type="number" min="0" step="0.01" value={draft.price} onChange={(event) => update("price", event.target.value)} placeholder="0.00" className={`${fieldClass} pl-8`} /></span></label>
              <label htmlFor="product-compare" className={labelClass}>Precio de comparación<span className="relative mt-1.5 block"><span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><input id="product-compare" type="number" min="0" step="0.01" value={draft.compareAtPrice} onChange={(event) => update("compareAtPrice", event.target.value)} placeholder="0.00" className={`${fieldClass} pl-8`} /></span></label>
              <label htmlFor="product-cost" className={labelClass}>Costo interno<span className="relative mt-1.5 block"><span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span><input id="product-cost" type="number" min="0" step="0.01" value={draft.cost} onChange={(event) => update("cost", event.target.value)} placeholder="0.00" className={`${fieldClass} pl-8`} /></span></label>
            </div>
            {margin !== null && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Info aria-hidden="true" className="h-3.5 w-3.5" />Margen estimado antes de otros gastos: <strong className="text-foreground">{margin}%</strong></p>}
          </Section>

          <Section icon={ImagePlus} title="Imágenes del producto" description="Añade varias imágenes y organiza su orden para la ficha. Los archivos solo se previsualizan localmente.">
            <input ref={imageInputRef} type="file" accept="image/*" multiple className="sr-only" aria-label="Seleccionar imágenes del producto" tabIndex={-1} onChange={(event) => addImages(event.target.files)} />
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px]">
              <button type="button" onClick={() => imageInputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addImages(event.dataTransfer.files); }} className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/15 px-4 py-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Upload aria-hidden="true" className="h-5 w-5 text-primary" /><span className="mt-2 text-xs font-bold text-foreground">Seleccionar o soltar imágenes</span><span className="mt-1 text-[11px] text-muted-foreground">JPG, PNG o WebP · vista previa local</span></button>
              <div className="rounded-xl border border-border bg-muted/20 p-3"><p className="text-[11px] font-semibold text-foreground">Orden de galería</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Arrastra miniaturas o usa las flechas para ordenarlas.</p><p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"><ImagePlus aria-hidden="true" className="h-3.5 w-3.5" />{draft.images.length} imágenes</p></div>
            </div>
            {draft.images.length ? <ol aria-label="Orden de imágenes del producto" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{draft.images.map((image, index) => <li key={image.id} draggable onDragStart={() => { dragIndex.current = index; }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); dropImage(index); }} onDragEnd={() => { dragIndex.current = null; }} className="group min-w-0 overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative aspect-[4/3] bg-muted"><Image src={image.src} alt={image.name} fill unoptimized sizes="(max-width: 640px) 45vw, 180px" className="object-cover" /><span className="absolute left-2 top-2 rounded-lg bg-black/65 px-2 py-1 text-[10px] font-bold text-white">{index === 0 ? "Portada" : `Imagen ${index + 1}`}</span><button type="button" aria-label={`Quitar ${image.name}`} onClick={() => update("images", draft.images.filter((item) => item.id !== image.id))} className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:h-9 lg:w-9"><X aria-hidden="true" className="h-4 w-4" /></button></div>
              <div className="flex flex-col gap-1 border-t border-border px-2 py-2 lg:flex-row lg:items-center lg:justify-between lg:py-1.5"><span className="min-w-0 truncate text-[10px] text-muted-foreground" title={image.name}>{image.name}</span><div className="flex shrink-0 justify-end gap-1"><button type="button" data-image-order-id={image.id} data-image-order-direction="-1" disabled={index === 0} aria-label={`Mover ${image.name} hacia arriba`} title="Subir imagen" onClick={() => moveImage(index, -1)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-9 lg:w-9"><ArrowUp aria-hidden="true" className="h-3.5 w-3.5" /></button><button type="button" data-image-order-id={image.id} data-image-order-direction="1" disabled={index === draft.images.length - 1} aria-label={`Mover ${image.name} hacia abajo`} title="Bajar imagen" onClick={() => moveImage(index, 1)} className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-9 lg:w-9"><ArrowDown aria-hidden="true" className="h-3.5 w-3.5" /></button></div></div>
            </li>)}</ol> : <div className="rounded-xl border border-border bg-muted/15 px-4 py-8 text-center text-xs text-muted-foreground">Todavía no hay imágenes en la galería.</div>}
          </Section>

          <Section icon={Box} title="Inventario" description="Control de existencias y aviso cuando el stock llegue al mínimo configurado.">
            <ToggleRow title="Rastrear cantidad disponible" detail="El inventario de muestra se ajustará al registrar una venta cuando exista integración." checked={draft.trackInventory} onChange={(value) => update("trackInventory", value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label htmlFor="product-stock" className={labelClass}>Cantidad disponible<input id="product-stock" type="number" min="0" step="1" disabled={!draft.trackInventory} value={draft.stock} onChange={(event) => update("stock", event.target.value)} className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`} /></label>
              <label htmlFor="product-low-stock" className={labelClass}>Avisar con stock igual o menor a<input id="product-low-stock" type="number" min="0" step="1" disabled={!draft.trackInventory} value={draft.lowStockThreshold} onChange={(event) => update("lowStockThreshold", event.target.value)} className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-50`} /></label>
            </div>
            {lowStock && <p role="status" className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 text-xs text-foreground"><CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />El stock de muestra está en o por debajo del umbral configurado.</p>}
          </Section>

          {!draft.isDigital && <Section icon={Package} title="Peso y dimensiones" description="Medidas del producto empaquetado para una futura estimación de envío.">
            <div className="grid gap-4 sm:grid-cols-4"><label htmlFor="product-weight" className={labelClass}>Peso (kg)<input id="product-weight" type="number" min="0" step="0.01" value={draft.weight} onChange={(event) => update("weight", event.target.value)} placeholder="0.00" className={fieldClass} /></label><label htmlFor="product-length" className={labelClass}>Largo (cm)<input id="product-length" type="number" min="0" step="0.1" value={draft.length} onChange={(event) => update("length", event.target.value)} placeholder="0" className={fieldClass} /></label><label htmlFor="product-width" className={labelClass}>Ancho (cm)<input id="product-width" type="number" min="0" step="0.1" value={draft.width} onChange={(event) => update("width", event.target.value)} placeholder="0" className={fieldClass} /></label><label htmlFor="product-height" className={labelClass}>Alto (cm)<input id="product-height" type="number" min="0" step="0.1" value={draft.height} onChange={(event) => update("height", event.target.value)} placeholder="0" className={fieldClass} /></label></div>
          </Section>}

          {draft.isDigital && <Section icon={FileDown} title="Archivo descargable" description="El archivo se elige en el navegador como referencia local. No se almacena ni se entrega.">
            <input ref={fileInputRef} type="file" className="sr-only" aria-label="Seleccionar archivo digital de muestra" tabIndex={-1} onChange={(event) => setDigitalFile(event.target.files?.[0]?.name ?? "")} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex min-h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-5 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Upload aria-hidden="true" className="h-4 w-4 text-primary" />{digitalFile || "Seleccionar archivo digital"}</button>
            <label className={labelClass}>Límite de descargas<input type="number" min="0" placeholder="Sin límite" className={fieldClass} /></label>
          </Section>}
        </div>

        <aside className="min-w-0 space-y-5 xl:sticky xl:top-24">
          <Section icon={Barcode} title="Organización">
            <label htmlFor="product-category" className={labelClass}>Categoría<span className="relative mt-1.5 block"><select id="product-category" value={draft.category} onChange={(event) => update("category", event.target.value)} className={`${fieldClass} appearance-none pr-10`}>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></span></label>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"><label htmlFor="product-sku" className={labelClass}>SKU<input id="product-sku" value={draft.sku} onChange={(event) => update("sku", event.target.value)} placeholder="DOM-001" className={`${fieldClass} font-mono`} /></label><label htmlFor="product-barcode" className={labelClass}>Código de barras<input id="product-barcode" value={draft.barcode} onChange={(event) => update("barcode", event.target.value)} placeholder="EAN o UPC" className={`${fieldClass} font-mono`} /></label></div>
            <div><label htmlFor="product-tag-input" className={labelClass}>Etiquetas</label><div className="mt-1.5 flex gap-2"><input id="product-tag-input" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="Añadir etiqueta" className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring" /><Button type="button" variant="outline" aria-label="Añadir etiqueta" onClick={addTag} className="h-11 w-11 shrink-0 rounded-xl p-0"><Plus aria-hidden="true" className="h-4 w-4" /></Button></div><div className="mt-2 flex flex-wrap gap-2">{draft.tags.length ? draft.tags.map((tag) => <span key={tag} className="inline-flex max-w-full items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"><span className="truncate">{tag}</span><button type="button" aria-label={`Quitar etiqueta ${tag}`} onClick={() => update("tags", draft.tags.filter((item) => item !== tag))} className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X aria-hidden="true" className="h-3 w-3" /></button></span>) : <span className="text-xs text-muted-foreground">Sin etiquetas</span>}</div></div>
          </Section>

          <Section icon={Star} title="Estado y visibilidad">
            <label htmlFor="product-status" className={labelClass}>Estado<span className="relative mt-1.5 block"><select id="product-status" value={draft.status} onChange={(event) => update("status", event.target.value as ProductStatus)} className={`${fieldClass} appearance-none pr-10`}><option>Borrador</option><option>Activo</option><option>Archivado</option></select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /></span></label>
            <ToggleRow title="Producto destacado" detail="Resaltar este artículo en las secciones de la tienda." checked={draft.featured} onChange={(value) => update("featured", value)} />
            <ToggleRow title="Producto digital" detail="Oculta peso y dimensiones y habilita el campo de archivo." checked={draft.isDigital} onChange={(value) => update("isDigital", value)} />
          </Section>

          <Section icon={Eye} title="Vista previa">
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              {draft.images[0] ? <div className="relative aspect-[4/3] bg-muted"><Image src={draft.images[0].src} alt="Vista previa del producto" fill unoptimized sizes="320px" className="object-cover" /></div> : <div className="flex aspect-[4/3] items-center justify-center bg-muted/40 text-muted-foreground"><ImagePlus aria-hidden="true" className="h-8 w-8" /></div>}
              <div className="space-y-2 p-3.5"><p className="line-clamp-2 text-sm font-bold text-foreground">{draft.name || "Nombre del producto"}</p><p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{draft.description || "La descripción aparecerá en esta vista previa."}</p><div className="flex items-center justify-between gap-2"><span className="text-lg font-extrabold tabular-nums text-foreground">${previewPrice.toFixed(2)}</span>{draft.featured && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary"><Star aria-hidden="true" className="h-3 w-3" />Destacado</span>}</div></div>
            </div>
            {draft.trackInventory && <p className={`text-xs ${lowStock ? "text-warning" : "text-muted-foreground"}`}>{draft.stock || "0"} unidades en inventario de muestra</p>}
          </Section>

          <div className="rounded-2xl border border-border bg-muted/25 p-4"><p className="text-xs font-bold text-foreground">Costos y rendimiento</p><p className="mt-1 text-xs text-muted-foreground">{margin === null ? "Agrega precio y costo para estimar el margen." : `Margen estimado: ${margin}%`}</p><div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs"><span className="text-muted-foreground">Vista de cliente</span><span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">{draft.status === "Activo" ? "Activo" : draft.status}</span></div></div>
        </aside>
      </div>

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center"><Button asChild variant="ghost" className="self-start rounded-xl px-3"><Link href="/admin/tienda/productos"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver a productos</Link></Button><div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => saveLocal("Borrador")} className="rounded-xl"><Save aria-hidden="true" className="h-4 w-4" />Guardar borrador</Button><Button onClick={() => saveLocal(draft.status === "Borrador" ? "Activo" : draft.status)} className="rounded-xl"><Check aria-hidden="true" className="h-4 w-4" />Guardar cambios</Button></div></div>
    </div>
  );
}
