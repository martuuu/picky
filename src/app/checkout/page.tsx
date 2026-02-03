"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, User, ChevronRight, CreditCard, Banknote, ShieldCheck, Mail, IdCard, Info, MapPin, Hash, UserCircle } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { showPickyAlert } from "@/components/ui/Alert";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState<"details" | "payment">("details");
  const [mounted, setMounted] = useState(false);
  
  // User Info
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");

  const [pickupMethod, setPickupMethod] = useState("counter");
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [processing, setProcessing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartTotal = total();
  const tax = cartTotal * 0.21;
  const shipping = 0; // Free shipping
  const finalTotal = cartTotal + tax + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName && lastName && dni) {
        setStep("payment");
        showPickyAlert("Datos Validados", "Podés elegir tu método de pago.", "info");
    } else {
        showPickyAlert("Campos Incompletos", "Por favor completá todos los datos.", "error");
    }
  };

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
        clearCart();
        showPickyAlert("Compra Confirmada", "Tu pedido ya está en preparación.", "success");
        router.push("/confirmation");
    }, 2000);
  };


  if (!mounted) return null;

  if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background-light dark:bg-background-dark">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Lock className="text-primary size-10" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Tu carrito está vacío</h2>
            <p className="text-slate-500 text-sm mt-2">Agregá productos para iniciar la compra.</p>
            <Link href="/store/all" className="mt-8">
                <Button variant="gradient-purple-pink" className="rounded-2xl px-8 h-12 uppercase italic font-black">Ir a la tienda</Button>
            </Link>
        </div>
      );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
        <button 
            onClick={() => step === 'payment' ? setStep('details') : router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform"
        >
            <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-[10px] font-black tracking-[0.3em] uppercase flex-1 text-center pr-10">
            {step === 'details' ? 'Datos del Cliente' : 'Método de Pago'}
        </h2>
      </div>

      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
            {step === 'details' ? (
                <motion.form 
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleNextStep}
                    className="space-y-8"
                >
                    {/* Social Login Options */}
                    {!isGuest && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-1">Iniciar Sesión</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accede con tu cuenta</p>
                            </div>

                            {/* Social Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider hover:border-primary transition-all active:scale-95 shadow-sm"
                                >
                                    <svg className="size-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continuar con Google
                                </button>

                                <button
                                    type="button"
                                    className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider hover:opacity-80 transition-all active:scale-95 shadow-sm"
                                >
                                    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                    </svg>
                                    Continuar con Apple
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background-light dark:bg-background-dark px-4 text-[10px] font-black text-slate-400 tracking-widest">O</span>
                                </div>
                            </div>

                            {/* Guest Checkout Button */}
                            <button
                                type="button"
                                onClick={() => setIsGuest(true)}
                                className="w-full h-14 rounded-2xl bg-gradient-purple-cyan text-white flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider shadow-xl glow-primary active:scale-95 transition-all"
                            >
                                <UserCircle size={20} strokeWidth={2.5} />
                                Continuar como Invitado
                            </button>
                        </div>
                    )}

                    {/* User Info - Only show if guest */}
                    {isGuest && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Información Personal</h3>
                                
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email" 
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                            <input 
                                                type="text" 
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Nombre" 
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Apellido" 
                                                className="w-full h-14 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value)}
                                            placeholder="DNI" 
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pickup Method */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Método de Retiro</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "counter"} onChange={() => setPickupMethod("counter")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase italic">Mostrador Principal</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Entrega inmediata en tienda</p>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "locker"} onChange={() => setPickupMethod("locker")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <Lock size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase italic">Smart Locker Picky</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Retiro sin contacto 24/7</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="gradient-purple-pink" className="w-full h-16 rounded-[2rem] text-lg font-black uppercase italic shadow-2xl">
                                Continuar al Pago
                                <ChevronRight size={24} strokeWidth={3} />
                            </Button>
                        </div>
                    )}
                </motion.form>
            ) : (
                <motion.div 
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    {/* Order Summary - Minimalist List */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Resumen del Pedido</h3>
                        
                        {/* Items List - No images, minimalist */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 space-y-3">
                            {items.map((item, index) => (
                                <div key={item.id} className={`flex items-center justify-between py-3 ${index !== items.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm font-black uppercase italic leading-tight truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                            {item.quantity}x • {item.category}
                                        </p>
                                    </div>
                                    <p className="text-sm font-black gradient-text-primary shrink-0">
                                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-500 dark:text-slate-400">Subtotal</span>
                                <span className="font-black">${cartTotal.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-500 dark:text-slate-400">IVA (21%)</span>
                                <span className="font-black">${tax.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-500 dark:text-slate-400">Envío</span>
                                <span className="font-black text-green-500">Gratis</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
                                <span className="text-2xl font-black italic tracking-tighter gradient-text-logo">${finalTotal.toLocaleString("es-AR")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Método de Pago</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="group cursor-pointer">
                                <input type="radio" name="payment" className="peer sr-only" checked={paymentMethod === "mercadopago"} onChange={() => setPaymentMethod("mercadopago")} />
                                <div className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <CreditCard size={24} />
                                    </div>
                                    <p className="font-black text-sm uppercase italic">Mercado Pago / Tarjeta</p>
                                </div>
                            </label>

                            <label className="group cursor-pointer">
                                <input type="radio" name="payment" className="peer sr-only" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                                <div className="flex items-center gap-4 p-5 rounded-[2.5rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                    <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                        <Banknote size={24} />
                                    </div>
                                    <p className="font-black text-sm uppercase italic">Efectivo en Caja</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <Button 
                        onClick={handlePay}
                        disabled={processing}
                        variant="gradient-purple-pink"
                        className="w-full h-20 rounded-[2.5rem] text-xl font-black uppercase italic shadow-2xl"
                    >
                        {processing ? "Procesando..." : "Confirmar Compra"}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
