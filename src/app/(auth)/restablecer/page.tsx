import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { PasswordUpdateForm } from "@/app/(auth)/restablecer/PasswordUpdateForm";

export const metadata: Metadata = {
  title: "Cambiar contraseña administrativa",
  robots: { index: false, follow: false },
};

export default function PasswordUpdatePage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Área administrativa</p>
        <h1 className="mt-2 text-2xl font-bold">Crear una nueva contraseña</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">El enlace de recuperación solo permite cambiar la contraseña de la cuenta que lo solicitó.</p>
        <PasswordUpdateForm />
        <Link href="/login" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver al acceso
        </Link>
      </section>
    </main>
  );
}
