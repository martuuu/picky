"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, Clock, Package, ChevronDown, ChevronUp,
  RefreshCw, Zap, ArrowUpDown, ArrowUp, ArrowDown, User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  brand?: string;
}

interface CartSnapshot {
  sessionId: string;
  items: CartItem[];
  updatedAt: string;
}

type SortKey = "time" | "items" | "total";
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function totalItems(cart: CartSnapshot): number {
  return cart.items.reduce((a, i) => a + i.quantity, 0);
}

function totalPrice(cart: CartSnapshot): number {
  return cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
}

// ─── Expanded cart row ────────────────────────────────────────────────────────

function CartRow({ cart, index }: { cart: CartSnapshot; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const total = totalPrice(cart);
  const itemCount = totalItems(cart);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm"
    >
      {/* ── Summary row (always visible) ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        {/* Live pulse dot */}
        <div className="relative shrink-0">
          <div className="size-2.5 rounded-full bg-secondary" />
          <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-60" />
        </div>

        {/* Session ID */}
        <div className="w-28 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Sesión</p>
          <p className="text-xs font-black font-mono text-slate-700 dark:text-slate-200 truncate">
            {cart.sessionId.replace("session-", "").slice(0, 12)}
          </p>
        </div>

        {/* Item count */}
        <div className="w-20 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Items</p>
          <div className="flex items-center gap-1.5">
            <Package size={12} className="text-primary" />
            <span className="text-sm font-black italic text-slate-900 dark:text-white">
              {itemCount} uds.
            </span>
          </div>
        </div>

        {/* Products preview (thumbnails) */}
        <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
          {cart.items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="relative size-8 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-white shrink-0"
              title={item.name}
            >
              <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
            </div>
          ))}
          {cart.items.length > 5 && (
            <span className="text-[9px] font-black text-slate-400 ml-1">
              +{cart.items.length - 5}
            </span>
          )}
        </div>

        {/* Total */}
        <div className="w-28 shrink-0 text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total</p>
          <p className="text-sm font-black italic gradient-text-logo leading-none">
            ${total.toLocaleString("es-AR")}
          </p>
        </div>

        {/* Time */}
        <div className="w-20 shrink-0 text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
            Última act.
          </p>
          <div className="flex items-center justify-end gap-1 text-slate-500 dark:text-slate-400">
            <Clock size={10} />
            <span className="text-[10px] font-bold">{timeAgo(cart.updatedAt)}</span>
          </div>
        </div>

        {/* Expand chevron */}
        <div className="shrink-0 ml-2 text-slate-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-2 bg-slate-50/50 dark:bg-slate-900/30">
              {/* Header row */}
              <div className="grid grid-cols-[2.5rem_1fr_auto_auto_auto] gap-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                <div />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Producto</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cant.</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">P. Unit.</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Subtotal</span>
              </div>

              {/* Item rows */}
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2.5rem_1fr_auto_auto_auto] items-center gap-3 py-1"
                >
                  <div className="relative size-10 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase italic tracking-tighter truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.brand && (
                        <span className="text-[9px] font-bold text-slate-400">{item.brand}</span>
                      )}
                      <span className="text-[9px] font-mono text-slate-300 dark:text-slate-600">{item.sku}</span>
                    </div>
                  </div>
                  <span className="text-sm font-black italic text-center w-10">×{item.quantity}</span>
                  <span className="text-[11px] font-bold text-slate-500 text-right whitespace-nowrap">
                    ${item.price.toLocaleString("es-AR")}
                  </span>
                  <span className="text-[11px] font-black text-slate-900 dark:text-white text-right whitespace-nowrap">
                    ${(item.price * item.quantity).toLocaleString("es-AR")}
                  </span>
                </div>
              ))}

              {/* Total row */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    {formatTime(cart.updatedAt)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Total estimado
                  </p>
                  <p className="text-xl font-black italic tracking-tighter gradient-text-logo">
                    ${total.toLocaleString("es-AR")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Sort header button ───────────────────────────────────────────────────────

function SortButton({
  label, sortKey, current, dir, onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        active
          ? "bg-primary/10 text-primary"
          : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      }`}
    >
      {label}
      {active ? (
        dir === "desc" ? <ArrowDown size={12} /> : <ArrowUp size={12} />
      ) : (
        <ArrowUpDown size={12} className="opacity-40" />
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LiveCartsPage() {
  const [mounted, setMounted] = useState(false);
  const [carts, setCarts] = useState<CartSnapshot[]>([]);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const fetchCarts = useCallback(async () => {
    try {
      const res = await fetch("/api/sync/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data: CartSnapshot[] = await res.json();
      setCarts(data);
      setLastFetch(new Date());
    } catch {
      // relay unavailable
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchCarts();
    const interval = setInterval(fetchCarts, 2000);
    return () => clearInterval(interval);
  }, [fetchCarts]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    return [...carts].sort((a, b) => {
      let diff = 0;
      if (sortKey === "time") {
        diff = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortKey === "items") {
        diff = totalItems(a) - totalItems(b);
      } else {
        diff = totalPrice(a) - totalPrice(b);
      }
      return sortDir === "desc" ? -diff : diff;
    });
  }, [carts, sortKey, sortDir]);

  const grandTotal = carts.reduce((a, c) => a + totalPrice(c), 0);
  const grandItems = carts.reduce((a, c) => a + totalItems(c), 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] font-display text-slate-900 dark:text-white antialiased">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center gap-4">
        <Link href="/picker">
          <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 active:scale-95 transition-all">
            <ArrowLeft size={18} />
          </button>
        </Link>

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="size-9 bg-gradient-purple-pink rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <Zap size={16} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-base font-black uppercase italic tracking-tighter leading-none">
              Carritos en Vivo
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Órdenes Inteligentes · Portal Picker
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
          <div className="relative size-2">
            <div className="size-2 rounded-full bg-secondary" />
            <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-60" />
          </div>
          <span className="text-[9px] font-black text-secondary uppercase tracking-widest">
            En vivo
          </span>
        </div>

        <button
          onClick={fetchCarts}
          className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all"
          title="Actualizar ahora"
        >
          <RefreshCw size={16} />
        </button>
      </header>

      <div className="px-5 py-5 max-w-4xl mx-auto space-y-5">

        {/* ── KPI strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Carritos Activos",
              value: carts.length,
              icon: ShoppingCart,
              color: "text-secondary",
              bg: "bg-secondary/10",
            },
            {
              label: "Items en curso",
              value: `${grandItems} uds.`,
              icon: Package,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Valor Estimado",
              value: `$${(grandTotal / 1000).toFixed(0)}k`,
              icon: User,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3"
            >
              <div className={`size-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center shrink-0`}>
                <kpi.icon size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-lg font-black italic tracking-tighter leading-none">{kpi.value}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Sort controls + last updated ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-1">Ordenar:</span>
          <SortButton label="Hora" sortKey="time" current={sortKey} dir={sortDir} onClick={handleSort} />
          <SortButton label="Items" sortKey="items" current={sortKey} dir={sortDir} onClick={handleSort} />
          <SortButton label="Total" sortKey="total" current={sortKey} dir={sortDir} onClick={handleSort} />
          {lastFetch && (
            <span className="ml-auto text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
              Act. {lastFetch.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>

        {/* ── Table ── */}
        {sorted.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
              <ShoppingCart size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400 mb-2">
              Sin carritos activos
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Cuando un consumidor agregue productos, aparecerá aquí
            </p>
            <p className="text-[9px] text-slate-300 dark:text-slate-600 mt-2">
              Actualizando cada 2 segundos via relay
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {sorted.map((cart, idx) => (
                <CartRow key={cart.sessionId} cart={cart} index={idx} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
