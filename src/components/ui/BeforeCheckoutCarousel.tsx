"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, CheckCircle2, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { Button } from "./Button";
import { useCartStore } from "@/stores/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeCheckoutCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function BeforeCheckoutCarousel({ products, title, subtitle }: BeforeCheckoutCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
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
    
    setAddedItemIds(prev => [...prev, product.id]);
    setTimeout(() => {
        setAddedItemIds(prev => prev.filter(id => id !== product.id));
    }, 1200);
  };

  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-base font-black italic uppercase tracking-tighter gradient-text-logo">{title}</h3>
        {subtitle && (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        )}
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-[130px] rounded-[1.25rem] overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            {/* Product Image */}
            <Link href={`/product/${product.sku}`} className="block relative h-[100px] bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-110"
                unoptimized
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-secondary text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                    Oferta
                  </span>
                </div>
              )}
            </Link>

            {/* Product Info */}
            <div className="p-2.5 space-y-1.5 flex flex-col justify-between">
              {/* Name */}
              <Link href={`/product/${product.sku}`} className="block">
                <h4 className="font-black text-[9px] uppercase italic leading-tight line-clamp-2 min-h-[1.75rem] hover:text-primary transition-colors">
                  {product.name}
                </h4>
              </Link>

              {/* Price and Add Button */}
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex flex-col">
                  {product.originalPrice && (
                    <span className="text-[8px] text-slate-400 line-through font-bold leading-none mb-0.5">
                      ${product.originalPrice.toLocaleString("es-AR")}
                    </span>
                  )}
                  <span className="text-sm font-black gradient-text-logo leading-none">
                    ${product.price.toLocaleString("es-AR")}
                  </span>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`size-6 rounded-md flex items-center justify-center transition-all ${
                    addedItemIds.includes(product.id)
                      ? "bg-emerald-500 text-white border-transparent"
                      : "border border-slate-300 dark:border-slate-600 text-slate-400 hover:border-primary hover:text-primary"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {addedItemIds.includes(product.id) ? (
                      <motion.div
                        key="added"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="add"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <ShoppingCart size={12} strokeWidth={2.5} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
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
                ? "w-6 bg-gradient-logo-full"
                : "w-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
