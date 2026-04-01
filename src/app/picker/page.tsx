"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Timer, ShoppingBasket, ListFilter, History, Settings,
  PlayCircle, Clock, RefreshCw, LayoutGrid, ScanBarcode,
  CheckCircle, AlertTriangle, User, TrendingUp, Package,
  ChevronRight, Zap, Bell, Moon, Sun
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const ORDERS = [
  {
    id: "ORD-4092",
    customer: "Juan Pérez",
    customerPhone: "+54 11 1234-5678",
    items: 24,
    pickedItems: 0,
    zone: "Pasillo 4",
    timeRemaining: "04:12",
    status: "late-risk",
    priority: "high",
    borderColor: "border-red-500",
    bgBadge: "bg-red-500/10",
    textBadge: "text-red-500",
    badgeLabel: "Riesgo de Atraso",
    createdAt: "09:45",
  },
  {
    id: "ORD-4105",
    customer: "María García",
    customerPhone: "+54 11 9876-5432",
    items: 8,
    pickedItems: 0,
    zone: "Ferretería",
    timeRemaining: "14:02",
    status: "urgent",
    priority: "medium",
    borderColor: "border-amber-500",
    bgBadge: "bg-amber-500/10",
    textBadge: "text-amber-500",
    badgeLabel: "Urgente",
    createdAt: "10:12",
  },
  {
    id: "ORD-4088",
    customer: "Tiago Rex",
    customerPhone: "+54 11 5555-1234",
    items: 15,
    pickedItems: 12,
    zone: "Construcción",
    status: "active",
    priority: "medium",
    borderColor: "border-primary",
    bgBadge: "bg-primary/10",
    textBadge: "text-primary",
    badgeLabel: "En Proceso",
    createdAt: "09:20",
  },
  {
    id: "ORD-4201",
    customer: "Ana Smith",
    customerPhone: "+54 11 2222-3333",
    items: 5,
    pickedItems: 0,
    zone: "Pinturas",
    timeRemaining: "45:00",
    status: "standard",
    priority: "low",
    borderColor: "border-green-500",
    bgBadge: "bg-green-500/10",
    textBadge: "text-green-500",
    badgeLabel: "A Tiempo",
    createdAt: "10:30",
  },
  {
    id: "ORD-4215",
    customer: "Roberto Álvarez",
    customerPhone: "+54 11 7777-8888",
    items: 11,
    pickedItems: 0,
    zone: "Maderas",
    timeRemaining: "28:30",
    status: "standard",
    priority: "low",
    borderColor: "border-green-500",
    bgBadge: "bg-green-500/10",
    textBadge: "text-green-500",
    badgeLabel: "A Tiempo",
    createdAt: "10:55",
  },
];

const PICKER_STATS = [
  { label: "Completadas Hoy", value: "18", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Tiempo Promedio", value: "8:34", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Tasa de Éxito", value: "96%", icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
];

function OrderCard({ order, compact = false }: { order: typeof ORDERS[0]; compact?: boolean }) {
  const progress = order.status === "active" ? (order.pickedItems / order.items) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative p-5 bg-white dark:bg-slate-800 rounded-[2rem] border-l-4 ${order.borderColor} shadow-sm border border-slate-100 dark:border-slate-700 space-y-4 ${compact ? "p-4" : ""}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black italic tracking-tighter uppercase">{order.id}</h3>
            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.bgBadge} ${order.textBadge}`}>
              {order.badgeLabel}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <User size={10} />
            {order.customer}
          </p>
        </div>
        {order.timeRemaining && (
          <div className={`flex items-center gap-1.5 ${order.textBadge} font-black text-xs uppercase italic bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl`}>
            <Timer size={13} />
            <span>{order.timeRemaining}</span>
          </div>
        )}
        {order.status === "active" && (
          <div className="flex items-center gap-1.5 font-black text-xs uppercase italic bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl text-primary">
            <ShoppingBasket size={13} />
            <span>{order.pickedItems}/{order.items}</span>
          </div>
        )}
      </div>

      {/* Metadata row */}
      {!compact && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Items</span>
            <span className="text-sm font-black italic uppercase">{order.items} uds.</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Zona</span>
            <span className="text-sm font-black italic uppercase">{order.zone}</span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {order.status === "active" && (
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-primary h-full rounded-full"
          />
        </div>
      )}

      {/* CTA */}
      <Link href={`/picker/${order.id}`} className="block">
        <Button
          variant="gradient-purple-pink"
          className="w-full h-12 rounded-2xl font-black uppercase italic tracking-tight gap-2 text-sm"
        >
          {order.status === "active" ? "Continuar Armado" : "Iniciar Picking"}
          <PlayCircle size={18} strokeWidth={2.5} />
        </Button>
      </Link>
    </motion.div>
  );
}

export default function PickerDashboard() {
  const [activeTab, setActiveTab] = useState("to-pick");
  const [mounted, setMounted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof ORDERS[0] | null>(null);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const filteredOrders = ORDERS.filter(o => {
    if (activeTab === "to-pick") return o.status !== "ready" && o.status !== "active";
    if (activeTab === "active") return o.status === "active";
    return o.status === "ready";
  });

  const TABS = [
    { id: "to-pick", label: "Pendientes", count: ORDERS.filter(o => o.status !== "active" && o.status !== "ready").length },
    { id: "active", label: "En Proceso", count: ORDERS.filter(o => o.status === "active").length },
    { id: "ready", label: "Listos", count: ORDERS.filter(o => o.status === "ready").length },
  ];

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shrink-0">
        {/* Logo area */}
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
                  <Image
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                    alt="Picker"
                    width={44}
                    height={44}
                    unoptimized
                  />
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

        {/* Nav links */}
        <nav className="px-4 mt-auto pb-6 space-y-1">
          {[
            { icon: LayoutGrid, label: "Órdenes", active: true },
            { icon: History, label: "Historial", active: false },
            { icon: Package, label: "Inventario Rápido", active: false },
            { icon: Settings, label: "Ajustes", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${item.active ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Mobile: profile | Desktop: title */}
          <div className="flex items-center gap-4 md:hidden">
            <div className="relative">
              <div className="size-10 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                  alt="Profile"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">Portal Picker</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Zona A • Operador 204</p>
            </div>
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Tablero de Órdenes</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Turno: 08:00 - 16:00 • Hoy, Viernes 13</p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="relative size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
            </button>
            <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all md:hidden">
              <ScanBarcode size={18} />
            </button>
            <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* Alert banner if late-risk orders exist */}
        {ORDERS.some(o => o.status === "late-risk") && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
              {ORDERS.filter(o => o.status === "late-risk").length} orden(es) en riesgo de atraso — atender con prioridad
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 py-4 sticky top-[73px] z-20 bg-background-light dark:bg-background-dark">
          <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1 max-w-md">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`size-4 rounded-full text-[8px] flex items-center justify-center font-black ${activeTab === tab.id ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-600 text-slate-500"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Order Grid */}
        <main className="flex-1 px-6 pb-28 md:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <CheckCircle size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
                  <p className="text-lg font-black text-slate-400 uppercase italic tracking-tighter">
                    Sin órdenes en esta categoría
                  </p>
                </motion.div>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-8 py-4 pb-safe-bottom flex justify-around items-center z-50">
        {[
          { icon: LayoutGrid, label: "Órdenes", active: true },
          { icon: History, label: "Historial", active: false },
          { icon: Settings, label: "Ajustes", active: false },
        ].map((item) => (
          <button key={item.label} className={`flex flex-col items-center gap-1 ${item.active ? "text-primary" : "text-slate-400"}`}>
            <item.icon size={22} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
