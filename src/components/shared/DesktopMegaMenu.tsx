"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { churchProfile } from "@/config/church-profile";
import {
  desktopMegaMenuSections,
  moreNavigation,
  publicNavigation,
} from "@/config/public-pages";

function isRouteActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopMegaMenu() {
  const pathname = usePathname();
  const [activeValue, setActiveValue] = useState("");
  const moreIsActive = moreNavigation.some((item) => isRouteActive(pathname, item.href));

  useEffect(() => {
    setActiveValue("");
  }, [pathname]);

  return (
    <NavigationMenu.Root
      aria-label="Navegación principal"
      className="desktop-navigation-root"
      value={activeValue}
      onValueChange={setActiveValue}
      delayDuration={140}
      skipDelayDuration={260}
      activationMode="automatic"
    >
      <NavigationMenu.List className="desktop-navigation-list">
        {publicNavigation.map((item) => {
          const active = isRouteActive(pathname, item.href);

          return (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link asChild active={active}>
                <Link
                  href={item.href}
                  className={`desktop-navigation-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}

        <NavigationMenu.Item value="more" className="desktop-navigation-more-item">
          <NavigationMenu.Trigger
            className={`desktop-navigation-link desktop-navigation-trigger${moreIsActive ? " is-active" : ""}`}
            aria-current={moreIsActive ? "page" : undefined}
            data-current={moreIsActive ? "true" : undefined}
          >
            Más
            <ChevronDown aria-hidden="true" className="desktop-navigation-chevron" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="desktop-navigation-content">
            <div className="desktop-mega-menu-panel">
              {desktopMegaMenuSections.map((section) => (
                <section
                  key={section.label}
                  className="desktop-mega-menu-section"
                  aria-labelledby={`desktop-mega-${section.label.toLowerCase()}`}
                >
                  <h2
                    id={`desktop-mega-${section.label.toLowerCase()}`}
                    className="desktop-mega-menu-heading"
                  >
                    {section.label}
                  </h2>
                  <ul className="desktop-mega-menu-links">
                    {section.items.map((item) => {
                      const active = isRouteActive(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <NavigationMenu.Link
                            asChild
                            active={active}
                            onSelect={() => setActiveValue("")}
                          >
                            <Link
                              href={item.href}
                              className="desktop-mega-menu-link"
                              aria-current={active ? "page" : undefined}
                            >
                              <span>{item.label}</span>
                              <ArrowUpRight aria-hidden="true" className="desktop-mega-menu-link-icon" />
                            </Link>
                          </NavigationMenu.Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}

              <NavigationMenu.Link asChild onSelect={() => setActiveValue("")}>
                <Link href="/servicios" className="desktop-mega-visit-card">
                  <span className="desktop-mega-visit-icon" aria-hidden="true">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="desktop-mega-visit-copy">
                    <span className="desktop-mega-visit-title">Planifica tu visita</span>
                    <span className="desktop-mega-visit-signature">{churchProfile.signature}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="desktop-mega-visit-arrow" />
                </Link>
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="desktop-navigation-viewport" />
    </NavigationMenu.Root>
  );
}
