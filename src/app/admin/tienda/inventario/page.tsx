"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowDownUp,
  ArrowUpRight,
  Boxes,
  Check,
  Clock3,
  Minus,
  PackageCheck,
  Plus,
  Search,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/constants/data";

type ProductStatus = "Activo" | "Borrador" | "Archivado";
type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  status: ProductStatus;
};
type StockMovement = {
  id: number;
  product: string;
  delta: number;
  balance: number;
  reason: string;
  date: string;
};

const STOCK_THRESHOLD_BY_PRODUCT_ID: Record<string, number> = {
  "1": 5,
  "2": 6,
  "3": 5,
};

const INITIAL_PRODUCTS: InventoryProduct[] = MOCK_PRODUCTS.map((product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku ?? `DOM-${product.id.padStart(3, "0")}`,
  category: product.category,
  stock: product.stock,
  threshold: STOCK_THRESHOLD_BY_PRODUCT_ID[product.id] ?? 0,
  status: "Borrador",
}));

const INITIAL_MOVEMENTS: StockMovement[] = [
  { id: 3, product: MOCK_PRODUCTS[0].name, delta: 8, balance: MOCK_PRODUCTS[0].stock, reason: "Reposición de muestra", date: "19 nov 2026 · 10:24" },
  { id: 2, product: MOCK_PRODUCTS[1].name, delta: -1, balance: MOCK_PRODUCTS[1].stock, reason: "Salida de muestra", date: "18 nov 2026 · 16:08" },
  { id: 1, product: MOCK_PRODUCTS[2].name, delta: 2, balance: MOCK_PRODUCTS[2].stock, reason: "Ajuste de conteo", date: "17 nov 2026 · 11:42" },
];

function stockLabel(product: InventoryProduct) {
  if (product.stock === 0) return "Agotado";
  if (product.stock <= product.threshold) return "Stock bajo";
  return "Disponible";
}

function stockTone(product: InventoryProduct) {
  if (product.stock === 0) return "bg-destructive/10 text-destructive";
  if (product.stock <= product.threshold) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
}

