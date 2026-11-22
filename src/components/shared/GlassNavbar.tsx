"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartButton } from "@/components/shared/CartButton";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { DesktopMegaMenu } from "@/components/shared/DesktopMegaMenu";
import { BrandMark } from "@/components/shared/BrandMark";
import { churchProfile } from "@/config/church-profile";
import { publicNavigation, moreNavigation } from "@/config/public-pages";
import { ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GlassNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        glass-navbar sticky top-0 z-50 w-full transition-[border-color,box-shadow] duration-500 ease-out
        ${scrolled
          ? "glass-navbar--scrolled border-b border-white/[0.08] shadow-[var(--shadow-public-header)] dark:shadow-[var(--shadow-public-header-dark)]"
          : "border-b border-transparent"
        }
      `}
    >
      {/* Glass backdrop layer */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0 transition-[background-color,backdrop-filter] duration-500
          ${scrolled
            ? "bg-background/70 backdrop-blur-2xl backdrop-saturate-[1.8] dark:bg-background/60"
            : "bg-background/95 dark:bg-background/90"
          }
        `}
      />

      {/* Subtle top-line accent */}
      <div
        aria-hidden="true"
        className={`
          absolute inset-x-0 top-0 h-[1px] transition-opacity duration-500
          bg-gradient-to-r from-transparent via-primary/40 to-transparent
          ${scrolled ? "opacity-100" : "opacity-0"}
        `}
      />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 max-[359px]:gap-2 max-[359px]:px-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80 max-[359px]:gap-1"
        >
          {/* Logo mark */}
          <BrandMark className="h-10 w-10 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.04]" />
          <span className="flex max-w-[132px] flex-col leading-tight max-[359px]:max-w-[76px]">
            <span className="text-[14px] font-bold tracking-tight text-foreground sm:text-[15px]">
              {churchProfile.shortName}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground max-[359px]:hidden">
              {churchProfile.denomination}
            </span>
          </span>
        </Link>

        <DesktopMegaMenu />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 max-[359px]:gap-0.5 sm:gap-2">
          <NotificationCenter />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground hover:bg-muted sm:hidden"
            aria-label="Recargar página"
            title="Recargar página"
            onClick={() => window.location.reload()}
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <CartButton />

          {/* Match the primary visit action to the home hero. */}
          <Link
            href="/servicios"
            className="
              hidden min-h-10 items-center gap-2 rounded-none border border-accent
              bg-accent px-4 text-sm font-semibold text-accent-ink shadow-none
              transition-colors hover:bg-accent/90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              sm:inline-flex
            "
          >
            Planifica tu visita
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Tablet secondary nav bar */}
      <nav
        aria-label="Navegación secundaria"
        className="relative hidden border-t border-white/[0.06] lg:block xl:hidden dark:border-white/[0.04]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-foreground/[0.02] dark:bg-white/[0.02]"
        />
        <ul className="relative mx-auto grid max-w-7xl grid-cols-6 items-center justify-items-center gap-x-1 gap-y-0.5 px-6 py-2">
          {[...publicNavigation, ...moreNavigation].map((item) => (
            <li key={item.href} className="w-full">
              <Link
                href={item.href}
                className={`
                  flex justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  ${isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
