"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, ScanBarcode, MapPin, Clock, User, Check,
  AlertCircle, ChevronRight, Package, CheckCircle2,
  Zap, Timer, Camera, X, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data";

const ORDER_META: Record<string, { customer: string; phone: string; deadline: string; totalItems: number }> = {
  "ORD-4092": { customer: "Juan Pérez", phone: "+54 11 1234-5678", deadline: "13:00", totalItems: 24 },
  "ORD-4105": { customer: "María García", phone: "+54 11 9876-5432", deadline: "15:00", totalItems: 8 },
  "ORD-4088": { customer: "Tiago Rex", phone: "+54 11 5555-1234", deadline: "16:30", totalItems: 15 },
  "ORD-4201": { customer: "Ana Smith", phone: "+54 11 2222-3333", deadline: "17:00", totalItems: 5 },
  "ORD-4215": { customer: "Roberto Álvarez", phone: "+54 11 7777-8888", deadline: "16:00", totalItems: 11 },
};

const buildPickingList = (orderId: string) => {
  const meta = ORDER_META[orderId] || { customer: "Cliente", phone: "", deadline: "00:00", totalItems: 3 };
  return [
    {
      id: "item-1",
      name: products[0].name,
      sku: products[0].sku,
      brand: products[0].brand,
      qty: 2,
      picked: false,
      zone: products[0].zone || "Pasillo A",
      image: products[0].image,
      lowStock: false,
    },
    {
      id: "item-2",
      name: products[1].name,
      sku: products[1].sku,
      brand: products[1].brand,
      qty: 1,
      picked: orderId === "ORD-4088",
      zone: products[1].zone || "Pasillo B",
      image: products[1].image,
      lowStock: true,
    },
    {
      id: "item-3",
      name: products[2].name,
      sku: products[2].sku,
      brand: products[2].brand,
      qty: 6,
      picked: orderId === "ORD-4088",
      zone: products[2].zone || "Exterior",
      image: products[2].image,
      lowStock: false,
    },
    {
      id: "item-4",
      name: products[3].name,
      sku: products[3].sku,
      brand: products[3].brand,
      qty: 1,
      picked: orderId === "ORD-4088",
      zone: products[3].zone || "Pasillo C",
      image: products[3].image,
      lowStock: false,
    },
    {
      id: "item-5",
      name: products[8].name,
      sku: products[8].sku,
      brand: products[8].brand,
      qty: 3,
      picked: false,
      zone: products[8].zone || "Pasillo D",
      image: products[8].image,
      lowStock: false,
    },
  ];
};

