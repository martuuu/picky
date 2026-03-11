"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ArrepentimientoPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background-light dark:bg-background-dark font-display text-center px-6 items-center justify-center">
        <div className="size-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-500/20 shadow-xl">
          <CheckCircle2 className="text-emerald-500 size-12" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-2">
          Solicitud Recibida
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs font-medium leading-relaxed">
          Hemos registrado tu solicitud de arrepentimiento. Te enviaremos las instrucciones de devolución a tu email en las próximas 24 hs hábiles.
        </p>
        <Link href="/">
          <Button variant="gradient-logo" className="h-14 px-8 rounded-2xl uppercase font-black italic shadow-xl">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl px-6 py-6 pt-12 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
        <Link href="/">
          <button className="flex items-center justify-center size-10 rounded-full bg-slate-100 dark:bg-slate-800 transition-all active:scale-95">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-[10px] font-black tracking-[0.3em] uppercase italic text-center text-slate-900 dark:text-white">
          Arrepentimiento
        </h1>
        <div className="size-10"></div> {/* Spacer */}
      </header>

      <main className="flex-1 px-6 py-8 space-y-8">
        <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-[2rem] border border-red-100 dark:border-red-900/30 flex items-start gap-4">
          <div className="size-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="font-black uppercase text-red-700 dark:text-red-400 text-sm mb-1 italic">Botón de Arrepentimiento</h2>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 font-medium leading-relaxed">
              De acuerdo a la Resolución 424/2020 de la Secretaría de Comercio Interior, tenés derecho a revocar la aceptación del producto dentro de los 10 días computados a partir de su entrega.
            </p>
          </div>
        </div>

        <form 
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Datos para solicitar revocación
            </h3>
            
            <div className="space-y-3">
              <input 
                required
                type="text" 
                placeholder="Número de Pedido u Operación" 
                className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input 
                required
                type="email" 
                placeholder="Email registrado en la compra" 
                className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input 
                required
                type="text" 
                placeholder="DNI / CUIT" 
                className="w-full h-14 px-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <textarea 
                required
                placeholder="Motivo (opcional)" 
                className="w-full h-32 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
            <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
              El producto debe ser devuelto en el mismo estado en que fue recibido, sin indicios de uso, con su empaque original y todos sus accesorios.
            </p>
          </div>

          <Button type="submit" variant="gradient-logo" className="w-full h-16 rounded-[2rem] uppercase font-black italic shadow-2xl text-lg mt-6">
            Iniciar Tramite
          </Button>
        </form>
      </main>
    </div>
  );
}
