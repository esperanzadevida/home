"use client";

import { useState } from "react";
import { Plus, Search, Edit3, Trash2, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { MOCK_PRODUCTS } from "@/constants/data";
import { Button } from "@/components/ui/button";

export default function AdminProductosPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestión de Productos e Inventario
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Administra precios, existencias, categorías y estados de la tienda y librería.
          </p>
        </div>
        <Button className="font-semibold gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs sm:text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-muted-foreground font-semibold">
          Mostrando {filtered.length} de {products.length} productos
        </div>
      </div>

      {/* Tabla de Productos del Admin */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Inventario</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.coverImage}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-border"
                      />
                      <div>
                        <div className="font-bold text-foreground text-sm line-clamp-1">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">ID: #{prod.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-muted text-foreground font-semibold">
                      {prod.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-extrabold text-foreground text-sm">
                      ${prod.price.toFixed(2)}
                    </div>
                    {prod.compareAtPrice && (
                      <div className="text-[10px] text-muted-foreground line-through">
                        ${prod.compareAtPrice.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {prod.stock <= 5 ? (
                        <span className="flex items-center gap-1 text-warning font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> {prod.stock} unid.
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-success font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> {prod.stock} unid.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-bold text-[10px]">
                      Activo
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
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
    </div>
  );
}
