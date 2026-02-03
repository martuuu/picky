"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-light dark:bg-background-dark border-t border-slate-100 dark:border-slate-800 pb-safe-bottom">
      <div className="flex justify-around items-end h-16 pb-2">
        <Link 
            href="/" 
            className={`flex flex-1 flex-col items-center justify-center gap-1 group ${pathname === '/' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Home className="size-6 transition-colors group-hover:text-primary" />
          <span className="text-[10px] font-bold transition-colors group-hover:text-primary uppercase tracking-tight">Inicio</span>
        </Link>

        <Link 
            href="/store/all" 
            className={`flex flex-1 flex-col items-center justify-center gap-1 group ${isActive('/store') ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <Grid className="size-6 transition-colors group-hover:text-primary" />
          <span className="text-[10px] font-bold transition-colors group-hover:text-primary uppercase tracking-tight">Tienda</span>
        </Link>

        {/* Cart with Badge */}
        <Link 
            href="/cart" 
            className={`flex flex-1 flex-col items-center justify-center gap-1 group relative ${isActive('/cart') ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <div className="relative">
            <ShoppingCart className="size-6 transition-colors group-hover:text-primary" />
            {mounted && items.length > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-purple-pink text-[9px] font-black text-white border-2 border-background-light dark:border-background-dark box-content animate-in zoom-in glow-primary">
                    {items.length}
                </span>
            )}
          </div>
          <span className="text-[10px] font-bold transition-colors group-hover:text-primary uppercase tracking-tight">Canasta</span>
        </Link>

        <Link 
            href="/profile" 
            className={`flex flex-1 flex-col items-center justify-center gap-1 group ${isActive('/profile') ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <User className="size-6 transition-colors group-hover:text-primary" />
          <span className="text-[10px] font-bold transition-colors group-hover:text-primary uppercase tracking-tight">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
