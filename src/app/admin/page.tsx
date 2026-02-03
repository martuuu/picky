"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ArrowLeft, 
  Share, 
  ChevronDown, 
  DollarSign, 
  Ticket, 
  QrCode,
  ArrowUp,
  Download,
  Users,
  Box,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0b1120] text-white font-display overflow-x-hidden pb-32 max-w-md mx-auto shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0b1120]/80 backdrop-blur-md border-b border-white/5 px-6 py-6 flex items-center justify-between">
        <button className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <h1 className="text-lg font-black uppercase italic tracking-tighter">Admin <span className="text-primary">Analytics</span></h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Download size={20} className="text-primary" />
        </button>
      </header>

      {/* Store Selector */}
      <div className="px-6 pt-8 space-y-4">
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Sucursal Activa</label>
            <div className="relative">
                <select className="w-full appearance-none bg-slate-800/50 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/50 outline-none">
                    <option>Picky - Buenos Aires Centro</option>
                    <option>Picky - Rosario Sur</option>
                    <option>Picky - Córdoba Norte</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
        </div>

        {/* Time Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['Hoy', 'Ayer', 'Semana', 'Mes'].map((filter, i) => (
                <button 
                    key={filter}
                    className={`h-9 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'bg-white/5 border border-white/10 text-slate-400'}`}
                >
                    {filter}
                </button>
            ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-6 pt-6 overflow-x-auto no-scrollbar flex gap-4 pb-4">
        {[
            { label: "Ventas Totales", value: "$420.500", diff: "+12%", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
            { label: "Ticket Promedio", value: "$32.400", diff: "+2.4%", icon: Ticket, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Scan Activos", value: "128", diff: "+5%", icon: QrCode, color: "text-green-400", bg: "bg-green-400/10", live: true }
        ].map((card, idx) => (
            <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col gap-4 p-5 rounded-3xl bg-slate-800/40 border border-white/5 min-w-[210px] relative overflow-hidden group"
            >
                <div className="absolute -right-4 -top-4 size-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                
                <div className="flex items-center gap-2 relative z-10">
                    <div className={`${card.bg} ${card.color} p-2 rounded-xl border border-white/5`}>
                        <card.icon size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{card.label}</span>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black italic tracking-tighter">{card.value}</span>
                        {card.live && (
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 bg-white/5 w-fit px-2.5 py-1 rounded-full border border-white/5">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-green-400 text-[10px] font-black">{card.diff}</span>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      {/* Trends Graph Placeholder */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Tendencias de <span className="text-primary">Venta</span></h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 px-3 py-1.5 rounded-full bg-primary/5">Ver Reporte</button>
        </div>
        <div className="w-full h-64 bg-slate-800/40 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
            {/* SVG Graph Simulation */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
                    </linearGradient>
                </defs>
                <path d="M0 80 Q 20 70, 40 50 T 80 20 T 100 10 V 100 H 0 Z" fill="url(#grad)" />
                <path d="M0 80 Q 20 70, 40 50 T 80 20 T 100 10" fill="none" stroke="#3b82f6" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-6 left-8 right-8 flex justify-between">
                {['08h', '12h', '16h', '20h'].map(t => <span key={t} className="text-[9px] font-black text-slate-500 uppercase">{t}</span>)}
            </div>
        </div>
      </div>

      {/* Success Rate Circle */}
      <div className="px-6 mt-10">
        <h2 className="text-xl font-black italic uppercase tracking-tighter mb-4">Eficiencia <span className="text-primary">Scan & Go</span></h2>
        <div className="p-6 rounded-[2.5rem] bg-slate-800/40 border border-white/5 flex items-center gap-8">
            <div className="relative size-32 flex-shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="92, 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black italic tracking-tighter leading-none">92%</span>
                    <span className="text-[8px] font-black uppercase text-slate-500">Éxito</span>
                </div>
            </div>
            <div className="flex-1 space-y-4">
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span className="text-slate-500">Scan Primer Intento</span>
                        <span className="text-primary">88%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[88%] shadow-[0_0_8px_rgba(56,189,248,0.4)]"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-1.5">
                        <span className="text-slate-500">Re-escaneos</span>
                        <span className="text-yellow-400">8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full w-[8%]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/5 px-8 py-4 pb-10 flex justify-around items-center z-50">
        <button className="flex flex-col items-center gap-1 text-primary">
            <div className="relative">
                <BarChart3 size={24} />
                <div className="absolute -top-1 -right-1 size-2 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Analíticas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
            <Box size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Inventario</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
            <Users size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Personal</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
            <Settings size={24} />
            <span className="text-[9px] font-black uppercase tracking-widest">Panel</span>
        </button>
      </nav>
    </div>
  );
}
