import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        >
          <Compass className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Error 404</p>
        <h1 id="not-found-title" className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          Puede que el enlace haya cambiado o que la dirección esté escrita de otra forma.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contacto">Contactar con la iglesia</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
