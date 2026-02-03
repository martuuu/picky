"use client";

import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { showPickyAlert } from "./Alert";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    
    // Custom premium toast
    showPickyAlert(product.name, "Agregado a tu canasta Picky.", "cart");

  };

  return (
    <div className="group flex flex-col bg-white dark:bg-background-dark-card rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 dark:border-primary/20 transition-all hover:shadow-2xl hover:scale-[1.02] hover:glow-primary active:scale-95 font-display">
      <Link href={`/product/${product.sku}`} className="relative w-full aspect-square overflow-hidden bg-background-light-card dark:bg-background-dark-elevated border-b border-slate-100 dark:border-primary/10">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-gradient-secondary text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg glow-secondary">Oferta</div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Link href={`/product/${product.sku}`} className="space-y-1">
          <h3 className="text-slate-900 dark:text-white text-sm font-black italic uppercase tracking-tighter leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-lg">
                {product.category}
            </span>
          </div>
        </Link>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white text-lg font-black italic tracking-tighter leading-none">
                ${product.price.toLocaleString("es-AR")}
            </span>
            {product.originalPrice && (
                <span className="text-slate-400 dark:text-slate-500 text-[10px] line-through font-bold mt-1">${product.originalPrice.toLocaleString("es-AR")}</span>
            )}
          </div>
          <Button 
            onClick={handleAdd}
            size="icon" 
            variant="gradient-purple-pink"
            className="size-10 rounded-2xl shadow-lg p-0 transition-all active:scale-90 group/btn"
          >
            <Plus size={20} strokeWidth={3} className="text-white group-hover/btn:rotate-90 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
