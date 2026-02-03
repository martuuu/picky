"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ScanBarcode, Heart, Store, Minus, Plus, List, ChevronDown, ShoppingBag } from "lucide-react";
import { products, Product } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/useCartStore";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui/Button";
import { toast } from "sonner";
import { showPickyAlert } from "@/components/ui/Alert";
import { CompetitorProducts } from "@/components/ui/CompetitorProducts";
import { PromotionsSection } from "@/components/ui/PromotionsSection";
import { ProductGallery } from "@/components/ui/ProductGallery";

export default function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = use(params);
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const product = products.find(p => p.sku === sku);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark">
            <h1 className="text-2xl font-bold dark:text-white">Producto no encontrado</h1>
            <Link href="/store/all" className="mt-4 text-primary">Volver al catálogo</Link>
        </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    showPickyAlert(product.name, `${quantity} unidades en tu canasta Picky.`, "cart");
  };


  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-40 bg-background-light dark:bg-background-dark font-display">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <button 
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
        >
            <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detalle de Producto</span>
            <span className="text-xs font-bold gradient-text-primary truncate max-w-[150px]">{product.sku}</span>
        </div>
        <Link href="/cart">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <ShoppingBag size={20} />
            </button>
        </Link>
      </header>

      <main className="w-full pt-20 px-4 space-y-6">
        {/* Main Product Section: Two Column-ish on Desktop, Compact on Mobile */}
        <div className="flex flex-col gap-6">
            {/* Header info moved BEFORE image to prioritize readability */}
            <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-2xl font-black leading-tight text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        {product.name}
                    </h1>
                    <button className="shrink-0 size-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 transition-colors">
                        <Heart size={20} />
                    </button>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-primary/10 dark:bg-primary/20 gradient-text-primary">
                        {product.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-green-500/10 text-green-600">
                        Disponibilidad: {product.stock}
                    </span>
                </div>
            </div>

            {/* Smaller Image and Primary Action Group */}
            <div className="grid grid-cols-12 gap-4">
                {/* Compact Product Image - Full coverage */}
                <div className="col-span-5 aspect-square relative bg-slate-50 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-lg">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    {product.originalPrice && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-gradient-secondary text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase glow-secondary">Oferta</span>
                        </div>
                    )}
                </div>

                {/* Pricing and Quick Specs Right Side */}
                <div className="col-span-7 flex flex-col justify-center gap-2">
                    <div className="flex flex-col">
                        {product.originalPrice && (
                            <span className="text-slate-400 text-xs line-through font-bold">
                                ${product.originalPrice.toLocaleString("es-AR")}
                            </span>
                        )}
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                            ${product.price.toLocaleString("es-AR")}
                        </span>
                    </div>
                    
                    {/* Location Badge */}
                    <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 w-fit">
                        <Store size={14} className="text-primary" />
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Pasillo 4, Estante 2</span>
                    </div>
                </div>
            </div>

            {/* Quantity and Description Group */}
            <div className="space-y-6">
                {/* Quantity Control */}
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">Cantidad</span>
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 rounded-2xl p-1">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="size-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-primary transition-colors"
                        >
                            <Minus size={20} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-black text-lg text-slate-900 dark:text-white">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="size-10 flex items-center justify-center rounded-xl bg-gradient-purple-pink text-white shadow-lg glow-primary"
                        >
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white italic">Descripción</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {product.description}
                    </p>
                </div>

                {/* Specs Accordion */}
                <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white italic">Especificaciones Técnicas</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {product.specs.map((spec, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <span className="block text-[10px] font-black uppercase text-slate-400 mb-1">{spec.label}</span>
                                <span className="block text-sm font-bold text-slate-900 dark:text-white tracking-tight">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Variants if any */}
                {product.variants && product.variants.length > 0 && (
                    <div className="space-y-4">
                        {product.variants.map((v, i) => (
                            <div key={i} className="space-y-3">
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white italic">{v.label}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {v.options.map((opt, oi) => (
                                        <button 
                                            key={oi}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all border-2",
                                                oi === 0 
                                                    ? "bg-gradient-purple-pink border-primary text-white shadow-md glow-primary"
                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* Competitor Products Section */}
      <div className="px-4 pb-8">
        <CompetitorProducts currentProduct={product} allProducts={products} />
      </div>

      {/* Promotions Section */}
      <div className="px-4 pb-8">
        <PromotionsSection />
      </div>

      {/* Product Gallery Section - At the bottom */}
      <div className="px-4 pb-32">
        <ProductGallery productName={product.name} mainImage={product.image} />
      </div>

      {/* Primary Action Button Floating */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
            <Button 
                onClick={handleAddToCart}
                variant="gradient-purple-pink"
                className="w-full h-18 rounded-[2.5rem] shadow-2xl flex items-center justify-between px-8 group active:scale-95 transition-all"
            >
                <div className="flex flex-col items-start leading-none gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Agregar al Carrito</span>
                    <span className="text-xl font-black uppercase italic tracking-tighter">Confirmar Item</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-px bg-white/20"></div>
                    <span className="text-2xl font-black italic tracking-tighter">
                        ${(product.price * quantity).toLocaleString("es-AR")}
                    </span>
                </div>
            </Button>
        </div>
      </div>
    </div>
  );
}
