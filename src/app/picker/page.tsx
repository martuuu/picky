"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Timer, ShoppingBasket, History, Settings,
  PlayCircle, Clock, RefreshCw, LayoutGrid, ScanBarcode,
  CheckCircle, TrendingUp, Package,
  Zap, Bell, ChevronRight, Trash2, AlertTriangle,
  ArrowRight, ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useOrderStore } from "@/stores/useOrderStore";
import type { PickyOrder, OrderStatus } from "@/stores/useOrderStore";
import { showPickyAlert } from "@/components/ui/Alert";

// ─── Live Cart Hook ───────────────────────────────────────────────────────────
// Primary source: GET /api/sync/cart relay (works cross-device, cross-browser).
// Fallback: picky-cart-storage localStorage (same-browser only).
//
// TODO (Supabase): Replace API polling with a Supabase Realtime subscription:
//   supabase.channel('carts').on('postgres_changes', { event: '*', schema: 'public',
//   table: 'carts' }, (payload) => setItems(payload.new.items))
//   This eliminates polling entirely and works at any scale.

interface LiveCartItem {
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
  items: LiveCartItem[];
  updatedAt: string;
}

function useLiveCart(): { items: LiveCartItem[]; sessionCount: number } {
  const [snapshots, setSnapshots] = useState<CartSnapshot[]>([]);

  const fetchFromRelay = useCallback(async () => {
    try {
      const res = await fetch("/api/sync/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("relay unavailable");
      const data: CartSnapshot[] = await res.json();
      setSnapshots(data);
    } catch {
      // Relay unavailable — fall back to reading own localStorage
      try {
        const raw = localStorage.getItem("picky-cart-storage");
        if (!raw) { setSnapshots([]); return; }
        const parsed = JSON.parse(raw);
        const items: LiveCartItem[] = parsed?.state?.items ?? [];
        if (items.length > 0) {
          setSnapshots([{ sessionId: "local", items, updatedAt: new Date().toISOString() }]);
        } else {
          setSnapshots([]);
        }
      } catch {
        setSnapshots([]);
      }
    }
  }, []);

  useEffect(() => {
    fetchFromRelay();
    // Poll relay every 2s — low enough latency for a demo, negligible load
    const interval = setInterval(fetchFromRelay, 2000);
    // Also rehydrate immediately on cross-tab localStorage change (same-browser fallback)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "picky-cart-storage") fetchFromRelay();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchFromRelay]);

  const items: LiveCartItem[] = snapshots.flatMap((s) => s.items);
  return { items, sessionCount: snapshots.length };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PICKER_STATS = [
  { label: "Completadas Hoy", value: "18", icon: CheckCircle,  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Tiempo Promedio", value: "8:34", icon: Clock,       color: "text-blue-400",    bg: "bg-blue-500/10"   },
  { label: "Tasa de Éxito",   value: "96%",  icon: TrendingUp,  color: "text-violet-400",  bg: "bg-violet-500/10" },
];

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "ahora";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function getPriorityMeta(order: PickyOrder) {
  const ageMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
  if (ageMinutes > 20) return { label: "Riesgo de Atraso", border: "border-red-500", badge: "bg-red-500/10 text-red-500" };
  if (ageMinutes > 10) return { label: "Urgente",          border: "border-amber-500", badge: "bg-amber-500/10 text-amber-500" };
  return { label: "A Tiempo", border: "border-green-500", badge: "bg-green-500/10 text-green-500" };
}

// ─── Kanban Column Config ────────────────────────────────────────────────────

interface KanbanColumn {
  id: string;
  label: string;
  statuses: OrderStatus[];
  emptyLabel: string;
  color: string;
  dotColor: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: "pending",  label: "Pendientes",   statuses: ["PENDING", "PAYING"],    emptyLabel: "Sin pedidos pendientes",   color: "text-slate-500",    dotColor: "bg-slate-400"   },
  { id: "picking",  label: "En Proceso",   statuses: ["PICKING"],              emptyLabel: "Ningún pedido en proceso", color: "text-primary",      dotColor: "bg-primary"     },
  { id: "ready",    label: "Listos",       statuses: ["READY"],                emptyLabel: "Ningún pedido listo",      color: "text-emerald-500",  dotColor: "bg-emerald-500" },
];

// ─── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({ order, columnId }: { order: PickyOrder; columnId: string }) {
  const { updateOrderStatus, assignPicker } = useOrderStore();
  const meta = getPriorityMeta(order);
  const pickedCount = order.items.filter((i) => i.picked).length;
  const totalItems = order.items.length;
  const progress = totalItems > 0 ? (pickedCount / totalItems) * 100 : 0;

  const handleTake = (e: React.MouseEvent) => {
    e.stopPropagation();
    assignPicker(order.id, "picker-204"); // TODO: use real authenticated picker ID
  };

  const handleMarkDelivered = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateOrderStatus(order.id, "DELIVERED");
  };

  return (
    <motion.div
      layoutId={`order-card-${order.id}`}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative p-4 bg-white dark:bg-slate-800 rounded-[1.75rem] border-l-4 ${meta.border} border border-slate-100 dark:border-slate-700 shadow-sm space-y-3`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-black italic tracking-tighter uppercase leading-none">{order.id}</h3>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {order.customerName}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 italic bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl shrink-0">
          <Timer size={11} />
          <span>{timeAgo(order.createdAt)}</span>
        </div>
      </div>

      {/* Items row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Items</span>
          <span className="text-sm font-black italic uppercase">{totalItems} uds.</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Total</span>
          <span className="text-sm font-black italic">${order.total.toLocaleString("es-AR")}</span>
        </div>
      </div>

      {/* Progress bar (only for PICKING) */}
      {columnId === "picking" && totalItems > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Progreso</span>
            <span className="text-[9px] font-black text-primary italic">{pickedCount}/{totalItems}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-gradient-purple-pink h-full rounded-full"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      {columnId === "pending" && (
        <button
          onClick={handleTake}
          className="w-full h-11 bg-gradient-purple-pink text-white rounded-2xl font-black uppercase italic text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
        >
          <PlayCircle size={16} strokeWidth={2.5} />
          Tomar Pedido
        </button>
      )}
      {columnId === "picking" && (
        <Link href={`/picker/${order.id}`} className="block">
          <button className="w-full h-11 bg-primary/10 text-primary rounded-2xl font-black uppercase italic text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all border border-primary/20">
            <ShoppingBasket size={16} strokeWidth={2.5} />
            Continuar Armado
            <ChevronRight size={14} className="ml-auto" />
          </button>
        </Link>
      )}
      {columnId === "ready" && (
        <button
          onClick={handleMarkDelivered}
          className="w-full h-11 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black uppercase italic text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all border border-emerald-500/20"
        >
          <CheckCircle size={16} strokeWidth={2.5} />
          Marcar como Entregado
        </button>
      )}
    </motion.div>
  );
}

// ─── Empty Column State ───────────────────────────────────────────────────────

function EmptyColumn({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
        <Package size={24} className="text-slate-300" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumnView({
  col,
  orders,
  isActive,
}: {
  col: KanbanColumn;
  orders: PickyOrder[];
  isActive: boolean;
}) {
  return (
    <div className={`flex flex-col shrink-0 w-72 md:w-auto md:flex-1 snap-start transition-all ${!isActive ? "opacity-60 md:opacity-100" : ""}`}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-1 mb-3">
        <div className={`size-2 rounded-full ${col.dotColor}`} />
        <h3 className={`text-[11px] font-black uppercase tracking-widest ${col.color}`}>{col.label}</h3>
        <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${orders.length > 0 ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
          {orders.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 min-h-24">
        <AnimatePresence mode="popLayout" initial={false}>
          {orders.length === 0 ? (
            <EmptyColumn label={col.emptyLabel} />
          ) : (
            orders.map((order) => (
              <KanbanCard key={order.id} order={order} columnId={col.id} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function PickerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeColIndex, setActiveColIndex] = useState(0); // for mobile column indicator
  const { orders, seedDemoOrders, clearAllOrders } = useOrderStore();
  const { items: liveCartItems, sessionCount: liveSessionCount } = useLiveCart();

  const handleSeedDemo = () => {
    const count = seedDemoOrders();
    showPickyAlert(`${count} Órdenes Cargadas`, "Datos demo listos en el Kanban.", "success");
  };

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // Filter out DELIVERED and CANCELLED for the Kanban
  const activeOrders = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED");

  const hasLateRisk = activeOrders.some((o) => {
    const ageMinutes = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
    return ageMinutes > 20 && o.status === "PENDING";
  });

  const columnOrders = COLUMNS.map((col) =>
    activeOrders.filter((o) => col.statuses.includes(o.status))
  );

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-purple-pink rounded-2xl flex items-center justify-center shadow-md">
              <Zap size={20} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-base font-black uppercase italic tracking-tighter leading-none">Picky</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Portal Picker</p>
            </div>
          </div>
        </div>

        {/* Picker profile */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-11 rounded-full bg-gradient-logo-full p-0.5">
                <div className="size-full rounded-full overflow-hidden border-2 border-white dark:border-slate-900">
                  <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Picker" width={44} height={44} unoptimized />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <p className="text-sm font-black uppercase italic">Armador 204</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Zona A • En línea</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-5 space-y-3">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Rendimiento Hoy</p>
          {PICKER_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className={`size-8 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={15} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-sm font-black italic">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ CARRITOS EN VIVO ═══ */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={13} className="text-secondary" />
            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Carritos en Vivo</p>
            {liveSessionCount > 0 && (
              <span className="ml-auto text-[8px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                {liveSessionCount} {liveSessionCount === 1 ? "shopper" : "shoppers"}
              </span>
            )}
          </div>
          {liveCartItems.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sin carritos activos</p>
              <p className="text-[8px] text-slate-300 dark:text-slate-600 mt-1">Se actualizan cada 2s via relay</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
              {liveCartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-secondary/5 border border-secondary/10">
                  <div className="relative size-8 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-white shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-tighter truncate">{item.name}</p>
                    <p className="text-[8px] font-bold text-slate-400">x{item.quantity} · ${(item.price * item.quantity).toLocaleString("es-AR")}</p>
                  </div>
                </div>
              ))}
              <div className="pt-1 px-1">
                <p className="text-[9px] font-black text-secondary italic">
                  Total: ${liveCartItems.reduce((a, i) => a + i.price * i.quantity, 0).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="px-4 mt-auto pb-6 space-y-1">
          {[
            { icon: LayoutGrid,   label: "Órdenes",          active: true,  href: "/picker" },
            { icon: ShoppingCart,  label: "Carritos en Vivo", active: false, href: "#carritos" },
            { icon: History,      label: "Historial",         active: false, href: "/picker/history" },
            { icon: Package,      label: "Inventario Rápido", active: false, href: "/store" },
            { icon: Settings,     label: "Ajustes",           active: false, href: "#" },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${item.active ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                <item.icon size={16} />
                {item.label}
                {item.label === "Carritos en Vivo" && liveCartItems.length > 0 && (
                  <span className="ml-auto size-5 rounded-full bg-secondary text-white text-[8px] font-black flex items-center justify-center animate-pulse">
                    {liveCartItems.length}
                  </span>
                )}
              </button>
            </Link>
          ))}
          {/* Dev tools */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-4 mb-2">Demo</p>
            <button onClick={handleSeedDemo} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <ArrowRight size={16} />
              Cargar Órdenes Demo
            </button>
            <button onClick={clearAllOrders} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
              <Trash2 size={16} />
              Limpiar Todo
            </button>
          </div>
        </nav>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <div className="relative">
              <div className="size-10 rounded-full overflow-hidden border-2 border-primary">
                <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="Profile" width={40} height={40} unoptimized />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">Portal Picker</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Zona A • Operador 204</p>
            </div>
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Tablero Kanban</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {activeOrders.length} orden(es) activa(s) en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
              <Bell size={18} />
              {hasLateRisk && <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />}
            </button>
            <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all md:hidden">
              <ScanBarcode size={18} />
            </button>
            <button
              onClick={() => useOrderStore.persist.rehydrate()}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* Late-risk alert banner */}
        {hasLateRisk && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
              Hay pedidos con riesgo de atraso — atender con prioridad
            </p>
          </div>
        )}

        {/* Mobile column indicator tabs */}
        <div className="md:hidden px-6 py-4">
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
            {COLUMNS.map((col, idx) => (
              <button
                key={col.id}
                onClick={() => setActiveColIndex(idx)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${activeColIndex === idx ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"}`}
              >
                {col.label}
                {columnOrders[idx].length > 0 && (
                  <span className={`size-4 rounded-full text-[8px] flex items-center justify-center font-black ${activeColIndex === idx ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-600 text-slate-500"}`}>
                    {columnOrders[idx].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ KANBAN BOARD ═══ */}
        {/*
          The board is ALWAYS rendered once mounted — hiding it conditionally
          based on activeOrders.length causes Zustand rehydration flashes where
          cards appear for one frame and vanish (the persist store starts empty,
          mounts, then rehydrates and triggers a re-render cycle).
          Empty-state CTA lives inside the board instead.
        */}
        <main className="flex-1 p-6 overflow-hidden">
          {activeOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
              <div className="size-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <LayoutGrid size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-400 mb-2">Sin órdenes activas</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                Las órdenes del cliente aparecen aquí en tiempo real
              </p>
              <button
                onClick={handleSeedDemo}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-purple-pink text-white rounded-2xl font-black uppercase italic text-sm shadow-lg active:scale-95 transition-all"
              >
                <ArrowRight size={18} />
                Cargar Órdenes Demo
              </button>
            </div>
          ) : (
            /*
              LayoutGroup wraps all columns so Framer Motion can animate
              cards moving between columns using shared layoutId.
            */
            <LayoutGroup>
              {/* Desktop: 3 columns side by side */}
              <div className="hidden md:grid md:grid-cols-3 gap-5 h-full items-start">
                {COLUMNS.map((col, idx) => (
                  <KanbanColumnView
                    key={col.id}
                    col={col}
                    orders={columnOrders[idx]}
                    isActive={true}
                  />
                ))}
              </div>

              {/* Mobile: show only the active column (tabs above control which) */}
              <div className="md:hidden">
                <KanbanColumnView
                  col={COLUMNS[activeColIndex]}
                  orders={columnOrders[activeColIndex]}
                  isActive={true}
                />
              </div>
            </LayoutGroup>
          )}
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-4 pb-safe-bottom flex justify-around items-center z-50">
        {[
          { icon: LayoutGrid,   label: "Órdenes",   active: true,  href: "/picker",         badge: 0 },
          { icon: ShoppingCart, label: "Carritos",   active: false, href: "#carritos",       badge: liveCartItems.length },
          { icon: History,      label: "Historial",  active: false, href: "/picker/history", badge: 0 },
          { icon: Settings,     label: "Ajustes",    active: false, href: "#",               badge: 0 },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <button className={`relative flex flex-col items-center gap-1 ${item.active ? "text-primary" : "text-slate-400"}`}>
              <item.icon size={22} />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 size-4 rounded-full bg-secondary text-white text-[7px] font-black flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
