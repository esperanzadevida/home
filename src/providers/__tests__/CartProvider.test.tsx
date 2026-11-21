import type { PropsWithChildren } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CartProvider, useCart, type CartProduct } from "@/providers/CartProvider";

const product: CartProduct = {
  id: "biblia-estudio",
  name: "Biblia de estudio",
  price: 24.5,
  coverImage: "/images/biblia.jpg",
  category: "Biblias",
};

function wrapper({ children }: PropsWithChildren) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("opens the cart, combines matching variants, and calculates totals", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(product, 2, "mediana");
      result.current.addItem(product, 1, "mediana");
      result.current.addItem(product, 2, "grande");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(5);
    expect(result.current.subtotal).toBe(122.5);
  });

  it("caps item quantities at twenty and removes items at zero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(product, 99));
    expect(result.current.items[0].quantity).toBe(20);

    act(() => result.current.updateQuantity(product.id, 25));
    expect(result.current.items[0].quantity).toBe(20);

    act(() => result.current.updateQuantity(product.id, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("migrates the legacy cart and caps its stored quantity", async () => {
    localStorage.setItem(
      "domenica-cart-v1",
      JSON.stringify([
        {
          productId: "camiseta-doménica",
          title: "Camiseta Doménica",
          unitPrice: 18,
          quantity: 27,
          variant: "M",
        },
      ]),
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.items[0]).toMatchObject({
      quantity: 20,
      variant: "M",
      product: { id: "camiseta-doménica", name: "Camiseta Doménica", category: "Ropa" },
    });
    expect(JSON.parse(localStorage.getItem("domenica_church_cart") ?? "[]")).toHaveLength(1);
  });

  it("keeps the cart usable when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage unavailable");
    });

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(0));

    expect(() => act(() => result.current.addItem(product))).not.toThrow();
    expect(result.current.totalItems).toBe(1);
  });

  it("ignores malformed saved data", async () => {
    localStorage.setItem("domenica_church_cart", "not-json");

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(0));
    expect(result.current.subtotal).toBe(0);
  });
});
