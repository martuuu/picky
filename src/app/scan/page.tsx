"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronDown, Minus, Plus, ShoppingBag,
  CheckCircle2, Tag, Layers, Package, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/data";
import { useCartStore } from "@/stores/useCartStore";
import { CompetitorProducts } from "@/components/ui/CompetitorProducts";
import { PromotionsSection } from "@/components/ui/PromotionsSection";
import { useRouter } from "next/navigation";

const PROMO_SNIPPETS = [
  { type: "bulk",      icon: <Package size={12} />, label: "x5+ unidades",          desc: "10% OFF",        color: "bg-tertiary/10 text-tertiary border-tertiary/20" },
  { type: "quantity",  icon: <Tag size={12} />,     label: "x10+ unidades",          desc: "15% OFF",        color: "bg-secondary/10 text-secondary border-secondary/20" },
  { type: "wholesale", icon: <Layers size={12} />,  label: "Prec. mayorista (x20+)", desc: "Precio Especial", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
];

function getActivePromo(qty: number, product: Product) {
  if (!product.wholesalePrice) return null;
  if (qty >= (product.wholesaleMinQuantity ?? 20)) {
    return { label: `Precio mayorista aplicado`, saving: product.price - product.wholesalePrice };
  }
  if (qty >= 10) return { label: "15% OFF por cantidad", saving: Math.round(product.price * 0.15) };
  if (qty >= 5)  return { label: "10% OFF por volumen",  saving: Math.round(product.price * 0.10) };
  return null;
}

function getEffectivePrice(qty: number, product: Product): number {
  const promo = getActivePromo(qty, product);
  if (!promo) return product.price;
  return product.price - Math.round(promo.saving / qty);
}

// ─── Quantity Discounts Expandable ───────────────────────────────────────────

function QuantityDiscountsExpandable({
  scannedProduct,
  quantity,
  setQuantity,
}: {
  scannedProduct: Product;
  quantity: number;
  setQuantity: (q: number) => void;
}) {
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
                  const targetQty =
                    promo.type === "wholesale"
                      ? (scannedProduct.wholesaleMinQuantity ?? 20)
                      : promo.type === "quantity"
                      ? 10
                      : 5;
                  if (promo.type === "wholesale" && !scannedProduct.wholesalePrice) return null;
                  const isActive = quantity >= targetQty;

                  return (
                    <button
                      key={promo.type}
                      onClick={() => setQuantity(Math.max(quantity, targetQty))}
                      className={`flex items-center text-left gap-3 px-3 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all w-full active:scale-95 relative ${
                        isActive
                          ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-sm"
                          : `${promo.color} opacity-80 hover:opacity-100`
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-purple-pink opacity-10 -z-10" />
                      )}
                      <span className={isActive ? "text-primary" : ""}>{promo.label}</span>
                      <span className={`font-black ml-auto ${isActive ? "text-primary" : ""}`}>
                        {isActive ? "✓ APLICADO" : `→ APLICAR`}
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

// ─── QR Camera Scanner Hook ───────────────────────────────────────────────────
// Uses the device camera + ZXing to decode real QR codes.
// QR value format expected: "picky://product/<SKU>"
// Works great in dev by pointing the phone camera at the /admin/qrs print page
// open on another screen.

function useQRScanner(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onDecode: (sku: string) => void,
  enabled: boolean
) {
  const readerRef = useRef<import("@zxing/browser").BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function start() {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        const reader = new BrowserQRCodeReader();
        readerRef.current = reader;

        const controls = await reader.decodeFromVideoDevice(
          undefined, // use default camera
          videoRef.current!,
          (result, err) => {
            if (cancelled) return;
            if (result) {
              const text = result.getText();
              // Accept "picky://product/<SKU>" format
              const match = text.match(/^picky:\/\/product\/(.+)$/);
              if (match) {
                onDecode(match[1]);
              }
            }
            // Ignore err — ZXing fires err when no QR in frame (normal behavior)
            void err;
          }
        );
        controlsRef.current = controls;
      } catch {
        // Camera permission denied or not available — fail silently
      }
    }

    start();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [enabled, videoRef, onDecode]);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ScanPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"scanning" | "scanned" | "expanded">("scanning");
  const [sheetDirection, setSheetDirection] = useState<"up" | "down">("up");
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [showCartSplash, setShowCartSplash] = useState(false);

  // Products from TiendaNube
  const [products, setProducts] = useState<Product[]>([]);

  // Camera QR scanning
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/tiendanube/products")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Called by the ZXing hook when a valid "picky://product/<SKU>" is decoded
  const handleQRDecode = useCallback((sku: string) => {
    if (status !== "scanning") return;
    const product = products.find((p) => p.sku === sku);
    if (product) {
      setScannedProduct(product);
      setStatus("scanned");
      setQuantity(1);
    }
  }, [status, products]);

  // Activate ZXing reader only when camera mode is on and we're in scanning state
  useQRScanner(videoRef, handleQRDecode, status === "scanning");

  // Demo shortcut: random product
  const handleSimulateScan = () => {
    if (products.length === 0) return;
    const randomIndex = Math.floor(Math.random() * products.length);
    setScannedProduct(products[randomIndex]);
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
      <div className="absolute inset-0 z-0 bg-black" onClick={handleBackgroundClick}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* 2. Controls Area */}
      <div className="absolute top-0 left-0 w-full z-20 pt-safe-top">
        <div className="flex justify-between items-center p-6 pt-12">
          <button
            onClick={() => { if (status === "expanded") { setSheetDirection("down"); setStatus("scanned"); } else router.back(); }}
            className="flex items-center justify-center size-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-3">
            <Link href="/checkout">
              <div className="flex flex-col items-center gap-0.5">
                <button className="flex items-center justify-center px-4 h-12 rounded-full bg-transparent border-2 border-white/70 text-white text-[9px] font-black tracking-widest uppercase shadow-lg transition-all active:scale-90 backdrop-blur-md">
                  Finalizar compra
                </button>
              </div>
            </Link>
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
          </div>
        </div>
      </div>

      {/* 3. Scanning Viewfinder */}
      <AnimatePresence>
        {status === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Minimal corner viewfinder */}
            <div className="relative w-64 h-64">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-white/80 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-[3px] border-r-[3px] border-white/80 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[3px] border-l-[3px] border-white/80 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-white/80 rounded-br-2xl" />
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
                <div className="absolute w-full h-0.5 bg-primary/60 shadow-[0_0_12px_rgba(139,92,246,0.6)] animate-scan" />
              </div>
            </div>

            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-6">
              Escaneá el QR del producto
            </p>

            {/* Demo shortcut */}
            <button
              onClick={handleSimulateScan}
              className="pointer-events-auto mt-4 text-white/30 text-[9px] font-bold uppercase tracking-widest underline underline-offset-2 active:text-white/60 transition-colors"
            >
              Producto aleatorio (demo)
            </button>
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
              animate={{ height: status === "scanned" ? "auto" : "88vh" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-background-light dark:bg-background-dark rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.4)] flex flex-col border-t border-white/10 overflow-hidden"
            >
              {/* Swipe Handle */}
              <motion.div
                key={`handle-drag-${status}`}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (status === "scanned" && (info.offset.y < -15 || info.velocity.y < -100)) { setSheetDirection("up"); setStatus("expanded"); }
                  else if (status === "expanded" && (info.offset.y > 15 || info.velocity.y > 100)) { setSheetDirection("down"); setStatus("scanned"); }
                }}
                className="w-full flex flex-col items-center pt-5 pb-2 cursor-grab active:cursor-grabbing group shrink-0"
                onClick={() => { if (status === "scanned") { setSheetDirection("up"); setStatus("expanded"); } else { setSheetDirection("down"); setStatus("scanned"); } }}
              >
                <div className="h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors group-hover:bg-primary" />
              </motion.div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-28">
                <AnimatePresence mode="wait">
                  {/* ═══ PRODUCT PREVIEW (status === "scanned") ═══ */}
                  {status === "scanned" && (
                    <motion.div
                      key="scanned"
                      initial={{ opacity: 0, y: sheetDirection === "down" ? -12 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-md">
                          <Image src={scannedProduct.image} alt={scannedProduct.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase italic tracking-tighter truncate">
                            {scannedProduct.name}
                          </h2>
                          <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Stock: {scannedProduct.stock}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
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

                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90 text-sm font-black">
                            <Minus size={13} strokeWidth={3} />
                          </button>
                          <span className="text-sm font-black min-w-[1rem] text-center italic">{quantity}</span>
                          <button onClick={() => setQuantity(Math.min(scannedProduct.stock, quantity + 1))} className="size-7 rounded-lg bg-gradient-purple-pink text-white shadow-md flex items-center justify-center active:scale-90 transition-all">
                            <Plus size={13} strokeWidth={3} />
                          </button>
                        </div>
                      </div>

                      <QuantityDiscountsExpandable scannedProduct={scannedProduct} quantity={quantity} setQuantity={setQuantity} />
                    </motion.div>
                  )}

                  {/* ═══ PRODUCT DETAIL OVERVIEW (status === "expanded") ═══ */}
                  {status === "expanded" && (
                    <motion.div
                      key="expanded"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="relative size-14 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-700 shrink-0 shadow-md">
                            <Image src={scannedProduct.image} alt={scannedProduct.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase italic">
                              {scannedProduct.name}
                            </h1>
                            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Stock: {scannedProduct.stock}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-lg italic tracking-tighter text-slate-900 dark:text-white leading-none">
                              ${effectiveUnitPrice.toLocaleString("es-AR")}
                            </p>
                            <span className="text-[9px] text-slate-400 font-bold">c/u</span>
                            {activePromo && (
                              <p className="text-[8px] font-bold text-tertiary line-through mt-0.5">${scannedProduct.price.toLocaleString("es-AR")}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
                            {scannedProduct.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          {scannedProduct.specs.slice(0, 2).map((s, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{s.label}</p>
                              <p className="text-[10px] font-bold truncate text-slate-900 dark:text-white">{s.value}</p>
                            </div>
                          ))}
                        </div>

                        {scannedProduct.variants?.map((v, i) => (
                          <div key={i} className="space-y-2">
                            <h3 className="text-lg font-black italic uppercase tracking-tighter">{v.label}</h3>
                            <div className="flex flex-wrap gap-2">
                              {v.options.map((opt, j) => (
                                <button key={j} className={`px-4 py-2 rounded-xl border-2 transition-all font-black text-[9px] uppercase ${j === 0 ? "border-transparent bg-gradient-purple-pink text-white shadow-lg" : "border-slate-100 dark:border-slate-800 text-slate-400"}`}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* <div className="pt-2">
                          <PromotionsSection />
                        </div> */}

                        <div className="grid grid-cols-[1fr_auto] gap-2 items-center bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 pl-1">Cantidad</span>
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-0.5 shadow-sm">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-90">
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="text-sm font-black min-w-[1rem] text-center italic">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(scannedProduct.stock, quantity + 1))} className="size-7 rounded-md bg-gradient-purple-pink text-white shadow-md flex items-center justify-center active:scale-90 transition-all">
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 pb-4">
                        <CompetitorProducts currentProduct={scannedProduct} allProducts={products} />
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
                      <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                        ¡Agregado!
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
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
          0%   { top: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan { animation: scan 2s infinite linear; }
      `}</style>
    </div>
  );
}
