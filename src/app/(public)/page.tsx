import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Clock3, HeartHandshake, MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { churchProfile } from "@/config/church-profile";
import { eventDetails, sermonDetails } from "@/config/content-details";
import { publicPageBlueprints } from "@/config/public-pages";
import { createPageMetadata } from "@/lib/page-metadata";

const [latestSermonSlug, latestSermon] = Object.entries(sermonDetails)[0];
const upcomingEvents = Object.entries(eventDetails).slice(0, 3);
const ministryRooms = publicPageBlueprints.ministerios.sections[0].cards;
const displayCity = churchProfile.city.replaceAll(/\s+\u00b7\s+/g, ", ");
const latestSermonMeta = latestSermon.meta
  .replaceAll(/(\d+):(\d+)\u2013(\d+)/g, "$1, versículos $2 y $3")
  .replaceAll(/\s+\u00b7\s+/g, ", ");

const hallmarkSlotsScript = [
  "window.hallmarkSlots = (images) => {",
  "  for (const [key, value] of Object.entries(images)) {",
  "    const slot = document.querySelector('[data-slot=\"' + key + '\"]');",
  "    if (!slot) continue;",
  "    const image = new Image();",
  "    image.src = typeof value === 'string' ? value : value.src;",
  "    image.alt = (typeof value === 'object' && value.alt) || slot.dataset.alt || '';",
  "    slot.querySelectorAll(':scope > img').forEach((oldImage) => oldImage.remove());",
  "    slot.prepend(image);",
  "  }",
  "};",
  "document.querySelectorAll('[data-slot] img').forEach((image) => {",
  "  if (image.complete && !image.naturalWidth) image.remove();",
  "  else image.addEventListener('error', () => image.remove(), { once: true });",
  "});",
].join("\n");

export const metadata = createPageMetadata({
  title: "Una fe que se vive en comunidad",
  description:
    "Conoce Iglesia Doménica, una comunidad de Asambleas de Dios en Ambato. Revisa los horarios, escucha mensajes y encuentra tu lugar para servir.",
  pathname: "/",
});

function formatEventDate(value: string) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    timeZone: "America/Guayaquil",
  }).format(date);
  const month = new Intl.DateTimeFormat("es-EC", {
    month: "short",
    timeZone: "America/Guayaquil",
  })
    .format(date)
    .replace(".", "")
    .toLocaleLowerCase("es-EC");

  return { day, month };
}

