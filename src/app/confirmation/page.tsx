"use client";

import { useEffect, useState } from "react";
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
  Star, 
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
  Baby
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BeforeCheckoutCarousel } from "@/components/ui/BeforeCheckoutCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";

// Order status types
type OrderStatus = "payment-pending" | "payment-confirmed" | "preparing" | "ready";

interface StatusStep {
  id: OrderStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  estimatedTime: string;
}

const STATUS_STEPS: StatusStep[] = [
  {
    id: "payment-pending",
    label: "Pago Pendiente",
    icon: <CreditCard size={20} strokeWidth={3} />,
    color: "text-tertiary",
    gradient: "bg-gradient-tertiary",
    estimatedTime: "Procesando..."
  },
  {
    id: "payment-confirmed",
    label: "Pago Confirmado",
    icon: <Check size={20} strokeWidth={3} />,
    color: "text-primary",
    gradient: "bg-gradient-primary",
    estimatedTime: "~10 min"
  },
  {
    id: "preparing",
    label: "Armando Pedido",
    icon: <ShoppingBasket size={24} />,
    color: "text-secondary",
    gradient: "bg-gradient-secondary",
    estimatedTime: "~5 min"
  },
  {
    id: "ready",
    label: "Listo para Retirar",
    icon: <Package size={24} />,
    color: "text-accent",
    gradient: "bg-gradient-accent",
    estimatedTime: "¡Ahora!"
  },
];

