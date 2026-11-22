"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Calendar,
  CreditCard,
  Boxes,
  FileText,
  Heart,
  House,
  Images,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  Settings,
  Shield,
  ShoppingBag,
  Tags,
  Users,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BrandMark } from "@/components/shared/BrandMark";
import { churchProfile } from "@/config/church-profile";
import { ADMIN_ROLE_LABELS } from "@/config/admin-roles";
import { canAccessAdminPath } from "@/lib/admin-access";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useAdminAccess } from "@/components/admin/AdminAuthGate";

const adminSections = [
  {
    title: "General",
    links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Contenido Público",
    links: [
      { href: "/admin/contenido/sermones", label: "Sermones", icon: Video },
      { href: "/admin/contenido/blog", label: "Blog y Noticias", icon: FileText },
      { href: "/admin/contenido/eventos", label: "Eventos y Calendario", icon: Calendar },
      { href: "/admin/contenido/galeria", label: "Galería", icon: Images },
    ],
  },
  {
    title: "Moderación",
    links: [
      { href: "/admin/oracion", label: "Peticiones de oración", icon: Heart },
      { href: "/admin/mensajes", label: "Mensajes de contacto", icon: Mail },
    ],
  },
  {
    title: "Tienda & Donaciones",
    links: [
      { href: "/admin/tienda/productos", label: "Productos y Stock", icon: ShoppingBag },
      { href: "/admin/tienda/categorias", label: "Categorías", icon: Tags },
      { href: "/admin/tienda/inventario", label: "Inventario", icon: Boxes },
      { href: "/admin/tienda/pedidos", label: "Pedidos y Ventas", icon: Layers },
      { href: "/admin/tienda/pagos", label: "Pagos", icon: CreditCard },
      { href: "/admin/donaciones", label: "Diezmos y Ofrendas", icon: Heart },
    ],
  },
  {
    title: "Administración",
    links: [
      { href: "/admin/miembros", label: "Directorio Miembros", icon: Users },
      { href: "/admin/ministerios", label: "Ministerios", icon: Users },
      { href: "/admin/usuarios", label: "Usuarios del sistema", icon: Shield },
      { href: "/admin/roles", label: "Roles y Permisos", icon: Shield },
      { href: "/admin/configuracion", label: "Configuración", icon: Settings },
    ],
  },
] as const;

const churchInitials = churchProfile.shortName
  .split(/\s+/)
  .filter((word) => !["de", "del", "la", "el"].includes(word.toLocaleLowerCase("es")))
  .slice(0, 2)
  .map((word) => word[0]?.toLocaleUpperCase("es") ?? "")
  .join("");

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminBrand() {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <BrandMark className="h-10 w-10 shrink-0 object-contain" />
      <div className="min-w-0">
        <div className="text-sm font-bold leading-tight">{churchProfile.shortName}</div>
        <div className="text-[10px] font-semibold uppercase text-muted-foreground">
          {churchProfile.denomination}
        </div>
      </div>
    </div>
  );
}

function AdminLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useAdminAccess();

  return (
    <nav aria-label="Navegación administrativa" className="space-y-1 text-sm font-medium">
      {adminSections.map((section, sectionIndex) => (
        (() => {
          const visibleLinks = section.links.filter(({ href }) => canAccessAdminPath(role, href));
          if (visibleLinks.length === 0) return null;

          return (
            <section key={section.title} aria-labelledby={`admin-section-${sectionIndex}`}>
              <h2
                id={`admin-section-${sectionIndex}`}
                className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground ${
                  sectionIndex === 0 ? "" : "pt-4"
                }`}
              >
                {section.title}
              </h2>
              <ul className="space-y-1">
                {visibleLinks.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      active
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
              </ul>
            </section>
          );
        })()
      ))}
    </nav>
  );
}

function AdminFooter({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const { role, demoMode } = useAdminAccess();

  async function signOut() {
    const client = getSupabaseBrowserClient();
    try {
      if (client) await client.auth.signOut();
    } catch {
      // Keep navigation available if the network is unavailable during sign-out.
    } finally {
      onNavigate?.();
      router.replace("/login");
    }
  }

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{churchInitials}</div>
          <div>
            <div className="text-xs font-semibold">{demoMode ? "Vista de demostración" : ADMIN_ROLE_LABELS[role]}</div>
            <div className="text-[10px] text-muted-foreground">{demoMode ? "Datos sintéticos" : "Cuenta verificada"}</div>
          </div>
        </div>
        {mobile ? (
          <div className="flex items-center gap-2 [&_button]:!h-11 [&_button]:!w-11">
            <span className="text-xs text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        ) : (
          <ThemeToggle />
        )}
      </div>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <House aria-hidden="true" className="h-3.5 w-3.5" />
        <span>Ir al sitio público</span>
      </Link>
      {!demoMode && (
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Cerrar sesión</span>
        </button>
      )}
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden h-screen min-h-0 w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex min-h-0 flex-1 flex-col gap-5 px-4 pb-3 pt-4">
        <div className="shrink-0">
          <AdminBrand />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <AdminLinks />
        </div>
      </div>
      <div className="shrink-0 px-4 pb-4 pt-2">
        <AdminFooter />
      </div>
    </aside>
  );
}

export function AdminMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir navegación administrativa"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal)] bg-black/45" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-[calc(var(--z-modal)+1)] flex w-[min(20rem,calc(100vw-2.5rem))] flex-col justify-between border-r border-border bg-card p-4 text-foreground shadow-xl focus:outline-none">
          <div className="min-h-0 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <AdminBrand />
                <Dialog.Title className="sr-only">Navegación administrativa</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Accesos a las secciones de administración de la iglesia.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Cerrar navegación"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto pr-1">
              <AdminLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
          <AdminFooter mobile onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
