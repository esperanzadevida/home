"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";

export type FilterableCard = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  href?: string;
  filterValues?: Record<string, string>;
  sortDate?: string;
  sortPrice?: number;
  sortWeight?: number;
  featured?: boolean;
};

export type FilterableCardFilter = {
  key: string;
  label: string;
  allLabel: string;
};

export type FilterableCardSortOption = {
  value: "newest" | "oldest" | "title" | "price-asc" | "price-desc" | "popular";
  label: string;
};

type FilterableCardGridProps = {
  cards: readonly FilterableCard[];
  searchLabel?: string;
  searchPlaceholder?: string;
  filters?: readonly FilterableCardFilter[];
  sortOptions?: readonly FilterableCardSortOption[];
  defaultSort?: FilterableCardSortOption["value"];
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function getSortTimestamp(value?: string) {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : timestamp;
}

export function FilterableCardGrid({
  cards,
  searchLabel = "Buscar",
  searchPlaceholder = "Buscar en esta lista",
  filters = [],
  sortOptions = [],
  defaultSort,
  pageSize = 6,
  emptyTitle = "No encontramos resultados",
  emptyDescription = "Prueba con otra búsqueda o cambia los filtros.",
}: FilterableCardGridProps) {
  const id = useId();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(defaultSort ?? "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const filterOptions = useMemo(
    () =>
      Object.fromEntries(
        filters.map(({ key }) => [
          key,
          Array.from(
            new Set(
              cards
                .map((card) => card.filterValues?.[key])
                .filter((value): value is string => Boolean(value?.trim())),
            ),
          ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })),
        ]),
      ),
    [cards, filters],
  );

  const visibleCards = useMemo(() => {
    const query = normalize(debouncedSearch.trim());
    const filtered = cards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => {
        const matchesSearch =
          !query ||
          normalize(
            [card.eyebrow, card.title, card.description, card.meta, ...Object.values(card.filterValues ?? {})]
              .filter(Boolean)
              .join(" "),
          ).includes(query);

        const matchesFilters = filters.every(({ key }) => {
          const selected = selectedFilters[key];
          return !selected || card.filterValues?.[key] === selected;
        });

        return matchesSearch && matchesFilters;
      });

    const direction = sort === "newest" || sort === "price-desc" || sort === "popular" ? -1 : 1;
    const sortValue = (card: FilterableCard): string | number | undefined => {
      switch (sort) {
        case "newest":
        case "oldest":
          return getSortTimestamp(card.sortDate);
        case "title":
          return card.title;
        case "price-asc":
        case "price-desc":
          return card.sortPrice;
        case "popular":
          return card.sortWeight ?? (card.featured ? 1 : 0);
        default:
          return undefined;
      }
    };

    if (sort) {
      filtered.sort((a, b) => {
        const aValue = sortValue(a.card);
        const bValue = sortValue(b.card);

        // Keep cards without the requested metadata after cards that can be sorted.
        if (aValue === undefined && bValue !== undefined) return 1;
        if (aValue !== undefined && bValue === undefined) return -1;
        if (aValue === undefined || bValue === undefined) return a.index - b.index;

        const comparison =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue, "es", { sensitivity: "base" })
            : Number(aValue) - Number(bValue);
        return comparison === 0 ? a.index - b.index : comparison * direction;
      });
    }

    return filtered.map(({ card }) => card);
  }, [cards, debouncedSearch, filters, selectedFilters, sort]);

  const hasActiveCriteria =
    search.trim().length > 0 || Object.values(selectedFilters).some(Boolean);
  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(visibleCards.length / safePageSize));
  const currentPage = Math.min(page, pageCount);
  const displayedCards = visibleCards.slice(
    (currentPage - 1) * safePageSize,
    currentPage * safePageSize,
  );

  function clearCriteria() {
    setSearch("");
    setSelectedFilters({});
    setPage(1);
  }

  return (
    <section className="space-y-6" aria-label="Buscar y filtrar contenido">
      <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1.5fr)_repeat(auto-fit,minmax(10rem,1fr))]">
          <div className="space-y-2">
            <label htmlFor={`${id}-search`} className="block text-sm font-medium text-foreground">
              {searchLabel}
            </label>
            <input
              id={`${id}-search`}
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          {filters.map((filter, index) => {
            const selectId = `${id}-filter-${index}`;
            return (
              <div key={filter.key} className="space-y-2">
                <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
                  {filter.label}
                </label>
                <select
                  id={selectId}
                  value={selectedFilters[filter.key] ?? ""}
                  onChange={(event) =>
                    {
                      setSelectedFilters((current) => ({ ...current, [filter.key]: event.target.value }));
                      setPage(1);
                    }
                  }
                  className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <option value="">{filter.allLabel}</option>
                  {(filterOptions[filter.key] ?? []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {sortOptions.length > 0 ? (
            <div className="space-y-2">
              <label htmlFor={`${id}-sort`} className="block text-sm font-medium text-foreground">
                Ordenar por
              </label>
              <select
                id={`${id}-sort`}
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as FilterableCardSortOption["value"] | "");
                  setPage(1);
                }}
                className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="">Orden predeterminado</option>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
            {visibleCards.length} {visibleCards.length === 1 ? "resultado" : "resultados"}
          </p>
          {hasActiveCriteria ? (
            <button
              type="button"
              onClick={clearCriteria}
              className="min-h-10 rounded-lg px-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Limpiar búsqueda y filtros
            </button>
          ) : null}
        </div>
      </div>

      {visibleCards.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedCards.map((card, index) => (
            <li
              key={`${card.href ?? card.title}-${index}`}
              className={`group flex h-full flex-col rounded-2xl border bg-card p-5 text-card-foreground shadow-sm ${
                card.featured ? "border-primary/40" : "border-border"
              }`}
            >
              {card.eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{card.eyebrow}</p>
              ) : null}
              {card.featured ? (
                <span className="mt-3 w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  Destacado
                </span>
              ) : null}
              <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
                {card.href ? (
                  <Link
                    href={card.href}
                    aria-label={`Abrir ${card.title}`}
                    className="rounded-sm underline-offset-4 group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {card.title}
                  </Link>
                ) : (
                  card.title
                )}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{card.description}</p>
              {card.meta ? <p className="mt-4 text-xs font-medium text-muted-foreground">{card.meta}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">{emptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
          {hasActiveCriteria ? (
            <button
              type="button"
              onClick={clearCriteria}
              className="mt-5 min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Limpiar búsqueda y filtros
            </button>
          ) : null}
        </div>
      )}

      {pageCount > 1 ? (
        <nav aria-label="Paginación de resultados" className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage <= 1}
            className="min-h-11 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anteriores
          </button>
          <span aria-current="page" className="text-sm tabular-nums text-muted-foreground">
            Página {currentPage} de {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={currentPage >= pageCount}
            className="min-h-11 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguientes
          </button>
        </nav>
      ) : null}
    </section>
  );
}
