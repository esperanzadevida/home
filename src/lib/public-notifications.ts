export type PublicNotificationEvent = {
  slug: string;
  title: string;
  description: string;
  href: string;
  startDates: string[];
};

export type PublicNotification = {
  id: string;
  kind: "event";
  title: string;
  description: string;
  href: string;
  scheduledAt: string;
};

const UPCOMING_EVENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function getUpcomingPublicNotifications(
  events: PublicNotificationEvent[],
  now = new Date(),
): PublicNotification[] {
  const nowMs = now.getTime();
  const windowEnd = nowMs + UPCOMING_EVENT_WINDOW_MS;

  return events
    .flatMap((event) => {
      const nextStart = event.startDates
        .map((value) => ({ value, timestamp: Date.parse(value) }))
        .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp > nowMs && timestamp <= windowEnd)
        .sort((a, b) => a.timestamp - b.timestamp)[0];

      if (!nextStart) return [];

      return [{
        id: `event:${event.slug}:${nextStart.value}`,
        kind: "event" as const,
        title: `Próximo evento: ${event.title}`,
        description: event.description,
        href: event.href,
        scheduledAt: nextStart.value,
      }];
    })
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));
}
