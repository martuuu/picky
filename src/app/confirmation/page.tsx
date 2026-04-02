"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X, Share2, Check, ShoppingBasket, Receipt, Clock,
  Package, Star, AlertCircle, ScanLine, Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useOrderStore } from "@/stores/useOrderStore";
import type { OrderStatus } from "@/stores/useOrderStore";

// ─── Status Step Definitions ─────────────────────────────────────────────────

type DisplayStatus = "payment-confirmed" | "preparing" | "ready";

interface StatusStep {
  id: DisplayStatus;
  label: string;
  icon: React.ReactNode;
  gradient: string;
  estimatedTime: string;
}

const STATUS_STEPS: StatusStep[] = [
  { id: "payment-confirmed", label: "Pago Confirmado",      icon: <Check size={20} strokeWidth={3} />,    gradient: "bg-gradient-purple-pink", estimatedTime: "~10 min" },
  { id: "preparing",         label: "Armando Pedido",       icon: <ShoppingBasket size={24} />,           gradient: "bg-gradient-purple-pink", estimatedTime: "~5 min" },
  { id: "ready",             label: "Listo para Retirar",   icon: <Package size={24} />,                  gradient: "bg-gradient-purple-pink", estimatedTime: "¡Ahora!" },
];

/** Map OrderStore status → display step */
function orderStatusToDisplay(status: OrderStatus): DisplayStatus {
  if (status === "PENDING" || status === "PAYING") return "payment-confirmed";
  if (status === "PICKING") return "preparing";
  return "ready"; // READY, DELIVERED, CANCELLED all map to final state
}

// ─── Warehouse Map ────────────────────────────────────────────────────────────

function WarehouseMap({ pickupZone }: { pickupZone: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Punto de Retiro</p>
          <p className="font-black text-sm uppercase italic tracking-tighter text-slate-900 dark:text-white">{pickupZone}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-xl">
          <Navigation size={12} className="text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">50m</span>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <svg viewBox="0 0 300 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="180" fill="transparent" />
          <rect x="10" y="10" width="280" height="160" rx="8" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="10" y="70" width="280" height="40" fill="#f8fafc" opacity="0.8" />
          <rect x="20" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="60" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="100" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="20" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="60" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="100" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <text x="35" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A1</text>
          <text x="75" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A2</text>
          <text x="115" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A3</text>
          <text x="35" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B1</text>
          <text x="75" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B2</text>
          <text x="115" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B3</text>
          <rect x="200" y="20" width="80" height="140" rx="6" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,2" />
          <text x="240" y="88" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">MOSTRADOR</text>
          <text x="240" y="100" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">PRINCIPAL</text>
          <text x="155" y="94" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">PASILLO CENTRAL</text>
          <motion.circle cx="20" cy="90" r="5" fill="#8b5cf6" />
          <text x="30" y="80" fontSize="6" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">Vos</text>
          <path d="M 25 90 L 155 90 L 200 90" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3" fill="none" />
          <motion.circle cx="240" cy="90" r="7" fill="#8b5cf6" animate={{ r: [7, 9, 7], opacity: [1, 0.6, 1] }} />
          <text x="240" y="93" textAnchor="middle" fontSize="6" fill="white" fontWeight="900" fontFamily="system-ui">✓</text>
          <rect x="10" y="82" width="6" height="16" fill="white" />
          <text x="6" y="93" fontSize="5" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui" textAnchor="middle">ENT</text>
        </svg>
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3 text-center">
        Seguí el camino marcado → Mostrador Principal
      </p>
    </div>
  );
}

// ─── Picker Card ──────────────────────────────────────────────────────────────

const PICKER_DATA = {
  name: "Marcos R.",
  zone: "Zona B · Pasillo 3-6",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200",
  rating: 4.8,
  totalOrders: 1247,
  emoji: "⚡",
};

