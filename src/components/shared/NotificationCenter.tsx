"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, Check, CheckCheck, Inbox, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePublicNotifications } from "@/providers/NotificationProvider";
import type { PublicNotification } from "@/lib/public-notifications";

function formatScheduledAt(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function NotificationEmptyState() {
  return (
    <div className="notification-empty-state">
      <span className="notification-empty-icon">
        <Inbox aria-hidden="true" className="h-6 w-6" />
      </span>
      <h3>Todo al día</h3>
      <p>No hay recordatorios de eventos para los próximos días.</p>
      <Dialog.Close asChild>
        <Link href="/eventos" className="notification-empty-link">
          Explorar eventos
        </Link>
      </Dialog.Close>
    </div>
  );
}

function NotificationItem({
  notification,
  isRead,
  onMarkRead,
}: {
  notification: PublicNotification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
}) {
  return (
    <li className={`notification-item${isRead ? " is-read" : " is-unread"}`}>
      <span className="notification-item-icon">
        <CalendarDays aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="notification-item-kind">Próximo evento</p>
        <Link
          href={notification.href}
          onClick={() => onMarkRead(notification.id)}
          className="notification-item-title"
        >
          {notification.title.replace(/^Próximo evento: /, "")}
        </Link>
        <p className="notification-item-description">{notification.description}</p>
        <time className="notification-item-time" dateTime={notification.scheduledAt}>
          {formatScheduledAt(notification.scheduledAt)}
        </time>
      </div>
      {!isRead && (
        <button
          type="button"
          className="notification-mark-read"
          onClick={() => onMarkRead(notification.id)}
          aria-label={`Marcar como leído: ${notification.title}`}
          title="Marcar como leído"
        >
          <Check aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </li>
  );
}

export function NotificationCenter() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const focusMainAfterClose = useRef(false);
  const previousPathname = useRef(pathname);
  const { notifications, unreadCount, isReady, isRead, markAsRead, markAllAsRead } = usePublicNotifications();

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (isOpen) {
      focusMainAfterClose.current = true;
      setIsOpen(false);
    }
  }, [isOpen, pathname]);

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success("Todos los recordatorios están marcados como leídos.");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="notification-center-trigger"
          aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones"}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="notification-count" aria-hidden="true">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="notification-panel-overlay" />
        <Dialog.Content
          className="notification-panel"
          onCloseAutoFocus={(event) => {
            if (!focusMainAfterClose.current) return;
            event.preventDefault();
            focusMainAfterClose.current = false;
            requestAnimationFrame(() => {
              document.getElementById("main-content")?.focus({ preventScroll: true });
            });
          }}
        >
          <header className="notification-panel-header">
            <div className="min-w-0">
              <Dialog.Title className="notification-panel-title">Recordatorios</Dialog.Title>
              <Dialog.Description className="notification-panel-description">
                Eventos próximos publicados en el sitio.
              </Dialog.Description>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notification-mark-all"
                  onClick={handleMarkAllRead}
                  aria-label="Marcar todos los recordatorios como leídos"
                >
                  <CheckCheck aria-hidden="true" className="h-4 w-4" />
                  <span className="hidden sm:inline">Marcar todo leído</span>
                </button>
              )}
              <Dialog.Close asChild>
                <button type="button" className="notification-panel-close" aria-label="Cerrar recordatorios">
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          </header>

          <div className="notification-panel-body" aria-live="polite" aria-busy={!isReady}>
            {!isReady ? (
              <p className="notification-loading">Cargando recordatorios…</p>
            ) : notifications.length === 0 ? (
              <NotificationEmptyState />
            ) : (
              <ul className="notification-list">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={isRead(notification.id)}
                    onMarkRead={markAsRead}
                  />
                ))}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
