"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Flashlight, ChevronUp, Minus, Plus, ChevronLeft, LayoutGrid, Info, ShoppingBag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "@/lib/data";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "sonner";
import { showPickyAlert } from "@/components/ui/Alert";
import { CompetitorProducts } from "@/components/ui/CompetitorProducts";
import { PromotionsSection } from "@/components/ui/PromotionsSection";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "scanned" | "expanded">("scanning");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSimulateScan = () => {
    // Simulate finding a product (Pintura Látex)
    setScannedProduct(products[0]);
    setStatus("scanned");
    setQuantity(1);
  };

  const handleReset = () => {
    setStatus("scanning");
    setScannedProduct(null);
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addItem(scannedProduct, quantity);
      showPickyAlert(scannedProduct.name, `${quantity} unidades en tu canasta.`, "cart");
      handleReset();
    }

  };

  const handleGoToProduct = () => {
    if (scannedProduct) {
      router.push(`/product/${scannedProduct.sku}`);
    }
  };

  // Close modal when clicking background
  const handleBackgroundClick = () => {
    if (status !== "scanning") {
      handleReset();
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative h-[100dvh] w-full flex flex-col bg-black overflow-hidden font-display antialiased">
      {/* 1. Camera Viewport (Background) */}
      <div 
        className="absolute inset-0 z-0 bg-black"
        onClick={handleBackgroundClick}
      >
        <div className="relative w-full h-full opacity-60">
            <Image 
                src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200"
                alt="Corralón Camera View"
                fill
                className="object-cover"
                unoptimized
            />
        </div>
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      {/* 2. Controls Area */}
      <div className="absolute top-0 left-0 w-full z-20 pt-safe-top">
        <div className="flex justify-between items-center p-6 pt-12">
          <div className="flex gap-3">
              <button 
                onClick={() => status === 'expanded' ? setStatus('scanned') : handleReset()}
                className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
              >
                {status === 'expanded' ? <ChevronLeft size={24} /> : <Flashlight size={24} />}
              </button>

              <Link href="/cart">
                <button className="relative flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90">
                    <ShoppingBag size={24} />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-purple-pink text-[10px] font-black text-white border-2 border-black animate-in zoom-in glow-primary">
                            {itemCount}
                        </span>
                    )}
                </button>
              </Link>
          </div>
          
          <AnimatePresence>
            {status === 'scanning' ? (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
                >
                    <X size={24} />
                </motion.button>
            ) : status === 'expanded' ? (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleGoToProduct}
                    className="px-5 py-2 rounded-full bg-gradient-tertiary-yellow backdrop-blur-xl border border-tertiary/30 glow-tertiary shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                    <span className="text-white text-[10px] font-black tracking-widest uppercase">Info Técnica</span>
                </motion.button>
            ) : (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleReset}
                    className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
                >
                    <X size={24} />
                </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Scanning Frame */}
      <AnimatePresence>
        {status === "scanning" && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleSimulateScan}
                className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
            >
                <div className="relative w-72 h-72">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-[3rem]"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-[3rem]"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-[3rem]"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-[3rem]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-[3rem]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-full h-1 bg-gradient-purple-pink shadow-2xl glow-primary animate-scan"></div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Sheet (Scanned / Expanded) */}
      <AnimatePresence>
        {scannedProduct && status !== "scanning" && (
            <motion.div 
                key="sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute bottom-0 left-0 w-full z-30"
                onClick={(e) => e.stopPropagation()}
            >
                <motion.div 
                    animate={{ height: status === 'scanned' ? '50vh' : '85vh' }}
                    className={`bg-background-light dark:bg-background-dark rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.4)] flex flex-col border-t border-white/10 overflow-hidden`}
                >
                    
                    {/* Interaction Handle */}
                    <div 
                        className="w-full flex flex-col items-center pt-6 pb-3 cursor-pointer group"
                        onClick={() => setStatus(status === 'scanned' ? 'expanded' : 'scanned')}
                    >
                        <div className="h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-primary"></div>
                        {status === 'scanned' && (
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Ver más</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-28">
                        {/* SCANNED View (Middle - Compact) - NO IMAGE, ALL DETAILS */}
                        {status === "scanned" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Header - No Image - More compact */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black gradient-text-primary uppercase tracking-widest italic leading-none">Producto Encontrado</span>
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase italic tracking-tighter">
                                        {scannedProduct.name}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 gradient-text-primary rounded-lg text-[8px] font-black tracking-[0.2em] uppercase">{scannedProduct.category}</span>
                                        <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">SKU: {scannedProduct.sku}</span>
                                    </div>
                                    <p className="gradient-text-primary font-black text-2xl italic tracking-tighter">
                                        ${scannedProduct.price.toLocaleString("es-AR")}
                                    </p>
                                </div>

                                {/* Specs Grid - More compact */}
                                <div className="grid grid-cols-2 gap-2">
                                    {scannedProduct.specs.map((s, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 leading-none">{s.label}</p>
                                            <p className="text-[11px] font-black truncate">{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Variants - More compact */}
                                {scannedProduct.variants?.map((v, i) => (
                                    <div key={i} className="space-y-2">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{v.label}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {v.options.map((opt, j) => (
                                                <button key={j} className={`px-3 py-2 rounded-xl border-2 transition-all font-black text-[9px] uppercase ${j === 0 ? 'border-primary bg-gradient-purple-pink text-white shadow-lg glow-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Quantity - More compact */}
                                <div className="grid grid-cols-[1fr_auto] gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Cantidad</span>
                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"><Minus size={16} strokeWidth={3} /></button>
                                        <span className="text-base font-black min-w-[1rem] text-center italic">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="size-9 rounded-lg bg-gradient-purple-pink text-white shadow-lg glow-primary flex items-center justify-center active:scale-90 transition-all"><Plus size={16} strokeWidth={3} /></button>
                                    </div>
                                </div>

                                {/* Cancel Button */}
                                <button
                                    onClick={handleReset}
                                    className="w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-wider hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
                                >
                                    Cancelar y Volver
                                </button>
                            </motion.div>
                        )}

                        {/* EXPANDED View (85% height - Full Detailed) */}
                        {status === "expanded" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Header - No Image */}
                                <div className="space-y-2">
                                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">
                                        {scannedProduct.name}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 gradient-text-primary rounded-lg text-[9px] font-black tracking-[0.2em] uppercase">{scannedProduct.category}</span>
                                        <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">SKU: {scannedProduct.sku}</span>
                                    </div>
                                    <p className="gradient-text-primary font-black text-3xl pt-1 italic tracking-tighter">${scannedProduct.price.toLocaleString("es-AR")}</p>
                                </div>

                                <div className="space-y-5">
                                    {/* Description */}
                                    <div className="bg-slate-50 dark:bg-slate-900/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2 italic">Descripción</h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
                                            {scannedProduct.description}
                                        </p>
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {scannedProduct.specs.map((s, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{s.label}</p>
                                                <p className="text-xs font-black truncate">{s.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Variants */}
                                    {scannedProduct.variants?.map((v, i) => (
                                        <div key={i} className="space-y-2">
                                            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">{v.label}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {v.options.map((opt, j) => (
                                                    <button key={j} className={`px-4 py-2 rounded-xl border-2 transition-all font-black text-[9px] uppercase ${j === 0 ? 'border-primary bg-gradient-purple-pink text-white shadow-lg glow-primary' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Quantity */}
                                    <div className="grid grid-cols-[1fr_auto] gap-4 items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-2">Cantidad</span>
                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"><Minus size={16} strokeWidth={3} /></button>
                                            <span className="text-base font-black min-w-[1rem] text-center italic">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="size-9 rounded-lg bg-gradient-purple-pink text-white shadow-lg glow-primary flex items-center justify-center active:scale-90 transition-all"><Plus size={16} strokeWidth={3} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Competitor Products Section */}
                                <div className="pt-2">
                                  <CompetitorProducts 
                                    currentProduct={scannedProduct} 
                                    allProducts={products} 
                                  />
                                </div>

                                {/* Promotions Section */}
                                <div className="pt-2 pb-4">
                                  <PromotionsSection />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Fixed Action Bar - Always visible */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-2xl">
                        <Button 
                            onClick={handleAddToCart}
                            variant="gradient-purple-pink"
                            className="w-full h-16 text-lg font-black italic uppercase shadow-2xl rounded-2xl gap-3 group"
                        >
                            <ShoppingBag className="size-6 group-hover:animate-bounce" strokeWidth={2.5} />
                            Agregar al Carrito • ${(scannedProduct.price * quantity).toLocaleString("es-AR")}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                display: none;
            }
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
            .animate-scan {
                animation: scan 2s infinite linear;
            }
        `}</style>
    </div>
  );
}
