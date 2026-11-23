import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { CartProvider } from "@/providers/CartProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { GlassNavbar } from "@/components/shared/GlassNavbar";
import { BrandMark } from "@/components/shared/BrandMark";
import { MobileNavigation } from "@/components/shared/MobileNavigation";
import { ToastViewport } from "@/components/shared/ToastViewport";
import { churchProfile } from "@/config/church-profile";
import { eventDetails } from "@/config/content-details";
import { publicNavigation, moreNavigation } from "@/config/public-pages";

const editorialDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth", "opsz"],
  variable: "--font-editorial-display",
  display: "optional",
});

const editorialReading = Source_Serif_4({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-editorial-reading",
  display: "optional",
});

const notificationEvents = Object.entries(eventDetails).map(([slug, event]) => ({
  slug,
  title: event.title,
  description: event.meta,
  href: `/eventos/${slug}`,
  startDates: event.startDates ?? [],
}));

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider events={notificationEvents}>
      <CartProvider>
        <div
          className={editorialDisplay.variable + " " + editorialReading.variable + " public-shell public-shell-with-mobile-navigation flex min-h-screen flex-col"}
        >
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
        >
          Ir al contenido principal
        </a>

        <GlassNavbar />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring"
        >
          {children}
        </main>

        <footer className="relative border-t border-border/50 bg-card/80 text-card-foreground backdrop-blur-xl">
          {/* Subtle top gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />

          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:px-10 lg:py-16">
            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BrandMark className="h-9 w-9 shrink-0 object-contain" />
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight">{churchProfile.shortName}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {churchProfile.denomination}
                  </span>
                </div>
              </div>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                {churchProfile.signature} {churchProfile.denomination} en Ambato.
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {churchProfile.city.replaceAll(/\s+\u00b7\s+/g, ", ")}
              </p>
              <Button
                asChild
                variant="outline"
                className="min-h-11 border-primary/20 bg-background/70 text-foreground hover:border-primary/40 hover:bg-primary/5"
              >
                <Link href="/login">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" />
                  Acceso administrativo
                </Link>
              </Button>
            </div>

            {/* Explore */}
            <nav aria-label="Enlaces principales del pie de página">
              <h2 className="mb-4 text-xs font-semibold text-muted-foreground">
                Explora
              </h2>
              <ul className="grid gap-2.5 text-sm">
                {publicNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Community */}
            <nav aria-label="Otros enlaces del pie de página">
              <h2 className="mb-4 text-xs font-semibold text-muted-foreground">
                Comunidad
              </h2>
              <ul className="grid gap-2.5 text-sm">
                {moreNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Visit */}
            <div className="space-y-4 text-sm">
              <h2 className="text-xs font-semibold text-muted-foreground">
                Visítanos
              </h2>
              <address className="not-italic leading-6 text-muted-foreground">
                {churchProfile.address}
              </address>
              <p className="leading-6 text-muted-foreground">{churchProfile.phone}</p>
              <ul className="space-y-2 pt-1">
                {churchProfile.schedule.map((service) => (
                  <li key={service.days} className="flex flex-wrap justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">{service.days}</span>
                    <span className="font-medium tabular-nums text-card-foreground">
                      {service.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-border/40 px-5 py-5 sm:px-8">
            <div className="mx-auto grid max-w-7xl gap-3 text-sm leading-6 text-muted-foreground">
              <p className="text-xs">
                © {new Date().getFullYear()} {churchProfile.name}. {churchProfile.denomination}.
              </p>
            </div>
          </div>
        </footer>

          <MobileNavigation />
          <CartDrawer />
          <ToastViewport />
        </div>
      </CartProvider>
    </NotificationProvider>
  );
}
