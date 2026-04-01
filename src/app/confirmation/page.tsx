"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  X, 
  Share2, 
  Check, 
  ShoppingBasket, 
  Timer, 
  Receipt, 
  Clock,
  Package,
  Star,
  MapPin,
  AlertCircle,
  ScanLine,
  ChevronRight,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Order status types (Simplified to 3 steps)
type OrderStatus = "payment-confirmed" | "preparing" | "ready";

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
    id: "payment-confirmed",
    label: "Pago Confirmado",
    icon: <Check size={20} strokeWidth={3} />,
    color: "text-primary",
    gradient: "bg-gradient-purple-pink",
    estimatedTime: "~10 min"
  },
  {
    id: "preparing",
    label: "Armando Pedido",
    icon: <ShoppingBasket size={24} />,
    color: "text-secondary",
    gradient: "bg-gradient-purple-pink",
    estimatedTime: "~5 min"
  },
  {
    id: "ready",
    label: "Listo para Retirar",
    icon: <Package size={24} />,
    color: "text-primary",
    gradient: "bg-gradient-purple-pink",
    estimatedTime: "¡Ahora!"
  },
];

// Mock picker data
const PICKER_DATA = {
  name: "Marcos R.",
  zone: "Zona B · Pasillo 3-6",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200",
  rating: 4.8,
  totalOrders: 1247,
  emoji: "⚡"
};

// Warehouse SVG Map component
function WarehouseMap({ pickupZone }: { pickupZone: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Punto de Retiro</p>
          <p className="font-black text-sm uppercase italic tracking-tighter text-slate-900 dark:text-white">{pickupZone}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-xl">
          <Navigation size={12} className="text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">50m</span>
        </div>
      </div>
      
      {/* SVG Warehouse Floor Plan */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <svg viewBox="0 0 300 180" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* Background */}
          <rect width="300" height="180" fill="transparent" />
          
          {/* Outer walls */}
          <rect x="10" y="10" width="280" height="160" rx="8" fill="none" stroke="#e2e8f0" strokeWidth="2" />
          
          {/* Main corridors */}
          <rect x="10" y="70" width="280" height="40" fill="#f8fafc" opacity="0.8" />
          
          {/* Aisles left section */}
          <rect x="20" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="60" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="100" y="20" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          
          {/* Aisles right section */}
          <rect x="20" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="60" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          <rect x="100" y="120" width="30" height="40" rx="4" fill="#e2e8f0" opacity="0.7" />
          
          {/* Zone labels */}
          <text x="35" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A1</text>
          <text x="75" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A2</text>
          <text x="115" y="44" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">A3</text>
          <text x="35" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B1</text>
          <text x="75" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B2</text>
          <text x="115" y="144" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">B3</text>
          
          {/* Counter / pickup zone */}
          <rect x="200" y="20" width="80" height="140" rx="6" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,2" />
          <text x="240" y="88" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">MOSTRADOR</text>
          <text x="240" y="100" textAnchor="middle" fontSize="8" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">PRINCIPAL</text>
          
          {/* Corridor label */}
          <text x="155" y="94" textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui">PASILLO CENTRAL</text>
          
          {/* Animated dot — YOU ARE HERE (entrance) */}
          <motion.circle cx="20" cy="90" r="5" fill="#8b5cf6" />
          <text x="30" y="80" fontSize="6" fill="#8b5cf6" fontWeight="900" fontFamily="system-ui">Vos</text>
          
          {/* Dashed path to counter */}
          <path d="M 25 90 L 155 90 L 200 90" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3" fill="none" />
          
          {/* Animated destination marker */}
          <motion.circle cx="240" cy="90" r="7" fill="#8b5cf6"
            animate={{ r: [7, 9, 7], opacity: [1, 0.6, 1] }}
          />
          <text x="240" y="93" textAnchor="middle" fontSize="6" fill="white" fontWeight="900" fontFamily="system-ui">✓</text>

          {/* Entrance */}
          <rect x="10" y="82" width="6" height="16" fill="white" />
          <text x="6" y="93" fontSize="5" fill="#94a3b8" fontWeight="bold" fontFamily="system-ui" textAnchor="middle">ENT</text>
        </svg>
      </div>
      
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3 text-center">
        Seguí el camino marcado → Mostrador Principal
      </p>
    </div>
  );
}

