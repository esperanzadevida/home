import Link from "next/link";
import { Bricolage_Grotesque, Source_Serif_4 } from "next/font/google";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { CartProvider } from "@/providers/CartProvider";
import { GlassNavbar } from "@/components/shared/GlassNavbar";
import { churchProfile } from "@/config/church-profile";
import { publicNavigation, moreNavigation } from "@/config/public-pages";

const editorialDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth", "opsz"],
  variable: "--font-editorial-display",
});

const editorialReading = Source_Serif_4({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-editorial-reading",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div
        className={editorialDisplay.variable + " " + editorialReading.variable + " public-shell flex min-h-screen flex-col"}
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
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-sm text-primary-foreground shadow-lg shadow-primary/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight">Doménica</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
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
            </div>

            {/* Explore */}
            <nav aria-label="Enlaces principales del pie de página">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
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
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
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
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
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
              <p data-credits className="font-display text-sm">
                Fotografía:{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:PalouseFromSteptoeButteMay2023-2.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Caleb Riston, Wikimedia Commons
                </a>. Licencia:{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  CC BY 4.0
                </a>
              </p>
              <p className="text-xs">
                © {new Date().getFullYear()} {churchProfile.name}. {churchProfile.denomination}.
              </p>
            </div>
          </div>
        </footer>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
