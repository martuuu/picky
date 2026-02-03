"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ScanBarcode, Minus, Plus, Trash2, ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CartItemCard } from "@/components/ui/CartItemCard";
import { BeforeCheckoutCarousel } from "@/components/ui/BeforeCheckoutCarousel";
import { PromotionsSection } from "@/components/ui/PromotionsSection";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total } = useCartStore();

  const cartTotal = total();
  const tax = cartTotal * 0.21;
  const finalTotal = cartTotal + tax;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Convert cart items to CartItemCard format
  const cartItems = items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    category: item.category,
    sku: item.sku,
    specs: item.specs
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-64 text-slate-900 dark:text-white font-display antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl px-6 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
        <button 
            onClick={() => router.back()}
            className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 transition-all active:scale-95"
        >
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-black tracking-[0.3em] uppercase italic">Mi Canasta</h1>
        <Link href="/scan">
            <button className="flex items-center justify-center size-10 rounded-xl bg-gradient-purple-pink text-white shadow-lg glow-primary">
                <ScanBarcode size={20} strokeWidth={3} />
            </button>
        </Link>
      </header>

      {/* Cart Items */}
      <main className="px-6 flex-1 space-y-4 pt-6">
        <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                >
                    <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-black text-slate-400 uppercase italic tracking-tighter">Tu carrito está vacío</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Escaneá productos para comenzar</p>
                    <Link href="/scan" className="mt-6">
                        <Button variant="gradient-purple-pink" size="lg" className="gap-2">
                            <ScanBarcode size={20} strokeWidth={2.5} />
                            Comenzar a Escanear
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                cartItems.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        onUpdateQuantity={(id, quantity) => {
                            updateQuantity(id, quantity);
                        }}
                        onRemove={(id) => removeItem(id)}
                    />
                ))
            )}
        </AnimatePresence>
      </main>

      {/* Promotions Section - Show when cart has items */}
      {items.length > 0 && (
        <section className="px-6 pb-6">
          <PromotionsSection />
        </section>
      )}

      {/* Before Checkout Carousel - Show when cart has items */}
      {items.length > 0 && (
        <section className="px-6 pb-6 pt-8 border-t border-slate-100 dark:border-slate-800">
          <BeforeCheckoutCarousel
            products={products.slice(0, 5)}
            title="Antes de Comprar..."
            subtitle="Productos que escaneaste pero no agregaste"
          />
        </section>
      )}

      {/* Footer Info */}
      {items.length > 0 && (
        <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-50">
            <div className="px-8 pt-8 pb-10 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Base Imponible</span>
                        <span className="text-slate-900 dark:text-white">${cartTotal.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>IVA (21%)</span>
                        <span className="text-slate-900 dark:text-white">${tax.toLocaleString("es-AR")}</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full border-t border-dashed"></div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase gradient-text-primary tracking-widest">Total Final</span>
                            <span className="text-4xl font-black italic tracking-tighter uppercase leading-none mt-1">${finalTotal.toLocaleString("es-AR")}</span>
                        </div>
                    </div>
                </div>

                <Link href="/checkout" className="block w-full">
                    <button className="w-full h-16 bg-gradient-purple-pink hover:opacity-90 active:scale-[0.98] transition-all rounded-[2rem] flex items-center justify-center text-white font-black uppercase italic text-lg shadow-2xl glow-primary gap-3 group">
                        Confirmar Pedido
                        <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </footer>
      )}
    </div>
  );
}
