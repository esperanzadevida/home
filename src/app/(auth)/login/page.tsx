import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { BrandMark } from "@/components/shared/BrandMark";
import { churchProfile } from "@/config/church-profile";

export const metadata: Metadata = {
  title: "Acceso administrativo",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(80%,64rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/70 to-transparent"
      />

      <main className="relative mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl sm:min-h-[calc(100dvh-5rem)] lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative isolate flex min-h-64 flex-col justify-between overflow-hidden bg-[#0b1b13] p-6 text-white sm:p-9 lg:min-h-0 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 -z-10 h-48 w-48 rounded-full border border-accent/30"
          />

          <div className="relative flex items-center gap-3">
            <BrandMark className="h-12 w-12 shrink-0 object-contain" />
            <div>
              <p className="text-sm font-semibold leading-tight">{churchProfile.name}</p>
              <p className="mt-1 text-xs text-white/65">{churchProfile.denomination}</p>
            </div>
          </div>

          <div className="relative mt-9 max-w-lg sm:mt-12 lg:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Coordinación y servicio
            </p>
            <h2 className="mt-4 max-w-[15ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Una comunidad, muchas formas de servir.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Un espacio para organizar la enseñanza, acompañar a las personas y cuidar cada área de
              la iglesia.
            </p>
          </div>

          <div className="relative mt-8 flex items-center justify-between gap-3 border-t border-white/15 pt-4 text-[11px] font-medium uppercase tracking-[0.13em] text-white/60 sm:text-xs">
            <span>{churchProfile.city}</span>
            <span className="text-accent">{churchProfile.denomination}</span>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Acceso en preparación
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Área administrativa
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Un espacio preparado para servir mejor.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              El acceso estará disponible cuando la autenticación y los permisos estén configurados.
              Estamos cuidando esa base antes de habilitar el ingreso.
            </p>

            <div
              role="status"
              className="mt-7 flex gap-3 rounded-2xl border border-border bg-background p-4 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Todavía no ingreses tus credenciales</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Esta página aún no autentica cuentas ni guarda contraseñas.
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
              <span>El acceso seguro se habilitará junto con la gestión de permisos.</span>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Volver al sitio público
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
