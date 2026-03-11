"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Share2, 
  Check, 
  ShoppingBasket, 
  Box, 
  Timer, 
  Receipt, 
  Rocket, 
  ArrowRight,
  ChevronRight,
  UtensilsCrossed,
  MapPin,
  Clock,
  CreditCard,
  Package,
  Sparkles,
  TrendingUp,
  Zap,
  AlertCircle,
  MessageCircle,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import { useCartStore } from "@/stores/useCartStore";
import { showPickyAlert } from "@/components/ui/Alert";

// Order status types (Simplified to 3 steps)
type OrderStatus = "payment-confirmed" | "preparing" | "ready";

interface StatusStep {
  id: OrderStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const STATUS_STEPS: StatusStep[] = [
  {
    id: "payment-confirmed",
    label: "Pago Confirmado",
    icon: <Check size={20} strokeWidth={3} />,
    color: "text-primary",
    gradient: "bg-gradient-primary"
  },
  {
    id: "preparing",
    label: "Armando Pedido",
    icon: <ShoppingBasket size={24} />,
    color: "text-secondary",
    gradient: "bg-gradient-secondary"
  },
  {
    id: "ready",
    label: "Enviado / Retirado",
    icon: <Package size={24} />,
    color: "text-accent",
    gradient: "bg-gradient-accent"
  },
];

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("payment-confirmed");
  const [progress, setProgress] = useState(0);
  const { addItem } = useCartStore();

