"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "@/components/shared/SiteImage";
import Link from "next/link";
import {
  Check,
  Eye,
  HeartHandshake,
  Info,
  Minus,
  Plus,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import {
  APPAREL_SIZE_GUIDE,
  STORE_CATALOG,
  STORE_CATEGORIES,
  type StoreCategory,
  type StoreProduct,
} from "@/config/store-catalog";
import { useCart, type CartProduct } from "@/providers/CartProvider";

type SortOption = "featured" | "price-asc" | "price-desc";

function mapToCartCategory(category: StoreCategory): CartProduct["category"] {
  if (category === "Biblias y Libros") return "Biblias";
  if (category === "Papelería") return "Accesorios";
  return category;
}

function formatUsd(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function getDiscountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function StorefrontExperience() {
  const { addItem, openCart, totalItems } = useCart();

  // Filters & sorting
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Todos" | StoreCategory>("Todos");
  const [activeSize, setActiveSize] = useState<string>("Todas");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  // Per-card quick selected color index (so swatches work directly on cards!)
  const [cardColors, setCardColors] = useState<Record<string, number>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Quick-view modal state
  const [modalProduct, setModalProduct] = useState<StoreProduct | null>(null);
  const [modalColorIdx, setModalColorIdx] = useState(0);
  const [modalModelIdx, setModalModelIdx] = useState(0);
  const [modalSizeIdx, setModalSizeIdx] = useState(0);
  const [modalQty, setModalQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const quickViewTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Debounce search (250ms)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    STORE_CATALOG.forEach((p) => {
      p.sizes.forEach((s) => {
        if (s.stock > 0) set.add(s.label);
      });
    });
    return ["Todas", ...Array.from(set)];
  }, []);

  const filteredProducts = useMemo(() => {
    const list = STORE_CATALOG.filter((product) => {
      if (activeCategory !== "Todos" && product.category !== activeCategory) return false;
      if (
        activeSize !== "Todas" &&
        !product.sizes.some((s) => s.label === activeSize && s.stock > 0)
      ) {
        return false;
      }
      if (debouncedSearch) {
        const haystack = [
          product.name,
          product.tagline,
          product.description,
          product.category,
          ...product.colors.map((c) => c.name),
          ...product.models.map((m) => m.name),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(debouncedSearch)) return false;
      }
      return true;
    });

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [activeCategory, activeSize, debouncedSearch, sortBy]);

  function openQuickView(product: StoreProduct, trigger: HTMLButtonElement) {
    quickViewTriggerRef.current = trigger;
    const initialColor = cardColors[product.id] ?? 0;
    const firstInStockSize = Math.max(
      0,
      product.sizes.findIndex((s) => s.stock > 0)
    );
    setModalProduct(product);
    setModalColorIdx(initialColor);
    setModalModelIdx(0);
    setModalSizeIdx(firstInStockSize);
    setModalQty(1);
    setShowSizeGuide(false);
  }

  function handleQuickAddCard(product: StoreProduct) {
    const color = product.colors[cardColors[product.id] ?? 0] ?? product.colors[0];
    const model = product.models[0];
    const size = product.sizes.find((s) => s.stock > 0) ?? product.sizes[0];
    const unitPrice = product.price + (model?.priceDelta ?? 0);
    const variantLabel = `${model.name} · ${color.name} · ${size.label}`;

    addItem(
      {
        id: product.id,
        name: product.name,
        price: unitPrice,
        coverImage: product.image,
        category: mapToCartCategory(product.category),
      },
      1,
      variantLabel
    );

    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1600);
  }

  function handleModalAddToCart() {
    if (!modalProduct) return;
    const color = modalProduct.colors[modalColorIdx] ?? modalProduct.colors[0];
    const model = modalProduct.models[modalModelIdx] ?? modalProduct.models[0];
    const size = modalProduct.sizes[modalSizeIdx] ?? modalProduct.sizes[0];
    if (!size || size.stock <= 0) return;

    const unitPrice = modalProduct.price + (model?.priceDelta ?? 0);
    const variantLabel = `${model.name} · ${color.name} · ${size.label}`;

    addItem(
      {
        id: modalProduct.id,
        name: modalProduct.name,
        price: unitPrice,
        coverImage: modalProduct.image,
        category: mapToCartCategory(modalProduct.category),
      },
      modalQty,
      variantLabel
    );

    setModalProduct(null);
  }

  const hasActiveFilters =
    activeCategory !== "Todos" || activeSize !== "Todas" || debouncedSearch.length > 0;

  // Derived modal values
  const selectedModalColor = modalProduct
    ? (modalProduct.colors[modalColorIdx] ?? modalProduct.colors[0])
    : null;
  const selectedModalModel = modalProduct
    ? (modalProduct.models[modalModelIdx] ?? modalProduct.models[0])
    : null;
  const selectedModalSize = modalProduct
    ? (modalProduct.sizes[modalSizeIdx] ?? modalProduct.sizes[0])
    : null;
  const modalUnitPrice = modalProduct
    ? modalProduct.price + (selectedModalModel?.priceDelta ?? 0)
    : 0;
  const modalSku =
    modalProduct && selectedModalColor && selectedModalModel && selectedModalSize
      ? `${modalProduct.skuPrefix}-${selectedModalModel.id.slice(0, 3).toUpperCase()}-${selectedModalColor.id.slice(0, 3).toUpperCase()}-${selectedModalSize.label.replace(/\s+/g, "").toUpperCase()}`
      : "";

  return (
    <section
      id="catalogo-tienda"
      aria-labelledby="store-catalog-heading"
      className="relative bg-background text-foreground py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Catalog Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Catálogo de muestra · Colección 2026
            </p>
            <h2
              id="store-catalog-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Explora por estilo, color y talla
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Selecciona colores directamente en cada tarjeta o abre la vista rápida para elegir modelo, talla y medidas antes de agregar al carrito.
            </p>
          </div>

          <button
            type="button"
            onClick={openCart}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2.5 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/50 hover:bg-muted md:self-auto"
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4 text-primary" />
            <span>Mi carrito</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          </button>
        </div>

        <aside className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground" aria-label="Estado del catálogo">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p><strong>Vista previa del catálogo.</strong> Productos, precios, modelos, tallas y existencias son datos de muestra; entrega, cambios y destino de aportes están por confirmar. El carrito conserva la selección en este navegador y no genera pedidos ni pagos.</p>
        </aside>

        {/* Interactive Filter Bar */}
        <div className="mt-8 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar hoodies, biblias, colores..."
                aria-label="Buscar productos en la tienda"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>

            {/* Category tabs */}
            <div
              role="tablist"
              aria-label="Filtrar por categoría"
              className="flex flex-wrap items-center gap-1.5"
            >
              {STORE_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-10 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border/80 bg-background/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
              <label htmlFor="store-sort" className="sr-only">
                Ordenar productos
              </label>
              <select
                id="store-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 cursor-pointer rounded-xl border border-input bg-background px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
              >
                <option value="featured">Ordenar: Destacados</option>
                <option value="price-asc">Precio: Menor a mayor</option>
                <option value="price-desc">Precio: Mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Size filter row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3.5">
            <span className="text-xs font-semibold text-muted-foreground">Talla / Formato:</span>
            {availableSizes.map((size) => {
              const selected = activeSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setActiveSize(size)}
                  className={`min-h-8 cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-foreground text-background"
                      : "border border-border/70 bg-background/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {size}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setDebouncedSearch("");
                  setActiveCategory("Todos");
                  setActiveSize("Todas");
                }}
                className="ml-auto inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-primary hover:underline"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="mt-6 text-xs font-medium text-muted-foreground">
          Mostrando <strong className="text-foreground">{filteredProducts.length}</strong> de{" "}
          {STORE_CATALOG.length} recursos disponibles
        </p>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <p className="text-base font-semibold text-foreground">
              No encontramos productos con esos filtros.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba limpiando la búsqueda o eligiendo otra categoría o talla.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setDebouncedSearch("");
                setActiveCategory("Todos");
                setActiveSize("Todas");
              }}
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Ver todo el catálogo
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const colorIdx = cardColors[product.id] ?? 0;
              const activeColor = product.colors[colorIdx] ?? product.colors[0];
              const discount = getDiscountPercent(product.price, product.compareAtPrice);
              const isAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="store-card group flex flex-col rounded-2xl border border-border/80 bg-card shadow-sm"
                >
                  {/* Studio Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 640px) 94vw, (max-width: 1024px) 46vw, 31vw"
                      style={{
                        filter: activeColor.imageFilter && activeColor.imageFilter !== "none"
                          ? activeColor.imageFilter
                          : undefined,
                      }}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {product.badge && (
                        <span className="rounded-full border border-white/20 bg-black/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                          {product.badge}
                        </span>
                      )}
                      {discount && (
                        <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-emerald-950 backdrop-blur-md">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Quick View Overlay Button */}
                    <button
                      type="button"
                      onClick={(event) => openQuickView(product, event.currentTarget)}
                      className="absolute bottom-3 right-3 inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white opacity-95 backdrop-blur-md transition-all hover:bg-black/90 sm:opacity-0 sm:translate-y-1 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label={`Vista rápida de ${product.name}`}
                    >
                      <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                      Vista rápida
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {product.category}
                      </span>
                      <span>{product.models.length} modelos</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-card-foreground">
                      <button
                        type="button"
                        onClick={(event) => openQuickView(product, event.currentTarget)}
                        className="cursor-pointer text-left transition-colors hover:text-primary"
                      >
                        {product.name}
                      </button>
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {product.tagline}
                    </p>

                    {/* Interactive Color Swatches */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2" role="group" aria-label={`Colores de ${product.name}`}>
                        {product.colors.map((color, idx) => {
                          const selected = idx === colorIdx;
                          return (
                            <button
                              key={color.id}
                              type="button"
                              onClick={() =>
                                setCardColors((prev) => ({ ...prev, [product.id]: idx }))
                              }
                              title={color.name}
                              aria-label={`Color ${color.name}`}
                              aria-pressed={selected}
                              className={`h-6 w-6 cursor-pointer rounded-full border transition-transform ${
                                selected
                                  ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card border-white/40"
                                  : "border-border hover:scale-105"
                              }`}
                              style={{ backgroundColor: color.hex }}
                            />
                          );
                        })}
                      </div>
                      <span className="truncate text-[11px] font-medium text-muted-foreground">
                        {activeColor.name}
                      </span>
                    </div>

                    {/* Available Sizes Preview */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.sizes.map((size) => (
                        <span
                          key={size.label}
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                            size.stock > 0
                              ? "border-border/80 bg-background/70 text-foreground/85"
                              : "border-border/40 bg-muted/40 text-muted-foreground/50 line-through"
                          }`}
                        >
                          {size.label}
                        </span>
                      ))}
                    </div>

                    {/* Price + Actions */}
                    <div className="mt-auto pt-5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold tabular-nums text-foreground">
                          {formatUsd(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs tabular-nums text-muted-foreground line-through">
                            {formatUsd(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(event) => openQuickView(product, event.currentTarget)}
                          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-muted"
                        >
                          Tallas y modelos
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddCard(product)}
                          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-92"
                        >
                          {isAdded ? (
                            <>
                              <Check aria-hidden="true" className="h-3.5 w-3.5" />
                              Agregado
                            </>
                          ) : (
                            <>
                              <ShoppingBag aria-hidden="true" className="h-3.5 w-3.5" />
                              Agregar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Trust & Mission Strip */}
        <div className="mt-16 grid gap-4 border-t border-border/80 pt-10 md:grid-cols-3">
          <div className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card/70 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Entrega por confirmar</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Publicaremos ubicación, horario y costos cuando la operación esté definida.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card/70 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Cambios por definir</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Las condiciones de cambio y devolución se comunicarán antes de recibir pedidos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card/70 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HeartHandshake aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">Destino comunitario por confirmar</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Cualquier destino de aportes se publicará con información aprobada.
              </p>
            </div>
          </div>
        </div>

        {/* Local cart behavior */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          El carrito guarda tu selección en este navegador; no envía pedidos ni pagos. ¿Tienes una consulta sobre el catálogo?{" "}
          <Link href="/contacto" className="font-semibold text-primary underline-offset-4 hover:underline">
            Escríbenos aquí
          </Link>
          .
        </p>
      </div>

      {/* =====================================================================
          INTERACTIVE QUICK-VIEW VARIANT MODAL (Modelos + Colores + Tallas + Guía)
          ===================================================================== */}
      <Dialog.Root
        open={Boolean(modalProduct)}
        onOpenChange={(open) => {
          if (!open) setModalProduct(null);
        }}
      >
        {modalProduct && selectedModalColor && selectedModalModel && selectedModalSize && (
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md" />
            <Dialog.Content
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                quickViewTriggerRef.current?.focus();
              }}
              className="fixed left-1/2 top-1/2 z-[121] max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border bg-card text-card-foreground shadow-2xl outline-none"
            >
              <div className="relative grid md:grid-cols-2">
                {/* Close Button */}
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Cerrar vista rápida"
                    className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/85 text-foreground backdrop-blur-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </Dialog.Close>

                {/* Left: Studio Preview */}
                <div className="relative flex flex-col justify-between bg-muted/60 p-5 sm:p-6">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 bg-background md:aspect-square">
                    <Image
                      src={modalProduct.image}
                      alt={modalProduct.imageAlt}
                      fill
                      sizes="(max-width: 768px) 92vw, 420px"
                      style={{
                        filter:
                          selectedModalColor.imageFilter && selectedModalColor.imageFilter !== "none"
                            ? selectedModalColor.imageFilter
                            : undefined,
                      }}
                      className="object-cover transition-all duration-300"
                    />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      <span
                        className="h-3 w-3 rounded-full border border-white/50"
                        style={{ backgroundColor: selectedModalColor.hex }}
                      />
                      {selectedModalColor.name}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-border/70 bg-background/80 p-3.5 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      Ficha de muestra: precio, existencias y detalles por confirmar.
                    </p>
                    <p className="mt-1">{modalProduct.materials}</p>
                  </div>
                </div>

                {/* Right: Variant Configurator */}
                <div className="flex flex-col p-5 sm:p-7">
                  <div className="pr-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {modalProduct.category} · SKU {modalSku}
                    </p>
                    <Dialog.Title asChild>
                      <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                        {modalProduct.name}
                      </h3>
                    </Dialog.Title>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2.5">
                    <span className="font-display text-2xl font-bold tabular-nums text-foreground">
                      {formatUsd(modalUnitPrice)}
                    </span>
                    {modalProduct.compareAtPrice && (
                      <span className="text-sm tabular-nums text-muted-foreground line-through">
                        {formatUsd(modalProduct.compareAtPrice)}
                      </span>
                    )}
                    <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedModalSize.stock > 0
                        ? `Muestra: ${selectedModalSize.stock}`
                        : "Sin stock en la muestra"}
                    </span>
                  </div>

                  <Dialog.Description asChild>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {modalProduct.description}
                    </p>
                  </Dialog.Description>

                  {/* 1. Model selector */}
                  <div className="mt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      1. Modelo
                    </span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {modalProduct.models.map((model, idx) => {
                        const selected = idx === modalModelIdx;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => setModalModelIdx(idx)}
                            className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                              selected
                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                : "border-border bg-background/70 hover:border-foreground/30"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-foreground">
                              <span>{model.name}</span>
                              {model.priceDelta ? (
                                <span className="text-primary">
                                  {model.priceDelta > 0 ? `+$${model.priceDelta}` : `-$${Math.abs(model.priceDelta)}`}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">{model.note}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Color selector */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        2. Color
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {selectedModalColor.name}
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                      {modalProduct.colors.map((color, idx) => {
                        const selected = idx === modalColorIdx;
                        return (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setModalColorIdx(idx)}
                            aria-label={`Elegir color ${color.name}`}
                            aria-pressed={selected}
                            className={`h-8 w-8 cursor-pointer rounded-full border transition-transform ${
                              selected
                                ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card border-white/50"
                                : "border-border hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Size selector + Size Guide */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        3. Talla / Formato
                      </span>
                      {modalProduct.hasApparelSizeGuide && (
                        <button
                          type="button"
                          onClick={() => setShowSizeGuide((prev) => !prev)}
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Ruler aria-hidden="true" className="h-3.5 w-3.5" />
                          {showSizeGuide ? "Ocultar guía" : "Guía de tallas"}
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {modalProduct.sizes.map((size, idx) => {
                        const selected = idx === modalSizeIdx;
                        const disabled = size.stock <= 0;
                        return (
                          <button
                            key={size.label}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setModalSizeIdx(idx);
                              setModalQty((q) => Math.min(q, Math.max(1, size.stock)));
                            }}
                            className={`min-h-10 min-w-12 rounded-xl border px-3 text-xs font-semibold transition-all ${
                              disabled
                                ? "cursor-not-allowed border-border/50 bg-muted/40 text-muted-foreground/50 line-through"
                                : selected
                                  ? "cursor-pointer border-primary bg-primary text-primary-foreground shadow-sm"
                                  : "cursor-pointer border-border bg-background text-foreground hover:border-primary/50"
                            }`}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>

                    {showSizeGuide && modalProduct.hasApparelSizeGuide && (
                      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-background p-3">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-border text-muted-foreground">
                              <th className="pb-1.5 font-semibold">Talla</th>
                              <th className="pb-1.5 font-semibold">Pecho</th>
                              <th className="pb-1.5 font-semibold">Largo</th>
                              <th className="pb-1.5 font-semibold">Hombro</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {APPAREL_SIZE_GUIDE.map((row) => (
                              <tr key={row.size}>
                                <td className="py-1.5 font-bold text-foreground">{row.size}</td>
                                <td className="py-1.5 tabular-nums text-muted-foreground">{row.chest}</td>
                                <td className="py-1.5 tabular-nums text-muted-foreground">{row.length}</td>
                                <td className="py-1.5 tabular-nums text-muted-foreground">{row.shoulder}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Quantity + Add to Cart (sticky at bottom so always reachable even with size guide open) */}
                  <div className="sticky bottom-0 -mx-5 mt-5 flex items-center gap-3 border-t border-border/60 bg-card/95 px-5 pb-1 pt-3 backdrop-blur-md sm:-mx-7 sm:px-7">
                    <div className="inline-flex h-12 items-center rounded-xl border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        aria-label="Disminuir cantidad"
                        className="flex h-full w-10 cursor-pointer items-center justify-center text-foreground hover:bg-muted rounded-l-xl"
                      >
                        <Minus aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <span className="min-w-9 text-center text-sm font-bold tabular-nums">
                        {modalQty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setModalQty((q) => Math.min(Math.max(1, selectedModalSize.stock), q + 1))
                        }
                        aria-label="Aumentar cantidad"
                        className="flex h-full w-10 cursor-pointer items-center justify-center text-foreground hover:bg-muted rounded-r-xl"
                      >
                        <Plus aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={selectedModalSize.stock <= 0}
                      onClick={handleModalAddToCart}
                      className="magic-shimmer-btn relative inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ShoppingBag aria-hidden="true" className="h-4 w-4" />
                      <span>
                        Agregar · {formatUsd(modalUnitPrice * modalQty)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </section>
  );
}
