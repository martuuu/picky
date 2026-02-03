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
  // Filter products in the same category, excluding the current product
  const competitors = allProducts
    .filter(p => 
      p.category === currentProduct.category && 
      p.id !== currentProduct.id
    )
    .slice(0, 4); // Show max 4 competitors

  if (competitors.length === 0) return null;

  return (
    <section className="px-6 pb-6">
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

      <div className="grid grid-cols-2 gap-4">
        {competitors.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.sku}`}
            className="group"
          >
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02]">
              {/* Product Image */}
              <div className="relative aspect-square bg-slate-50 dark:bg-slate-900 p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
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
              <div className="p-4 space-y-2">
                <h4 className="font-black text-sm uppercase italic leading-tight line-clamp-2 group-hover:gradient-text-tertiary transition-all">
                  {product.name}
                </h4>

                <div className="flex items-end justify-between">
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

                  <div className="size-8 rounded-full bg-gradient-purple-orange flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>

                {/* Price Comparison */}
                {currentProduct.price !== product.price && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      product.price < currentProduct.price
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {product.price < currentProduct.price
                        ? `${Math.round(((currentProduct.price - product.price) / currentProduct.price) * 100)}% más barato`
                        : `${Math.round(((product.price - currentProduct.price) / currentProduct.price) * 100)}% más caro`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