export default function ConfirmationPage() {
  const [mounted, setMounted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("payment-confirmed");
  const [progress, setProgress] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setMounted(true);
    setOrderNumber(`PCK-${Math.floor(Math.random() * 9000) + 1000}-Z`);
  }, []);

  // Update progress bar based on current status
  useEffect(() => {
    const statusIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);
    const newProgress = ((statusIndex + 1) / STATUS_STEPS.length) * 100;
    setProgress(newProgress);
  }, [currentStatus]);

  // Products for "Antes de Comprar"
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
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 pb-32 overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/20 dark:bg-tertiary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 relative z-10 font-black">
        <Link href="/">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
                <X size={20} />
            </button>
        </Link>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado en Vivo</span>
            <h1 className="text-xl font-black uppercase italic tracking-tighter gradient-text-logo">#{orderNumber}</h1>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
            <Share2 size={20} className="gradient-text-primary" />
        </button>
      </header>

      {/* Dynamic Status Indicator with QR Progress */}
      <section className="px-4 py-4">
        <div className="relative overflow-hidden rounded-[2.5rem] p-5 bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 min-h-[160px] flex items-center">

            {/* Animated Background */}
            <div className={`absolute inset-0 ${currentStep.gradient} opacity-5 animate-pulse`}></div>
            
            <div className={`relative z-10 w-full flex items-center gap-6 transition-all duration-700 ${currentStatus === 'ready' ? 'flex-row' : ''}`}>
              {/* QR Code / Progress Indicator */}
              <motion.div 
                layout
                className={`relative flex-shrink-0 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center
                  ${currentStatus === 'ready' ? 'size-32 sm:size-40' : 'size-24'}`}
              >
                {/* QR Pattern Placeholder */}
                <div className="absolute inset-0 p-3 grid grid-cols-4 grid-rows-4 gap-1 opacity-20 group">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`rounded-sm bg-slate-900 dark:bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-20'}`}></div>
                  ))}
                </div>

                {/* Gradient Fill Animation */}
                <motion.div 
                  className={`absolute bottom-0 left-0 w-full ${currentStep.gradient} z-10 transition-all duration-1000 ease-out`}
                  initial={{ height: "0%" }}
                  animate={{ height: `${progress}%` }}
                />

                {/* Overlaid Icon or Real QR */}
                <div className="relative z-20 flex items-center justify-center w-full h-full p-2">
                  {currentStatus === 'ready' ? (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full bg-white rounded-xl p-2 flex items-center justify-center"
                    >
                      {/* Generics QR Placeholder/Image */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        <path d="M10 10h30v30h-30z m5 5h20v20h-20z M60 10h30v30h-30z m5 5h20v20h-20z M10 60h30v30h-30z m5 5h20v20h-20z M60 60h10v10h-10z M75 60h15v15h-15z M60 75h10v15h-10z M75 80h10v10h-10z" fill="currentColor" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="text-white drop-shadow-lg">
                      {currentStep.icon}
                    </div>
                  )}
                </div>

                {/* Ready Pulse Effect */}
                {currentStatus === 'ready' && (
                  <div className="absolute inset-0 rounded-3xl animate-ping opacity-10 bg-gradient-accent"></div>
                )}
              </motion.div>

              {/* Status Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <h2 className={`font-black italic uppercase tracking-tighter leading-tight transition-all duration-500
                    ${currentStatus === 'ready' ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                    {currentStep.label}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {currentStatus === "payment-pending" && "Procesando tu pago..."}
                    {currentStatus === "payment-confirmed" && "¡Pago exitoso! Armando pedido"}
                    {currentStatus === "preparing" && "Tu pedido está siendo preparado"}
                    {currentStatus === "ready" && "¡Listo! Escaneá para retirar"}
                  </p>
                </div>

                {/* Estimated Time / Details */}
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                >
                  <Clock size={16} className={currentStep.color} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {currentStatus === 'ready' ? 'Sector B • Pasillo 4' : `Listo en ${currentStep.estimatedTime}`}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
        </div>
      </section>

      {/* Progress Stepper - Clickable */}
      <section className="px-4 py-6">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-6 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
          
          {/* Animated Progress Bar */}
          <div 
            className="absolute left-0 top-6 h-2 bg-gradient-logo-full rounded-full transition-all duration-1000 ease-out glow-primary"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Status Steps - Clickable */}
          <div className="relative flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStatus(step.id)}
                  className="flex flex-col items-center gap-2 relative z-10 cursor-pointer group"
                >
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
                    } group-hover:scale-110`}
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
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* "¡Estás a Tiempo!" - Fixed height, can add items to order */}
      {currentStatus !== "ready" && (
        <section className="px-4 pb-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-pink-orange p-5 text-white min-h-[180px] flex flex-col justify-between">
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
                Agregá más artículos a tu pedido. Se cargarán y pagarán junto con tu orden actual.
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

      {/* Products Carousel - Compact like cart */}
      <section className="px-4 pb-6">
        <BeforeCheckoutCarousel
          products={relatedProducts}
          title="Productos que Miraste"
          subtitle="Artículos que escaneaste pero no agregaste"
        />
      </section>

      {/* Food Court Offers */}
      <section className="px-4 pb-6">
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
                <Button variant="gradient-logo" size="sm" className="w-full gap-2">
                  <UtensilsCrossed size={16} />
                  Agregar al Pedido
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="px-4 py-4">
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30 p-5">
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

      {/* Picky Lounge - Always visible */}
      <section className="px-8 pb-6 space-y-6">
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

      {/* Kids Zone - New section similar to Picky Lounge */}
      <section className="px-8 pb-12 space-y-6">
        <div className="group relative overflow-hidden rounded-[3rem] bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700">
            <div className="aspect-[16/10] relative overflow-hidden">
                <Image 
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800"
                    alt="Picky Kids Zone"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter gradient-text-secondary">Picky Kids Zone</h4>
                        <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                          Espacio de entretenimiento para los más chicos con juegos y actividades.
                        </p>
                    </div>
                    <div className="size-12 bg-gradient-pink-orange rounded-2xl flex items-center justify-center text-white glow-secondary">
                        <Baby size={20} />
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planta Baja • 30m</span>
                    <button className="flex items-center gap-2 rounded-full bg-gradient-pink-orange px-6 py-2.5 text-[10px] font-black text-white uppercase tracking-widest shadow-xl glow-secondary">
                        Como llegar
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Rating - Only show when ready */}
      {currentStatus === "ready" && (
        <section className="px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center space-y-4 shadow-2xl"
          >
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Calificá tu Experiencia</h3>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">¿Cómo fue tu compra hoy?</p>
              <div className="flex justify-center gap-2 py-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={32} className={s <= 4 ? "fill-tertiary text-tertiary" : "text-slate-700"} />)}
              </div>
              <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-tertiary/50 placeholder:text-white/20"
                  placeholder="¿Algo más que nos quieras decir?"
                  rows={3}
              ></textarea>
              <Button variant="gradient-logo" className="w-full">
                Enviar Calificación
              </Button>
          </motion.div>
        </section>
      )}
    </div>
  );
}
