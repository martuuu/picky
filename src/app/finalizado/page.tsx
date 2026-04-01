"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  X, 
  Check, 
  Star, 
  ShoppingBag,
  MessageCircle,
  Home,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function FinalizadoPage() {
  const [mounted, setMounted] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySubmitted(true);
  };

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden pt-8">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/20 dark:bg-accent/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-8 w-full z-10 relative pb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="size-32 rounded-[3xl] bg-gradient-purple-pink flex items-center justify-center text-white shadow-2xl glow-primary mt-6"
          >
              <Check size={64} strokeWidth={3} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
              <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-tight gradient-text-logo px-4">
                  ¡Pedido Finalizado!
              </h1>
              <p className="font-bold text-slate-500 dark:text-slate-400">
                  Gracias por elegir Picky. Esperamos que disfrutes tus productos.
              </p>
          </motion.div>

          {/* Expanded Survey View inline */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full p-6 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center shadow-2xl border border-white/10"
          >
            {surveySubmitted ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="py-10 space-y-4"
               >
                 <div className="flex justify-center text-accent">
                    <CheckCircle2 size={48} />
                 </div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">¡Gracias!</h3>
                 <p className="text-xs font-medium text-white/60">Tu opinión nos ayuda a mejorar.</p>
               </motion.div>
            ) : (
                <form onSubmit={handleSurveySubmit} className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Calificá tu Experiencia</h3>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">¿Cómo fue tu compra hoy?</p>
                    </div>

                    <div className="flex justify-center gap-2 py-2">
                        {[1,2,3,4,5].map(s => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-90"
                            >
                                <Star 
                                    size={36} 
                                    className={`transition-colors duration-300 ${rating >= s ? "fill-tertiary text-tertiary" : "text-slate-700"}`} 
                                />
                            </button>
                        ))}
                    </div>

                    <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-tertiary/50 placeholder:text-white/20 resize-none"
                        placeholder="¿Algo más que nos quieras decir?"
                        rows={3}
                    ></textarea>

                    <Button 
                        type="submit" 
                        variant="gradient-purple-pink" 
                        className="w-full shadow-lg"
                        disabled={rating === 0}
                    >
                        Enviar Calificación
                    </Button>
                </form>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full pt-4"
          >
              <Link href="/">
                  <Button variant="outline" className="w-full shadow-sm h-14 rounded-full gap-2 text-lg font-black text-slate-500 hover:text-slate-900 dark:hover:text-white">
                      <Home size={20} />
                      Volver al Inicio
                  </Button>
              </Link>
          </motion.div>
      </main>
    </div>
  );
}
