"use client";

import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, List } from "lucide-react";
import { useMemo, useState } from "react";

export interface EventsExplorerEvent {
  title: string;
  description: string;
  href: string;
  category: string;
  date: string;
  dateLabel: string;
  meta?: string;
}

interface EventsExplorerProps {
  events: EventsExplorerEvent[];
}

type Month = { year: number; month: number };
type ViewMode = "list" | "calendar";

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const ALL_CATEGORIES = "__all_categories__";

function getMonthFromDate(date: string): Month | null {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(date);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year, month };
}

function monthKey(month: Month) {
  return `${month.year}-${String(month.month + 1).padStart(2, "0")}`;
}

function shiftMonth(month: Month, offset: number): Month {
  const date = new Date(Date.UTC(month.year, month.month + offset, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

function getCalendarDays(month: Month): Array<number | null> {
  const firstWeekday = new Date(Date.UTC(month.year, month.month, 1)).getUTCDay();
  const mondayOffset = (firstWeekday + 6) % 7;
  const daysInMonth = new Date(Date.UTC(month.year, month.month + 1, 0)).getUTCDate();
  const cells: Array<number | null> = Array.from({ length: mondayOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function monthLabel(month: Month) {
  return `${MONTH_NAMES[month.month]} ${month.year}`;
}

export function EventsExplorer({ events }: EventsExplorerProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [displayMonth, setDisplayMonth] = useState<Month | null>(() =>
    events.length ? getMonthFromDate(events[0].date) : null,
  );

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.category))].sort((a, b) => a.localeCompare(b, "es")),
    [events],
  );

  const filteredEvents = useMemo(
    () => events.filter((event) => category === ALL_CATEGORIES || event.category === category),
    [category, events],
  );

  const monthEvents = useMemo(() => {
    if (!displayMonth) return [];
    const key = monthKey(displayMonth);
    return filteredEvents.filter((event) => event.date.startsWith(`${key}-`));
  }, [displayMonth, filteredEvents]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, Array<{ event: EventsExplorerEvent; index: number }>>();
    if (!displayMonth) return map;
    const key = monthKey(displayMonth);
    filteredEvents.forEach((event, index) => {
      if (!event.date.startsWith(`${key}-`)) return;
      const day = Number(event.date.slice(8, 10));
      if (!Number.isInteger(day) || day < 1 || day > 31) return;
      const items = map.get(day) ?? [];
      items.push({ event, index });
      map.set(day, items);
    });
    return map;
  }, [displayMonth, filteredEvents]);

  const days = displayMonth ? getCalendarDays(displayMonth) : [];

  return (
    <section aria-label="Explorar eventos" className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="w-full space-y-2 sm:max-w-xs">
          <label htmlFor="events-category" className="text-sm font-medium text-foreground">
            Filtrar por categoría
          </label>
          <select
            id="events-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={ALL_CATEGORIES}>Todas las categorías</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div aria-label="Vista de eventos" className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground sm:flex-none"
          >
            <List aria-hidden="true" className="h-4 w-4" />
            Lista
          </button>
          <button
            type="button"
            aria-pressed={view === "calendar"}
            onClick={() => setView("calendar")}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground sm:flex-none"
          >
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            Calendario
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
        {view === "calendar" && displayMonth
          ? `${monthEvents.length} ${monthEvents.length === 1 ? "evento" : "eventos"} en ${monthLabel(displayMonth)}${category !== ALL_CATEGORIES ? ` · ${filteredEvents.length} en esta categoría en total` : ""}`
          : `${filteredEvents.length} ${filteredEvents.length === 1 ? "evento encontrado" : "eventos encontrados"}`}
      </p>

      {filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
          <CalendarDays aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">No hay eventos para mostrar</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {events.length ? "Prueba con otra categoría." : "Vuelve pronto para conocer las próximas actividades."}
          </p>
        </div>
      ) : view === "list" ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <li key={`${event.href}-${event.date}-${index}`}>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{event.category}</span>
                  <time dateTime={event.date} className="text-muted-foreground">
                    {event.dateLabel}
                  </time>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold leading-snug text-foreground">{event.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{event.description}</p>
                </div>
                {event.meta ? <p className="text-xs text-muted-foreground">{event.meta}</p> : null}
                <Link
                  href={event.href}
                  aria-label={`Ver detalles de ${event.title}, ${event.dateLabel}, evento ${index + 1}`}
                  className="mt-auto inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Ver detalles <span aria-hidden="true" className="ml-1">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : displayMonth ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
            <button
              type="button"
              aria-label="Mes anterior"
              onClick={() => setDisplayMonth((month) => month ? shiftMonth(month, -1) : month)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <h3 className="text-center text-lg font-semibold capitalize text-foreground sm:text-xl">
              {monthLabel(displayMonth)}
            </h3>
            <button
              type="button"
              aria-label="Mes siguiente"
              onClick={() => setDisplayMonth((month) => month ? shiftMonth(month, 1) : month)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div
            role="region"
            aria-label={`Calendario mensual de ${monthLabel(displayMonth)}. Desplázate horizontalmente para ver todos los días.`}
            tabIndex={0}
            className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <table className="w-full min-w-[840px] table-fixed border-collapse">
              <caption className="sr-only">Eventos de {monthLabel(displayMonth)}</caption>
              <thead>
                <tr>
                  {WEEKDAYS.map((weekday) => (
                    <th key={weekday} scope="col" className="border-b border-border px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      {weekday}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
                  <tr key={weekIndex}>
                    {days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, weekdayIndex) => {
                      const dayEvents = day === null ? [] : eventsByDay.get(day) ?? [];
                      return (
                        <td key={`${weekIndex}-${weekdayIndex}`} className="h-32 border-b border-r border-border p-2 align-top last:border-r-0">
                          {day !== null ? (
                            <>
                              <span className="mb-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-muted px-1 text-xs font-semibold tabular-nums text-foreground">
                                {day}
                              </span>
                              <ul className="space-y-1">
                                {dayEvents.map(({ event, index }) => (
                                  <li key={`${event.href}-${event.date}-${index}`}>
                                    <Link
                                      href={event.href}
                                      aria-label={`Ver detalles de ${event.title}, ${event.dateLabel}, evento ${index + 1}`}
                                      className="block rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-medium leading-4 text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                      <span className="line-clamp-2">{event.title}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {monthEvents.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-muted-foreground">No hay eventos este mes.</p>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">No hay un mes disponible porque todavía no hay eventos publicados.</p>
        </div>
      )}
    </section>
  );
}