function csvCell(value: string | number) {
  const safeValue = String(value).replace(/^[=+@\-]/, "'$&");
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function QuantityControl({ product, onAdjust }: { product: InventoryProduct; onAdjust: (productId: string, amount: number) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-label={`Ajustar stock de ${product.name}`}>
      <Button type="button" variant="outline" size="icon" className="h-11 w-11 min-h-11 min-w-11 shrink-0 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0" aria-label={`Restar una unidad de ${product.name}`} disabled={product.stock === 0} onClick={() => onAdjust(product.id, -1)}>
        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
      </Button>
      <output className="min-w-10 shrink-0 text-center text-sm font-bold tabular-nums text-foreground" aria-label={`${product.stock} unidades`}>{product.stock}</output>
      <Button type="button" variant="outline" size="icon" className="h-11 w-11 min-h-11 min-w-11 shrink-0 sm:h-9 sm:w-9 sm:min-h-0 sm:min-w-0" aria-label={`Sumar una unidad a ${product.name}`} onClick={() => onAdjust(product.id, 1)}>
        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function AdminInventarioPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [announcement, setAnnouncement] = useState("");

  const filteredProducts = useMemo(() => products.filter((product) => {
    const query = search.trim().toLocaleLowerCase("es");
    const matchesSearch = !query || [product.name, product.sku, product.category].some((value) => value.toLocaleLowerCase("es").includes(query));
    const matchesStock = stockFilter === "todos" || (stockFilter === "bajo" && product.stock > 0 && product.stock <= product.threshold) || (stockFilter === "agotado" && product.stock === 0);
    const matchesStatus = statusFilter === "todos" || product.status === statusFilter;
    return matchesSearch && matchesStock && matchesStatus;
  }), [products, search, stockFilter, statusFilter]);

  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= product.threshold).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const trackedUnits = products.reduce((total, product) => total + product.stock, 0);

  function adjustStock(productId: string, amount: number) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const nextStock = Math.max(0, product.stock + amount);
    const delta = nextStock - product.stock;
    if (delta === 0) return;

    setProducts((current) => current.map((item) => item.id === productId ? { ...item, stock: nextStock } : item));
    const date = new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date());
    setMovements((current) => [{ id: Date.now(), product: product.name, delta, balance: nextStock, reason: "Ajuste manual local", date }, ...current]);
    setAnnouncement(`Stock de ${product.name}: ${nextStock} unidades.`);
  }

  function exportCsv() {
    const rows = [
      ["Producto", "SKU", "Categoría", "Cantidad", "Mínimo", "Estado de stock", "Estado de producto"],
      ...filteredProducts.map((product) => [product.name, product.sku, product.category, product.stock, product.threshold, stockLabel(product), product.status]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventario-esperanza-de-vida-muestra.csv";
    link.click();
    URL.revokeObjectURL(url);
    setAnnouncement(`CSV local preparado con ${filteredProducts.length} productos.`);
  }

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Warehouse aria-hidden="true" className="h-4 w-4" /> Tienda · Operación local</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Inventario</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Consulta existencias, ajusta cantidades y revisa movimientos de muestra.</p>
        </div>
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={exportCsv}>
          <ArrowDownToLine aria-hidden="true" className="h-4 w-4" /> Exportar CSV
        </Button>
      </header>

      <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-foreground" aria-label="Aviso sobre datos de demostración">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p><strong>Vista de demostración.</strong> Datos de muestra; los ajustes son temporales y se reinician al recargar. No se procesan pagos ni se usan datos personales reales.</p>
      </aside>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen del inventario">
        <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">Unidades registradas</p><span className="rounded-xl bg-primary/10 p-2 text-primary"><Boxes aria-hidden="true" className="h-4 w-4" /></span></div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{trackedUnits}</p>
          <p className="mt-1 text-xs text-muted-foreground">En {products.length} productos de muestra</p>
        </article>
        <article className="rounded-2xl border border-warning/25 bg-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">Bajo el mínimo</p><span className="rounded-xl bg-warning/10 p-2 text-warning"><ArrowDownUp aria-hidden="true" className="h-4 w-4" /></span></div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{lowStockCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Requieren una revisión</p>
        </article>
        <article className="rounded-2xl border border-destructive/20 bg-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-muted-foreground">Sin unidades</p><span className="rounded-xl bg-destructive/10 p-2 text-destructive"><PackageCheck aria-hidden="true" className="h-4 w-4" /></span></div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-foreground">{outOfStockCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Productos sin existencias</p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5" aria-labelledby="inventory-title">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 id="inventory-title" className="text-lg font-bold text-foreground">Existencias por producto</h2><p className="mt-1 text-xs text-muted-foreground">Los cambios de cantidad se reflejan en el historial local.</p></div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[min(100%,42rem)]">
            <div className="relative sm:col-span-1">
              <Search aria-hidden="true" className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <label htmlFor="inventory-search" className="sr-only">Buscar por producto, SKU o categoría</label>
              <input id="inventory-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o SKU" className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div><label htmlFor="stock-filter" className="sr-only">Filtrar por nivel de stock</label><select id="stock-filter" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="todos">Todo el stock</option><option value="bajo">Stock bajo</option><option value="agotado">Agotados</option></select></div>
            <div><label htmlFor="status-filter" className="sr-only">Filtrar por estado del producto</label><select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="todos">Todos los estados</option><option value="Activo">Activo</option><option value="Borrador">Borrador</option><option value="Archivado">Archivado</option></select></div>
          </div>
        </div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">{announcement || `${filteredProducts.length} productos visibles.`}</p>
        <div className="grid gap-3 md:grid-cols-2 xl:hidden">
          {filteredProducts.length ? filteredProducts.map((product) => (
            <article key={product.id} className="min-w-0 rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-bold text-foreground">{product.name}</h3><p className="mt-1 text-xs text-muted-foreground">{product.sku} · {product.category}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${stockTone(product)}`}>{stockLabel(product)}</span></div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-border pt-3"><div><p className="text-[11px] text-muted-foreground">Mínimo {product.threshold} · {product.status}</p><p className="mt-1 text-xs text-muted-foreground">Ajustar unidades</p></div><QuantityControl product={product} onAdjust={adjustStock} /></div>
            </article>
          )) : <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground md:col-span-2">No hay productos con esos filtros.</p>}
        </div>
        <div className="hidden overflow-x-auto rounded-xl border border-border xl:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Inventario filtrado de productos y controles para ajustar unidades</caption>
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr><th scope="col" className="px-4 py-3">Producto</th><th scope="col" className="px-4 py-3">Categoría / SKU</th><th scope="col" className="px-4 py-3">Stock</th><th scope="col" className="px-4 py-3">Estado</th><th scope="col" className="px-4 py-3 text-right">Ajuste local</th></tr></thead>
            <tbody className="divide-y divide-border/70">{filteredProducts.length ? filteredProducts.map((product) => <tr key={product.id} className="hover:bg-muted/30"><th scope="row" className="px-4 py-4 text-left font-semibold text-foreground">{product.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">Mínimo: {product.threshold} unidades</span></th><td className="px-4 py-4 text-muted-foreground">{product.category}<span className="mt-1 block text-xs">{product.sku}</span></td><td className="px-4 py-4"><span className="font-semibold tabular-nums text-foreground">{product.stock}</span><span className="ml-1 text-xs text-muted-foreground">unid.</span></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${stockTone(product)}`}>{stockLabel(product)}</span><span className="ml-2 text-xs text-muted-foreground">{product.status}</span></td><td className="px-4 py-3"><div className="flex justify-end"><QuantityControl product={product} onAdjust={adjustStock} /></div></td></tr>) : <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No hay productos con esos filtros.</td></tr>}</tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /> Mostrando {filteredProducts.length} de {products.length} productos</div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby="movement-title">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5"><div><h2 id="movement-title" className="text-lg font-bold text-foreground">Movimientos recientes</h2><p className="mt-1 text-xs text-muted-foreground">Muestra local de ajustes y cambios de existencia</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" /> Solo esta sesión</span></div>
        <ol className="divide-y divide-border/70">
          {movements.length ? movements.slice(0, 6).map((movement) => <li key={movement.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5"><div className="flex min-w-0 gap-3"><span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${movement.delta > 0 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}><ArrowDownUp aria-hidden="true" className="h-4 w-4" /></span><div className="min-w-0"><p className="break-words text-sm font-semibold text-foreground">{movement.product}</p><p className="mt-1 text-xs text-muted-foreground">{movement.reason} · {movement.date}</p></div></div><div className="shrink-0 text-right"><p className={`font-bold tabular-nums ${movement.delta > 0 ? "text-success" : "text-warning"}`}>{movement.delta > 0 ? "+" : ""}{movement.delta}</p><p className="text-[11px] text-muted-foreground">Saldo: {movement.balance}</p></div></li>) : <li className="px-5 py-10 text-center text-sm text-muted-foreground">Aún no hay movimientos.</li>}
        </ol>
        {movements.length > 0 && <p className="flex items-center gap-2 border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground sm:px-5"><Check aria-hidden="true" className="h-3.5 w-3.5 text-success" /> Historial temporal. Se reinicia al actualizar esta página.</p>}
      </section>
    </div>
  );
}