export default function PickerChecklist({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const [items, setItems] = useState(() => buildPickingList(orderId));
  const [activeFilter, setActiveFilter] = useState<"to-pick" | "picked" | "all">("to-pick");
  const [mounted, setMounted] = useState(false);
  const [scanSimulating, setScanSimulating] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  const meta = ORDER_META[orderId] || { customer: "Cliente", phone: "", deadline: "00:00", totalItems: items.length };

  useEffect(() => { setMounted(true); }, []);

  const togglePick = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, picked: !item.picked } : item));
  };

  const simulateScan = () => {
    const unpicked = items.filter(i => !i.picked);
    if (unpicked.length === 0) return;
    setScanSimulating(true);
    setTimeout(() => {
      const target = unpicked[0];
      setLastScanned(target.sku);
      setItems(prev => prev.map(i => i.id === target.id ? { ...i, picked: true } : i));
      setScanSimulating(false);
      setTimeout(() => setLastScanned(null), 2000);
    }, 800);
  };

  const pickedCount = items.filter(i => i.picked).length;
  const totalCount = items.length;
  const progress = (pickedCount / totalCount) * 100;

  const FILTERS: { id: "to-pick" | "picked" | "all"; label: string; count: number }[] = [
    { id: "to-pick", label: `Pendientes`, count: totalCount - pickedCount },
    { id: "picked", label: `Retirados`, count: pickedCount },
    { id: "all", label: `Todos`, count: totalCount },
  ];

  if (!mounted) return null;

  const filteredItems = items.filter(item => {
    if (activeFilter === "to-pick") return !item.picked;
    if (activeFilter === "picked") return item.picked;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* ═══ DESKTOP LEFT PANEL ═══ */}
      <aside className="hidden md:flex flex-col w-80 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shrink-0">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 dark:hover:text-white mb-4">
            <ArrowLeft size={14} />
            Volver al tablero
          </button>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">{orderId}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Picking en curso</p>
        </div>

        {/* Customer Info */}
        <div className="p-6 space-y-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Información del Cliente</p>
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-black uppercase italic">{meta.customer}</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-widest">{meta.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Timer size={18} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Límite de entrega</p>
              <p className="text-sm font-black uppercase italic">{meta.deadline} hs</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Progreso de Armado</p>
            <p className="text-sm font-black text-primary italic">{pickedCount}/{totalCount}</p>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            />
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{Math.round(progress)}% completado</p>
        </div>

        {/* Desktop scan button */}
        <div className="p-6">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Simular Escaneo</p>
          <button
            onClick={simulateScan}
            disabled={scanSimulating || pickedCount === totalCount}
            className="w-full h-14 bg-gradient-logo-full text-white rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg disabled:opacity-50"
          >
            {scanSimulating ? (
              <><Camera size={18} className="animate-pulse" /> Escaneando...</>
            ) : (
              <><ScanBarcode size={18} /> Escanear Siguiente Item</>
            )}
          </button>
        </div>

        {/* Finalize */}
        <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
          <Button
            disabled={pickedCount < totalCount}
            className="w-full h-14 rounded-2xl font-black uppercase italic gap-2 disabled:opacity-40 disabled:grayscale"
          >
            Finalizar Armado
            <CheckCircle2 size={18} />
          </Button>
        </div>
      </aside>

      {/* ═══ MAIN CHECKLIST ═══ */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center p-5 pb-3 justify-between">
            <button onClick={() => router.back()} className="size-10 shrink-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 active:scale-90">
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-black uppercase italic tracking-tighter">{orderId}</h2>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Picking en curso</span>
            </div>
            <button
              onClick={simulateScan}
              disabled={scanSimulating || pickedCount === totalCount}
              className="size-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 active:scale-90 disabled:opacity-50"
            >
              {scanSimulating ? <Camera size={20} className="animate-pulse" /> : <ScanBarcode size={20} strokeWidth={2.5} />}
            </button>
          </div>

          {/* Info chips */}
          <div className="px-5 pb-3 flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest">
              <User size={11} />
              <span>{meta.customer}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Clock size={11} />
              <span>Límite: {meta.deadline}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="px-5 pb-5 space-y-1.5">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Progreso</span>
              <span className="text-xs font-black text-primary italic">{pickedCount}/{totalCount} Items</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 px-5 pb-5 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex h-9 shrink-0 items-center gap-1.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f.id ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700"}`}
              >
                {f.label}
                <span className={`size-4 rounded-full text-[8px] flex items-center justify-center font-black ${activeFilter === f.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>{f.count}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Desktop filter bar */}
        <div className="hidden md:flex items-center gap-2 px-8 py-4 border-b border-slate-100 dark:border-slate-800">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex h-9 items-center gap-1.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f.id ? "bg-primary text-white shadow-sm" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:text-slate-700"}`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Scan success flash */}
        <AnimatePresence>
          {lastScanned && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
            >
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                ✓ SKU {lastScanned} escaneado y marcado como retirado
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Item List */}
        <main className="flex-1 px-5 md:px-8 py-5 space-y-3 pb-32 md:pb-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4 opacity-40" />
                <p className="text-lg font-black text-slate-400 uppercase italic tracking-tighter">
                  {activeFilter === "picked" ? "Aún no retiraste ningún ítem" : "¡Todos los ítems retirados!"}
                </p>
              </motion.div>
            ) : (
              filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative flex gap-4 p-4 rounded-[2rem] border transition-all ${
                    item.picked
                      ? "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-60"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                  }`}
                >
                  {/* Image */}
                  <div className={`relative size-20 shrink-0 rounded-2xl overflow-hidden bg-white border border-slate-100 ${item.picked ? "grayscale" : ""}`}>
                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    {item.picked && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="text-primary size-8" strokeWidth={4} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-14">
                    <h4 className={`text-sm font-black italic tracking-tighter uppercase leading-tight line-clamp-2 ${item.picked ? "line-through text-slate-400" : ""}`}>
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.brand}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.picked ? "bg-slate-200 text-slate-400" : "bg-primary/10 text-primary"}`}>
                        Cant: {item.qty}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">SKU: {item.sku}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 mt-1">
                      <MapPin size={11} className="shrink-0 text-slate-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest truncate">{item.zone}</span>
                    </div>
                    {item.lowStock && !item.picked && (
                      <div className="mt-1.5 flex items-center gap-1 text-red-500">
                        <AlertCircle size={10} />
                        <span className="text-[8px] font-black uppercase italic">Stock Crítico</span>
                      </div>
                    )}
                  </div>

                  {/* Checkbox */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-5">
                    <label className="relative flex items-center justify-center cursor-pointer">
                      <input type="checkbox" checked={item.picked} onChange={() => togglePick(item.id)} className="peer sr-only" />
                      <div className="size-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 transition-all peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm group-active:scale-90">
                        <Check className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={20} strokeWidth={4} />
                      </div>
                    </label>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Footer */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 py-5 pb-10">
          <Button
            disabled={pickedCount < totalCount}
            className="w-full h-16 rounded-[2rem] font-black uppercase italic text-lg shadow-2xl shadow-primary/30 gap-3 disabled:opacity-40 disabled:grayscale transition-all"
          >
            <span>Finalizar Armado</span>
            <div className="bg-white/20 px-3 py-1 rounded-xl text-xs">
              {pickedCount}/{totalCount}
            </div>
            <ChevronRight size={24} strokeWidth={3} />
          </Button>
        </footer>
      </div>
    </div>
  );
}
