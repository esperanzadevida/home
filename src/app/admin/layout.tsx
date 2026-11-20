import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import type { Metadata } from "next";
import {
  LayoutDashboard,
  FileText,
  Video,
  Calendar,
  ShoppingBag,
  Users,
  Heart,
  Shield,
  Settings,
  LogOut,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Logo Admin */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center">
              AD
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Admin Portal</div>
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                Asambleas de Dios
              </div>
            </div>
          </div>

          {/* Menú de Navegación del Panel */}
          <nav aria-label="Navegación administrativa" className="space-y-1 text-sm font-medium">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
              General
            </div>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary/10 text-primary font-semibold"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 pt-4 py-1">
              Contenido Público
            </div>
            <Link
              href="/admin/contenido/sermones"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Sermones</span>
            </Link>
            <Link
              href="/admin/contenido/blog"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Blog y Noticias</span>
            </Link>
            <Link
              href="/admin/contenido/eventos"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Eventos y Calendario</span>
            </Link>

            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 pt-4 py-1">
              Tienda & Donaciones
            </div>
            <Link
              href="/admin/tienda/productos"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Productos y Stock</span>
            </Link>
            <Link
              href="/admin/tienda/pedidos"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Pedidos y Ventas</span>
            </Link>
            <Link
              href="/admin/donaciones"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Diezmos y Ofrendas</span>
            </Link>

            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2 pt-4 py-1">
              Administración
            </div>
            <Link
              href="/admin/miembros"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Directorio Miembros</span>
            </Link>
            <Link
              href="/admin/roles"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Roles y Permisos</span>
            </Link>
            <Link
              href="/admin/configuracion"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </Link>
          </nav>
        </div>

        {/* Footer del Sidebar con Usuario y Salida */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                PA
              </div>
              <div>
                <div className="text-xs font-semibold">Pastor Principal</div>
                <div className="text-[10px] text-muted-foreground">Super Administrador</div>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      {/* Área Principal de Contenido del Admin */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">
          <h2 className="text-lg font-bold">Gestión de la Iglesia</h2>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-xs text-primary hover:underline font-semibold">
              Ver sitio público ↗
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
