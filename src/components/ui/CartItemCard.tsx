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
  specs?: Array<{ label: string; value: string }>;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3"
    >
      {/* Header - More compact */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          {/* Category Badge - Smaller */}
          <span className="inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider bg-primary/10 dark:bg-primary/20 gradient-text-primary">
            {item.category}
          </span>
          
          {/* Product Name - Smaller */}
          <h3 className="text-sm font-black uppercase italic leading-tight text-slate-900 dark:text-white">
            {item.name}
          </h3>
          
          {/* SKU - Smaller */}
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            SKU: {item.sku}
          </p>
        </div>

        {/* Delete Button - Smaller */}
        <button
          onClick={() => onRemove(item.id)}
          className="size-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-90"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Specifications - Simplified, only show first 2 */}
      {item.specs && item.specs.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {item.specs.slice(0, 2).map((spec, index) => (
            <div
              key={index}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-lg px-2 py-1 border border-slate-100 dark:border-slate-800"
            >
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
                {spec.label}
              </p>
              <p className="text-[10px] font-black text-slate-900 dark:text-white">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quantity & Price - More compact */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Quantity Controls - Smaller */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-0.5">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <span className="text-sm font-black min-w-[1.5rem] text-center italic text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="size-7 rounded-lg bg-gradient-purple-pink text-white shadow-md glow-primary flex items-center justify-center active:scale-90 transition-all"
          >
            <Plus size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Price - Smaller */}
        <div className="text-right">
          <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
            Subtotal
          </p>
          <p className="text-lg font-black italic tracking-tighter gradient-text-primary">
            ${(item.price * item.quantity).toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
