export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Cargando página"
      className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
        <p role="status" className="sr-only">
          Cargando contenido. Espera un momento.
        </p>
        <div aria-hidden="true" className="animate-pulse space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-muted" />
          <div className="mx-auto h-3 w-20 rounded bg-muted" />
          <div className="mx-auto h-8 w-3/4 rounded bg-muted" />
          <div className="mx-auto h-4 w-full max-w-sm rounded bg-muted" />
          <div className="mx-auto h-4 w-2/3 rounded bg-muted" />
          <div className="mx-auto flex max-w-xs gap-3 pt-2">
            <div className="h-10 flex-1 rounded-xl bg-muted" />
            <div className="h-10 flex-1 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
