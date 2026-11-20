"use client";

import { useCart } from "@/providers/CartProvider";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop con Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header del Carrito */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-lg text-foreground">Tu Carrito de Compra</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Productos del Carrito */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-foreground">Tu carrito está vacío</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Explora nuestra tienda de recursos y literatura bíblica para apoyar las misiones.
                </p>
                <Button variant="outline" size="sm" onClick={closeCart} className="mt-2 font-semibold">
                  Continuar Explorando
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-background border border-border"
                >
                  <img
                    src={item.product.coverImage}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-extrabold text-foreground mt-0.5">
                        ${item.product.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border rounded-lg bg-card">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-muted text-muted-foreground hover:text-foreground rounded-l-lg"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-muted text-muted-foreground hover:text-foreground rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-destructive hover:opacity-80 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito con Subtotal y Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/20 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío a domicilio</span>
                  <span className="text-success font-semibold">Calculado en checkout</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-foreground pt-2 border-t border-border/50">
                  <span>Total Estimado</span>
                  <span className="text-primary text-base">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full font-bold gap-2 text-sm shadow-md">
                Proceder al Pago Seguro
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Tu compra sostiene directamente obras misioneras</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
