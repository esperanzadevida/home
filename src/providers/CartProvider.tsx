"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product } from "@/types";

export type CartProduct = Pick<Product, "id" | "name" | "price" | "coverImage" | "category">;

export interface CartItem {
  product: CartProduct;
  quantity: number;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: CartProduct, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CART_STORAGE_KEY = "domenica_church_cart";
const LEGACY_CART_STORAGE_KEY = "domenica-cart-v1";
const MAX_QUANTITY = 20;

const CartContext = createContext<CartContextType | undefined>(undefined);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CartItem>;
  const product = candidate.product;

  return Boolean(
    product &&
      typeof product.id === "string" &&
      typeof product.name === "string" &&
      typeof product.price === "number" &&
      typeof product.coverImage === "string" &&
      typeof product.category === "string" &&
      typeof candidate.quantity === "number" &&
      Number.isInteger(candidate.quantity) &&
      candidate.quantity > 0,
  );
}

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function migrateLegacyCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((value): CartItem[] => {
      if (!value || typeof value !== "object") return [];
      const item = value as {
        productId?: unknown;
        title?: unknown;
        unitPrice?: unknown;
        quantity?: unknown;
        variant?: unknown;
      };

      if (
        typeof item.productId !== "string" ||
        typeof item.title !== "string" ||
        typeof item.unitPrice !== "number" ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return [];
      }

      const coverImage = item.productId.includes("camiseta")
        ? "/images/hero/merch-tshirt-hoodie-minimal.jpg"
        : item.productId.includes("cuaderno")
          ? "/images/hero/christian-books-bible-store.jpg"
          : "/images/hero/bible-study.jpg";

      return [
        {
          product: {
            id: item.productId,
            name: item.title,
            price: item.unitPrice,
            coverImage,
            category: item.productId.includes("camiseta")
              ? "Ropa"
              : item.productId.includes("cuaderno")
                ? "Accesorios"
                : "Biblias",
          },
          quantity: Math.min(MAX_QUANTITY, item.quantity),
          ...(typeof item.variant === "string" ? { variant: item.variant } : {}),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const restored = saved
        ? parseCart(saved)
        : migrateLegacyCart(localStorage.getItem(LEGACY_CART_STORAGE_KEY));
      setItems(restored);
    } catch {
      // The cart remains usable for this visit when browser storage is unavailable.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The cart remains usable for this visit when browser storage is unavailable.
    }
  }, [isHydrated, items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((previous) => !previous), []);

  const addItem = useCallback((product: CartProduct, quantity = 1, variant?: string) => {
    const safeQuantity = Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
    setItems((previous) => {
      const existing = previous.find(
        (item) => item.product.id === product.id && item.variant === variant,
      );

      if (existing) {
        return previous.map((item) =>
          item === existing
            ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + safeQuantity) }
            : item,
        );
      }

      return [...previous, { product, quantity: safeQuantity, ...(variant ? { variant } : {}) }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, variant?: string) => {
    setItems((previous) =>
      previous.filter((item) => !(item.product.id === productId && item.variant === variant)),
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      setItems((previous) =>
        previous.filter((item) => !(item.product.id === productId && item.variant === variant)),
      );
      return;
    }

    const safeQuantity = Math.min(MAX_QUANTITY, Math.floor(quantity));
    setItems((previous) =>
      previous.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}
