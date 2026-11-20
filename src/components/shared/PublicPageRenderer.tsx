import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { churchProfile } from "@/config/church-profile";
import { EventsExplorer } from "@/components/shared/EventsExplorer";
import { FilterableCardGrid } from "@/components/shared/FilterableCardGrid";
import { MinistryExplorer } from "@/components/shared/MinistryExplorer";
import {
  publicPageBlueprints,
  type PublicPageBlueprint,
  type PublicPageSection,
  type PublicPageSlug,
} from "@/config/public-pages";

const visualClasses = {
  gathering: "bg-gradient-to-br from-primary/25 via-background to-accent/20",
  generations: "bg-gradient-to-br from-accent/30 via-background to-secondary/20",
  service: "bg-gradient-to-br from-secondary/20 via-muted to-primary/25",
} as const;

const filterableExplorerOptions = {
  sermons: {
    searchLabel: "Buscar sermones",
    searchPlaceholder: "Título, tema o pasaje bíblico",
    filters: [
      { key: "serie", label: "Serie", allLabel: "Todas las series" },
      { key: "pastor", label: "Pastor", allLabel: "Todos los pastores" },
      { key: "fecha", label: "Fecha", allLabel: "Todas las fechas" },
      { key: "etiqueta", label: "Tema", allLabel: "Todos los temas" },
    ],
    sortOptions: [{ value: "newest", label: "Fecha más reciente" }],
    defaultSort: "newest",
    pageSize: 3,
    emptyTitle: "No encontramos sermones con esos criterios",
    emptyDescription: "Prueba otro tema, fecha o palabra de búsqueda.",
  },
  blog: {
    searchLabel: "Buscar artículos",
    searchPlaceholder: "Título, categoría o contenido",
    filters: [{ key: "categoría", label: "Categoría", allLabel: "Todas las categorías" }],
    sortOptions: [
      { value: "newest", label: "Más recientes" },
      { value: "oldest", label: "Más antiguos" },
    ],
    defaultSort: "newest",
    emptyTitle: "No encontramos artículos con esos criterios",
    emptyDescription: "Prueba otra categoría o palabra de búsqueda.",
  },
  shop: {
    searchLabel: "Buscar recursos",
    searchPlaceholder: "Nombre, categoría o descripción",
    filters: [
      { key: "categoría", label: "Categoría", allLabel: "Todas las categorías" },
      { key: "precio", label: "Precio", allLabel: "Todos los precios" },
    ],
    sortOptions: [
      { value: "price-asc", label: "Precio: menor a mayor" },
      { value: "price-desc", label: "Precio: mayor a menor" },
      { value: "newest", label: "Novedades" },
      { value: "popular", label: "Más populares" },
    ],
    defaultSort: "popular",
    emptyTitle: "No encontramos recursos con esos criterios",
    emptyDescription: "Prueba otra categoría o palabra de búsqueda.",
  },
} as const;

