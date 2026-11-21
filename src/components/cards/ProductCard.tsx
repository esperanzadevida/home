"use client";

import Link from "next/link";
import Image from "@/components/shared/SiteImage";
import { ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/providers/CartProvider";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:-translate-y-1 shadow-sm flex flex-col">
      {/* Cover Image con Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={product.coverImage}
          alt={product.name}
          fill
          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc((100vw - 3rem) / 2), (max-width: 1279px) calc((100vw - 6rem) / 4), 18rem"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2.5 py-1 rounded-md bg-background/90 text-foreground text-[10px] font-bold shadow backdrop-blur-sm">
            {product.category}
          </span>
          {product.compareAtPrice && (
            <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[10px] font-bold shadow">
              Oferta
            </span>
          )}
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-warning/90 text-warning-foreground text-[10px] font-semibold">
            ¡Últimas {product.stock} unidades!
          </span>
        )}
      </div>

      {/* Info del Producto */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link href={`/tienda/${product.id}`}>
            <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <Button
          variant={added ? "accent" : "default"}
          size="sm"
          className="w-full font-semibold gap-1.5 transition-all"
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> ¡Añadido al Carrito!
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Añadir al Carrito
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
