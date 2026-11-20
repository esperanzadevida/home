"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { moreNavigation } from "@/config/public-pages";

export function MoreNavigation() {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  return (
    <details ref={menuRef} className="group relative">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-1 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        Más
        <ChevronDown
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
        />
      </summary>
      <nav
        aria-label="Más secciones"
        className="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-56 rounded-2xl border border-border bg-background p-2 shadow-xl"
      >
        <ul className="grid gap-1">
          {moreNavigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-10 items-center rounded-xl px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
