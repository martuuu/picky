"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { useCartStore } from "@/stores/useCartStore";
import { showPickyAlert } from "./Alert";

interface BeforeCheckoutCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function BeforeCheckoutCarousel({ products, title, subtitle }: BeforeCheckoutCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCartStore();

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showPickyAlert(product.name, "Agregado a tu pedido", "cart");
  };

  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-base font-black italic uppercase tracking-tighter gradient-text-tertiary">{title}</h3>
        {subtitle && (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-40 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg"
          >
            {/* Product Image */}
            <div className="relative h-32 bg-slate-50 dark:bg-slate-900">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-3"
                unoptimized
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-secondary text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase">
                    Oferta
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 space-y-2">
              {/* Name */}
              <h4 className="font-black text-xs uppercase italic leading-tight line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h4>

              {/* Price */}
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-[9px] text-slate-400 line-through font-bold">
                    ${product.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
                <span className="text-lg font-black gradient-text-tertiary">
                  ${product.price.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full h-9 rounded-xl bg-gradient-purple-orange text-white text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-lg glow-tertiary hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={14} strokeWidth={3} />
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-gradient-purple-orange"
                : "w-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