function PickerCard({ picker, onRate }: { picker: typeof PICKER_DATA; onRate: (stars: number) => void }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rated, setRated] = useState(0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tu Picker</p>
      </div>
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="size-14 rounded-2xl overflow-hidden border-2 border-primary/20">
            <Image src={picker.avatar} alt={picker.name} width={56} height={56} className="object-cover w-full h-full" unoptimized />
          </div>
          <div className="absolute -bottom-1 -right-1 size-6 bg-gradient-purple-pink rounded-full flex items-center justify-center text-[10px] shadow-md border-2 border-white dark:border-slate-800">
            {picker.emoji}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm uppercase italic tracking-tighter text-slate-900 dark:text-white">{picker.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{picker.zone}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-black text-slate-900 dark:text-white">{picker.rating}</span>
            <span className="text-[9px] text-slate-400 font-bold">· {picker.totalOrders.toLocaleString()} pedidos</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
          {rated > 0 ? "¡Gracias por calificar!" : "Calificá al picker"}
        </p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => { setRated(star); onRate(star); }} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} className="transition-transform active:scale-90">
              <Star size={24} className={`transition-colors ${star <= (hoveredStar || rated) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700 fill-transparent"}`} />
            </button>
          ))}
          {rated > 0 && (
            <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] font-black text-amber-500 uppercase tracking-wider ml-1">
              ¡Gracias!
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConfirmationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Read order from store (currentOrderId set by checkout)
  const { orders, currentOrderId, updateOrderStatus } = useOrderStore();
  const currentOrder = orders.find((o) => o.id === currentOrderId);

  // Map store status → display step (for demo advance buttons)
  const displayStatus: DisplayStatus = currentOrder
    ? orderStatusToDisplay(currentOrder.status)
    : "payment-confirmed";

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.id === displayStatus);
  const currentStep = STATUS_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STATUS_STEPS.length) * 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigate to /finalizado when order is DELIVERED
  useEffect(() => {
    if (currentOrder?.status === "DELIVERED") {
      router.push("/finalizado");
    }
  }, [currentOrder?.status, router]);

  // ── Demo advance helpers (also update real store so picker stays in sync) ──
  const advanceStatus = () => {
    if (!currentOrderId) return;
    if (currentOrder?.status === "PENDING")  updateOrderStatus(currentOrderId, "PICKING");
    if (currentOrder?.status === "PICKING")  updateOrderStatus(currentOrderId, "READY");
  };

  const regressStatus = () => {
    if (!currentOrderId) return;
    if (currentOrder?.status === "READY")   updateOrderStatus(currentOrderId, "PICKING");
    if (currentOrder?.status === "PICKING") updateOrderStatus(currentOrderId, "PENDING");
  };

  const handleQRScan = () => {
    if (displayStatus === "ready" && currentOrderId) {
      updateOrderStatus(currentOrderId, "DELIVERED");
      // Navigation handled by the useEffect above
    }
  };

  if (!mounted) return null;

  // Order summary: use real items or empty fallback
  const orderItems = currentOrder?.items ?? [];
  const orderTotal = currentOrder?.total ?? 0;
  const orderSavings = currentOrder?.savings ?? 0;
  const orderId = currentOrder?.id ?? "—";
  const pickupZone = currentOrder?.pickupMethod === "locker"
    ? "Smart Locker · Zona C"
    : "Mostrador Principal · Sector B";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 pb-32 overflow-x-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 relative z-10">
        <Link href="/">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
            <X size={18} />
          </button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estado en Vivo</span>
          {/* Tap to regress status (demo) */}
          <button onClick={regressStatus} className="active:scale-95 transition-transform">
            <h1 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">#{orderId}</h1>
          </button>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
          <Share2 size={18} className="text-slate-500" />
        </button>
      </header>

      {/* Dynamic Status Indicator — tap to advance (demo) */}
      <section
        className="px-4 py-3 cursor-pointer"
        onClick={() => { if (displayStatus !== "ready") advanceStatus(); }}
      >
        <div className="relative overflow-hidden rounded-[2.5rem] p-5 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 min-h-[140px] flex items-center">
          <div className={`absolute inset-0 ${currentStep.gradient} opacity-5 animate-pulse`} />

          <div className={`relative z-10 w-full flex gap-5 transition-all duration-700 ${displayStatus === "ready" ? "flex-col items-center py-8 text-center" : "items-center"}`}>

            {/* QR / Spinner */}
            <motion.div
              layout
              onClick={handleQRScan}
              className={`relative flex-shrink-0 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center transition-all duration-700 ${displayStatus === "ready" ? "size-64 cursor-pointer hover:scale-105 active:scale-95" : "size-20"}`}
            >
              <div className="absolute inset-0 p-2 grid grid-cols-4 grid-rows-4 gap-0.5">
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-sm bg-slate-900 dark:bg-white"
                    animate={displayStatus === "preparing" ? { opacity: [0.15, 0.9, 0.15] } : { opacity: 0.1 }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>

              <div className="relative z-20 flex items-center justify-center w-full h-full p-2">
                {displayStatus === "ready" ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-full h-full bg-white rounded-2xl p-3 flex items-center justify-center relative group/qr shadow-xl"
                  >
                    {/* Real QR with order ID */}
                    <QRCodeSVG
                      value={`picky://order/${orderId}`}
                      size={180}
                      level="M"
                      fgColor="#0f172a"
                      bgColor="#ffffff"
                    />
                    <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover/qr:opacity-100 transition-opacity backdrop-blur-sm">
                      <ScanLine className="size-14 mb-2" />
                      <span className="text-sm font-black uppercase text-center leading-tight">Simular<br />Retiro QR</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-slate-800 dark:text-slate-300 drop-shadow-xl scale-110">
                    <ShoppingBasket size={28} />
                  </div>
                )}
              </div>

              {displayStatus === "ready" && (
                <div className="absolute inset-0 rounded-3xl animate-ping opacity-15 bg-gradient-purple-pink" />
              )}
            </motion.div>

            {/* Status Info */}
            <div className={`flex-1 space-y-2 w-full ${displayStatus === "ready" ? "flex flex-col items-center" : ""}`}>
              <div>
                <h2 className={`font-black italic uppercase tracking-tighter leading-tight transition-all duration-500 ${displayStatus === "ready" ? "text-2xl" : "text-xl"}`}>
                  {currentStep.label}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {displayStatus === "payment-confirmed" && "¡Pago exitoso! Asignando picker"}
                  {displayStatus === "preparing"         && "Tu pedido está siendo preparado"}
                  {displayStatus === "ready"             && "¡Listo! Mostrale este QR al picker"}
                </p>
              </div>

              <div className={`flex items-center gap-2 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 ${displayStatus === "ready" ? "w-full justify-center mt-2" : ""}`}>
                <Clock size={14} className="text-primary" />
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {displayStatus === "ready" ? pickupZone : `Listo en ${currentStep.estimatedTime}`}
                </p>
              </div>

              {displayStatus !== "ready" && (
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-purple-pink rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {displayStatus !== "ready" && (
          <p className="text-center text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest mt-2">
            {/* DEMO NOTE: en producción este avance lo dispara el picker desde su portal */}
            Toca para simular avance de estado →
          </p>
        )}
      </section>

      {/* Picker Card */}
      {displayStatus !== "ready" && (
        <section className="px-4 py-2">
          <PickerCard picker={PICKER_DATA} onRate={(stars) => console.log(`Rated ${stars}★`)} />
        </section>
      )}

      {/* Warehouse Map */}
      {displayStatus === "preparing" && (
        <section className="px-4 py-2">
          <WarehouseMap pickupZone={pickupZone} />
        </section>
      )}

      {/* Order Summary — real items */}
      <section className="px-4 py-2">
        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Resumen de Compra</h3>
            <span className="text-lg font-black italic tracking-tighter text-slate-900 dark:text-white">
              ${orderTotal.toLocaleString("es-AR")}
            </span>
          </div>

          {orderItems.length > 0 ? (
            <div className="space-y-3 mb-5">
              {orderItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
                  <span className="text-slate-500 truncate max-w-[65%]">
                    {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ""}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white shrink-0">
                    ${(item.priceAtPurchase * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}
              {orderSavings > 0 && (
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                  <span>Ahorro Total Picky</span>
                  <span>-${orderSavings.toLocaleString("es-AR")}</span>
                </div>
              )}
            </div>
          ) : (
            // Fallback when no real order found (e.g. navigated directly)
            <div className="space-y-3 mb-5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center py-4">
                — Iniciá una compra para ver el resumen —
              </p>
            </div>
          )}

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 py-3.5 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary">
            <Receipt size={16} />
            Descargar Factura A/B
          </button>
        </div>
      </section>

      {/* Arrepentimiento */}
      <div className="flex justify-center pt-4 pb-2">
        <Link href="/arrepentimiento">
          <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <AlertCircle size={11} />
            Botón de Arrepentimiento
          </button>
        </Link>
      </div>
    </div>
  );
}
