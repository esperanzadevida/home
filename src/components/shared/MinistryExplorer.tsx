import Link from "next/link";
import Image from "@/components/shared/SiteImage";

export type MinistryExplorerItem = {
  category: string;
  title: string;
  description: string;
  meeting: string;
  leader: string;
  imageSrc: string;
  imageAlt: string;
};

type MinistryExplorerProps = {
  items: MinistryExplorerItem[];
};

export function MinistryExplorer({ items }: MinistryExplorerProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
        No hay ministerios para mostrar por el momento.
      </p>
    );
  }

  return (
    <ul aria-label="Ministerios de la iglesia" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="h-full">
          <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-primary/40 sm:p-6">
            <div className="relative -mx-5 -mt-5 mb-5 aspect-[16/10] overflow-hidden bg-muted sm:-mx-6 sm:-mt-6">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) calc((100vw - 4rem) / 2), 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {item.category}
            </p>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>

            <details className="group mt-5 border-t border-border pt-4">
              <summary className="min-h-11 cursor-pointer rounded-lg text-sm font-semibold text-primary marker:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card">
                Horario y liderazgo
              </summary>
              <dl className="mt-3 space-y-3 text-sm leading-6">
                <div>
                  <dt className="font-semibold text-foreground">Reuniones</dt>
                  <dd className="text-muted-foreground">{item.meeting}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Liderazgo</dt>
                  <dd className="text-muted-foreground">{item.leader}</dd>
                </div>
              </dl>
              <Link
                href="/contacto"
                aria-label={`Consultar sobre ${item.title} en la página de contacto`}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Ir a contacto <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </details>
          </article>
        </li>
      ))}
    </ul>
  );
}
