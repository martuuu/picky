"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ScanBarcode } from "lucide-react";
import { SocialAuthButtons } from "@/components/ui/SocialAuthButtons";
import { useRouter } from "next/navigation";
import { showPickyAlert } from "@/components/ui/Alert";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      showPickyAlert("Bienvenido!", "Sesión iniciada con Google", "success");
      router.push("/");
      setIsLoading(false);
    }, 1500);
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      showPickyAlert("Bienvenido!", "Sesión iniciada con Apple", "success");
      router.push("/");
      setIsLoading(false);
    }, 1500);
  };

  const handleEmailLogin = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      showPickyAlert("Bienvenido!", `Sesión iniciada como ${email}`, "success");
      router.push("/");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-500 max-w-md mx-auto">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/20 dark:bg-tertiary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10">
        <Link href="/">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 active:scale-90 transition-all">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Iniciar Sesión</span>
        </div>
        <div className="w-12"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="relative flex items-center justify-center size-24 rounded-3xl bg-gradient-logo-full text-white shadow-2xl animate-glow">
            <ScanBarcode size={48} strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 size-8 bg-gradient-tertiary rounded-full flex items-center justify-center text-white shadow-lg glow-tertiary">
            <span className="text-xs font-black">✓</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Corralón <span className="gradient-text-logo">Picky</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Smart Shopping Experience
          </p>
        </div>

        {/* Welcome Message */}
        <div className="w-full mb-8 p-6 rounded-[2rem] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-black italic uppercase tracking-tighter mb-2 gradient-text-primary">
            ¡Bienvenido de Vuelta!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Iniciá sesión para acceder a tu historial de compras, ofertas personalizadas y la experiencia completa de Picky.
          </p>
        </div>

        {/* Social Auth Buttons */}
        <div className="w-full">
          <SocialAuthButtons
            onGoogleLogin={handleGoogleLogin}
            onAppleLogin={handleAppleLogin}
            onEmailLogin={handleEmailLogin}
          />
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-black text-primary hover:underline">
              Registrate
            </Link>
          </p>
        </div>

        {/* Guest Access */}
        <div className="mt-6">
          <Link href="/">
            <button className="text-xs text-slate-400 hover:text-primary font-black uppercase tracking-widest transition-colors underline underline-offset-4">
              Continuar como Invitado
            </button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 rounded-2xl bg-gradient-purple-pink flex items-center justify-center text-white glow-primary">
              <ScanBarcode size={20} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Scan & Go
            </p>
          </div>
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 rounded-2xl bg-gradient-purple-orange flex items-center justify-center text-white glow-tertiary">
              <span className="text-lg">💳</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Pago Rápido
            </p>
          </div>
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 rounded-2xl bg-gradient-orange-cyan flex items-center justify-center text-white glow-accent">
              <span className="text-lg">🎁</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Ofertas
            </p>
          </div>
        </div>
      </section>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="size-16 mx-auto mb-4 rounded-full bg-gradient-logo-full animate-spin border-4 border-white/20"></div>
            <p className="text-sm font-black uppercase tracking-widest text-center">
              Iniciando Sesión...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
