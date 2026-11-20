import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { ContentDetail } from "@/config/content-details";
import { churchProfile } from "@/config/church-profile";
import { ShareActions } from "@/components/shared/ShareActions";

export function ContentDetailPage({
  content,
  backHref,
  backLabel,
  actions,
}: {
  content: ContentDetail;
  backHref: string;
  backLabel: string;
  actions?: ReactNode;
}) {
  return (
    <article>
      <header className="relative isolate overflow-hidden border-b border-border bg-muted/50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_16%_8%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_42%),radial-gradient(ellipse_at_90%_72%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_34%)]"
        />
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <nav aria-label="Ruta de navegación" className="mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={backHref}
                  className="rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {backLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {content.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-end lg:gap-16">
            <div className="max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {content.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {content.intro}
              </p>
              {content.author ? (
                <div className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                  >
                    {content.author
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{content.author}</p>
                    {content.authorRole ? (
                      <p className="text-xs text-muted-foreground">{content.authorRole}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <div className="mt-7">
                <ShareActions title={content.title} />
              </div>
              {actions ? <div className="mt-6">{actions}</div> : null}
            </div>

            <aside className="rounded-3xl border border-border/80 bg-background/75 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                {churchProfile.city}
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-foreground">
                {content.meta}
              </p>
            </aside>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          {content.sections.length > 0 && (
            <nav
              aria-label="En esta página"
              className="h-fit rounded-2xl border border-border bg-muted/30 p-5 lg:sticky lg:top-24"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                En esta página
              </h2>
              <ol className="mt-4 grid gap-2">
                {content.sections.map((section, index) => (
                  <li key={`${section.title}-${index}`}>
                    <a
                      href={`#contenido-seccion-${index + 1}`}
                      className="block rounded-md py-1 text-sm leading-6 text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mx-auto w-full max-w-3xl space-y-12 sm:space-y-14">
            {content.sections.map((section, index) => (
              <section
                key={`${section.title}-${index}`}
                aria-labelledby={`contenido-seccion-${index + 1}`}
              >
                <h2
                  id={`contenido-seccion-${index + 1}`}
                  className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  {section.title}
                </h2>
                <div className="mt-5 space-y-5">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={`${paragraph.slice(0, 48)}-${paragraphIndex}`}
                      className="text-base leading-8 text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {content.tags?.length ? (
              <section aria-labelledby="detail-tags-title" className="border-t border-border pt-7">
                <h2 id="detail-tags-title" className="text-sm font-semibold text-foreground">
                  Temas
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {content.related?.length ? (
              <section aria-labelledby="detail-related-title" className="border-t border-border pt-7">
                <h2 id="detail-related-title" className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  También te puede interesar
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {content.related.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex min-h-16 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>{item.title}</span>
                        <span aria-hidden="true" className="text-primary">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="border-t border-border pt-8">
              <Link
                href={backHref}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Volver a {backLabel.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
