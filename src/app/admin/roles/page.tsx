"use client";

import { useState } from "react";
import { Shield, Check, Lock, Users, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export default function AdminRolesPage() {
  const [activeRole, setActiveRole] = useState<string>("editor");
  const [saved, setSaved] = useState(false);

  const [permissions, setPermissions] = useState<RolePermission[]>([
    { module: "Sermones y Mensajes", view: true, create: true, edit: true, delete: false },
    { module: "Blog y Devocionales", view: true, create: true, edit: true, delete: false },
    { module: "Eventos y Calendario", view: true, create: true, edit: true, delete: false },
    { module: "Tienda y Productos", view: true, create: false, edit: false, delete: false },
    { module: "Muro de Oración", view: true, create: true, edit: true, delete: true },
    { module: "Directorio de Miembros", view: true, create: false, edit: false, delete: false },
    { module: "Finanzas y Donaciones", view: false, create: false, edit: false, delete: false },
    { module: "Configuración del Sistema", view: false, create: false, edit: false, delete: false },
  ]);

  const togglePermission = (index: number, key: keyof Omit<RolePermission, "module">) => {
    setPermissions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [key]: !p[key] } : p))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Control de Acceso, Roles y Permisos
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Define privilegios granulares para pastores, líderes de ministerios, editores de blog y encargados de tienda.
          </p>
        </div>

        <Button
          variant={saved ? "accent" : "default"}
          className="font-semibold gap-1.5 self-start"
          onClick={handleSave}
        >
          {saved ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {saved ? "Guardado con éxito" : "Guardar Cambios de Permisos"}
        </Button>
      </div>

      {/* Selector de Roles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "super_admin", name: "Pastor Principal", desc: "Acceso total sin restricciones" },
          { id: "admin", name: "Administrador General", desc: "Gestión completa de ChMS y Tienda" },
          { id: "editor", name: "Editor de Medios", desc: "Sube sermones, blog y eventos" },
          { id: "leader", name: "Líder de Ministerio", desc: "Gestiona células y su ministerio" },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRole(r.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeRole === r.id
                ? "bg-primary/10 border-primary text-foreground shadow-sm"
                : "bg-card border-border hover:bg-muted/50 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${activeRole === r.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-bold text-sm text-foreground">{r.name}</span>
            </div>
            <p className="text-[11px] mt-1 line-clamp-1">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Matriz de Permisos */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-foreground">
            Módulos del Sistema vs Acciones Permitidas
          </span>
          <span className="text-xs text-muted-foreground font-semibold">
            Editando: <strong className="text-primary">{activeRole.toUpperCase()}</strong>
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-muted/20 border-b border-border/60 text-muted-foreground font-semibold">
            <tr>
              <th className="p-4">Módulo</th>
              <th className="p-4 text-center">Ver</th>
              <th className="p-4 text-center">Crear</th>
              <th className="p-4 text-center">Editar</th>
              <th className="p-4 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {permissions.map((p, idx) => (
              <tr key={p.module} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-semibold text-foreground">{p.module}</td>
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.view}
                    onChange={() => togglePermission(idx, "view")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.create}
                    onChange={() => togglePermission(idx, "create")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.edit}
                    onChange={() => togglePermission(idx, "edit")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={p.delete}
                    onChange={() => togglePermission(idx, "delete")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
