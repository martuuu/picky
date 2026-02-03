"use client";

import { useState, useEffect } from "react";
import { Search, ScanBarcode, LayoutGrid, ShoppingBag, Plus } from "lucide-react";
import { products, categories, Product } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col pb-32 font-display transition-colors duration-500">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pt-safe-top border-b border-slate-100 dark:border-slate-800">
        <div className="px-6 py-4 flex flex-col gap-1">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Catálogo <span className="gradient-text-primary">Smart</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encontrá materiales para tu obra</p>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-2">
            <div className="relative flex w-full items-center">
                <Search className="absolute left-4 size-5 text-slate-400" />
                <input 
                    type="text"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
                    placeholder="Buscar materiales, herramientas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Categories (Chips) */}
        <div className="flex gap-2 px-6 py-4 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setSelectedCategory("Todos")}
                className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'Todos' ? 'bg-gradient-purple-pink text-white shadow-lg glow-primary' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700'}`}
            >
                Todos
            </button>
            {categories.map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex h-10 shrink-0 items-center justify-center px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-gradient-purple-pink text-white shadow-lg glow-primary' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Populares en <span className="gradient-text-primary">Picky</span></h2>
                <div className="h-1 w-12 bg-gradient-purple-pink rounded-full glow-primary"></div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 dark:border-slate-800 pb-1">Ver todos</button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
                {filteredProducts.map(product => (
                    <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {filteredProducts.length === 0 && (
                <div className="col-span-2 py-20 text-center flex flex-col items-center gap-4">
                    <div className="size-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center">
                        <ShoppingBag size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Lo sentimos, no encontramos resultados.</p>
                </div>
            )}
        </div>
      </main>

      {/* Floating Scan Button */}
      <div className="fixed bottom-28 right-6 z-40">
        <Link href="/scan">
            <Button variant="gradient-purple-pink" size="icon" className="w-16 h-16 rounded-full shadow-2xl hover:scale-105 active:scale-95 text-white transition-all ring-4 ring-white dark:ring-background-dark">
                <ScanBarcode size={32} strokeWidth={2.5} />
            </Button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
