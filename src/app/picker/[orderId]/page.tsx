"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ScanBarcode, 
  MapPin, 
  Clock, 
  User, 
  Check, 
  AlertCircle,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data";

const mockPickingItems = [
  {
    id: "item-1",
    name: "Látex Interior Profesional",
    sku: "PIN-LAT-01",
    qty: 1,
    picked: false,
    zone: "Pasillo 4 - Estante 2",
    image: products[0].image,
    lowStock: false
  },
  {
    id: "item-2",
    name: "Taladro Percutor 18V",
    sku: "HER-TAL-18V",
    qty: 1,
    picked: true,
    zone: "Pasillo 1 - Ferretería",
    image: products[1].image,
    lowStock: true
  },
  {
    id: "item-3",
    name: "Cemento Portland 50kg",
    sku: "CON-CEM-50KG",
    qty: 6,
    picked: false,
    zone: "Pasillo 12 - Construcción",
    image: products[2].image,
    lowStock: false
  }
];

export default function PickerChecklist({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const router = useRouter();
  const [items, setItems] = useState(mockPickingItems);
  const [activeFilter, setActiveFilter] = useState<"to-pick" | "picked" | "all">("to-pick");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const togglePick = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, picked: !item.picked } : item
    ));
  };

  const pickedCount = items.filter(i => i.picked).length;
  const totalCount = items.length;
  const progress = (pickedCount / totalCount) * 100;

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center p-6 pb-4 justify-between">
            <button 
                onClick={() => router.back()}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-all active:scale-90"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">{orderId}</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Picking en curso</span>
            </div>
            <button className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <ScanBarcode size={22} strokeWidth={2.5} />
            </button>
        </div>

        {/* Info Bar */}
        <div className="px-6 pb-4 flex justify-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                <User size={12} />
                <span>J. Pérez</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                <Clock size={12} />
                <span>Límite: 14:00</span>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-6 space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-display">Progreso de Armado</span>
                <span className="text-sm font-black text-primary italic">{pickedCount}/{totalCount} Items</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                />
            </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 px-6 pb-6 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveFilter("to-pick")}
                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'to-pick' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
            >
                Pendientes ({totalCount - pickedCount})
            </button>
            <button 
                onClick={() => setActiveFilter("picked")}
                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'picked' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
            >
                Retirados ({pickedCount})
            </button>
        </div>
      </header>

      {/* Checklist Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
            {items
                .filter(item => {
                    if (activeFilter === 'to-pick') return !item.picked;
                    if (activeFilter === 'picked') return item.picked;
                    return true;
                })
                .map((item) => (
                    <motion.div 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`group relative flex gap-4 p-4 rounded-[2.5rem] border transition-all ${
                            item.picked 
                            ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800 opacity-60' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                    >
                        <div className={`relative size-20 shrink-0 rounded-2xl overflow-hidden bg-white border border-slate-100 ${item.picked ? 'grayscale' : ''}`}>
                             <Image src={item.image} alt={item.name} fill className="object-cover p-2" unoptimized />
                             {item.picked && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <Check className="text-primary size-8" strokeWidth={4} />
                                </div>
                             )}
                        </div>

                        <div className="flex-1 min-w-0 pr-12">
                            <div className="flex justify-between items-start mb-1 h-10">
                                <h4 className={`text-base font-black italic tracking-tighter uppercase leading-tight line-clamp-2 ${item.picked ? 'line-through text-slate-400' : ''}`}>
                                    {item.name}
                                </h4>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${item.picked ? 'bg-slate-200 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                                    Cant: {item.qty}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">SKU: {item.sku}</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-400">
                                <MapPin size={12} className="shrink-0" />
                                <span className="text-[9px] font-black uppercase tracking-widest truncate">{item.zone}</span>
                            </div>
                            
                            {item.lowStock && !item.picked && (
                                <div className="mt-2 flex items-center gap-1 text-red-500">
                                    <AlertCircle size={10} />
                                    <span className="text-[8px] font-black uppercase italic">Stock Crítico</span>
                                </div>
                            )}
                        </div>

                        <div className="absolute top-1/2 -translate-y-1/2 right-6">
                            <label className="relative flex items-center justify-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={item.picked} 
                                    onChange={() => togglePick(item.id)}
                                    className="peer sr-only"
                                />
                                <div className="size-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 transition-all peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm group-active:scale-90">
                                    <Check className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={20} strokeWidth={4} />
                                </div>
                            </label>
                        </div>
                    </motion.div>
                ))}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 py-6 pb-10">
        <Button 
            disabled={pickedCount < totalCount}
            className="w-full h-18 rounded-[2rem] font-black uppercase italic text-lg shadow-2xl shadow-primary/30 gap-3 disabled:opacity-40 disabled:grayscale transition-all"
        >
            <span>Finalizar Armado</span>
            <div className="bg-white/20 px-3 py-1 rounded-xl text-xs">
                {pickedCount}/{totalCount}
            </div>
            <ChevronRight size={24} strokeWidth={3} />
        </Button>
      </footer>
    </div>
  );
}