  // Encuesta feedback
  const [showSurveyBtn, setShowSurveyBtn] = useState(true);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveySubmitted(true);
    setTimeout(() => {
        setIsSurveyOpen(false);
    }, 2000);
  };

  const handleAddFood = (offer: any) => {
    addItem({
      id: `food-${offer.id}`,
      name: offer.name,
      price: offer.price,
      image: offer.image,
      category: "CAFETERÍA",
      sku: `FOOD-${offer.id}`,
      description: "Agregado desde el Picky Lounge",
      stock: 50,
      specs: [],
    }, 1);
    showPickyAlert(offer.name, "Suma exitosa a tu pedido pendiente", "success");
  };

  // Simulate dynamic status changes every 5 seconds
  useEffect(() => {
    setMounted(true);
    
    const statusSequence: OrderStatus[] = ["payment-confirmed", "preparing", "ready"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statusSequence.length) {
          setCurrentStatus(statusSequence[currentIndex]);
      }
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update progress bar based on current status
  useEffect(() => {
    const statusIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);
    const newProgress = ((statusIndex + 1) / STATUS_STEPS.length) * 100;
    setProgress(newProgress);
  }, [currentStatus]);

  // Related products (simulated - products user scanned but didn't add)
  const relatedProducts = products.slice(0, 5);
  
  // Food court offers
  const foodOffers = [
    {
      id: 1,
      name: "Café + Muffin",
      price: 5000,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      gradient: "from-tertiary to-secondary"
    },
    {
      id: 2,
      name: "Combo Almuerzo",
      price: 8500,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      gradient: "from-primary to-accent"
    },
    {
      id: 3,
      name: "Smoothie + Snack",
      price: 4500,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=800",
      gradient: "from-secondary to-primary"
    }
  ];

  if (!mounted) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);
  const currentStep = STATUS_STEPS[currentStepIndex];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 pb-32 max-w-md mx-auto shadow-2xl overflow-x-hidden">


      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/20 dark:bg-tertiary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <Link href="/">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
                <X size={20} />
            </button>
        </Link>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado en Vivo</span>
            <h1 className="text-xl font-black uppercase italic tracking-tighter gradient-text-logo">#{id}</h1>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
            <Share2 size={20} className="gradient-text-primary" />
        </button>
      </header>

      {/* Dynamic Status Indicator */}
      <section className="px-6 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStatus}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-[2.5rem] p-8 bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700"
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 ${currentStep.gradient} opacity-10 animate-pulse`}></div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className={`size-20 rounded-3xl ${currentStep.gradient} text-white shadow-2xl flex items-center justify-center relative`}>
                <div className={`absolute inset-0 rounded-3xl animate-ping opacity-20 ${currentStep.gradient}`}></div>
                {currentStep.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-tight mb-1">
                  {currentStep.label}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {currentStatus === "payment-confirmed" && "¡Pago exitoso! Armando pedido"}
                  {currentStatus === "preparing" && "Tu pedido está siendo preparado"}
                  {currentStatus === "ready" && "¡Listo! Ya podés disfrutarlo"}
                </p>
              </div>
            </div>
            
            {/* Regret button inline */}
            {currentStatus !== "ready" && (
                <div className="mt-6 flex justify-center">
                    <Link href="/arrepentimiento">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <AlertCircle size={14} />
                            Botón de Arrepentimiento
                        </button>
                    </Link>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Progress Stepper */}
      <section className="px-8 py-6">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-6 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          
          {/* Animated Progress Bar */}
          <div 
            className="absolute left-0 top-6 h-2 bg-gradient-logo-full rounded-full transition-all duration-1000 ease-out glow-primary"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Status Steps */}
          <div className="relative flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isCurrent ? Infinity : 0,
                    }}
                    className={`size-12 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? `${step.gradient} text-white shadow-xl`
                        : "bg-slate-100 dark:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {isActive && index < currentStepIndex ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                  <span className={`text-[8px] font-black uppercase tracking-widest text-center max-w-[60px] leading-tight ${
                    isActive ? currentStep.color : "text-slate-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Estimated Time */}
      {currentStatus !== "ready" && (
        <section className="px-6 pb-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-tertiary/10 to-secondary/10 dark:from-tertiary/20 dark:to-secondary/20 border border-tertiary/20 flex items-center gap-4">
            <div className="size-14 bg-gradient-tertiary rounded-2xl flex items-center justify-center text-white glow-tertiary">
              <Clock size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight gradient-text-tertiary">
                Listo en ~{currentStatus === "payment-confirmed" ? "10" : "5"} minutos
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Te avisaremos enseguida
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Add More Items Section - Only show if not ready */}
      {currentStatus !== "ready" && (
        <section className="px-6 pb-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-pink-orange p-6 text-white">
            <div className="absolute top-0 right-0 opacity-20">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="animate-pulse" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">
                  ¡Estás a Tiempo!
                </h3>
              </div>
              <p className="text-sm font-bold opacity-90 mb-4">
                Agregá más artículos a tu pedido antes de que esté listo
              </p>
              <div className="flex gap-2">
                <Button variant="glass-light" size="sm" className="flex-1">
                  <TrendingUp size={14} />
                  Ver Ofertas
                </Button>
                <Link href="/scan" className="flex-1">
                  <Button variant="glass-light" size="sm" className="w-full">
                    Escanear Más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products Carousel */}
      <section className="px-6 pb-6">
        <ProductCarousel
          products={relatedProducts}
          title="Productos que Miraste"
          subtitle="Artículos que escaneaste pero no agregaste"
        />
      </section>

      {/* Food Court Offers */}
      <section className="px-6 pb-6">
        <div className="mb-4">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">
            Ofertas del <span className="gradient-text-tertiary">Patio de Comidas</span>
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Disfrutá mientras esperás tu pedido
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {foodOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="shrink-0 w-72 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 group"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-40`}></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-xs font-black">
                    ${offer.price.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black italic uppercase tracking-tighter mb-3">
                  {offer.name}
                </h4>
                <Button onClick={() => handleAddFood(offer)} variant="gradient-logo" size="sm" className="w-full gap-2">
                  <UtensilsCrossed size={16} />
                  Agregar al Pedido
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="px-6 py-4">
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30 p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Resumen de Compra</h3>
                <span className="text-lg font-black italic tracking-tighter gradient-text-logo">$230.900</span>
            </div>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-tight">
                    <span className="text-slate-500">Látex Pro Blanco (x1)</span>
                    <span className="font-black">$45.900</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-tight">
                    <span className="text-slate-500">Taladro Percutor (x1)</span>
                    <span className="font-black">$185.000</span>
                </div>
            </div>
            <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 py-4 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-gradient-purple-cyan hover:text-white">
                <Receipt size={18} className="gradient-text-accent" />
                Descargar Factura A/B
            </button>
        </div>
      </section>

      {/* Picky Lounge */}
      <section className="px-6 pb-12 space-y-6">
        <div className="group relative overflow-hidden rounded-[3rem] bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="aspect-[16/10] relative overflow-hidden">
                <Image 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
                    alt="Picky Lounge"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter gradient-text-logo">Picky Lounge</h4>
                        <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                          Disfrutá un café de especialidad mientras preparamos tu orden.
                        </p>
                    </div>
                    <div className="size-12 bg-gradient-tertiary rounded-2xl flex items-center justify-center text-white glow-tertiary">
                        <UtensilsCrossed size={20} />
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planta Alta • 50m</span>
                    <button className="flex items-center gap-2 rounded-full bg-gradient-logo px-6 py-2.5 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                        Como llegar
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Floating Survey Button / Expandable Survey Component */}
      <AnimatePresence>
        {showSurveyBtn && !isSurveyOpen && (
          <motion.button
            key="floating-btn"
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSurveyOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-accent text-white p-4 pr-6 rounded-full shadow-[0_20px_40px_-15px_rgba(var(--color-accent-rgb),1)] glow-accent"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle size={24} className="animate-pulse" />
            </div>
            <span className="font-black text-xs uppercase tracking-wider pr-1">¿Que te pareció la experiencia Picky?</span>
          </motion.button>
        )}

        {isSurveyOpen && (
          <motion.div
            key="survey-modal"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-x-4 bottom-6 z-50 p-6 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center shadow-2xl border border-white/10 mx-auto max-w-sm"
          >
            <button 
                onClick={() => setIsSurveyOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

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
                <form onSubmit={handleSurveySubmit} className="space-y-6 pt-2">
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
                        variant="gradient-logo" 
                        className="w-full shadow-lg"
                        disabled={rating === 0}
                    >
                        Enviar Calificación
                    </Button>
                </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
