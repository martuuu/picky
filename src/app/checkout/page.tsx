"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, User, ChevronRight, CreditCard, Banknote, Mail, IdCard, MapPin, UserCircle, Car, Truck, FileText, AlertCircle } from "lucide-react";
import { useCartStore, CartItem } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { showPickyAlert } from "@/components/ui/Alert";

function getActivePromo(qty: number, item: CartItem) {
  if (item.wholesalePrice && qty >= (item.wholesaleMinQuantity ?? 10)) {
    return { label: `Por mayor`, saving: item.price - item.wholesalePrice };
  }
  if (qty >= 10) return { label: "15% OFF", saving: Math.round(item.price * 0.15) };
  if (qty >= 5) return { label: "10% OFF", saving: Math.round(item.price * 0.10) };
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
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

  // Calcular totales considerando promos
  const { subtotal, totalSavings } = items.reduce((acc, item) => {
    const promo = getActivePromo(item.quantity, item);
    const effectivePrice = promo ? item.price - Math.round(promo.saving / item.quantity) : item.price;
    const saving = promo ? Math.round(promo.saving / item.quantity) * item.quantity : 0;
    
    return {
        subtotal: acc.subtotal + (effectivePrice * item.quantity),
        totalSavings: acc.totalSavings + saving
    };
  }, { subtotal: 0, totalSavings: 0 });

  const tax = subtotal * 0.21;
  const shipping = pickupMethod === "delivery" ? 8500 : 0;
  const finalTotal = subtotal + tax + shipping;

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
        <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center bg-background-light dark:bg-background-dark font-display">
            <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Lock className="text-primary size-10" />
            </div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Tu canasta está vacía</h2>
            <p className="text-slate-500 text-sm mt-2 font-bold">Agregá productos para iniciar la compra.</p>
            <Link href="/scan" className="mt-8">
                <Button variant="gradient-logo" className="rounded-2xl px-8 h-14 uppercase italic font-black shadow-xl">Volver al Scanner</Button>
            </Link>
        </div>
      );
  }

  // Helper para mostrar el nombre del método de entrega
  const getDeliveryName = () => {
      switch(pickupMethod) {
          case 'counter': return 'Mostrador Principal';
          case 'locker': return 'Smart Locker Picky';
          case 'picky-car': return 'Retiro en Picky Car';
          case 'delivery': return 'Envío a Domicilio';
          default: return '';
      }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl p-4 pt-12 pb-4 justify-between border-b border-slate-100 dark:border-slate-800/50">
        <button 
            onClick={() => step === 'payment' ? setStep('details') : router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-sm transition-transform active:scale-95"
        >
            <ArrowLeft size={20} />
        </button>
        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex-1 text-center pr-10">
            {step === 'details' ? 'Datos y Entrega' : 'Pago y Resumen'}
        </h2>
      </div>

      <div className="px-5 py-6">
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

                            {/* Nuevos métodos de Retiro/Envío aplicados */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Método de Entrega</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "counter"} onChange={() => setPickupMethod("counter")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <MapPin size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm uppercase italic">Mostrador Principal</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Retiro por tienda local</p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Gratis</div>
                                        </div>
                                    </label>
                                    
                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "locker"} onChange={() => setPickupMethod("locker")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                            <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <Lock size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm uppercase italic">Smart Locker Picky</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Retiro sin contacto 24/7</p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Gratis</div>
                                        </div>
                                    </label>

                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "picky-car"} onChange={() => setPickupMethod("picky-car")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-secondary text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-xl z-10">Nuevo</div>
                                            <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                                <Car size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm uppercase italic">Picky Car (Drive-Thru)</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Te lo llevamos a tu vehículo</p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Gratis</div>
                                        </div>
                                    </label>

                                    <label className="group cursor-pointer">
                                        <input type="radio" name="pickup" className="peer sr-only" checked={pickupMethod === "delivery"} onChange={() => setPickupMethod("delivery")} />
                                        <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                            <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                                <Truck size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-sm uppercase italic">Envío a Domicilio</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Entrega en 2 a 4 días hábiles</p>
                                            </div>
                                            <div className="text-sm font-black italic">+$8.500</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="gradient-logo" className="w-full h-16 rounded-[2rem] text-lg font-black uppercase italic shadow-2xl">
                                Continuar al Pago
                                <ChevronRight size={24} strokeWidth={3} />
                            </Button>

                            {/* Botón de Arrepentimiento */}
                            <div className="flex justify-center mt-6">
                                <Link href="/arrepentimiento">
                                    <button type="button" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                        <AlertCircle size={12} />
                                        Botón de Arrepentimiento
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.form>
            ) : (
                <motion.div 
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {/* Order Details - Sumario Simplificado */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase italic truncate">{firstName} {lastName}</p>
                                <p className="text-[10px] font-bold text-slate-400">{dni} · {email}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {pickupMethod === "delivery" ? <Truck size={18} /> : 
                                 pickupMethod === "picky-car" ? <Car size={18} /> : 
                                 pickupMethod === "locker" ? <Lock size={18} /> : <MapPin size={18} />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entrega seleccionada</p>
                                <p className="font-black text-sm uppercase italic">{getDeliveryName()}</p>
                            </div>
                            <button onClick={() => setStep('details')} className="ml-auto text-[10px] font-black uppercase text-primary underline">Editar</button>
                        </div>
                    </div>

                    {/* PDF Simulador */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                        <div className="size-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase">Factura B (Borrrador)</p>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Documento generado para validación</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-[10px] rounded-lg">Ver PDF</Button>
                    </div>

                    {/* Unified Order Summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 space-y-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Resumen de Compra</h3>
                            <span className="text-xl font-black italic tracking-tighter gradient-text-logo">${finalTotal.toLocaleString("es-AR")}</span>
                        </div>
                        
                        <div className="space-y-4">
                            {items.map((item) => {
                                const promo = getActivePromo(item.quantity, item);
                                const effectivePrice = promo ? item.price - Math.round(promo.saving / item.quantity) : item.price;
                                
                                return (
                                    <div key={item.id} className="flex justify-between items-start text-sm font-bold uppercase tracking-tight">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white leading-tight pr-4">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                                        </div>
                                        <span className="font-black shrink-0 text-right">${(effectivePrice * item.quantity).toLocaleString("es-AR")}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Subtotal</span>
                                <span className="text-slate-900 dark:text-white">${subtotal.toLocaleString("es-AR")}</span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    <span>Ahorro por descuentos</span>
                                    <span>-${totalSavings.toLocaleString("es-AR")}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>IVA (21%)</span>
                                <span className="text-slate-900 dark:text-white">${tax.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Costo de envío</span>
                                <span className="text-slate-900 dark:text-white">{shipping > 0 ? `$${shipping.toLocaleString("es-AR")}` : 'Gratis'}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 border-t-2 border-slate-100 dark:border-slate-700">
                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-500">Total a Pagar</span>
                            <span className="text-3xl font-black italic tracking-tighter gradient-text-logo leading-none">${finalTotal.toLocaleString("es-AR")}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Seleccionar Medio de Pago</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="group cursor-pointer">
                                <input type="radio" name="payment" className="peer sr-only" checked={paymentMethod === "mercadopago"} onChange={() => setPaymentMethod("mercadopago")} />
                                <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                        <CreditCard size={24} />
                                    </div>
                                    <p className="font-black text-sm uppercase italic">Tarjeta vía Mercado Pago</p>
                                </div>
                            </label>

                            <label className="group cursor-pointer">
                                <input type="radio" name="payment" className="peer sr-only" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                                <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-slate-800 border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all shadow-sm">
                                    <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                        <Banknote size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-sm uppercase italic">Efectivo en Caja</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Abonás al retirar</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button 
                            onClick={handlePay}
                            disabled={processing}
                            variant="gradient-logo"
                            className="w-full h-18 rounded-[2rem] text-xl font-black uppercase italic shadow-2xl"
                        >
                            {processing ? "Procesando el Pago..." : "Finalizar Compra"}
                        </Button>
                    </div>

                    {/* Botón de Arrepentimiento en la vista de pago tmb */}
                    <div className="flex justify-center pt-2 pb-6">
                        <Link href="/arrepentimiento">
                            <button type="button" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <AlertCircle size={12} />
                                Botón de Arrepentimiento
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

