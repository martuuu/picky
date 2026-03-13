"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
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
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="shrink-0 w-40 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg"
          >
            {/* Product Image */}
            <Link href={`/product/${product.sku}`} className="block relative h-32 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform hover:scale-110"
                unoptimized
              />
              {product.originalPrice && (
                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-secondary text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase">
                    Oferta
                  </span>
                </div>
              )}
            </Link>

            {/* Product Info */}
            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              {/* Name */}
              <Link href={`/product/${product.sku}`} className="block">
                <h4 className="font-black text-xs uppercase italic leading-tight line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
                  {product.name}
                </h4>
              </Link>

              {/* Price */}
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-[9px] text-slate-400 line-through font-bold">
                    ${product.originalPrice.toLocaleString("es-AR")}
                  </span>
                )}
                <span className="text-lg font-black gradient-text-logo">
                  ${product.price.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full h-9 rounded-xl text-white text-[9px] font-black uppercase flex items-center justify-center gap-1 shadow-lg hover:scale-105 active:scale-95 transition-all relative overflow-hidden ${
                  addedItemIds.includes(product.id) 
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : "bg-gradient-logo-full"
                }`}
              >
                <AnimatePresence mode="wait">
                  {addedItemIds.includes(product.id) ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} strokeWidth={3} />
                      ¡Agregado!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1"
                    >
                      <Plus size={14} strokeWidth={3} />
                      Agregar
                    </motion.div>
                  )}
                </AnimatePresence>
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
                ? "w-6 bg-gradient-logo-full"
                : "w-1.5 bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
