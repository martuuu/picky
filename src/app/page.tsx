"use client";

import { Button } from "@/components/ui/Button";
import { QrCode, Zap, ScanBarcode, CreditCard, ShoppingBag, Moon, Sun, Sparkles, TrendingUp, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import PickyLogo from "@/assets/logos/logo.png";

export default function WelcomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark transition-colors duration-500 font-display">
      {/* Ambient Background Effects - Now with 3 colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/20 dark:bg-tertiary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Theme Selector Floating Overlay - Minimalist */}
      <div className="absolute top-4 right-4 z-50 flex gap-1 p-1 rounded-xl">
        <button 
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-300 dark:text-slate-600 hover:text-primary'}`}
        >
            <Sun size={14} />
        </button>
        <button 
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-300 dark:text-slate-600 hover:text-primary'}`}
        >
            <Moon size={14} />
        </button>
      </div>

      {/* Top Bar / Logo */}
      <div className="relative flex items-center p-6 pb-3 justify-center z-10">
        <div className="flex flex-col items-center gap-2">
          {/* Picky Logo */}
          <div className="relative w-20 h-20">
            <Image 
              src={PickyLogo}
              alt="Picky Logo"
              fill
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Smart Shopping Experience</p>
        </div>
      </div>

      {/* Hero Image - Más compacto */}
      <div className="relative px-6 py-2 z-10 group">
        <div className="relative w-full aspect-[4/5] max-h-[340px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] border-4 border-transparent bg-gradient-logo-full p-1">
          <div className="relative w-full h-full rounded-[3rem] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800"
              alt="Corralón Experience"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-primary/20 to-transparent"></div>
            
            <div className="absolute bottom-8 left-6 right-6">
              <h3 className="text-white text-2xl font-black leading-tight uppercase italic tracking-tighter">
                  Experiencia Smart Shopping
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Más compacto */}
      <div className="relative flex flex-col items-center px-8 py-4 z-10">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed text-center max-w-[320px]">
          Escaneá productos en góndola, visualizá stocks reales y pagá desde tu móvil en segundos.
        </p>
      </div>

      {/* Features Cards - Con gradientes del branding */}
      <div className="relative grid grid-cols-3 gap-3 px-6 py-4 z-10">
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-purple-pink text-white shadow-lg glow-primary">
          <ScanBarcode className="size-8" strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-wider text-center">Scan & Go</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-purple-orange text-white shadow-lg glow-tertiary">
          <Zap className="size-8 fill-current" strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-wider text-center">Pago Rápido</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-pink-orange text-white shadow-lg glow-secondary">
          <Package className="size-8" strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-wider text-center">Pick-Up</span>
        </div>
      </div>

      {/* CTA - Más arriba */}
      <div className="relative flex flex-col gap-4 px-8 py-6 mt-auto w-full z-10">
        <Link href="/scan" className="w-full">
          <Button 
            variant="gradient-logo" 
            size="lg" 
            className="w-full h-18 text-xl font-black uppercase italic gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group rounded-[2rem]"
          >
            <Zap className="size-6 fill-current group-hover:animate-bounce" />
            Comenzar a Comprar
          </Button>
        </Link>
      </div>

      {/* Benefits Bar */}
      <div className="relative flex items-center justify-center gap-8 px-10 pb-12 z-10">
        <div className="flex flex-col items-center gap-2 text-slate-700 dark:text-slate-400">
            <div className="size-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center gradient-text-primary">
              <CreditCard className="size-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider">Pagos Seguros</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-slate-700 dark:text-slate-400">
            <div className="size-10 rounded-xl bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center gradient-text-tertiary">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider">Ofertas</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-slate-700 dark:text-slate-400">
            <div className="size-10 rounded-xl bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center gradient-text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider">Retiro Rápido</span>
        </div>
      </div>
    </main>
  );
}
