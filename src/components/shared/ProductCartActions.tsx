"use client";

import { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import type { Product } from "@/types";

type ProductCartActionsProps = {
  productId: string;
  title: string;
  price: number;
  coverImage: string;
  category: Product["category"];
  variants?: string[];
};

const MAX_QUANTITY = 20;

export function ProductCartActions({
  productId,
  title,
  price,
  coverImage,
  category,
  variants = [],
}: ProductCartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(variants[0] ?? "");
  const [status, setStatus] = useState("");
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(
      { id: productId, name: title, price, coverImage, category },
      quantity,
      variant || undefined,
    );
    setStatus(`${quantity} ${quantity === 1 ? "unidad añadida" : "unidades añadidas"} al carrito.`);
  }

  return (
    <section
      aria-labelledby="product-cart-title"
      className="max-w-xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6"
    >
      <h2 id="product-cart-title" className="text-lg font-semibold text-foreground">
        {new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(price)}
      </h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        El carrito se guarda en este navegador; los pedidos y pagos en línea no están habilitados.
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
        onClick={handleAddToCart}
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
