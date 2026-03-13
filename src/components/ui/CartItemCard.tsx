"use client";

import { Minus, Plus, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";



interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

import { getItemPricing, CartItem } from "@/stores/useCartStore";

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const { effectivePrice, originalPrice, savingPerItem, promoLabel } = getItemPricing(item);
  const subtotal = effectivePrice * item.quantity;
  const originalSubtotal = originalPrice * item.quantity;
  const totalSaving = savingPerItem * item.quantity;

  const handleMinus = () => {
    if (item.quantity <= 1) {
      setShowConfirmRemove(true);
    } else {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

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
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-xs font-black uppercase italic leading-tight text-slate-900 dark:text-white line-clamp-2">
            {item.name}
          </h3>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1 truncate">
            {item.category} · {item.sku}
          </p>
          
          {/* Optional: Promos */}
          {promoLabel && savingPerItem > 0 && (
            <div className="flex gap-2 items-center mt-1.5">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{promoLabel}</span>
              <span className="text-[9px] text-slate-400 font-bold line-through">${originalSubtotal.toLocaleString("es-AR")}</span>
            </div>
          )}
        </div>

        {/* Lado derecho: Controles dinámicos */}
        <AnimatePresence mode="popLayout" initial={false}>
          {showConfirmRemove ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="flex flex-col items-end justify-center shrink-0 pl-3 py-1"
            >
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 mb-2">
                <AlertCircle size={12} strokeWidth={3} />
                <span>¿Quitar?</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmRemove(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase active:scale-95 transition-all text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => onRemove(item.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500 text-white text-[9px] font-black uppercase active:scale-95 transition-all shadow-md shadow-rose-500/20"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-end justify-center shrink-0 gap-1"
            >
              {totalSaving > 0 && (
                <span className="text-[9px] font-black text-emerald-500 leading-none">
                  Ahorrás ${totalSaving.toLocaleString("es-AR")}
                </span>
              )}
              <p className="text-lg font-black italic tracking-tighter gradient-text-primary leading-none">
                ${subtotal.toLocaleString("es-AR")}
              </p>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-[0.6rem] p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  onClick={handleMinus}
                  className="size-5 rounded flex items-center justify-center text-slate-500 hover:text-primary transition-all active:scale-90 bg-transparent"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span className="text-[10px] font-black min-w-[1rem] text-center italic text-slate-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="size-5 rounded bg-slate-300 dark:bg-slate-600/80 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-90 transition-all shadow-sm"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

