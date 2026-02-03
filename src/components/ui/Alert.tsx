"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertTriangle, ShoppingBag, Plus } from "lucide-react";
import { toast } from "sonner";

interface PickyAlertProps {
  message: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning" | "cart";
}

export const PickyAlert = ({ message, description, type = "success" }: PickyAlertProps) => {
  const icons = {
    success: <Check className="size-5" />,
    error: <X className="size-5" />,
    info: <Info className="size-5" />,
    warning: <AlertTriangle className="size-5" />,
    cart: <ShoppingBag className="size-5" />,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
    cart: "bg-primary",
  };

  return (
    <div className="flex w-full max-w-sm pointer-events-auto">
      <div className="relative overflow-hidden w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 flex items-center gap-4">
        {/* Animated Progress Bar */}
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 3, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-1 ${colors[type]} opacity-50`}
        />

        {/* Icon Container */}
        <div className={`shrink-0 size-12 rounded-2xl ${colors[type]} flex items-center justify-center text-white shadow-lg shadow-${type === 'cart' ? 'primary' : type}-500/30`}>
          {icons[type]}
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-0.5">
          <h4 className="text-sm font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
            {message}
          </h4>
          {description && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {description}
            </p>
          )}
        </div>

        {/* Close Button UI (Subtle) */}
        <button 
          onClick={() => toast.dismiss()}
          className="size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
        >
          <X size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export const showPickyAlert = (message: string, description?: string, type: PickyAlertProps["type"] = "success") => {
  toast.custom((t) => (
    <PickyAlert message={message} description={description} type={type} />
  ), {
    duration: 3000,
    position: "top-center"
  });
};
