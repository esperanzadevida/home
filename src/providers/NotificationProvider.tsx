"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getUpcomingPublicNotifications,
  type PublicNotification,
  type PublicNotificationEvent,
} from "@/lib/public-notifications";

const READ_NOTIFICATION_STORAGE_KEY = "domenica-public-notifications-read-v1";

type NotificationContextValue = {
  notifications: PublicNotification[];
  unreadCount: number;
  isReady: boolean;
  isRead: (id: string) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function readStoredIds(): string[] {
  try {
    const value = window.localStorage.getItem(READ_NOTIFICATION_STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function NotificationProvider({
  events,
  children,
}: {
  events: PublicNotificationEvent[];
  children: ReactNode;
}) {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setReadIds(readStoredIds());
    setIsReady(true);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === READ_NOTIFICATION_STORAGE_KEY) {
        setReadIds(readStoredIds());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(READ_NOTIFICATION_STORAGE_KEY, JSON.stringify(readIds));
    } catch {
      // In-app notifications remain usable when storage is unavailable.
    }
  }, [isReady, readIds]);

  const notifications = useMemo(
    () => isReady ? getUpcomingPublicNotifications(events) : [],
    [events, isReady],
  );
  const readIdSet = useMemo(() => new Set(readIds), [readIds]);

  const isRead = useCallback((id: string) => readIdSet.has(id), [readIdSet]);
  const markAsRead = useCallback((id: string) => {
    setReadIds((current) => current.includes(id) ? current : [...current, id]);
  }, []);
  const markAllAsRead = useCallback(() => {
    setReadIds((current) => [...new Set([...current, ...notifications.map(({ id }) => id)])]);
  }, [notifications]);

  const value = useMemo<NotificationContextValue>(() => ({
    notifications,
    unreadCount: notifications.filter(({ id }) => !readIdSet.has(id)).length,
    isReady,
    isRead,
    markAsRead,
    markAllAsRead,
  }), [notifications, readIdSet, isReady, isRead, markAsRead, markAllAsRead]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function usePublicNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("usePublicNotifications debe usarse dentro de NotificationProvider.");
  }
  return context;
}
