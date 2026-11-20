"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { moreNavigation, publicNavigation } from "@/config/public-pages";

export function MobileNavigation() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
  }

  return (
    <details ref={menuRef} className="group relative lg:hidden">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <Menu aria-hidden="true" className="h-5 w-5 group-open:hidden" />
        <X aria-hidden="true" className="hidden h-5 w-5 group-open:block" />
        <span className="sr-only">Abrir o cerrar navegación</span>
      </summary>
      <nav
        aria-label="Navegación móvil"
        className="absolute right-0 top-[calc(100%+0.75rem)] z-50 max-h-[calc(100dvh-6rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-border bg-background p-3 shadow-xl"
      >
        <ul className="grid gap-1">
          {publicNavigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Comunidad
          </li>
          {moreNavigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/servicios"
              onClick={closeMenu}
              className="flex min-h-11 items-center rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Planifica tu visita
            </Link>
          </li>
        </ul>
      </nav>
    </details>
  );
}
