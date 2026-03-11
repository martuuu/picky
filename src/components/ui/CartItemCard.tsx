"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  sku: string;
  wholesalePrice?: number;
  wholesaleMinQuantity?: number;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function getActivePromo(qty: number, item: CartItem) {
  if (item.wholesalePrice && qty >= (item.wholesaleMinQuantity ?? 10)) {
    return { label: `Por mayor`, saving: item.price - item.wholesalePrice };
  }
  if (qty >= 10) return { label: "15% OFF", saving: Math.round(item.price * 0.15) };
  if (qty >= 5) return { label: "10% OFF", saving: Math.round(item.price * 0.10) };
  return null;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const promo = getActivePromo(item.quantity, item);
  const effectivePrice = promo ? item.price - Math.round(promo.saving / item.quantity) : item.price;
  const subtotal = effectivePrice * item.quantity;
  const originalSubtotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm mb-3 overflow-hidden"
    >
      <div className="flex justify-between relative">
        {/* Info del producto: Nombre y Categoría */}
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-black uppercase italic leading-tight text-slate-900 dark:text-white line-clamp-2">
            {item.name}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1.5 truncate">
            {item.category} · {item.sku}
          </p>
          
          {/* Optional: Promos */}
          {promo && (
            <div className="flex gap-2 items-center mt-2">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{promo.label}</span>
              <span className="text-[10px] text-slate-400 font-bold line-through">${originalSubtotal.toLocaleString("es-AR")}</span>
            </div>
          )}
        </div>

        {/* Lado derecho: Basurero, Precio y Stepper */}
        <div className="flex flex-col items-end shrink-0 gap-3 relative">
          <button
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-red-500 transition-colors absolute top-0 right-0 -mr-1 -mt-1 p-1"
          >
            <Trash2 size={16} />
          </button>

          <div className="flex flex-col items-end gap-1.5 mt-6">
            <p className="text-xl font-black italic tracking-tighter gradient-text-primary leading-none">
              ${subtotal.toLocaleString("es-AR")}
            </p>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700 mt-0.5 shadow-inner">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="size-6 rounded-md flex items-center justify-center text-slate-500 hover:text-primary transition-all active:scale-90 bg-transparent"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-xs font-black w-4 text-center italic text-slate-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="size-6 rounded-md bg-slate-300 dark:bg-slate-600/80 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

