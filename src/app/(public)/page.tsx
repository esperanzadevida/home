import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Play,
  ArrowRight,
  Flame,
  ShieldCheck,
  Heart,
  Calendar as CalendarIcon,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  MOCK_SERMONS,
  MOCK_EVENTS,
  MOCK_PRODUCTS,
  MOCK_PRAYERS,
  MOCK_MINISTRIES,
  CHURCH_INFO,
} from "@/constants/data";
import { SermonCard } from "@/components/cards/SermonCard";
import { EventCard } from "@/components/cards/EventCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { PrayerCard } from "@/components/cards/PrayerCard";
import { CalendarPicker } from "@/components/shared/CalendarPicker";
import { MapSection } from "@/components/media/MapSection";
import { ContextMenuWrapper } from "@/components/shared/ContextMenuWrapper";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* ========================================================
          1. HERO SECTION (Cinematográfico, /10k-websites)
         ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-border/40">
        {/* Imagen Conceptual 8K de Fondo con Overlay Gradiente */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 dark:opacity-35 transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/hero/hero-cinematic-main.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background z-0" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6 pt-12">
          {/* Badge institucional */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            <Flame className="w-3.5 h-3.5 text-secondary animate-pulse" />
            <span>Asambleas de Dios — 100+ Años de Fe Pentecostal</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] text-foreground">
            Un lugar de encuentro con la{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              presencia de Dios
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Somos una familia que adora en el poder del Espíritu Santo, crece en la Palabra y transforma su ciudad con amor compasivo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/servicios">
              <Button size="lg" className="shadow-lg shadow-primary/25 font-semibold text-base">
                Planifica tu visita este domingo
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/sermones">
              <Button variant="outline" size="lg" className="gap-2 font-semibold text-base backdrop-blur-sm">
                <Play className="w-4 h-4 fill-current text-primary" />
                Ver último sermón
              </Button>
            </Link>
          </div>

          {/* Horarios rápidos en el Hero */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-border/50">
            {CHURCH_INFO.services.slice(0, 4).map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-left"
              >
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {s.day}
                </div>
                <div className="text-sm font-bold text-foreground mt-1">{s.time}</div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SECCIÓN: 4 PILARES DOCTRINALES DE ASAMBLEAS DE DIOS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Nuestros Fundamentos Bíblicos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">
            Las 4 Doctrinas Cardinales
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            La esencia bíblica inquebrantable que sostiene nuestro ministerio desde 1914.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              ✝
            </div>
            <h3 className="font-bold text-lg text-foreground">1. Salvación</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Mediante la gracia de Dios por medio de la fe en Jesucristo, quien dio Su vida por el perdón de nuestros pecados.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-secondary/50 transition-all hover:-translate-y-1 group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
              🔥
            </div>
            <h3 className="font-bold text-lg text-foreground">2. Espíritu Santo</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              El bautismo en el Espíritu Santo con la evidencia bíblica de hablar en lenguas para recibir poder de testimonio.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:-translate-y-1 group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              🕊
            </div>
            <h3 className="font-bold text-lg text-foreground">3. Sanidad Divina</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              La sanidad provista en la expiación de Cristo en la cruz como respuesta soberana a la oración de fe.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              👑
            </div>
            <h3 className="font-bold text-lg text-foreground">4. Segunda Venida</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              La esperanza bienaventurada: el regreso inminente y glorioso de Cristo para reinar eternamente con Su Iglesia.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SECCIÓN: ÚLTIMOS SERMONES Y MENSAJES (Multimedia)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Alimento para el Alma
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
              Últimas Predicaciones
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escucha o mira las enseñanzas bíblicas de nuestros cultos dominicales.
            </p>
          </div>
          <Link href="/sermones">
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
              Ver Archivo Completo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_SERMONS.map((sermon) => (
            <ContextMenuWrapper key={sermon.id}>
              <SermonCard sermon={sermon} />
            </ContextMenuWrapper>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. SECCIÓN: CALENDARIO INTERACTIVO Y PRÓXIMOS EVENTOS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              Vida Comunitaria
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
              Calendario de Actividades
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Elige un día en el calendario o inscríbete en nuestros próximos congresos.
            </p>
          </div>
          <Link href="/eventos">
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
              Todos los Eventos <CalendarIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendario con selección de fecha */}
          <div className="lg:col-span-5">
            <CalendarPicker />
          </div>

          {/* Cards de Eventos Destacados */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MOCK_EVENTS.slice(0, 2).map((event) => (
              <ContextMenuWrapper key={event.id}>
                <EventCard event={event} />
              </ContextMenuWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECCIÓN: MINISTERIOS EMBLEMÁTICOS DE ASAMBLEAS DE DIOS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            Un Lugar para Cada Etapa
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-foreground">
            Ministerios de Nuestra Casa
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Desde la niñez hasta la edad madura, hay un grupo de conexión diseñado para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_MINISTRIES.map((min) => (
            <div
              key={min.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={min.coverImage}
                  alt={min.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                  {min.schedule}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {min.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {min.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                  Líder: <strong className="text-foreground">{min.leader}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. SECCIÓN: TIENDA ONLINE Y RECURSOS
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Librería Cristiana y Merchandising
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
              Recursos para el Crecimiento Espiritual
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Biblias de estudio, literatura bíblica y prendas que sostienen nuestras obras misioneras.
            </p>
          </div>
          <Link href="/tienda">
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
              Ver Tienda Completa <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((prod) => (
            <ContextMenuWrapper key={prod.id}>
              <ProductCard product={prod} />
            </ContextMenuWrapper>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. SECCIÓN: MURO INTERACTIVO DE ORACIÓN (Prayer Wall)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-card via-card to-primary/5 border border-border space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Intercesión Comunitaria
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                Muro de Oración en Tiempo Real
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                La iglesia ora unida por tus necesidades. Haz clic en *"He orado por ti"* para levantar las manos de un hermano.
              </p>
            </div>
            <Link href="/oracion">
              <Button variant="secondary" className="gap-2 font-semibold">
                <Heart className="w-4 h-4 fill-current" />
                Enviar Mi Petición
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PRAYERS.map((prayer) => (
              <PrayerCard key={prayer.id} prayer={prayer} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. SECCIÓN: MAPA Y CÓMO LLEGAR (MapLibre Engine)
         ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Ubicación y Sedes
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
            Encuentra Nuestra Casa
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Te esperamos con los brazos abiertos en cualquiera de nuestros servicios presenciales.
          </p>
        </div>

        <MapSection />
      </section>
    </div>
  );
}
