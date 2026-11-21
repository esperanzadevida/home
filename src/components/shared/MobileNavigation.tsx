"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Heart,
  Home,
  Images,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Music,
  Newspaper,
  Radio,
  ShoppingBag,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { churchProfile } from "@/config/church-profile";
import { mobileMoreSections, mobilePrimaryNavigation } from "@/config/public-pages";
import { MobileNavigationItem } from "@/components/shared/MobileNavigationItem";

const navIcons: Record<string, LucideIcon> = {
  "/": Home,
  "/nosotros": Users,
  "/servicios": MapPin,
  "/sermones": BookOpen,
  "/eventos": CalendarDays,
  "/ministerios": Music,
  "/contacto": MessageCircle,
  "/blog": Newspaper,
  "/tienda": ShoppingBag,
  "/galeria": Images,
  "/donaciones": Heart,
  "/oracion": Heart,
  "/en-vivo": Radio,
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const focusMainAfterClose = useRef(false);
  const previousPathname = useRef(pathname);
  const moreIsActive = !mobilePrimaryNavigation.some((item) => isRouteActive(pathname, item.href));

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (isMoreOpen) {
      focusMainAfterClose.current = true;
      setIsMoreOpen(false);
    }
  }, [isMoreOpen, pathname]);

  const handleCloseAutoFocus = (event: Event) => {
    if (!focusMainAfterClose.current) return;
    event.preventDefault();
    focusMainAfterClose.current = false;
    requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  };

  return (
    <nav className="mobile-navigation-viewport" aria-label="Navegación móvil">
      <ul className="mobile-navigation-bar">
        {mobilePrimaryNavigation.map((item) => {
          const Icon = navIcons[item.href] ?? ChevronRight;
          return (
            <li key={item.href}>
              <MobileNavigationItem
                href={item.href}
                label={item.label}
                icon={Icon}
                active={isRouteActive(pathname, item.href)}
                variant="tab"
              />
            </li>
          );
        })}
        <li>
          <Dialog.Root open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={`mobile-navigation-link${moreIsActive ? " is-active" : ""}`}
                aria-expanded={isMoreOpen}
                aria-haspopup="dialog"
                aria-current={moreIsActive ? "page" : undefined}
              >
                <MoreHorizontal aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span>Más</span>
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="mobile-navigation-overlay" />
              <Dialog.Content
                className="mobile-navigation-sheet"
                onCloseAutoFocus={handleCloseAutoFocus}
              >
                <header className="mobile-navigation-sheet-header">
                  <span className="mobile-navigation-brand-mark" aria-hidden="true">
                    <BrandMark className="h-5 w-5 object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Dialog.Title className="mobile-navigation-sheet-title">
                      Explora {churchProfile.shortName}
                    </Dialog.Title>
                    <Dialog.Description className="mobile-navigation-sheet-description">
                      Secciones y recursos de la comunidad.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button type="button" className="mobile-navigation-close" aria-label="Cerrar menú">
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </header>

                <div className="mobile-navigation-sheet-body">
                  {mobileMoreSections.map((section) => (
                    <section key={section.label} aria-labelledby={`mobile-more-${section.label}`}>
                      <h3 id={`mobile-more-${section.label}`} className="mobile-navigation-section-title">
                        {section.label}
                      </h3>
                      <ul className="mobile-navigation-menu-list">
                        {section.items.map((item) => {
                          const Icon = navIcons[item.href] ?? ChevronRight;
                          const active = isRouteActive(pathname, item.href);
                          return (
                            <li key={item.href}>
                              <Dialog.Close asChild>
                                <MobileNavigationItem
                                  href={item.href}
                                  label={item.label}
                                  icon={Icon}
                                  active={active}
                                  variant="menu"
                                  onClick={() => {
                                    focusMainAfterClose.current = !isRouteActive(pathname, item.href);
                                  }}
                                />
                              </Dialog.Close>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>

                <div className="mobile-navigation-sheet-footer">
                  <Dialog.Close asChild>
                    <Link
                      href="/servicios"
                      className="mobile-navigation-visit-link"
                      onClick={() => {
                        focusMainAfterClose.current = !isRouteActive(pathname, "/servicios");
                      }}
                    >
                      Planifica tu visita
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
      </ul>
    </nav>
  );
}
