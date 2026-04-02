"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, CreditCard, CheckCircle2, Loader2, Banknote,
  Fingerprint, Wifi, Smartphone, Receipt,
} from "lucide-react";
import { useOrderStore } from "@/stores/useOrderStore";
import { showPickyAlert } from "@/components/ui/Alert";

// ─── Step Config Per Payment Method ──────────────────────────────────────────

interface PaymentStep {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  duration: number; // ms to show this step
}

const MERCADOPAGO_STEPS: PaymentStep[] = [
  { icon: Shield,        label: "Verificando datos",     sublabel: "Validando identidad del comprador",    duration: 1800 },
  { icon: CreditCard,    label: "Procesando pago",       sublabel: "Conectando con Mercado Pago",          duration: 2400 },
  { icon: Fingerprint,   label: "Autenticación 3DS",     sublabel: "Confirmá en tu app bancaria",          duration: 2000 },
  { icon: CheckCircle2,  label: "Pago confirmado",       sublabel: "Transacción aprobada",                 duration: 1200 },
];

const CASH_STEPS: PaymentStep[] = [
  { icon: Shield,       label: "Verificando datos",      sublabel: "Validando datos del pedido",           duration: 1500 },
  { icon: Receipt,      label: "Generando código",       sublabel: "Creando comprobante de reserva",       duration: 2000 },
  { icon: Banknote,     label: "Reserva confirmada",     sublabel: "Abonás al retirar en caja",            duration: 1200 },
];

const DEBIT_STEPS: PaymentStep[] = [
  { icon: Shield,       label: "Verificando datos",      sublabel: "Validando identidad del comprador",    duration: 1800 },
  { icon: Wifi,         label: "Conectando con POS",     sublabel: "Acercá tu tarjeta al lector",          duration: 2500 },
  { icon: Smartphone,   label: "Esperando contactless",  sublabel: "Procesando lectura NFC",               duration: 2000 },
  { icon: CheckCircle2, label: "Pago aprobado",          sublabel: "Débito procesado correctamente",       duration: 1200 },
];

function getSteps(paymentMethod: string): PaymentStep[] {
  switch (paymentMethod) {
    case "cash":  return CASH_STEPS;
    case "debit": return DEBIT_STEPS;
    default:      return MERCADOPAGO_STEPS;
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentProcessingPage() {
  const router = useRouter();
  const { orders, updateOrderStatus, currentOrderId } = useOrderStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const order = orders.find((o) => o.id === currentOrderId);
  const steps = getSteps(order?.paymentMethod ?? "mercadopago");
  const isLastStep = currentStep >= steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => { setMounted(true); }, []);

  // If no order is being processed, redirect back
  useEffect(() => {
    if (mounted && !order) {
      router.replace("/checkout");
    }
  }, [mounted, order, router]);

  // Advance through payment steps
  useEffect(() => {
    if (!mounted || !order) return;
    if (currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // All steps done → update order to PENDING and navigate
        updateOrderStatus(order.id, "PENDING");
        showPickyAlert("Compra Confirmada", "Tu pedido ya está en preparación.", "success");
        router.push("/confirmation");
      }
    }, steps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [mounted, order, currentStep, steps, updateOrderStatus, router]);

  if (!mounted || !order) return null;

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Background gradient pulse */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center px-8 max-w-sm w-full">
        {/* Payment Method Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            {order.paymentMethod === "cash" ? "Pago en Efectivo" :
             order.paymentMethod === "debit" ? "Tarjeta de Débito" :
             "Mercado Pago"}
          </p>
        </motion.div>

        {/* Animated Icon */}
        <div className="relative mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`size-24 rounded-[2rem] flex items-center justify-center shadow-xl ${
                isLastStep
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-gradient-purple-pink text-white shadow-primary/30"
              }`}
            >
              <StepIcon size={40} strokeWidth={2} />
            </motion.div>
          </AnimatePresence>

          {/* Spinner ring (not on last step) */}
          {!isLastStep && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2"
            >
              <div className="w-full h-full rounded-[2.5rem] border-2 border-transparent border-t-primary/40" />
            </motion.div>
          )}
        </div>

        {/* Step Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">
              {step.label}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {step.sublabel}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isLastStep ? "bg-emerald-500" : "bg-gradient-purple-pink"
              }`}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              ${order.total.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {/* Step Dots */}
        <div className="flex items-center gap-2 mt-4">
          {steps.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: idx === currentStep ? 1.3 : 1,
                backgroundColor: idx <= currentStep
                  ? (isLastStep ? "#10b981" : "#7c3aed")
                  : "#e2e8f0",
              }}
              className="size-2 rounded-full"
            />
          ))}
        </div>

        {/* Order ID */}
        <p className="mt-8 text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
          Orden {order.id}
        </p>
      </div>

      {/* TODO (TiendaNube): Replace this simulated flow with TiendaNube Checkout API
          integration. The TiendaNube Payments API (POST /orders/{id}/payment)
          supports MercadoPago, card, and custom payment methods configured in the
          store's TiendaNube admin. For production:
          1. Create the order in TiendaNube via POST /v1/{store_id}/orders
          2. Redirect to the TiendaNube checkout URL returned in the response
          3. Handle the webhook callback to update order status in Picky
          Ref: https://tiendanube.github.io/api-documentation/resources/order */}
    </div>
  );
}
