import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CartButton } from "@/components/shared/CartButton";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { CartProvider } from "@/providers/CartProvider";
import { MobileNavigation } from "@/components/shared/MobileNavigation";
import { MoreNavigation } from "@/components/shared/MoreNavigation";
import { Button } from "@/components/ui/button";
import { churchProfile } from "@/config/church-profile";
import { moreNavigation, publicNavigation } from "@/config/public-pages";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
        >
          Ir al contenido principal
        </a>

        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold tracking-tight text-primary">
                D
              </span>
              <span className="flex flex-col">
                <span className="text-base font-semibold tracking-tight sm:text-lg">
                {churchProfile.name.replace("Iglesia ", "")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {churchProfile.denomination}
              </span>
            </span>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-4 text-[13px] font-medium xl:flex"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ))}
            <MoreNavigation />
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <CartButton />
            <Button asChild size="sm" className="hidden font-semibold sm:inline-flex">
              <Link href="/servicios">
                Planifica tu visita
              </Link>
            </Button>
            <MobileNavigation />
          </div>
        </div>

        <nav
          aria-label="Más secciones"
          className="hidden border-t border-border/50 bg-background/80 xl:hidden lg:block"
        >
          <ul className="mx-auto flex max-w-7xl items-center justify-center gap-5 overflow-x-auto px-6 py-2 text-xs font-medium text-muted-foreground">
            {[...publicNavigation, ...moreNavigation].map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <footer className="border-t border-border bg-card text-card-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] lg:px-10 lg:py-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary">
                D
              </span>
              <span className="text-lg font-semibold">
                {churchProfile.name.replace("Iglesia ", "")}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              {churchProfile.signature} {churchProfile.denomination} en Ambato.
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {churchProfile.city}
            </p>
          </div>

          <nav aria-label="Enlaces principales del pie de página">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Explora
            </h2>
            <ul className="grid gap-3 text-sm">
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

          <nav aria-label="Otros enlaces del pie de página">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Comunidad
            </h2>
            <ul className="grid gap-3 text-sm">
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

          <div className="space-y-4 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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

        <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {churchProfile.name} · {churchProfile.denomination}
        </div>
      </footer>

      <CartDrawer />
    </div>
  </CartProvider>
  );
}
