"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronDown, Flashlight, Minus, Plus, ShoppingBag, CheckCircle2, Tag, Layers, Package, ChevronUp } from "lucide-react";
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
  { type: "wholesale", icon: <Layers size={12} />, label: "Prec. mayorista (x20+)", desc: "Precio Especial", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

function getActivePromo(qty: number, product: Product) {
  if (!product.wholesalePrice) return null;
  if (qty >= (product.wholesaleMinQuantity ?? 20)) {
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

function QuantityDiscountsExpandable({ scannedProduct, quantity, setQuantity }: { scannedProduct: Product, quantity: number, setQuantity: (q: number) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activePromo = getActivePromo(quantity, scannedProduct);

  return (
    <div className="space-y-2 relative z-10">
      <motion.div layout className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative z-10 w-full mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-left active:scale-[0.98] transition-all"
        >
          <div className="flex flex-col">
            <span className="font-black text-xs italic uppercase tracking-tight">Oferta Mayorista / Promos</span>
            <span className="text-[9px] font-bold text-slate-400">Ver descuentos por cantidad</span>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
            <ChevronDown size={18} className="text-slate-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                {PROMO_SNIPPETS.map((promo) => {
                  const targetQty = promo.type === 'wholesale' ? (scannedProduct.wholesaleMinQuantity ?? 20) : (promo.type === 'quantity' ? 10 : 5);
                  if (promo.type === 'wholesale' && !scannedProduct.wholesalePrice) return null;
                  const isActive = quantity >= targetQty;

                  return (
                    <button
                      key={promo.type}
                      onClick={() => setQuantity(Math.max(quantity, targetQty))}
                      className={`flex items-center text-left gap-3 px-3 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all w-full active:scale-95 relative ${
                        isActive
                          ? 'bg-primary/5 dark:bg-primary/10 border-primary shadow-sm'
                          : `${promo.color} opacity-80 hover:opacity-100`
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-purple-pink opacity-10 -z-10" />
                      )}
                      <span className={isActive ? 'text-primary' : ''}>{promo.label}</span>
                      <span className={`font-black ml-auto ${isActive ? 'text-primary' : ''}`}>
                        {isActive ? '✓ APLICADO' : `→ APLICAR`}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {activePromo && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shadow-sm border border-emerald-500/20"
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                  <span className="text-[10px] font-black">
                    {activePromo.label} · <span className="underline">Ahorrás ${(activePromo.saving * quantity).toLocaleString("es-AR")}</span> en total
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "scanned" | "expanded">("scanning");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [showDescFull, setShowDescFull] = useState(false);

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
            src="/picky-scan.png"
            alt="Corralón Camera View"
            fill
            className="object-cover"
            priority
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

                  {/* Carrito */}
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
                              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-purple-pink text-[10px] font-black text-white border-2 border-black shadow-md"
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
                              className="absolute inset-0 rounded-full bg-tertiary flex items-center justify-center z-10"
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
                    className="px-4 py-1.5 rounded-full bg-gradient-purple-pink backdrop-blur-xl border border-primary/30 glow-primary shadow-xl hover:scale-105 active:scale-95 transition-all text-white text-[9px] font-black tracking-widest uppercase"
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
              {/* Swipe Handle — with swipe-up gesture */}
              <motion.div
                key={`handle-drag-${status}`}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (status === 'scanned' && info.offset.y < -40) setStatus('expanded');
                  else if (status === 'expanded' && info.offset.y > 40) setStatus('scanned');
                }}
                className="w-full flex flex-col items-center pt-5 pb-2 cursor-grab active:cursor-grabbing group shrink-0"
                onClick={() => setStatus(status === 'scanned' ? 'expanded' : 'scanned')}
              >
                <div className="h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-primary"></div>
                {status === 'scanned' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1 mt-1.5"
                  >
                    <ChevronUp size={12} className="text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Deslizá para más</span>
                    <ChevronUp size={12} className="text-slate-400" />
                  </motion.div>
                )}
              </motion.div>

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
                        {scannedProduct.brand && (
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{scannedProduct.brand}</p>
                        )}
                      </div>
                    </div>

                    {/* Fila 3: Precio · Stock · Cantidades */}
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
                      {/* Precio */}
                      <div className="flex-1">
                        <p className="font-black text-xl italic tracking-tighter leading-none text-slate-900 dark:text-white">
                          ${effectiveUnitPrice.toLocaleString("es-AR")}
                        </p>
                        {activePromo && (
                          <p className="text-[8px] font-bold line-through mt-0.5 text-tertiary">
                            ${scannedProduct.price.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="flex flex-col items-center px-3 border-x border-slate-200 dark:border-slate-700">
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Stock</span>
                        <span className="text-xs font-black text-orange-500">
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
                          className="size-7 rounded-lg bg-gradient-purple-pink text-white shadow-md flex items-center justify-center active:scale-90 transition-all"
                        >
                          <Plus size={13} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                      {/* Fila 4: Snippet de Promociones por cantidad */}
                      <QuantityDiscountsExpandable
                        scannedProduct={scannedProduct}
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
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
                          {scannedProduct.brand && (
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{scannedProduct.brand}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <p className="font-black text-3xl pt-1 italic tracking-tighter text-slate-900 dark:text-white">
                          ${effectiveUnitPrice.toLocaleString("es-AR")}
                        </p>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-slate-400 font-bold">c/u</span>
                          <span className="text-[9px] font-black text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg uppercase tracking-wider">Stock: {scannedProduct.stock}</span>
                        </div>
                      </div>
                      {activePromo && (
                        <p className="text-[10px] font-bold text-tertiary line-through">Precio original: ${scannedProduct.price.toLocaleString("es-AR")}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Descripción — comprimida con toggle */}
                      <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className={`text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium ${!showDescFull ? 'line-clamp-2' : ''}`}>
                          {scannedProduct.description}
                        </p>
                        <button
                          onClick={() => setShowDescFull(!showDescFull)}
                          className="text-[9px] font-black text-primary uppercase tracking-widest mt-1"
                        >
                          {showDescFull ? 'Ver menos ↑' : 'Ver más ↓'}
                        </button>
                      </div>

                      {/* Specs Grid — solo 2 specs */}
                      <div className="grid grid-cols-2 gap-2">
                        {scannedProduct.specs.slice(0, 2).map((s, i) => (
                          <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{s.label}</p>
                            <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{s.value}</p>
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
                                    ? 'border-transparent bg-gradient-purple-pink text-white shadow-lg'
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
                      <QuantityDiscountsExpandable
                        scannedProduct={scannedProduct}
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />

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
                            className="size-9 rounded-lg bg-gradient-purple-pink text-white shadow-lg flex items-center justify-center active:scale-90 transition-all"
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
              <div className="absolute bottom-0 left-0 w-full z-50 p-4 bg-white/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-2xl shrink-0 space-y-2">
                <Button
                  onClick={handleAddToCart}
                  variant="gradient-purple-pink"
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
                {/* Los botones Ver Carrito y Finalizar Compra se muestran solo cuando hay items */}
                {/* {items.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/cart">
                      <button className="w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 active:scale-95 transition-all">
                        Ver Carrito ({items.reduce((a, i) => a + i.quantity, 0)})
                      </button>
                    </Link>
                    <Link href="/checkout">
                      <button className="w-full h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                        Finalizar Compra
                      </button>
                    </Link>
                  </div>
                )} */}
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
