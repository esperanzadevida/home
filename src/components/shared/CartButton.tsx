"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const { totalItems, isOpen, toggleCart } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-11 w-11 rounded-full text-foreground hover:bg-muted"
      onClick={toggleCart}
      aria-label="Abrir carrito de compras"
      aria-controls="cart-dialog"
      aria-expanded={isOpen}
    >
      <ShoppingBag aria-hidden="true" className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground shadow-sm animate-in zoom-in-50">
          {totalItems}
        </span>
      )}
    </Button>
  );
}
