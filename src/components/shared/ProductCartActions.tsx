"use client";

import { useState } from "react";

type StoredCartItem = {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  variant?: string;
};

type ProductCartActionsProps = {
  productId: string;
  title: string;
  price: number;
  variants?: string[];
};

const CART_KEY = "domenica-cart-v1";
const MAX_QUANTITY = 20;

export function ProductCartActions({
  productId,
  title,
  price,
  variants = [],
}: ProductCartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(variants[0] ?? "");
  const [status, setStatus] = useState("");

  function addToCart() {
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      const items = Array.isArray(parsed)
        ? (parsed as StoredCartItem[]).filter(
            (item) =>
              typeof item?.productId === "string" &&
              typeof item?.title === "string" &&
              typeof item?.unitPrice === "number" &&
              typeof item?.quantity === "number",
          )
        : [];

      const existing = items.find(
        (item) => item.productId === productId && item.variant === (variant || undefined),
      );

      const next = existing
        ? items.map((item) =>
            item === existing
              ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
              : item,
          )
        : [
            ...items,
            {
              productId,
              title,
              unitPrice: price,
              quantity,
              ...(variant ? { variant } : {}),
            },
          ];

      window.localStorage.setItem(CART_KEY, JSON.stringify(next));
      setStatus(
        `${quantity} ${quantity === 1 ? "unidad añadida" : "unidades añadidas"} a tu carrito en este dispositivo. No se procesó ningún pedido ni pago.`,
      );
    } catch {
      setStatus("No pudimos guardar el carrito en este navegador. Consulta disponibilidad en la sede.");
    }
  }

  return (
    <section
      aria-labelledby="product-cart-title"
      className="max-w-xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6"
    >
      <h2 id="product-cart-title" className="text-lg font-semibold text-foreground">
        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(price)}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        El carrito se guarda en este navegador; la compra y el pago no están habilitados.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {variants.length > 0 ? (
          <div className="space-y-2">
            <label htmlFor="product-variant" className="block text-sm font-medium text-foreground">
              Talla
            </label>
            <select
              id="product-variant"
              value={variant}
              onChange={(event) => setVariant(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {variants.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="product-quantity" className="block text-sm font-medium text-foreground">
            Cantidad
          </label>
          <input
            id="product-quantity"
            type="number"
            min={1}
            max={MAX_QUANTITY}
            step={1}
            value={quantity}
            onChange={(event) => {
              const nextQuantity = Number(event.target.value);
              if (Number.isInteger(nextQuantity)) {
                setQuantity(Math.min(MAX_QUANTITY, Math.max(1, nextQuantity)));
              }
            }}
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={addToCart}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
      >
        Agregar al carrito
      </button>
      {status ? (
        <p role="status" aria-live="polite" aria-atomic="true" className="mt-4 text-sm leading-6 text-muted-foreground">
          {status}
        </p>
      ) : null}
    </section>
  );
}
