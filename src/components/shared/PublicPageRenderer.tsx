import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  PhoneCall,
  Youtube,
} from "lucide-react";
import { churchProfile } from "@/config/church-profile";
import { createPageMetadata } from "@/lib/page-metadata";
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

const contactCardIcons = {
  location: MapPin,
  phone: PhoneCall,
  email: Mail,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
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

function CardAction({
  href,
  title,
  label,
}: {
  href: string;
  title: string;
  label?: string;
}) {
  const isEmail = href.startsWith("mailto:");
  const isPhone = href.startsWith("tel:");
  const Icon = isEmail ? Mail : isPhone ? PhoneCall : ArrowUpRight;
  const className =
    "mt-3 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-2 text-xs font-semibold text-primary underline-offset-4 transition-colors hover:bg-primary/5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const content = (
    <>
      {label ?? "Ver detalle"}
      <Icon aria-hidden="true" className="h-4 w-4" />
    </>
  );

  if (isEmail || isPhone) {
    return (
      <a href={href} aria-label={label ?? `Ver detalle: ${title}`} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label ?? `Ver detalle: ${title}`} className={className}>
      {content}
    </Link>
  );
}

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

  if (section.presentation === "contact-methods") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {section.cards.map((card, cardIndex) => {
          const Icon = card.icon ? contactCardIcons[card.icon] : MapPin;

          return (
            <article
              key={`${card.title}-${cardIndex}`}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent-foreground">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                {card.eyebrow ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {card.eyebrow}
                  </p>
                ) : null}
              </div>
              <h3
                className={`mt-5 break-words font-semibold leading-snug tracking-tight text-card-foreground [overflow-wrap:anywhere] ${
                  card.icon === "email"
                    ? "text-base md:text-sm lg:text-lg"
                    : "text-lg sm:text-xl"
                }`}
              >
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
              {card.href ? (
                <CardAction href={card.href} title={card.title} label={card.actionLabel} />
              ) : null}
              {card.meta ? (
                <p className="mt-auto pt-4 text-xs font-medium text-muted-foreground">
                  {card.meta}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    );
  }

  if (section.presentation === "social-profiles") {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {section.cards.map((card, cardIndex) => {
          const Icon = card.icon ? contactCardIcons[card.icon] : Instagram;

          return (
            <article
              key={`${card.title}-${cardIndex}`}
              className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold leading-snug text-card-foreground">
                  {card.title}
                </h3>
              </div>
              <p className="mt-3 break-words text-sm font-medium leading-5 text-foreground [overflow-wrap:anywhere]">
                {card.description}
              </p>
              {card.meta ? (
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {card.meta}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    );
  }

  if (section.presentation === "callout" && section.cards[0]) {
    const card = section.cards[0];

    return (
      <aside className="flex flex-col gap-6 rounded-3xl border border-border bg-muted/40 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h3 className="font-serif text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            {card.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            {card.description}
          </p>
          {card.meta ? (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              {card.meta}
            </p>
          ) : null}
        </div>
        {card.href ? (
          <Link
            href={card.href}
            className="mt-1 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:mt-0"
          >
            {card.actionLabel ?? "Ver detalle"}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        ) : null}
      </aside>
    );
  }

  if (section.presentation === "numbered-list") {
    return (
      <ol className="grid gap-x-12 md:grid-cols-2">
        {section.cards.map((card, cardIndex) => (
          <li
            key={`${card.title}-${cardIndex}`}
            className="border-t border-border py-3 sm:py-6"
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <span
                aria-hidden="true"
                className="min-w-8 pt-0.5 font-serif text-2xl leading-none text-amber-700 dark:text-amber-300"
              >
                {String(cardIndex + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-snug tracking-tight text-card-foreground sm:text-lg">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.description}
                </p>
                {card.meta ? (
                  <p className="mt-3 text-xs font-medium leading-5 text-primary/80">
                    {card.meta}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      {section.cards.map((card, cardIndex) => (
        <div
          key={`${card.title}-${cardIndex}`}
          className="group relative flex min-h-56 flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-7"
        >
          {card.imageSrc ? (
            <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden bg-muted sm:-mx-7 sm:-mt-7">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt ?? ""}
                fill
                sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) calc((100vw - 4rem) / 2), 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10"
              />
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-slate-950/25 font-serif text-sm text-white backdrop-blur-sm"
              >
                {String(cardIndex + 1).padStart(2, "0")}
              </span>
            </div>
          ) : card.visual ? (
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
          {!card.imageSrc ? (
            <span
              aria-hidden="true"
              className="absolute right-5 top-4 text-4xl font-light tracking-tight text-primary/70 transition-colors group-hover:text-primary/85"
            >
              {String(cardIndex + 1).padStart(2, "0")}
            </span>
          ) : null}
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
            <CardAction href={card.href} title={card.title} label={card.actionLabel} />
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

  return createPageMetadata({
    title: page.title,
    description: page.intro,
    pathname: `/${slug}`,
  });
}

export function PublicPageRenderer({ slug }: { slug: PublicPageSlug }) {
  const page: PublicPageBlueprint = publicPageBlueprints[slug];
  const hasExplorer = page.sections.some((section) => section.explorer);
  const compactHero = hasExplorer || page.compactHero;
  const heroGridClass = page.heroNote
    ? "lg:grid-cols-[minmax(0,1fr)_19rem]"
    : "";
  const heroLayoutClass = compactHero
    ? `mx-auto grid max-w-7xl gap-8 px-5 py-6 sm:px-8 sm:py-8 ${heroGridClass} lg:items-end lg:gap-12 lg:px-10 lg:py-12`
    : `mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 sm:py-16 ${heroGridClass} lg:items-end lg:gap-16 lg:px-10 lg:py-24`;
  const contentLayoutClass = hasExplorer
    ? "mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
    : "mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24";
  const sectionSpacingClass = page.compactSections || hasExplorer
    ? "space-y-16 sm:space-y-20"
    : "space-y-20 sm:space-y-24";

  return (
    <article>
      <section className="relative isolate overflow-hidden border-b border-border bg-muted/50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_10%,color-mix(in_srgb,var(--primary)_17%,transparent),transparent_42%),radial-gradient(ellipse_at_88%_70%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_34%)]"
        />
        <div
          className={heroLayoutClass}
        >
          <div className="max-w-4xl">
            <nav aria-label="Ruta de navegación" className={compactHero ? "mb-4 sm:mb-6" : "mb-10"}>
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
            <h1
              className={`${
                hasExplorer ? "mt-3 sm:text-5xl lg:text-6xl" : "mt-4 sm:text-6xl lg:text-7xl"
              } max-w-4xl text-balance font-serif text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-foreground`}
            >
              {page.title}
            </h1>
            <p className={`${compactHero ? "mt-4" : "mt-6"} max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8`}>
              {page.intro}
            </p>

            {page.action ? (
              <Link
                href={page.action.href}
                className={`${compactHero ? "mt-6" : "mt-8"} inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              >
                {page.action.label}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {page.heroNote ? (
            <aside className="relative overflow-hidden rounded-3xl border border-border/80 bg-background/75 p-6 shadow-sm backdrop-blur sm:p-7">
              <span
                aria-hidden="true"
                className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-primary/15"
              />
              <span
                aria-hidden="true"
                className="absolute -right-4 -top-6 h-24 w-24 rounded-full border border-accent/20"
              />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {page.heroNote.eyebrow}
                </p>
                <h2 className="mt-4 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  {page.heroNote.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {page.heroNote.description}
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <div className={contentLayoutClass}>
        <div className={sectionSpacingClass}>
          {page.sections.map((section, sectionIndex) => (
            <section key={section.title} aria-labelledby={`section-${sectionIndex}`}>
              <div className={`${hasExplorer ? "mb-4 sm:mb-6" : "mb-8 sm:mb-10"} max-w-3xl`}>
                {section.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {section.eyebrow}
                  </p>
                ) : null}
                <h2
                  id={`section-${sectionIndex}`}
                  className={`${hasExplorer ? "mt-2" : "mt-3"} scroll-mt-24 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl`}
                >
                  {section.title}
                </h2>
                {section.intro ? (
                  <p className={`${hasExplorer ? "mt-3" : "mt-4"} max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base`}>
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
            <section
              aria-labelledby="page-faq-title"
              className="grid gap-6 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.25fr)] lg:gap-12"
            >
              <div className="max-w-md lg:max-w-none">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Preguntas frecuentes
                </p>
                <h2
                  id="page-faq-title"
                  className="mt-3 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
                >
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

        {page.closingCta !== false ? (
          <section className="mt-20 overflow-hidden rounded-[2rem] bg-accent px-6 py-9 text-accent-foreground sm:mt-24 sm:px-10 sm:py-11 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                Iglesia Doménica · Ambato
              </p>
              <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight sm:text-3xl">
                {churchProfile.signature}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-accent-foreground">
                Acompáñanos en uno de nuestros encuentros semanales. Hay un espacio para ti.
              </p>
            </div>
            <Link
              href="/servicios"
              className="mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent lg:mt-0"
            >
              Planifica tu visita
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>
        ) : null}
      </div>
    </article>
  );
}
