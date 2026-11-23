import Link from "next/link";
import type { Metadata } from "next";
import { AdminMobileMenu, AdminSidebar, AdminWorkspaceTitle } from "@/components/admin/AdminNavigation";
import { AdminAuthGate, AdminAccessNotice } from "@/components/admin/AdminAuthGate";
import { churchProfile } from "@/config/church-profile";

export const metadata: Metadata = {
  title: "Administración",
  description: `Panel administrativo de ${churchProfile.name}.`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen flex bg-background text-foreground">
        <a
          href="#admin-main-content"
          className="sr-only z-[60] rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
        >
          Ir al contenido principal
        </a>
        <AdminSidebar />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <AdminMobileMenu />
              <h2 className="truncate text-base font-bold sm:text-lg"><AdminWorkspaceTitle /></h2>
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
            <AdminAccessNotice />
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGate>
  );
}
