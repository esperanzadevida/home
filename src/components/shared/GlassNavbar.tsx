"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartButton } from "@/components/shared/CartButton";
import { MobileNavigation } from "@/components/shared/MobileNavigation";
import { churchProfile } from "@/config/church-profile";
import { publicNavigation, moreNavigation } from "@/config/public-pages";
import {
  ChevronDown,
  Flame,
} from "lucide-react";

export function GlassNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close "Más" dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // close "Más" on click outside
  useEffect(() => {
    if (!moreOpen) return;
    const handler = () => setMoreOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [moreOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className={`
        glass-navbar sticky top-0 z-50 w-full transition-all duration-500 ease-out
        ${scrolled
          ? "glass-navbar--scrolled border-b border-white/[0.08] shadow-[0_1px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_32px_rgba(0,0,0,0.3)]"
          : "border-b border-transparent"
        }
      `}
    >
      {/* Glass backdrop layer */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-0 transition-all duration-500
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

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
        >
          {/* Logo mark */}
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-[1.04]">
            <Flame className="h-5 w-5 drop-shadow-sm" />
            {/* Subtle inner shine */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-white/20"
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              Doménica
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {churchProfile.denomination}
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center xl:flex"
        >
          <ul className="flex items-center gap-1">
            {publicNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group/link relative flex items-center px-3.5 py-2 text-[13px] font-medium transition-colors duration-200
                    rounded-lg
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {item.label}
                  {/* Active indicator pill */}
                  {isActive(item.href) && (
                    <span
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                    />
                  )}
                  {/* Hover glass pill */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-foreground/[0.04] opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 dark:bg-white/[0.06]"
                  />
                </Link>
              </li>
            ))}

            {/* "Más" dropdown */}
            <li className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreOpen(!moreOpen);
                }}
                className={`
                  group/more relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${moreNavigation.some((m) => isActive(m.href))
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
                aria-expanded={moreOpen}
                aria-haspopup="true"
              >
                Más
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg bg-foreground/[0.04] opacity-0 transition-opacity duration-200 group-hover/more:opacity-100 dark:bg-white/[0.06]"
                />
              </button>

              {/* Dropdown panel */}
              {moreOpen && (
                <div
                  className="
                    absolute right-0 top-[calc(100%+8px)] z-50 w-56 origin-top-right
                    animate-in fade-in-0 zoom-in-95 slide-in-from-top-2
                    rounded-xl border border-white/[0.12] bg-background/80 p-1.5
                    shadow-xl shadow-black/[0.08] backdrop-blur-2xl backdrop-saturate-150
                    dark:border-white/[0.08] dark:bg-background/70 dark:shadow-black/[0.3]
                  "
                >
                  <ul className="grid gap-0.5">
                    {moreNavigation.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`
                            flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                            ${isActive(item.href)
                              ? "bg-primary/10 text-primary dark:bg-primary/15"
                              : "text-foreground/80 hover:bg-foreground/[0.05] hover:text-foreground dark:hover:bg-white/[0.06]"
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <CartButton />

          {/* CTA button with glass effect */}
          <Link
            href="/servicios"
            className="
              group/cta relative hidden items-center gap-2 overflow-hidden rounded-full
              bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground
              shadow-lg shadow-primary/25 transition-all duration-300
              hover:shadow-xl hover:shadow-primary/30 hover:brightness-110
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
              sm:inline-flex
            "
          >
            {/* Shimmer effect */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
            />
            <span className="relative">Visítanos</span>
          </Link>

          <MobileNavigation />
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
        <ul className="relative mx-auto flex max-w-7xl items-center justify-center gap-1 overflow-x-auto px-6 py-1.5">
          {[...publicNavigation, ...moreNavigation].map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className={`
                  rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200
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
