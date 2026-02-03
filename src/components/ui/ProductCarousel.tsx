"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { useCartStore } from "@/stores/useCartStore";
import { showPickyAlert } from "./Alert";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function ProductCarousel({ products, title, subtitle }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCartStore();

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showPickyAlert(product.name, "Agregado a tu pedido actual", "cart");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </div>

      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-[2.5rem]">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-full flex-shrink-0 p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex gap-4 items-center">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                    {product.originalPrice && (
                      <div className="absolute top-1 left-1">
                        <span className="bg-gradient-secondary text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase glow-secondary">
                          Oferta
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-black text-sm uppercase italic leading-tight truncate">
                        {product.name}
                      </h4>
                      <div className="flex flex-col items-end flex-shrink-0">
                        {product.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through font-bold">
                            ${product.originalPrice.toLocaleString("es-AR")}
                          </span>
                        )}
                        <span className="text-lg font-black gradient-text-tertiary">
                          ${product.price.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="gradient-purple-orange"
                      size="sm"
                      className="w-full gap-2"
                    >
                      <Plus size={14} strokeWidth={3} />
                      Agregar al Pedido
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center text-slate-900 dark:text-white hover:scale-110 transition-transform z-10"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center text-slate-900 dark:text-white hover:scale-110 transition-transform z-10"
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-gradient-purple-orange glow-tertiary"
                  : "w-1.5 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
