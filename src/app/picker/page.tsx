"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Timer, 
  ShoppingBasket, 
  ListFilter, 
  History, 
  Settings,
  PlayCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Search,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const orders = [
  {
    id: "ORD-4092",
    customer: "Juan Pérez",
    items: 24,
    zone: "Pasillo 4",
    timeRemaining: "04:12 min",
    status: "late-risk",
    borderColor: "border-red-500",
    bgBadge: "bg-red-500/10",
    textBadge: "text-red-500",
    badgeLabel: "Riesgo de Atraso"
  },
  {
    id: "ORD-4105",
    customer: "María García",
    items: 8,
    zone: "Ferretería",
    timeRemaining: "14:02 min",
    status: "urgent",
    borderColor: "border-amber-500",
    bgBadge: "bg-amber-500/10",
    textBadge: "text-amber-500",
    badgeLabel: "Urgente"
  },
  {
    id: "ORD-4088",
    customer: "Tiago Rex",
    items: 15,
    pickedItems: 12,
    zone: "Construcción",
    status: "active",
    borderColor: "border-primary",
    bgBadge: "bg-primary/10",
    textBadge: "text-primary",
    badgeLabel: "En Proceso"
  },
  {
    id: "ORD-4201",
    customer: "Ana Smith",
    items: 5,
    zone: "Pinturas",
    timeRemaining: "45:00 min",
    status: "standard",
    borderColor: "border-green-500",
    bgBadge: "bg-green-500/10",
    textBadge: "text-green-500",
    badgeLabel: "A Tiempo"
  }
];

export default function PickerDashboard() {
  const [activeTab, setActiveTab] = useState("to-pick");

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="size-12 rounded-full border-2 border-primary overflow-hidden">
                        <Image 
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" 
                            alt="Profile" 
                            width={48} 
                            height={48}
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
                </div>
                <div>
                    <h1 className="text-base font-black uppercase italic tracking-tighter leading-none">Depósito Picky</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Zona A • Operador 204</p>
                </div>
            </div>
            <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 active:scale-95 transition-all">
                <RefreshCw size={20} />
            </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-6 sticky top-[84px] z-20 bg-background-light dark:bg-background-dark">
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
            {['to-pick', 'active', 'ready'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab 
                        ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                    {tab === 'to-pick' ? 'Pendientes' : tab === 'active' ? 'En Proceso' : 'Listos'}
                </button>
            ))}
        </div>
      </div>

      {/* Order List */}
      <main className="px-6 space-y-4">
        <AnimatePresence mode="popLayout">
            {orders.filter(o => {
                if (activeTab === 'to-pick') return o.status !== 'ready' && o.status !== 'active';
                if (activeTab === 'active') return o.status === 'active';
                return o.status === 'ready';
            }).map((order) => (
                <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative p-5 bg-white dark:bg-slate-800 rounded-[2.5rem] border-l-4 ${order.borderColor} shadow-sm border border-slate-100 dark:border-slate-700 space-y-4`}
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black italic tracking-tighter uppercase">{order.id}</h3>
                                {order.badgeLabel && (
                                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.bgBadge} ${order.textBadge}`}>
                                        {order.badgeLabel}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente: {order.customer}</p>
                        </div>
                        {order.timeRemaining && (
                            <div className={`flex items-center gap-1.5 ${order.textBadge} font-black text-xs uppercase italic bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl`}>
                                <Timer size={14} />
                                <span>{order.timeRemaining}</span>
                            </div>
                        )}
                        {order.status === 'active' && (
                            <div className="flex items-center gap-1.5 font-black text-xs uppercase italic bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl text-primary">
                                <ShoppingBasket size={14} />
                                <span>{order.pickedItems}/{order.items}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Items</span>
                            <span className="text-sm font-black italic uppercase">{order.items} Unidades</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Ubicación</span>
                            <span className="text-sm font-black italic uppercase">{order.zone}</span>
                        </div>
                    </div>

                    {order.status === 'active' && (
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${(order.pickedItems! / order.items) * 100}%` }}
                            ></div>
                        </div>
                    )}

                    <Link href={`/picker/${order.id}`} className="block">
                        <Button className="w-full h-14 rounded-2xl font-black uppercase italic tracking-tight gap-2 shadow-lg shadow-primary/20">
                            {order.status === 'active' ? 'Continuar Armado' : 'Iniciar Picking'}
                            <PlayCircle size={20} strokeWidth={2.5} />
                        </Button>
                    </Link>
                </motion.div>
            ))}
        </AnimatePresence>
      </main>

      {/* FAB Filter */}
      <button className="fixed bottom-32 right-6 size-14 bg-slate-900 dark:bg-primary text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all z-40">
        <ListFilter size={24} />
      </button>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-8 py-4 pb-10 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
            <LayoutGrid size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Órdenes</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
            <History size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Historial</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
            <Settings size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}