function SectionCards({ section }: { section: PublicPageSection }) {
  if (section.explorer === "ministries") {
    return (
      <MinistryExplorer
        items={section.cards.flatMap((card) =>
          card.meeting && card.leader
            ? [
                {
                  category: card.eyebrow ?? "Ministerio",
                  title: card.title,
                  description: card.description,
                  meeting: card.meeting,
                  leader: card.leader,
                },
              ]
            : [],
        )}
      />
    );
  }

  if (section.explorer === "events") {
    return (
      <EventsExplorer
        events={section.cards.flatMap((card) =>
          card.href && card.calendarDate
            ? [
                {
                  title: card.title,
                  description: card.description,
                  href: card.href,
                  category: card.calendarCategory ?? "Comunidad",
                  date: card.calendarDate,
                  dateLabel: card.eyebrow ?? card.calendarDate,
                  meta: card.meta,
                },
              ]
            : [],
        )}
      />
    );
  }

  if (section.explorer === "sermons" || section.explorer === "blog" || section.explorer === "shop") {
    const options = filterableExplorerOptions[section.explorer];
    return <FilterableCardGrid cards={section.cards} {...options} />;
  }

  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {section.cards.map((card, cardIndex) => (
        <div
          key={card.title}
          className="group relative flex min-h-56 flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
        >
          {card.visual ? (
            <div
              aria-hidden="true"
              className={`relative -mx-6 -mt-6 mb-5 h-36 overflow-hidden sm:-mx-7 sm:-mt-7 ${visualClasses[card.visual]}`}
            >
              <span className="absolute -bottom-10 -right-4 h-36 w-36 rounded-full border border-foreground/15" />
              <span className="absolute -bottom-6 -right-1 h-24 w-24 rounded-full border border-foreground/15" />
              <span className="absolute left-6 top-6 h-3 w-3 rounded-full bg-primary/70" />
              <span className="absolute bottom-5 left-6 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
                Iglesia Doménica · Ambato
              </span>
            </div>
          ) : null}
          <span
            aria-hidden="true"
            className="absolute right-5 top-4 text-4xl font-light tracking-tight text-primary/10 transition-colors group-hover:text-primary/20"
          >
            {String(cardIndex + 1).padStart(2, "0")}
          </span>
          {card.eyebrow ? (
            <p className="relative max-w-[80%] text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              {card.eyebrow}
            </p>
          ) : null}
          <h3 className="relative mt-4 text-lg font-semibold leading-snug tracking-tight text-card-foreground sm:text-xl">
            {card.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
          {card.href ? (
            <Link
              href={card.href}
              aria-label={`Ver detalle: ${card.title}`}
              className="mt-5 inline-flex min-h-8 w-fit items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ver detalle
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          ) : null}
          {card.meta ? (
            <p className="mt-auto pt-6 text-xs font-medium text-muted-foreground">{card.meta}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function getPublicPageMetadata(slug: PublicPageSlug): Metadata {
  const page = publicPageBlueprints[slug];

  return {
    title: `${page.title} | ${churchProfile.name}`,
    description: page.intro,
  };
}

export function PublicPageRenderer({ slug }: { slug: PublicPageSlug }) {
  const page: PublicPageBlueprint = publicPageBlueprints[slug];

  return (
    <article>
      <section className="relative isolate overflow-hidden border-b border-border bg-muted/50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_10%,color-mix(in_srgb,var(--primary)_17%,transparent),transparent_42%),radial-gradient(ellipse_at_88%_70%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_34%)]"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end lg:gap-16 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <nav aria-label="Ruta de navegación" className="mb-10">
              <ol className="flex items-center gap-2 text-xs text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">
                  {page.eyebrow.split(" · ")[0]}
                </li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {page.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {page.intro}
            </p>

            {page.action ? (
              <Link
                href={page.action.href}
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {page.action.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-border/80 bg-background/75 p-5 shadow-sm backdrop-blur sm:p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span>{churchProfile.city}</span>
            </div>
            <p className="mt-5 text-sm font-semibold text-foreground">
              Encuentros de la semana
            </p>
            <ul className="mt-4 divide-y divide-border">
              {churchProfile.schedule.map((service) => (
                <li
                  key={service.days}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {service.days}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {service.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {service.time}
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="space-y-20 sm:space-y-24">
          {page.sections.map((section, sectionIndex) => (
            <section key={section.title} aria-labelledby={`section-${sectionIndex}`}>
              <div className="mb-8 max-w-3xl sm:mb-10">
                {section.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {section.eyebrow}
                  </p>
                ) : null}
                <h2
                  id={`section-${sectionIndex}`}
                  className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  {section.title}
                </h2>
                {section.intro ? (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.intro}
                  </p>
                ) : null}
              </div>

              <SectionCards section={section} />
              {section.source ? (
                <aside className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">
                  <p>{section.source.note}</p>
                  <a
                    href={section.source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex min-h-10 items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {section.source.label}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </aside>
              ) : null}
            </section>
          ))}
          {page.faq?.length ? (
            <section aria-labelledby="page-faq-title" className="max-w-4xl">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Preguntas frecuentes
                </p>
                <h2 id="page-faq-title" className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Respuestas para planificar tu visita
                </h2>
              </div>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 sm:px-6">
                {page.faq.map((item) => (
                  <details key={item.question} className="group py-5">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md text-base font-semibold text-foreground marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {item.question}
                      <span aria-hidden="true" className="text-xl font-light text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-3xl pb-2 pt-3 text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <section className="mt-20 overflow-hidden rounded-[2rem] bg-primary px-6 py-9 text-primary-foreground sm:mt-24 sm:px-10 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">
              Iglesia Doménica · Ambato
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {churchProfile.signature}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80">
              Acompáñanos en uno de nuestros encuentros semanales. Hay un espacio para ti.
            </p>
          </div>
          <Link
            href="/servicios"
            className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-background px-6 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary lg:mt-0"
          >
            Planifica tu visita
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </article>
  );
}
