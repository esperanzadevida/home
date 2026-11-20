"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Flame,
  Home,
  Users,
  Calendar,
  BookOpen,
  Music,
  Heart,
  MapPin,
  ShoppingBag,
  Image as ImageIcon,
  Radio,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import { publicNavigation, moreNavigation } from "@/config/public-pages";

const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/nosotros": Users,
  "/servicios": MapPin,
  "/sermones": BookOpen,
  "/eventos": Calendar,
  "/ministerios": Music,
  "/contacto": MessageCircle,
  "/blog": Newspaper,
  "/tienda": ShoppingBag,
  "/galeria": ImageIcon,
  "/donaciones": Heart,
  "/oracion": Heart,
  "/en-vivo": Radio,
};

export function MobileNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="lg:hidden">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex h-10 w-10 items-center justify-center rounded-xl
          text-foreground transition-colors
          hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        "
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop + Slide-over panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" id="mobile-nav-panel">
          {/* Glass backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in-0 duration-300"
            onClick={close}
            aria-hidden="true"
          />

          {/* Panel */}
          <nav
            aria-label="Navegación móvil"
            className="
              absolute inset-y-0 right-0 flex w-[min(22rem,85svw)] flex-col
              animate-in slide-in-from-right duration-300 ease-out
              border-l border-white/[0.08]
              bg-background/80 backdrop-blur-2xl backdrop-saturate-[1.8]
              dark:bg-background/70
            "
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Flame className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">Doménica</span>
              </div>
              <button
                onClick={close}
                className="
                  flex h-9 w-9 items-center justify-center rounded-xl
                  text-muted-foreground transition-colors
                  hover:bg-foreground/[0.06] hover:text-foreground
                  dark:hover:bg-white/[0.08]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                "
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              {/* Home link */}
              <Link
                href="/"
                onClick={close}
                className={`
                  mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  ${pathname === "/"
                    ? "bg-primary/10 text-primary dark:bg-primary/15"
                    : "text-foreground/80 hover:bg-foreground/[0.05] dark:hover:bg-white/[0.06]"
                  }
                `}
              >
                <Home className="h-4 w-4 shrink-0 opacity-60" />
                Inicio
                {pathname === "/" && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                )}
              </Link>

              {/* Primary nav */}
              <div className="mb-2 mt-3 px-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Explorar
                </span>
              </div>
              <ul className="grid gap-0.5">
                {publicNavigation.map((item) => {
                  const Icon = navIcons[item.href] || ChevronRight;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`
                          flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                          ${active
                            ? "bg-primary/10 text-primary dark:bg-primary/15"
                            : "text-foreground/80 hover:bg-foreground/[0.05] dark:hover:bg-white/[0.06]"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-60" />
                        {item.label}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

              {/* Secondary nav */}
              <div className="mb-2 px-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  Comunidad
                </span>
              </div>
              <ul className="grid gap-0.5">
                {moreNavigation.map((item) => {
                  const Icon = navIcons[item.href] || ChevronRight;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`
                          flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                          ${active
                            ? "bg-primary/10 text-primary dark:bg-primary/15"
                            : "text-foreground/80 hover:bg-foreground/[0.05] dark:hover:bg-white/[0.06]"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-60" />
                        {item.label}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Panel footer CTA */}
            <div className="border-t border-white/[0.06] p-4 dark:border-white/[0.04]">
              <Link
                href="/servicios"
                onClick={close}
                className="
                  group/cta relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl
                  bg-primary py-3 text-sm font-semibold text-primary-foreground
                  shadow-lg shadow-primary/25 transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/30 hover:brightness-110
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                "
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                />
                <Flame className="relative h-4 w-4" />
                <span className="relative">Planifica tu visita</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
