"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Percent } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { showPickyAlert } from "./Alert";

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
  },
  {
    id: 4,
    title: "Kit Construcción",
    description: "Balde + Cuchara",
    discount: 20,
    originalPrice: 42000,
    finalPrice: 33600,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
    type: "combo"
  },
  {
    id: 5,
    title: "Pinceles Profesionales",
    description: "2x1 en herramientas",
    discount: 50,
    originalPrice: 18000,
    finalPrice: 9000,
    image: "https://images.unsplash.com/photo-1563861826131-7bcba75024d9?auto=format&fit=crop&q=80&w=800",
    type: "promo"
  }
];

export function PromotionsSection() {
  const { addItem } = useCartStore();

  const handleAddPromo = (promo: Promotion) => {
    addItem({
      id: `promo-${promo.id}`,
      name: promo.title,
      price: promo.finalPrice,
      image: promo.image,
      category: promo.type === "combo" ? "COMBO ESPECIAL" : "PROMO ACTIVA",
      sku: `PRM-${promo.id}`,
      description: promo.description,
      stock: 50,
      specs: [],
      originalPrice: promo.originalPrice,
    }, 1);
    showPickyAlert(promo.title, "Promoción agregada con éxito", "success");
  };

  return (
    <section className="pb-2">
      {/* Header — igual que La Competencia */}
      <div className="mb-4">
        <div>
          <h3 className="text-lg font-black italic uppercase tracking-tighter">
            Promociones & Combos
          </h3>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Ofertas especiales en tu tienda
        </p>
      </div>

      {/* Carousel de cards */}
      <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory custom-scrollbar pb-4 pr-4">
        {PROMOTIONS.map((promo) => (
          <div
            key={promo.id}
            className="group min-w-[160px] snap-center shrink-0 flex flex-col rounded-[2rem] overflow-hidden bg-slate-800 dark:bg-slate-800/80 border border-slate-700 shadow-xl transition-all hover:scale-[1.02]"
          >
            {/* Product Image Box — full, grande como en Competencia */}
            <div className="relative h-24 bg-slate-900/50">
              {/* Discount badge — 2-color gradient */}
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-gradient-purple-pink text-white rounded-lg px-2 py-1 flex items-center gap-0.5 shadow-lg">
                  <Percent size={9} strokeWidth={3} />
                  <span className="text-[10px] font-black">{promo.discount}</span>
                </div>
              </div>
              {/* Type badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                  promo.type === "combo"
                    ? "bg-secondary/80 text-white"
                    : "bg-primary/80 text-white"
                }`}>
                  {promo.type === "combo" ? "Combo" : "Promo"}
                </span>
              </div>
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>

            {/* Info Container — mismo estilo que Competencia */}
            <div className="flex flex-col flex-1 p-3 justify-between bg-slate-800/40">
              <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  {promo.description}
                </p>
                <h4 className="font-black text-[9px] uppercase italic leading-tight line-clamp-2 text-white/90 group-hover:text-white transition-colors">
                  {promo.title}
                </h4>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 line-through font-bold leading-none">
                    ${promo.originalPrice.toLocaleString("es-AR")}
                  </span>
                  <span className="text-sm font-black text-white leading-tight">
                    ${promo.finalPrice.toLocaleString("es-AR")}
                  </span>
                </div>
                <button
                  onClick={() => handleAddPromo(promo)}
                  className="size-7 rounded-lg bg-gradient-purple-pink text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                  <ShoppingCart size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
