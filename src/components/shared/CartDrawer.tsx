"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Minus,
  NotebookPen,
  Plus,
  Shirt,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";

const currency = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    const panel = panelRef.current;
    if (!drawer || !panel) return;
    const activePanel = panel;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const appShell = drawer.parentElement;
    const backgroundElements = appShell
      ? Array.from(appShell.children).filter(
          (element): element is HTMLElement => element instanceof HTMLElement && element !== drawer,
        )
      : [];
    const previousInertValues = backgroundElements.map((element) => element.inert);
    backgroundElements.forEach((element) => {
      element.inert = true;
    });

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        activePanel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");

      if (focusable.length === 0) {
        event.preventDefault();
        activePanel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      backgroundElements.forEach((element, index) => {
        element.inert = previousInertValues[index];
      });
      if (previouslyFocusedRef.current?.isConnected) previouslyFocusedRef.current.focus();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div ref={drawerRef} className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        tabIndex={-1}
        onClick={closeCart}
        className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
      />

      <section
        ref={panelRef}
        id="cart-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        aria-describedby="cart-description"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-lg flex-col border-l border-border bg-card text-card-foreground shadow-2xl outline-none motion-safe:animate-in motion-safe:slide-in-from-right duration-300"
      >
        <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag aria-hidden="true" className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="cart-title" className="text-base font-semibold tracking-tight text-foreground">
                Tu carrito
              </h2>
              <p id="cart-description" className="mt-0.5 text-xs text-muted-foreground">
                {totalItems} {totalItems === 1 ? "recurso guardado" : "recursos guardados"} en este navegador
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag aria-hidden="true" className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-foreground">Tu carrito está vacío</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Explora los recursos disponibles y guarda aquí lo que quieras consultar en la sede.
            </p>
            <Button variant="outline" onClick={closeCart} className="mt-6 min-h-11 rounded-full px-5">
              Ver recursos
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 sm:px-7">
              <ul aria-label="Recursos en tu carrito" className="space-y-3">
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.variant ?? "default"}`}
                    className="flex gap-4 rounded-2xl border border-border bg-background p-3 sm:p-4"
                  >
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-accent/15 text-primary">
                      {item.product.category === "Ropa" ? (
                        <Shirt aria-hidden="true" className="h-7 w-7" />
                      ) : item.product.category === "Accesorios" ? (
                        <NotebookPen aria-hidden="true" className="h-7 w-7" />
                      ) : (
                        <BookOpen aria-hidden="true" className="h-7 w-7" />
                      )}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                          {item.product.name}
                        </h3>
                        {item.variant ? (
                          <p className="mt-1 text-xs text-muted-foreground">Talla {item.variant}</p>
                        ) : null}
                        <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                          {currency.format(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div
                          className="inline-flex h-11 items-center rounded-full border border-border bg-card"
                          aria-label={`Cantidad de ${item.product.name}`}
                        >
                          <button
                            type="button"
                            aria-label={`Reducir cantidad de ${item.product.name}${item.variant ? `, talla ${item.variant}` : ""}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                          >
                            <Minus aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <span className="min-w-7 text-center text-sm font-semibold tabular-nums text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumentar cantidad de ${item.product.name}${item.variant ? `, talla ${item.variant}` : ""}`}
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                          >
                            <Plus aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Quitar ${item.product.name}${item.variant ? `, talla ${item.variant}` : ""} del carrito`}
                          onClick={() => removeItem(item.product.id, item.variant)}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Trash2 aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="space-y-4 border-t border-border bg-muted/20 px-5 py-5 sm:px-7">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal de referencia</span>
                <span className="font-semibold tabular-nums text-foreground">{currency.format(subtotal)}</span>
              </div>
              <p className="rounded-xl bg-background px-4 py-3 text-xs leading-5 text-muted-foreground">
                La disponibilidad puede variar. Los pedidos y pagos se consultan en el punto de recursos de la sede.
              </p>
              <Button asChild className="min-h-12 w-full rounded-full font-semibold">
                <Link href="/contacto" onClick={closeCart}>
                  Consultar en la sede
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
