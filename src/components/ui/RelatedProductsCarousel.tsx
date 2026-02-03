"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { useCartStore } from "@/stores/useCartStore";
import { showPickyAlert } from "./Alert";

interface RelatedProductsCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function RelatedProductsCarousel({ products, title, subtitle }: RelatedProductsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCartStore();

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
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
    showPickyAlert(product.name, "Agregado a tu pedido", "cart");
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-xl font-black italic uppercase tracking-tighter gradient-text-tertiary">{title}</h3>
        {subtitle && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </div>

      {/* Carousel Card */}
      <div className="relative">
        <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl">
          {/* Product Display */}
          <div className="p-6">
            {/* Product Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 mb-4">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
              {currentProduct.originalPrice && (
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-secondary text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase glow-secondary">
                    Oferta
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              {/* Category */}
              <span className="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 dark:bg-primary/20 gradient-text-primary">
                {currentProduct.category}
              </span>

              {/* Name */}
              <h4 className="font-black text-lg uppercase italic leading-tight">
                {currentProduct.name}
              </h4>

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                {currentProduct.description}
              </p>

              {/* Price & Action */}
              <div className="flex items-end justify-between pt-2">
                <div className="flex flex-col">
                  {currentProduct.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-bold">
                      ${currentProduct.originalPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  <span className="text-3xl font-black gradient-text-tertiary">
                    ${currentProduct.price.toLocaleString("es-AR")}
                  </span>
                </div>

                <Button
                  onClick={() => handleAddToCart(currentProduct)}
                  variant="gradient-purple-orange"
                  size="lg"
                  className="gap-2"
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center text-slate-900 dark:text-white hover:scale-110 transition-transform z-10 border-2 border-slate-100 dark:border-slate-700"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white dark:bg-slate-900 shadow-2xl flex items-center justify-center text-slate-900 dark:text-white hover:scale-110 transition-transform z-10 border-2 border-slate-100 dark:border-slate-700"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-gradient-purple-orange glow-tertiary"
                  : "w-2 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
