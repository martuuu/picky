"use client";

import { Product } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, ArrowRight, ShoppingCart } from "lucide-react";

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
        <div>
          <h3 className="text-lg font-black italic uppercase tracking-tighter">
            La Competencia
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

            const brandSpec = product.specs?.find(s => s.label.toLowerCase() === 'marca');
            const brandName = brandSpec ? brandSpec.value : 'Original Picky';

            return (
              <Link
                key={product.id}
                href={`/product/${product.sku}`}
                className="group flex flex-col rounded-[2rem] overflow-hidden bg-slate-800 dark:bg-slate-800/80 border border-slate-700 shadow-xl transition-all hover:scale-[1.02]"
              >
                {/* Product Image Box */}
                <div className="relative h-24 bg-slate-900/50 p-2 flex items-center justify-center">
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-lg shadow-emerald-500/20">
                      {isCheaper ? `-${diffPerc}% OFF` : `+${diffPerc}%`}
                    </span>
                  </div>
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border border-white/5">
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
                <div className="flex flex-col flex-1 p-3 justify-between bg-slate-800/40">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{brandName}</p>
                    <h4 className="font-black text-[9px] uppercase italic leading-tight line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                      {product.name}
                    </h4>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm font-black gradient-text-tertiary leading-none">
                      ${product.price.toLocaleString("es-AR")}
                    </p>
                    <button 
                      className="size-6 rounded-lg border border-slate-600 text-slate-400 flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        // Optional Add to Cart Logic here
                      }}
                    >
                      <ShoppingCart size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </Link>
            )
        })}
      </div>
    </section>
  );
}
