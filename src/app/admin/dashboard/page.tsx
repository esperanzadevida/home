import Link from "next/link";
import { churchProfile } from "@/config/church-profile";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Heart,
  Images,
  LayoutGrid,
  LockKeyhole,
  Boxes,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Users,
  Video,
} from "lucide-react";

const adminModules = [
  {
    category: "Contenido",
    title: "Sermones",
    description: "Organiza los mensajes y recursos de enseñanza.",
    href: "/admin/contenido/sermones",
    icon: Video,
  },
  {
    category: "Contenido",
    title: "Eventos",
    description: "Coordina celebraciones, encuentros y actividades.",
    href: "/admin/contenido/eventos",
    icon: CalendarDays,
  },
  {
    category: "Contenido",
    title: "Blog y noticias",
    description: "Comparte historias, reflexiones y novedades.",
    href: "/admin/contenido/blog",
    icon: FileText,
  },
  {
    category: "Contenido",
    title: "Galería",
    description: "Organiza imágenes y revisa su accesibilidad.",
    href: "/admin/contenido/galeria",
    icon: Images,
  },
  {
    category: "Comunidad",
    title: "Miembros",
    description: "Consulta el directorio y acompaña a cada persona.",
    href: "/admin/miembros",
    icon: Users,
  },
  {
    category: "Comunidad",
    title: "Ministerios",
    description: "Consulta responsables y horarios de reunión.",
    href: "/admin/ministerios",
    icon: Users,
  },
  {
    category: "Comunidad",
    title: "Diezmos y ofrendas",
    description: "Revisa el espacio de administración financiera.",
    href: "/admin/donaciones",
    icon: Heart,
  },
  {
    category: "Recursos",
    title: "Productos",
    description: "Mantén organizado el catálogo de la tienda.",
    href: "/admin/tienda/productos",
    icon: ShoppingBag,
  },
  {
    category: "Recursos",
    title: "Categorías",
    description: "Agrupa y ordena los recursos de la tienda.",
    href: "/admin/tienda/categorias",
    icon: Tags,
  },
  {
    category: "Recursos",
    title: "Inventario",
    description: "Revisa existencias y alertas de stock.",
    href: "/admin/tienda/inventario",
    icon: Boxes,
  },
  {
    category: "Recursos",
    title: "Pedidos",
    description: "Consulta los pedidos y su estado de atención.",
    href: "/admin/tienda/pedidos",
    icon: LayoutGrid,
  },
  {
    category: "Recursos",
    title: "Pagos",
    description: "Consulta transacciones y estado de integración.",
    href: "/admin/tienda/pagos",
    icon: CreditCard,
  },
  {
    category: "Administración",
    title: "Usuarios",
    description: "Revisa los accesos de muestra del equipo.",
    href: "/admin/usuarios",
    icon: ShieldCheck,
  },
  {
    category: "Administración",
    title: "Roles y permisos",
    description: "Define los niveles de acceso del equipo.",
    href: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    category: "Administración",
    title: "Configuración",
    description: "Revisa las preferencias generales del sitio.",
    href: "/admin/configuracion",
    icon: Settings,
  },
] as const;

const summaryCards = [
  { label: "Miembros", value: "248", note: "+12 este mes", icon: Users, tone: "blue" },
  { label: "Eventos del mes", value: "06", note: "2 esta semana", icon: CalendarDays, tone: "violet" },
  { label: "Sermones publicados", value: "38", note: "4 nuevos este mes", icon: Video, tone: "teal" },
  { label: "Ofrendas del mes", value: "$4.820", note: "Acumulado mensual", icon: Heart, tone: "rose" },
  { label: "Pedidos pendientes", value: "03", note: "Requieren seguimiento", icon: ShoppingBag, tone: "amber" },
] as const;

const donationValues = [3200, 4100, 3650, 4920, 4380, 4820];
const donationMonths = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"];
const memberValues = [9, 13, 11, 18, 16, 22];
const memberMonths = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"];