export default function HomePage() {
  const values = [
    {
      title: "Una fe cotidiana",
      body: "Aprendemos de Jesús y llevamos sus enseñanzas a nuestras relaciones y decisiones de cada día.",
    },
    {
      title: "Una mesa abierta",
      body: "Nos conocemos, compartimos nuestras historias y hacemos lugar para quienes llegan por primera vez.",
    },
    {
      title: "Una ciudad que cuidar",
      body: "Queremos que la esperanza que compartimos se convierta en gestos concretos de servicio en Ambato.",
    },
  ];

  return (
    <>
      <div className="home-page pb-20">
        <section className="relative isolate flex min-h-[min(46rem,calc(100svh-4rem))] overflow-clip bg-scrim text-hero-ink">
          <div
            data-slot="hero"
            data-alt="Personas reunidas en un auditorio durante un encuentro de culto."
            className="absolute inset-0 -z-20"
          >
            <Image
              src="/images/hero/hero-cinematic-main.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_54%]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim/95 via-scrim/75 to-scrim/15 md:bg-gradient-to-r md:from-scrim/95 md:via-scrim/70 md:to-scrim/15"
          />

          <div className="mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-7 pt-24 sm:px-8 sm:pb-10 md:justify-center md:px-10 lg:px-12">
            <div className="max-w-4xl">
              <h1>La fe crece caminando juntos.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-hero-ink/85 sm:mt-6 sm:text-lg sm:leading-8">
                Una comunidad de fe en Ambato para compartir, aprender y servir.
              </p>

              <Button
                asChild
                size="lg"
                variant="default"
                className="mt-7 min-h-12 rounded-none bg-accent px-6 font-display text-base font-semibold text-accent-ink shadow-none transition-colors hover:bg-accent/90 sm:mt-8"
              >
                <Link href="/servicios">
                  Planifica tu visita
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-hero-ink/35 pt-5 sm:mt-12 sm:gap-5 sm:pt-6 md:max-w-4xl">
              {churchProfile.schedule.map((service) => (
                <div key={service.days} className="min-w-0 pr-1 sm:pr-4">
                  <p className="font-display text-sm font-semibold text-gold sm:text-base">
                    {service.days}
                  </p>
                  <p className="mt-1 text-base font-semibold text-hero-ink sm:text-lg">
                    {service.time}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-hero-ink/80 sm:text-base sm:leading-6">
                    {service.title.replaceAll(/\s+\u00b7\s+/g, " y ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="community-title"
          className="home-section px-5 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="home-section-heading">
              <h2 id="community-title">Encuentra tu lugar para crecer y servir.</h2>
              <p className="home-lead">
                Hay espacios para aprender, hacer amistades y compartir tus dones. Estos son algunos de los equipos que forman parte de nuestra vida comunitaria.
              </p>
            </div>

            <div
              aria-label="Espacios de la comunidad"
              className="home-rail mt-8"
              role="list"
              tabIndex={0}
            >
              {ministryRooms.map((ministry) => (
                <Link
                  key={ministry.title}
                  href="/ministerios"
                  className="home-rail-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  role="listitem"
                >
                  <h3>{ministry.title}</h3>
                  <p>{ministry.description}</p>
                  <span className="home-meta inline-flex items-center gap-2">
                    Conocer ministerios
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="faith-title"
          className="home-section bg-paper-2 px-5 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="home-section-heading">
              <h2 id="faith-title">Una fe que se vive en lo cotidiano.</h2>
              <p className="home-lead">
                Creemos que la vida con Jesús también se refleja en cómo escuchamos, cuidamos y servimos a las personas que nos rodean. Aquí hay espacio para cada generación y para cada nuevo comienzo.
              </p>
            </div>

            <div className="home-value-list mt-9">
              {values.map((value) => (
                <article key={value.title} className="home-value-row">
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="events-title"
          className="home-section px-5 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="home-section-heading">
              <h2 id="events-title">Próximos encuentros</h2>
              <Link
                href="/eventos"
                className="inline-flex min-h-11 items-center gap-2 self-start font-display text-base font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:self-auto"
              >
                Ver la agenda <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="home-event-list mt-8">
              {upcomingEvents.map(([slug, event]) => {
                const eventDate = event.startDates?.[0];
                const date = eventDate ? formatEventDate(eventDate) : null;

                return (
                  <Link
                    key={slug}
                    href={"/eventos/" + slug}
                    className="home-event-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <time
                      className="home-event-date font-display"
                      dateTime={eventDate}
                    >
                      <strong>{date?.day}</strong>
                      <span>{date?.month}</span>
                    </time>
                    <div className="home-event-copy">
                      <h3>{event.title}</h3>
                      <p>{event.intro}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-accent" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="message-title"
          className="home-section bg-paper-2 px-5 sm:px-8 lg:px-12"
        >
          <div className="home-feature mx-auto max-w-7xl">
            <figure className="home-photo-figure">
              <div
                data-slot="sermon-feature"
                data-alt="Colinas verdes bajo la luz de la mañana."
                data-photo-credit="Caleb Riston, Wikimedia Commons, CC BY 4.0"
                className="home-photo"
              >
                <Image
                  src="/images/hallmark/palousefromsteptoebuttemay2023-2-1920.jpg"
                  alt="Colinas verdes y onduladas bajo la luz de la mañana."
                  fill
                  sizes="(min-width: 48rem) 56vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="home-photo-credit">
                Fotografía: {" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:PalouseFromSteptoeButteMay2023-2.jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  Caleb Riston, Wikimedia Commons
                </a>. {" "}Licencia: {" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CC BY 4.0
                </a>
              </figcaption>
            </figure>

            <article className="home-feature-copy">
              <h2 id="message-title">{latestSermon.title}</h2>
              <p>{latestSermon.intro}</p>
              <p className="home-meta mt-5 text-sm font-medium text-muted-foreground sm:text-base">
                {latestSermonMeta}
              </p>
              <Link
                href={"/sermones/" + latestSermonSlug}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-display font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Leer el mensaje
              </Link>
            </article>
          </div>
        </section>

        <section
          id="visit"
          aria-labelledby="visit-title"
          className="home-visit-band mx-5 px-5 py-10 sm:mx-8 sm:px-8 sm:py-14 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-16"
        >
          <div>
            <h2 id="visit-title">Ven tal como eres. Hay un lugar para ti.</h2>
            <p className="mt-4 max-w-lg text-base leading-7">
              Nos reunimos en {displayCity}. Si es tu primera visita, conoce los horarios y algunos detalles prácticos antes de venir.
            </p>
            <Link
              href="/servicios"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-display font-semibold text-band-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mt-7"
            >
              Tu primera visita <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="home-visit-details mt-8 lg:mt-0">
            <div className="home-visit-detail">
              <MapPin className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <h3>Dirección</h3>
                <address className="mt-1 not-italic text-base leading-6">
                  {churchProfile.address}
                </address>
              </div>
            </div>
            <div className="home-visit-detail">
              <Clock3 className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <h3>Encuentro principal</h3>
                <p className="mt-1 text-base leading-6">
                  {churchProfile.schedule[0].days}, {churchProfile.schedule[0].time}
                  <br />
                  Celebración y enseñanza
                </p>
              </div>
            </div>
            <div className="home-visit-detail">
              <HeartHandshake className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <h3>Una comunidad para todos</h3>
                <p className="mt-1 text-base leading-6">
                  Acércate al equipo de bienvenida cuando llegues; con gusto te orientamos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Script id="hallmark-slots" strategy="afterInteractive">
        {hallmarkSlotsScript}
      </Script>
    </>
  );
}
