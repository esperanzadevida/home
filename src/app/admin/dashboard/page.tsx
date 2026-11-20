export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Administración
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Panel en preparación
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Esta vista todavía no tiene inicio de sesión ni conexión a datos. Los módulos se habilitarán después de definir el alcance y configurar el backend.
        </p>
      </div>

      <section
        aria-label="Estado de la administración"
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-card-foreground">Acceso</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Autenticación y permisos pendientes. No ingreses credenciales en esta vista de prototipo.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-card-foreground">Datos</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sin métricas, miembros, pedidos, donaciones ni eventos conectados. El dashboard se construirá con datos reales cuando estén disponibles.
          </p>
        </div>
      </section>
    </div>
  );
}