// Picker rating component
function PickerCard({ 
  picker, 
  onRate 
}: { 
  picker: typeof PICKER_DATA;
  onRate: (stars: number) => void;
}) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [rated, setRated] = useState(0);

  const handleRate = (stars: number) => {
    setRated(stars);
    onRate(stars);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tu Picker</p>
      </div>
      <div className="px-5 py-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="size-14 rounded-2xl overflow-hidden border-2 border-primary/20">
            <Image 
              src={picker.avatar} 
              alt={picker.name} 
              width={56} 
              height={56} 
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-1 -right-1 size-6 bg-gradient-purple-pink rounded-full flex items-center justify-center text-[10px] shadow-md border-2 border-white dark:border-slate-800">
            {picker.emoji}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm uppercase italic tracking-tighter text-slate-900 dark:text-white">{picker.name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{picker.zone}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-black text-slate-900 dark:text-white">{picker.rating}</span>
            <span className="text-[9px] text-slate-400 font-bold">· {picker.totalOrders.toLocaleString()} pedidos</span>
          </div>
        </div>
      </div>
      
      {/* Rating */}
      <div className="px-5 pb-4">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
          {rated > 0 ? '¡Gracias por calificar!' : 'Calificá al picker'}
        </p>
        <div className="flex items-center gap-2">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform active:scale-90"
            >
              <Star 
                size={24} 
                className={`transition-colors ${
                  star <= (hoveredStar || rated) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-slate-200 dark:text-slate-700 fill-transparent'
                }`}
              />
            </button>
          ))}
          {rated > 0 && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[9px] font-black text-amber-500 uppercase tracking-wider ml-1"
            >
              ¡Gracias!
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("preparing");
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

  const handleStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
  };

  const advanceStatus = () => {
    if (currentStatus === "payment-confirmed") handleStatusChange("preparing");
    else if (currentStatus === "preparing") handleStatusChange("ready");
  };

  const regressStatus = () => {
    if (currentStatus === "ready") handleStatusChange("preparing");
    else if (currentStatus === "preparing") handleStatusChange("payment-confirmed");
  };

  const handleQRScan = () => {
    if (currentStatus === "ready") {
      router.push("/finalizado");
    }
  };

  const handlePickerRating = (stars: number) => {
    // In a real app, this would call an API
    console.log(`Picker rated ${stars} stars`);
  };

  if (!mounted) return null;

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);
  const currentStep = STATUS_STEPS[currentStepIndex];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 pb-32 overflow-x-hidden">

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-4 relative z-10">
        <Link href="/">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
            <X size={18} />
          </button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Estado en Vivo</span>
          <button onClick={regressStatus} className="active:scale-95 transition-transform">
            <h1 className="text-lg font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">#{orderNumber}</h1>
          </button>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
          <Share2 size={18} className="text-slate-500" />
        </button>
      </header>

      {/* Dynamic Status Indicator */}
      <section className="px-4 py-3 cursor-pointer" onClick={() => {
        if (currentStatus !== 'ready') advanceStatus();
      }}>
        <div className="relative overflow-hidden rounded-[2.5rem] p-5 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 min-h-[140px] flex items-center">
          {/* Animated gradient background */}
          <div className={`absolute inset-0 ${currentStep.gradient} opacity-5 animate-pulse`}></div>
          
          <div className={`relative z-10 w-full flex gap-5 transition-all duration-700 ${currentStatus === 'ready' ? 'flex-col items-center py-8 text-center' : 'items-center'}`}>
            {/* QR Code / Progress Indicator */}
            <motion.div 
              layout
              onClick={handleQRScan}
              className={`relative flex-shrink-0 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center transition-all duration-700
                ${currentStatus === 'ready' ? 'size-64 cursor-pointer hover:scale-105 active:scale-95' : 'size-20'}`}
            >
              {/* QR pixel animation */}
              <div className="absolute inset-0 p-2 grid grid-cols-4 grid-rows-4 gap-0.5">
                {[...Array(16)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="rounded-sm bg-slate-900 dark:bg-white"
                    animate={currentStatus === 'preparing' ? { 
                      opacity: [0.15, 0.9, 0.15],
                    } : { opacity: 0.1 }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              <div className="relative z-20 flex items-center justify-center w-full h-full p-2">
                {currentStatus === 'ready' ? (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-full h-full bg-white rounded-2xl p-1.5 flex items-center justify-center relative group/qr shadow-xl"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                      <path d="M10 10h30v30h-30z m5 5h20v20h-20z M60 10h30v30h-30z m5 5h20v20h-20z M10 60h30v30h-30z m5 5h20v20h-20z M60 60h10v10h-10z M75 60h15v15h-15z M60 75h10v15h-10z M75 80h10v10h-10z" fill="currentColor" />
                    </svg>
                    <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover/qr:opacity-100 transition-opacity backdrop-blur-sm">
                      <ScanLine className={`${currentStatus === 'ready' ? 'size-14 mb-2' : 'size-7 mb-1'}`} />
                      <span className={`${currentStatus === 'ready' ? 'text-sm' : 'text-[7px]'} font-black uppercase text-center leading-tight`}>Simular<br/>Retiro QR</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-slate-800 dark:text-slate-300 drop-shadow-xl scale-110">
                    <ShoppingBasket size={28} />
                  </div>
                )}
              </div>

              {currentStatus === 'ready' && (
                <div className="absolute inset-0 rounded-3xl animate-ping opacity-15 bg-gradient-purple-pink"></div>
              )}
            </motion.div>

            {/* Status Info */}
            <div className={`flex-1 space-y-2 w-full ${currentStatus === 'ready' ? 'flex flex-col items-center' : ''}`}>
              <div>
                <h2 className={`font-black italic uppercase tracking-tighter leading-tight transition-all duration-500
                  ${currentStatus === 'ready' ? 'text-2xl' : 'text-xl'}`}>
                  {currentStep.label}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {currentStatus === "payment-confirmed" && "¡Pago exitoso! Armando pedido"}
                  {currentStatus === "preparing" && "Tu pedido está siendo preparado"}
                  {currentStatus === "ready" && "¡Listo! Mostrale este QR al picker"}
                </p>
              </div>

              <div className={`flex items-center gap-2 py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 ${currentStatus === 'ready' ? 'w-full justify-center mt-2' : ''}`}>
                <Clock size={14} className="text-primary" />
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {currentStatus === 'ready' ? 'Sector B · Pasillo 4' : `Listo en ${currentStep.estimatedTime}`}
                </p>
              </div>

              {/* Progress bar */}
              {currentStatus !== 'ready' && (
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-purple-pink rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tap to advance hint */}
        {currentStatus !== 'ready' && (
          <p className="text-center text-[8px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest mt-2">
            Toca para simular avance →
          </p>
        )}
      </section>

      {/* Picker Card */}
      {currentStatus !== 'ready' && (
        <section className="px-4 py-2">
          <PickerCard picker={PICKER_DATA} onRate={handlePickerRating} />
        </section>
      )}

      {/* Warehouse Map — only shown when preparing (hide on ready to give full screen to QR) */}
      {currentStatus === "preparing" && (
        <section className="px-4 py-2">
          <WarehouseMap pickupZone="Mostrador Principal · Sector B" />
        </section>
      )}

      {/* Order Summary */}
      <section className="px-4 py-2">
        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Resumen de Compra</h3>
            <span className="text-lg font-black italic tracking-tighter text-slate-900 dark:text-white">$230.900</span>
          </div>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
              <span className="text-slate-500">Látex Pro 20L (x1)</span>
              <span className="font-black text-slate-900 dark:text-white">$45.900</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-tight">
              <span className="text-slate-500">Taladro DeWalt (x1)</span>
              <span className="font-black text-slate-900 dark:text-white">$185.000</span>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 py-3.5 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary">
            <Receipt size={16} />
            Descargar Factura A/B
          </button>
        </div>
      </section>

      {/* Arrepentimiento button */}
      <div className="flex justify-center pt-4 pb-2">
        <Link href="/arrepentimiento">
          <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors">
            <AlertCircle size={11} />
            Botón de Arrepentimiento
          </button>
        </Link>
      </div>
    </div>
  );
}