const recentActivity = [
  { title: "Nuevo sermón publicado", detail: "La esperanza que permanece · Pastor Samuel", time: "Hace 18 min", icon: Video },
  { title: "Evento actualizado", detail: "Encuentro de familias · Domingo, 09:00", time: "Hace 2 h", icon: CalendarDays },
  { title: "Nueva nota en el blog", detail: "Servir con alegría · María Fernanda", time: "Ayer", icon: FileText },
];

const upcomingEvents = [
  { day: "DOM", date: "22", month: "NOV", title: "Domingo de bienvenida", time: "09:00 y 11:30 · Sector Ficoa", tag: "Mañana" },
  { day: "DOM", date: "06", month: "DIC", title: "Una tarde para servir", time: "15:00 · Ambato", tag: "En dos semanas" },
  { day: "DOM", date: "20", month: "DIC", title: "Navidad en comunidad", time: "17:00 · Ambato", tag: "En cuatro semanas" },
];

function DonationsChart() {
  const maxValue = 6000;
  const chartHeight = 132;
  const barWidth = 38;
  const gap = 37;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" />
        Ofrendas recibidas
      </div>
      <svg viewBox="0 0 480 174" className="mt-2 w-full overflow-visible" role="img" aria-labelledby="donations-chart-title donations-chart-desc">
        <title id="donations-chart-title">Ofrendas de los últimos seis meses</title>
        <desc id="donations-chart-desc">Junio: 3200 dólares; julio: 4100; agosto: 3650; septiembre: 4920; octubre: 4380; noviembre: 4820.</desc>
        {[0, 1, 2, 3].map((line) => {
          const y = 15 + line * 38;
          return <line key={line} x1="8" x2="470" y1={y} y2={y} className="stroke-border" strokeDasharray="3 5" />;
        })}
        {donationValues.map((value, index) => {
          const height = (value / maxValue) * chartHeight;
          const x = 22 + index * (barWidth + gap);
          const y = 130 - height;
          return (
            <g key={donationMonths[index]}>
              <rect x={x} y={y} width={barWidth} height={height} rx="7" className={index === donationValues.length - 1 ? "fill-primary" : "fill-primary/45"} />
              <text x={x + barWidth / 2} y="155" textAnchor="middle" className="fill-muted-foreground" fontSize="11">{donationMonths[index]}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-end justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Total recibido en noviembre</span>
        <span className="text-lg font-semibold tabular-nums text-foreground">$4.820</span>
      </div>
    </div>
  );
}

function MembersChart() {
  const points = memberValues.map((value, index) => `${38 + index * 80},${126 - value * 4}`).join(" ");

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
        Nuevos miembros
      </div>
      <svg viewBox="0 0 480 174" className="mt-2 w-full overflow-visible" role="img" aria-labelledby="members-chart-title members-chart-desc">
        <title id="members-chart-title">Nuevos miembros de los últimos seis meses</title>
        <desc id="members-chart-desc">Junio: 9; julio: 13; agosto: 11; septiembre: 18; octubre: 16; noviembre: 22.</desc>
        {[0, 1, 2, 3].map((line) => {
          const y = 18 + line * 36;
          return <line key={line} x1="10" x2="470" y1={y} y2={y} className="stroke-border" strokeDasharray="3 5" />;
        })}
        <polyline points={points} fill="none" className="stroke-accent" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {memberValues.map((value, index) => {
          const x = 38 + index * 80;
          const y = 126 - value * 4;
          return (
            <g key={memberMonths[index]}>
              <circle cx={x} cy={y} r="4.5" className="fill-card stroke-accent" strokeWidth="2.5" />
              <text x={x} y="155" textAnchor="middle" className="fill-muted-foreground" fontSize="11">{memberMonths[index]}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-end justify-between gap-2 border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Personas nuevas en noviembre</span>
        <span className="text-lg font-semibold tabular-nums text-foreground">22</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-8">
      <section
        aria-labelledby="admin-dashboard-title"
        className="relative isolate grid gap-8 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/10 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)] xl:items-center xl:p-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full border border-primary/15" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 -z-10 h-52 w-52 rounded-full border border-accent/20" />

        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            Espacio de gestión
          </p>
          <h1 id="admin-dashboard-title" className="mt-4 max-w-[18ch] text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl xl:text-5xl">
            Coordina cada área de servicio desde un solo lugar.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            Accede a las herramientas para compartir el mensaje, cuidar a la comunidad y organizar los recursos de {churchProfile.name}.
          </p>
          <Link href="/admin/contenido/eventos" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            Abrir agenda <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <aside aria-label="Estado de configuración" className="rounded-2xl border border-border bg-background/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
              <LockKeyhole aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-foreground">Panel en preparación</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">La autenticación y la conexión con datos aún están pendientes.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/70 px-3 py-2.5">
              <span className="text-xs text-muted-foreground">Acceso seguro</span><span className="text-xs font-semibold text-foreground">Pendiente</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/70 px-3 py-2.5">
              <span className="text-xs text-muted-foreground">Datos conectados</span><span className="text-xs font-semibold text-foreground">No configurado</span>
            </div>
          </div>
        </aside>
      </section>

      <section aria-labelledby="summary-title" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Vista previa del panel</p>
            <h2 id="summary-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Resumen de la comunidad</h2>
          </div>
          <p className="max-w-lg text-xs leading-5 text-muted-foreground sm:text-right">Indicadores y tendencias de muestra para revisar la presentación del tablero.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map(({ label, value, note, icon: Icon, tone }) => (
            <article key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  tone === "blue" ? "bg-blue-500/10 text-blue-600 dark:text-blue-300" :
                  tone === "violet" ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" :
                  tone === "teal" ? "bg-teal-500/10 text-teal-600 dark:text-teal-300" :
                  tone === "rose" ? "bg-rose-500/10 text-rose-600 dark:text-rose-300" :
                  "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                }`}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums text-foreground">{value}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Tendencias de la comunidad" className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-medium text-muted-foreground">Finanzas</p><h2 className="mt-1 text-base font-semibold">Ofrendas recibidas</h2></div>
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Últimos 6 meses</span>
          </div>
          <DonationsChart />
        </article>
        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-medium text-muted-foreground">Crecimiento</p><h2 className="mt-1 text-base font-semibold">Nuevos miembros</h2></div>
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Últimos 6 meses</span>
          </div>
          <MembersChart />
        </article>
      </section>

      <section aria-label="Actividad y agenda" className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-medium text-muted-foreground">Lo que ocurre</p><h2 className="mt-1 text-base font-semibold">Actividad reciente</h2></div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Activity aria-hidden="true" className="h-4 w-4" /></span>
          </div>
          <ol className="mt-5 space-y-0">
            {recentActivity.map(({ title, detail, time, icon: Icon }, index) => (
              <li key={title} className="relative flex gap-3 pb-5 last:pb-0">
                {index < recentActivity.length - 1 && <span aria-hidden="true" className="absolute left-[17px] top-9 h-[calc(100%-1.75rem)] w-px bg-border" />}
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-sm font-medium text-foreground">{title}</p><time className="text-[11px] text-muted-foreground">{time}</time>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-medium text-muted-foreground">Próximas reuniones</p><h2 className="mt-1 text-base font-semibold">Agenda de la iglesia</h2></div>
            <Link href="/admin/contenido/eventos" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Ver agenda <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
          </div>
          <ul className="mt-5 space-y-3">
            {upcomingEvents.map((event) => (
              <li key={event.title} className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/70 p-3">
                <div className="flex h-[58px] w-[52px] shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-[9px] font-bold tracking-wider">{event.day}</span><span className="text-xl font-semibold leading-none tabular-nums">{event.date}</span><span className="mt-0.5 text-[8px] font-semibold">{event.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-muted-foreground"><Clock3 aria-hidden="true" className="h-3 w-3 shrink-0" />{event.time}</p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-1 text-[10px] font-semibold text-accent-foreground sm:inline-flex"><CheckCircle2 aria-hidden="true" className="h-3 w-3" />{event.tag}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section aria-labelledby="admin-modules-title" className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Navegación rápida</p><h2 id="admin-modules-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Áreas de gestión</h2></div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">Selecciona un área para recorrer su interfaz.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminModules.map(({ category, title, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group flex min-h-40 flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{category}</p>
                <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Los indicadores son una vista de muestra. Las acciones y datos requieren configuración antes de usarse en operación.</p>
    </div>
  );
}
