"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ScanBarcode, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCartStore, CartItem, getItemPricing } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { BeforeCheckoutCarousel } from "@/components/ui/BeforeCheckoutCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";



export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();

  // Calcular totales considerando promos
  const { subtotal, totalSavings } = items.reduce((acc, item) => {
    const { effectivePrice, savingPerItem } = getItemPricing(item);
    
    return {
        subtotal: acc.subtotal + (effectivePrice * item.quantity),
        totalSavings: acc.totalSavings + (savingPerItem * item.quantity)
    };
  }, { subtotal: 0, totalSavings: 0 });

  const tax = subtotal * 0.21;
  const finalTotal = subtotal + tax;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background-light dark:bg-background-dark pb-64 text-slate-900 dark:text-white font-display antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl px-4 pb-4 pt-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
        <button 
            onClick={() => router.back()}
            className="flex items-center justify-center size-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 transition-all active:scale-95"
        >
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-xs font-black tracking-[0.3em] uppercase flex-1 text-center italic text-slate-900 dark:text-white">Carrito</h1>
        <Link href="/scan" className="shrink-0 flex items-center">
            <button className="flex items-center justify-center size-10 rounded-[0.8rem] bg-gradient-purple-pink text-white shadow-md glow-primary">
                <ScanBarcode size={18} strokeWidth={3} />
            </button>
        </Link>
      </header>

      {/* Cart Items */}
      <main className="px-5 flex-1 pt-6 space-y-1">
        <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center mt-10"
                >
                    <div className="size-20 bg-slate-100 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-black text-slate-400 uppercase italic tracking-tighter">Tu canasta está vacía</p>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Escaneá productos en góndola</p>
                    <Link href="/scan" className="mt-8">
                        <Button variant="gradient-purple-pink" size="lg" className="h-14 px-8 rounded-2xl gap-3 shadow-xl">
                            <ScanBarcode size={20} strokeWidth={2.5} />
                            Comenzar a Escanear
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                items.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity)}
                        onRemove={(id) => removeItem(id)}
                    />
                ))
            )}
        </AnimatePresence>
      </main>

      {/* Before Checkout Carousel - Solo si hay items */}
      {items.length > 0 && (
        <section className="px-6 pb-12 mb-10 pt-8 mt-4 border-t border-slate-100 dark:border-slate-800">
          <BeforeCheckoutCarousel
            products={products.slice(0, 5)}
            title="Antes de Comprar..."
            subtitle="Productos que escaneaste pero no agregaste"
          />
        </section>
      )}

      {/* Footer Info */}
      {items.length > 0 && (
        <footer className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50">
            <div className="px-4 pt-4 pb-6 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Total s/ imp.</span>
                        <span className="text-slate-900 dark:text-white text-[10px]">${subtotal.toLocaleString("es-AR")}</span>
                    </div>

                    {totalSavings > 0 && (
                        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] text-emerald-500 overflow-hidden bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                            <span className="flex items-center gap-1 font-black">
                                Ahorro Picky
                            </span>
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={`savings-${totalSavings}`}
                                    initial={{ scale: 1.5, opacity: 0, y: -10, rotate: -5 }}
                                    animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="text-[10px] font-black flex items-center gap-1 drop-shadow-md text-emerald-600 dark:text-emerald-400"
                                >
                                    -${totalSavings.toLocaleString("es-AR")}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>IVA (21%)</span>
                        <span className="text-slate-900 dark:text-white text-[10px]">${tax.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full border-t border-dashed my-2"></div>
                    <div className="flex items-end justify-between">
                        <span className="text-[10px] font-black uppercase gradient-text-primary tracking-widest leading-none mb-1">Total Final</span>
                        <motion.span 
                            key={`total-${finalTotal}`}
                            initial={{ scale: 1.15, color: '#a855f7' }}
                            animate={{ scale: 1, color: '' }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white origin-right inline-block"
                        >
                            ${finalTotal.toLocaleString("es-AR")}
                        </motion.span>
                    </div>
                </div>

                <Link href="/checkout" className="block w-full">
                    <button className="w-full h-12 bg-gradient-purple-pink hover:opacity-90 active:scale-[0.98] transition-all rounded-[1.5rem] flex items-center justify-center text-white font-black uppercase italic text-[13px] shadow-lg glow-primary gap-2 group">
                        Confirmar Pedido
                        <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </footer>
      )}
    </div>
  );
}

