"use client";

import { useState } from "react";
import Image from "@/components/shared/SiteImage";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, AlertTriangle, CheckCircle, Boxes, Tags } from "lucide-react";
import { MOCK_PRODUCTS } from "@/constants/data";
import { Button } from "@/components/ui/button";

type ProductStatus = "Activo" | "Borrador" | "Archivado";

const PRODUCT_STATUS_BY_ID: Record<string, ProductStatus> = {
  "1": "Borrador",
  "2": "Borrador",
  "3": "Borrador",
};

const statusClasses: Record<ProductStatus, string> = {
  Activo: "bg-success/10 text-success",
  Borrador: "bg-warning/10 text-warning",
  Archivado: "bg-muted text-muted-foreground",
};

function productSku(product: { id: string; sku?: string }) {
  return product.sku ?? `DOM-${product.id.padStart(3, "0")}`;
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [stockFilter, setStockFilter] = useState("Todos los niveles");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [notice, setNotice] = useState("");
  const categories = Array.from(new Set(products.map((product) => product.category)));

  const filtered = products.filter(
    (p) =>
      (p.name.toLocaleLowerCase("es").includes(searchTerm.toLocaleLowerCase("es")) ||
        p.category.toLocaleLowerCase("es").includes(searchTerm.toLocaleLowerCase("es")) ||
        productSku(p).toLocaleLowerCase("es").includes(searchTerm.toLocaleLowerCase("es"))) &&
      (categoryFilter === "Todas" || p.category === categoryFilter) &&
      (stockFilter === "Todos los niveles" || (stockFilter === "Stock bajo" ? p.stock <= 5 : p.stock > 5)) &&
      (statusFilter === "Todos los estados" || PRODUCT_STATUS_BY_ID[p.id] === statusFilter)
  );

  function removeProduct(productId: string, productName: string) {
    setProducts((current) => current.filter((product) => product.id !== productId));
    setNotice(`${productName} se quitó de esta vista local. No se modificó ningún catálogo conectado.`);
  }

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Productos
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Mantén al día la información y disponibilidad del catálogo.
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-warning" />
            Datos de muestra · los cambios no se guardan en una base de datos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" className="min-h-10 gap-2 rounded-xl px-3">
            <Link href="/admin/tienda/categorias"><Tags aria-hidden="true" className="h-4 w-4" />Categorías</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-10 gap-2 rounded-xl px-3">
            <Link href="/admin/tienda/inventario"><Boxes aria-hidden="true" className="h-4 w-4" />Inventario</Link>
          </Button>
          <Button asChild className="min-h-10 gap-1.5 rounded-xl font-semibold">
            <Link href="/admin/tienda/productos/nuevo"><Plus aria-hidden="true" className="h-4 w-4" />Nuevo producto</Link>
          </Button>
        </div>
      </header>

      {notice && <p role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground">{notice}</p>}

      <section aria-label="Buscar y filtrar productos" className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 xl:grid-cols-[minmax(15rem,1fr)_repeat(3,minmax(10rem,0.7fr))_auto] xl:items-end">
        <div className="relative min-w-0">
          <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <label htmlFor="admin-product-search" className="sr-only">
            Buscar productos por nombre, SKU o categoría
          </label>
          <input
            id="admin-product-search"
            type="search"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
          />
        </div>
        <label className="block text-[11px] font-medium text-muted-foreground" htmlFor="admin-product-category">Categoría
          <select id="admin-product-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="mt-1 block h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="block text-[11px] font-medium text-muted-foreground" htmlFor="admin-product-stock">Existencias
          <select id="admin-product-stock" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="mt-1 block h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>Todos los niveles</option><option>Stock bajo</option><option>Stock disponible</option>
          </select>
        </label>
        <label className="block text-[11px] font-medium text-muted-foreground" htmlFor="admin-product-status">Estado
          <select id="admin-product-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="mt-1 block h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option>Todos los estados</option><option>Activo</option><option>Borrador</option><option>Archivado</option>
          </select>
        </label>
        <span aria-live="polite" aria-atomic="true" className="self-center text-xs font-semibold text-muted-foreground sm:col-span-2 xl:col-span-1 xl:whitespace-nowrap">
          {filtered.length} de {products.length} productos
        </span>
      </section>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 xl:hidden" aria-label="Lista de productos">
        {filtered.length > 0 ? filtered.map((prod) => (
          <article key={prod.id} className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={prod.coverImage}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl border border-border object-cover"
              />
              <div className="min-w-0">
                <h2 className="break-words text-sm font-bold leading-snug text-foreground">{prod.name}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">SKU: {productSku(prod)}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/70 pt-3 text-xs">
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Categoría</dt>
                <dd className="mt-1 break-words font-medium text-foreground">{prod.category}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Precio</dt>
                <dd className="mt-1 font-extrabold tabular-nums text-foreground">${prod.price.toFixed(2)}</dd>
                {prod.compareAtPrice && (
                  <dd className="text-[10px] text-muted-foreground line-through">
                    ${prod.compareAtPrice.toFixed(2)}
                  </dd>
                )}
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Inventario</dt>
                <dd className={`mt-1 inline-flex items-center gap-1 font-semibold ${prod.stock <= 5 ? "text-warning" : "text-success"}`}>
                  {prod.stock <= 5 ? (
                    <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <CheckCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  )}
                  {prod.stock} unid.
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Estado</dt>
                <dd className="mt-1">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses[PRODUCT_STATUS_BY_ID[prod.id] ?? "Borrador"]}`}>
                    {PRODUCT_STATUS_BY_ID[prod.id] ?? "Borrador"}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex justify-end gap-1 border-t border-border/70 pt-2">
              <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                <Link href={`/admin/tienda/productos/${prod.id}`} aria-label={`Editar ${prod.name}`}><Edit3 aria-hidden="true" className="h-4 w-4" /></Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label={`Quitar ${prod.name} de esta vista local`} onClick={() => removeProduct(prod.id, prod.name)} className="h-10 w-10 rounded-lg text-destructive hover:bg-destructive/10">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </article>
        )) : (
          <p className="sm:col-span-2 rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            No hay productos que coincidan con esa búsqueda.
          </p>
        )}
      </section>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:block">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th scope="col" className="p-4">Producto</th>
              <th scope="col" className="p-4">Categoría</th>
              <th scope="col" className="p-4">Precio</th>
              <th scope="col" className="p-4">Inventario</th>
              <th scope="col" className="p-4">Estado</th>
              <th scope="col" className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.length > 0 ? filtered.map((prod) => (
              <tr key={prod.id} className="transition-colors hover:bg-muted/30">
                <th scope="row" className="p-4 text-left font-normal">
                  <div className="flex items-center gap-3">
                    <Image src={prod.coverImage} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" />
                    <div className="min-w-0">
                      <div className="line-clamp-2 font-bold text-sm text-foreground">{prod.name}</div>
                      <div className="text-[10px] text-muted-foreground">SKU: {productSku(prod)}</div>
                    </div>
                  </div>
                </th>
                <td className="p-4">
                  <span className="inline-block max-w-48 break-words rounded-md bg-muted px-2.5 py-1 font-semibold text-foreground">{prod.category}</span>
                </td>
                <td className="p-4">
                  <div className="font-extrabold tabular-nums text-sm text-foreground">${prod.price.toFixed(2)}</div>
                  {prod.compareAtPrice && <div className="text-[10px] text-muted-foreground line-through">${prod.compareAtPrice.toFixed(2)}</div>}
                </td>
                <td className="p-4">
                  {prod.stock <= 5 ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-warning">
                      <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> {prod.stock} unid.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                      <CheckCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /> {prod.stock} unid.
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses[PRODUCT_STATUS_BY_ID[prod.id] ?? "Borrador"]}`}>{PRODUCT_STATUS_BY_ID[prod.id] ?? "Borrador"}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/tienda/productos/${prod.id}`} aria-label={`Editar ${prod.name}`}><Edit3 aria-hidden="true" className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={`Quitar ${prod.name} de esta vista local`} onClick={() => removeProduct(prod.id, prod.name)} className="h-10 w-10 rounded-lg text-destructive hover:bg-destructive/10">
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No hay productos que coincidan con esa búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
