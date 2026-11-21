import Link from "next/link";
import type { Metadata } from "next";
import { Info } from "lucide-react";
import { AdminMobileMenu, AdminSidebar } from "@/components/admin/AdminNavigation";
import { churchProfile } from "@/config/church-profile";

export const metadata: Metadata = {
  title: "Administración",
  description: `Panel de demostración local de ${churchProfile.name}. Sin autenticación ni almacenamiento de servidor.`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <a
        href="#admin-main-content"
        className="sr-only z-[60] rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
      >
        Ir al contenido principal
      </a>
      <AdminSidebar />

      {/* Área Principal de Contenido del Admin */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <AdminMobileMenu />
            <h2 className="truncate text-base font-bold sm:text-lg">Gestión de la Iglesia</h2>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-2 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3"
            >
              <span className="sm:hidden">Ver sitio ↗</span>
              <span className="hidden sm:inline">Ver sitio público ↗</span>
            </Link>
          </div>
        </header>

        <main id="admin-main-content" tabIndex={-1} className="w-full flex-1 space-y-5 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring sm:p-6 lg:p-8">
          <aside className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-xs leading-relaxed text-foreground sm:text-sm" aria-label="Estado de demostración del panel">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p><strong>Panel de demostración.</strong> No hay autenticación ni almacenamiento de servidor. El blog y la configuración general guardan borradores solo en este navegador; las demás pantallas usan datos de muestra. Ninguna acción local modifica el sitio público ni envía mensajes o pagos.</p>
          </aside>
          {children}
        </main>
      </div>
    </div>
  );
}
