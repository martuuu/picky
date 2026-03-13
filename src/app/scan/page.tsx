"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Flashlight, Minus, Plus, ShoppingBag, ExternalLink, CheckCircle2, Tag, Layers, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "@/lib/data";
import { useCartStore } from "@/stores/useCartStore";
import { CompetitorProducts } from "@/components/ui/CompetitorProducts";
import { PromotionsSection } from "@/components/ui/PromotionsSection";
import { useRouter } from "next/navigation";

const PROMO_SNIPPETS = [
  { type: "bulk", icon: <Package size={12} />, label: "x5+ unidades", desc: "10% OFF", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  { type: "quantity", icon: <Tag size={12} />, label: "x10+ unidades", desc: "15% OFF", color: "bg-secondary/10 text-secondary border-secondary/20" },
  { type: "wholesale", icon: <Layers size={12} />, label: "Precio mayorista", desc: "35% OFF", color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
];

function getActivePromo(qty: number, product: Product) {
  if (!product.wholesalePrice) return null;
  if (qty >= (product.wholesaleMinQuantity ?? 10)) {
    return { label: `Precio mayorista aplicado`, saving: product.price - product.wholesalePrice };
  }
  if (qty >= 10) return { label: "15% OFF por cantidad", saving: Math.round(product.price * 0.15) };
  if (qty >= 5) return { label: "10% OFF por volumen", saving: Math.round(product.price * 0.10) };
  return null;
}

function getEffectivePrice(qty: number, product: Product): number {
  const promo = getActivePromo(qty, product);
  if (!promo) return product.price;
  return product.price - Math.round(promo.saving / qty);
}

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "scanned" | "expanded">("scanning");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Splash animation state
  const [showCartSplash, setShowCartSplash] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSimulateScan = () => {
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
      // Animación splash de confirmación — sin Alert
      setShowCartSplash(true);
      setTimeout(() => {
        setShowCartSplash(false);
        handleReset();
      }, 1200);
    }
  };

  const handleGoToProduct = () => {
    if (scannedProduct) {
      router.push(`/product/${scannedProduct.sku}`);
    }
  };

  // Cerrar sheet al tocar el fondo
  const handleBackgroundClick = () => {
    if (status !== "scanning") handleReset();
  };

  if (!mounted) return null;

  const activePromo = scannedProduct ? getActivePromo(quantity, scannedProduct) : null;
  const effectiveUnitPrice = scannedProduct ? getEffectivePrice(quantity, scannedProduct) : 0;
  const totalPrice = effectiveUnitPrice * quantity;

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

      {/* 2. Controls Area — REORGANIZADO: ChevronLeft izq, Flashlight + Cart derecha */}
      <div className="absolute top-0 left-0 w-full z-20 pt-safe-top">
        <div className="flex justify-between items-center p-6 pt-12">
          {/* Izquierda: Volver atrás */}
          <button
            onClick={() => status === 'expanded' ? setStatus('scanned') : router.back()}
            className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Derecha: Flashlight + Carrito / Info Técnica */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {status !== 'expanded' ? (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                >
                  {/* Flashlight */}
                  <button
                    className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
                  >
                    <Flashlight size={22} />
                  </button>

                  {/* Carrito con label y splash */}
                  <Link href="/cart">
                    <div className="relative flex flex-col items-center gap-0.5">
                      <button className="relative flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90">
                        <ShoppingBag size={22} />
                        <AnimatePresence>
                          {itemCount > 0 && !showCartSplash && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-logo-full text-[10px] font-black text-white border-2 border-black shadow-md"
                            >
                              {itemCount}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {/* Splash de confirmación al agregar */}
                        <AnimatePresence>
                          {showCartSplash && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 1.5, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              className="absolute inset-0 rounded-full bg-emerald-500 flex items-center justify-center z-10"
                            >
                              <CheckCircle2 size={22} className="text-white" strokeWidth={2.5} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                      <span className="text-[8px] font-black text-white/70 uppercase tracking-wider leading-none">Carrito</span>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="info-tecnica"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={handleGoToProduct}
                    className="px-4 py-1.5 rounded-full bg-gradient-tertiary-yellow backdrop-blur-xl border border-tertiary/30 glow-tertiary shadow-xl hover:scale-105 active:scale-95 transition-all text-white text-[9px] font-black tracking-widest uppercase"
                  >
                    Info Técnica
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                <div className="absolute w-full h-1 bg-gradient-logo-full shadow-2xl animate-scan"></div>
              </div>
            </div>
            <p className="absolute bottom-32 text-white/60 text-xs font-black uppercase tracking-widest">
              Tocá para simular escaneo
            </p>
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
              animate={{ height: status === 'scanned' ? 'auto' : '88vh' }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-background-light dark:bg-background-dark rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.4)] flex flex-col border-t border-white/10 overflow-hidden"
            >
              {/* Swipe Handle — sin texto "Ver más" */}
              <div
                className="w-full flex flex-col items-center pt-5 pb-2 cursor-pointer group shrink-0"
                onClick={() => setStatus(status === 'scanned' ? 'expanded' : 'scanned')}
              >
                <div className="h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-primary"></div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-28">
                <AnimatePresence mode="wait">
                  {/* ==================== PRODUCT PREVIEW (status === "scanned") ==================== */}
                  {status === "scanned" && (
                    <motion.div
                      key="scanned"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                    {/* Fila 1: Imagen + Nombre */}
                    <div className="flex items-start gap-3">
                      <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-md">
                        <Image
                          src={scannedProduct.image}
                          alt={scannedProduct.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase italic tracking-tighter truncate">
                          {scannedProduct.name}
                        </h2>
                        {/* Fila 2: Categoría + SKU */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 gradient-text-logo rounded-lg text-[8px] font-black tracking-[0.2em] uppercase">
                            {scannedProduct.category}
                          </span>
                          <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">
                            SKU: {scannedProduct.sku}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fila 3: Precio · Stock · Cantidades */}
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                      {/* Precio */}
                      <div className="flex-1">
                        <p className="gradient-text-logo font-black text-xl italic tracking-tighter leading-none">
                          ${effectiveUnitPrice.toLocaleString("es-AR")}
                        </p>
                        {activePromo && (
                          <p className="text-[8px] text-slate-400 font-bold line-through mt-0.5">
                            ${scannedProduct.price.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="flex flex-col items-center px-3 border-x border-slate-200 dark:border-slate-700">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Stock</span>
                        <span className={`text-xs font-black ${scannedProduct.stock < 10 ? 'text-orange-500' : 'text-emerald-500'}`}>
                          {scannedProduct.stock}
                        </span>
                      </div>

                      {/* Cantidad — compacta */}
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 text-sm font-black"
                        >
                          <Minus size={13} strokeWidth={3} />
                        </button>
                        <span className="text-sm font-black min-w-[1rem] text-center italic">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(scannedProduct.stock, quantity + 1))}
                          className="size-7 rounded-lg bg-gradient-logo-full text-white shadow-md flex items-center justify-center active:scale-90 transition-all"
                        >
                          <Plus size={13} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                      {/* Fila 4: Snippet de Promociones por cantidad */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-black italic uppercase tracking-tighter pl-0.5">Descuentos por Cantidad</h3>
                        <div className="flex flex-col gap-2">
                          {PROMO_SNIPPETS.map((promo) => {
                            const targetQty = promo.type === 'wholesale' ? (scannedProduct.wholesaleMinQuantity ?? 10) : (promo.type === 'quantity' ? 10 : 5);
                            if (promo.type === 'wholesale' && !scannedProduct.wholesalePrice) return null;
                            const isActive = quantity >= targetQty;

                            return (
                              <button
                                key={promo.type}
                                onClick={() => setQuantity(Math.max(quantity, targetQty))}
                                className={`flex items-center text-left gap-3 px-3 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all w-full active:scale-95 relative ${
                                  isActive
                                    ? 'bg-white dark:bg-slate-900 border-transparent'
                                    : `${promo.color} opacity-80 hover:opacity-100`
                                }`}
                              >
                                {isActive && (
                                  <div className="absolute inset-0 rounded-xl bg-gradient-logo-full -z-10 -m-[2px]" />
                                )}
                                <span className={isActive ? 'gradient-text-logo' : ''}>{promo.icon}</span>
                                <span className={isActive ? 'gradient-text-logo' : ''}>{promo.label}</span>
                                <span className={`font-black ml-auto ${isActive ? 'gradient-text-logo' : ''}`}>
                                  {isActive ? '✓ APLICADO' : `→ APLICAR ${promo.desc}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      {activePromo && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-logo-full text-white shadow-md border-transparent"
                        >
                          <CheckCircle2 size={14} strokeWidth={2.5} />
                          <span className="text-[9px] font-black">{activePromo.label} · Ahorrás ${activePromo.saving.toLocaleString("es-AR")}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                  {/* ==================== PRODUCT DETAIL OVERVIEW (status === "expanded") ==================== */}
                  {status === "expanded" && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-md">
                          <Image
                            src={scannedProduct.image}
                            alt={scannedProduct.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">
                            {scannedProduct.name}
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-primary/10 dark:bg-primary/20 gradient-text-logo rounded-lg text-[9px] font-black tracking-[0.2em] uppercase">
                              {scannedProduct.category}
                            </span>
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                              SKU: {scannedProduct.sku}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="gradient-text-logo font-black text-3xl pt-1 italic tracking-tighter">
                        ${effectiveUnitPrice.toLocaleString("es-AR")}
                        <span className="text-sm text-slate-400 font-bold normal-case tracking-normal ml-2">
                          c/u · Stock: {scannedProduct.stock}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Descripción */}
                      <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-black italic uppercase tracking-tighter mb-2">Descripción</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
                          {scannedProduct.description}
                        </p>
                      </div>

                      {/* Specs Grid — movidas del Preview */}
                      <div className="grid grid-cols-2 gap-2">
                        {scannedProduct.specs.map((s, i) => (
                          <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{s.label}</p>
                            <p className="text-xs font-black truncate">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Variantes — movidas del Preview */}
                      {scannedProduct.variants?.map((v, i) => (
                        <div key={i} className="space-y-2">
                          <h3 className="text-lg font-black italic uppercase tracking-tighter">{v.label}</h3>
                          <div className="flex flex-wrap gap-2">
                            {v.options.map((opt, j) => (
                              <button
                                key={j}
                                className={`px-4 py-2 rounded-xl border-2 transition-all font-black text-[9px] uppercase ${
                                  j === 0
                                    ? 'border-transparent bg-gradient-logo-full text-white shadow-lg'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-400'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Promotions Section */}
                      <div className="pt-2">
                        <PromotionsSection />
                      </div>

                      {/* Snippets de descuentos seleccionables */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-black italic uppercase tracking-tighter">Descuentos por Cantidad</h3>
                        <div className="flex flex-col gap-2">
                          {PROMO_SNIPPETS.map((promo) => {
                            const targetQty = promo.type === 'wholesale' ? (scannedProduct.wholesaleMinQuantity ?? 10) : (promo.type === 'quantity' ? 10 : 5);
                            if (promo.type === 'wholesale' && !scannedProduct.wholesalePrice) return null;
                            const isActive = quantity >= targetQty;

                            return (
                              <button
                                key={promo.type}
                                onClick={() => setQuantity(Math.max(quantity, targetQty))}
                                className={`flex items-center text-left gap-3 px-3 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all w-full active:scale-95 relative ${
                                  isActive
                                    ? 'bg-white dark:bg-slate-900 border-transparent'
                                    : `${promo.color} opacity-80 hover:opacity-100`
                                }`}
                              >
                                {isActive && (
                                  <div className="absolute inset-0 rounded-xl bg-gradient-logo-full -z-10 -m-[2px]" />
                                )}
                                <span className={isActive ? 'gradient-text-logo' : ''}>{promo.icon}</span>
                                <span className={isActive ? 'gradient-text-logo' : ''}>{promo.label}</span>
                                <span className={`font-black ml-auto ${isActive ? 'gradient-text-logo' : ''}`}>
                                  {isActive ? '✓ APLICADO' : `→ APLICAR ${promo.desc}`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cantidad en expanded */}
                      <div className="grid grid-cols-[1fr_auto] gap-3 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 pl-1">Cantidad Final</span>
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="size-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90"
                          >
                            <Minus size={16} strokeWidth={3} />
                          </button>
                          <span className="text-base font-black min-w-[1rem] text-center italic">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(scannedProduct.stock, quantity + 1))}
                            className="size-9 rounded-lg bg-gradient-logo-full text-white shadow-lg flex items-center justify-center active:scale-90 transition-all"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Products */}
                    <div className="pt-2 pb-4">
                      <CompetitorProducts
                        currentProduct={scannedProduct}
                        allProducts={products}
                      />
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Fixed Action Bar */}
              <div className="absolute bottom-0 left-0 w-full z-50 p-5 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-2xl shrink-0">
                <Button
                  onClick={handleAddToCart}
                  variant="gradient-logo"
                  className="w-full h-14 text-base font-black italic uppercase shadow-lg rounded-2xl gap-3 group relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {showCartSplash ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                        ¡Agregado!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        Agregar al Carrito · ${totalPrice.toLocaleString("es-AR")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s infinite linear; }
      `}</style>
    </div>
  );
}
