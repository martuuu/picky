"use client";

import Image from "next/image";
import { Sparkles, Percent, ShoppingCart } from "lucide-react";
import { Button } from "./Button";

interface Promotion {
  id: number;
  title: string;
  description: string;
  discount: number;
  originalPrice: number;
  finalPrice: number;
  image: string;
  type: "promo" | "combo";
}

const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    title: "Combo Pintura Completo",
    description: "Látex + Rodillo + Bandeja",
    discount: 25,
    originalPrice: 65000,
    finalPrice: 48750,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800",
    type: "combo"
  },
  {
    id: 2,
    title: "Pack Herramientas",
    description: "Taladro + Brocas + Nivel",
    discount: 30,
    originalPrice: 250000,
    finalPrice: 175000,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800",
    type: "combo"
  },
  {
    id: 3,
    title: "Oferta Cemento",
    description: "3x2 en bolsas de 50kg",
    discount: 33,
    originalPrice: 45000,
    finalPrice: 30000,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    type: "promo"
  }
];

export function PromotionsSection() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="gradient-text-secondary" />
        <h3 className="text-lg font-black italic uppercase tracking-tighter">
          Promociones <span className="gradient-text-secondary">&</span> Combos
        </h3>
      </div>

      {/* Promotions Grid */}
      <div className="space-y-3">
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.id}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg group"
          >
            <div className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                {/* Discount Badge */}
                <div className="absolute top-2 right-2">
                  <div className="bg-gradient-secondary text-white rounded-lg px-2 py-1 flex items-center gap-1 shadow-lg glow-secondary">
                    <Percent size={10} strokeWidth={3} />
                    <span className="text-xs font-black">{promo.discount}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                {/* Title & Description */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                      promo.type === "combo" 
                        ? "bg-tertiary/10 dark:bg-tertiary/20 gradient-text-tertiary"
                        : "bg-secondary/10 dark:bg-secondary/20 gradient-text-secondary"
                    }`}>
                      {promo.type === "combo" ? "Combo" : "Promo"}
                    </span>
                  </div>
                  <h4 className="font-black text-sm uppercase italic leading-tight text-slate-900 dark:text-white">
                    {promo.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                    {promo.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 line-through font-bold">
                      ${promo.originalPrice.toLocaleString("es-AR")}
                    </span>
                    <span className="text-xl font-black gradient-text-secondary">
                      ${promo.finalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <button className="size-10 rounded-xl bg-gradient-pink-orange text-white shadow-lg glow-secondary flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                    <ShoppingCart size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
