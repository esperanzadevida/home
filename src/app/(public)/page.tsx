import Image from "@/components/shared/SiteImage";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Play } from "lucide-react";
import { ScrollScrubHero } from "@/components/shared/ScrollScrubHero";
import { ScrollScrubNarrative } from "@/components/shared/ScrollScrubNarrative";
import { churchProfile } from "@/config/church-profile";
import { eventDetails, sermonDetails } from "@/config/content-details";
import { publicPageBlueprints } from "@/config/public-pages";
import { createPageMetadata } from "@/lib/page-metadata";
import { withBasePath } from "@/lib/site-url";

const [latestSermonSlug, latestSermon] = Object.entries(sermonDetails)[0];
const currentTime = Date.now();
const upcomingEvents = Object.entries(eventDetails)
  .filter(([, event]) => event.startDates?.some((date) => Date.parse(date) > currentTime))
  .sort(([, first], [, second]) => Date.parse(first.startDates?.[0] ?? "") - Date.parse(second.startDates?.[0] ?? ""))
  .slice(0, 3);
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
  description: `Conoce ${churchProfile.name}, una comunidad de ${churchProfile.denomination} en Ambato. Revisa los horarios, escucha mensajes y encuentra tu lugar para servir.`,
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
        <ScrollScrubHero
          videoSrc={withBasePath("/videos/hero-scrub.mp4")}
          posterSrc={withBasePath("/videos/hero-poster.webp")}
          estimatedBytes={4_290_098}
          scrollHeightVh={520}
          mobileScrollHeightVh={380}
          accentTheme="emerald"
          cueLabel="Desliza para descubrir"
        >
          <ScrollScrubNarrative
            name={churchProfile.name}
            city={displayCity}
            address={churchProfile.address}
            schedule={churchProfile.schedule}
          />
        </ScrollScrubHero>

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

            <ul
              aria-label="Espacios de la comunidad"
              className="home-rail mt-8 list-none"
              tabIndex={0}
            >
              {ministryRooms.map((ministry) => (
                <li key={ministry.title}>
                  <Link
                    href="/ministerios"
                    className="home-rail-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    {ministry.imageSrc ? (
                      <span className="home-rail-image">
                        <Image
                          src={ministry.imageSrc}
                          alt={ministry.imageAlt ?? ""}
                          fill
                          sizes="(max-width: 640px) 80vw, 19rem"
                          className="object-cover"
                        />
                      </span>
                    ) : null}
                    <h3>{ministry.title}</h3>
                    <p>{ministry.description}</p>
                    <span className="home-meta inline-flex items-center gap-2">
                      Conocer ministerios
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
                className="inline-flex min-h-11 items-center gap-2 self-start font-display text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:self-auto"
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
                    <ArrowRight className="h-5 w-5 text-primary" aria-hidden="true" />
                  </Link>
                );
              })}
              {upcomingEvents.length === 0 && (
                <p className="rounded-2xl border border-border bg-card px-5 py-6 text-sm text-muted-foreground">
                  Pronto compartiremos nuevas fechas. Mientras tanto, revisa nuestros horarios semanales.
                </p>
              )}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="message-title"
          className="home-section bg-paper-2 px-5 sm:px-8 lg:px-12"
        >
          <div className="home-feature mx-auto max-w-7xl">
            <div
              data-slot="sermon-feature"
              data-alt="Amanecer dorado sobre un valle andino cercano a Ambato."
              data-photo-credit="Imagen original generada para Iglesia Esperanza de Vida."
              className="home-photo"
            >
              <Image
                src="/images/esperanza-de-vida/esperanza-amanecer.webp"
                alt="Amanecer dorado sobre un valle andino cercano a Ambato."
                fill
                sizes="(min-width: 48rem) 56vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            <article className="home-feature-copy">
              <h2 id="message-title">{latestSermon.title}</h2>
              <p>{latestSermon.intro}</p>
              <p className="home-meta mt-5 text-sm font-medium text-muted-foreground sm:text-base">
                {latestSermonMeta}
              </p>
              <Link
                href={"/sermones/" + latestSermonSlug}
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-display font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Leer el mensaje
              </Link>
            </article>
          </div>
        </section>

      </div>
      <Script id="hallmark-slots" strategy="afterInteractive">
        {hallmarkSlotsScript}
      </Script>
    </>
  );
}
