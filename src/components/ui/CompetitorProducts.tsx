"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";

interface CompetitorProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

export function CompetitorProducts({ currentProduct, allProducts }: CompetitorProductsProps) {
  let competitors = allProducts
    .filter(p => 
      p.category === currentProduct.category && 
      p.id !== currentProduct.id
    )
    .slice(0, 4); // Show max 4 competitors

  // Fallback for prototype: Simulate competitors based on the current product
  if (competitors.length === 0) {
    competitors = allProducts
      .filter(p => p.id !== currentProduct.id)
      .slice(0, 4)
      .map((p, index) => ({
        ...p,
        name: `${currentProduct.name.split(' ')[0]} ${index === 0 ? 'Premium' : index === 1 ? 'Standard' : index === 2 ? 'Pro' : 'Eco'} Alternativo`,
        category: currentProduct.category,
        image: currentProduct.image,
        price: index % 2 === 0 
          ? Math.round(currentProduct.price * (1.15 + (index * 0.05)) / 100) * 100 
          : Math.round(currentProduct.price * (0.85 - (index * 0.05)) / 100) * 100
      }));
  }

  if (competitors.length === 0) return null;

  return (
    <section className="pb-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="gradient-text-tertiary" />
          <h3 className="text-xl font-black italic uppercase tracking-tighter">
            La <span className="gradient-text-tertiary">Competencia</span>
          </h3>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Otras opciones en {currentProduct.category}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {competitors.map((product) => {
            const isCheaper = product.price < currentProduct.price;
            const diffPerc = isCheaper
              ? Math.round(((currentProduct.price - product.price) / currentProduct.price) * 100)
              : Math.round(((product.price - currentProduct.price) / currentProduct.price) * 100);

            return (
              <Link
                key={product.id}
                href={`/product/${product.sku}`}
                className="group flex flex-col rounded-[2rem] overflow-hidden bg-slate-800 dark:bg-slate-800/80 border border-slate-700 shadow-xl transition-all hover:scale-[1.02]"
              >
                {/* Product Image Box */}
                <div className="relative aspect-square bg-slate-900/50 p-3 flex items-center justify-center">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-white/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Info Container */}
                <div className="flex flex-col flex-1 p-4 justify-between bg-slate-800/40">
                  <div className="space-y-3">
                    <h4 className="font-black text-xs uppercase italic leading-tight line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                      {product.name}
                    </h4>
                    
                    <p className="text-xl font-black gradient-text-tertiary">
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-700/50">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      isCheaper ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      {diffPerc}% {isCheaper ? 'más barato' : 'más caro'}
                    </span>
                  </div>
                </div>
              </Link>
            )
        })}
      </div>
    </section>
  );
}
