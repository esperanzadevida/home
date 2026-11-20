"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6">
      <section
        aria-labelledby="error-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
        >
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 id="error-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Algo salió mal
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          No pudimos cargar esta página. Puedes intentarlo de nuevo o volver al inicio.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Intentar de nuevo
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
