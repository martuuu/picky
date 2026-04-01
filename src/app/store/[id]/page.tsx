"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft, QrCode, Edit3, AlertTriangle, Package,
  MapPin, Printer, Download, Check, X, BarChart3,
  Tag, ChevronRight, Zap, TrendingUp, TrendingDown, Minus
} from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";

const STOCK_HISTORY = [
  { date: "Mar 7", stock: 55 },
  { date: "Mar 8", stock: 48 },
  { date: "Mar 9", stock: 42 },
  { date: "Mar 10", stock: 35 },
  { date: "Mar 11", stock: 30 },
  { date: "Mar 12", stock: 25 },
  { date: "Mar 13", stock: 42 },
];

function MiniChart({ data }: { data: { date: string; stock: number }[] }) {
  const max = Math.max(...data.map(d => d.stock));
  const min = Math.min(...data.map(d => d.stock));
  const range = max - min || 1;
  const W = 240; const H = 80; const pad = 8;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = pad + ((max - d.stock) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const fillPoints = `${pad},${H - pad} ${points} ${W - pad},${H - pad}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (W - pad * 2);
        const y = pad + ((max - d.stock) / range) * (H - pad * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" />;
      })}
    </svg>
  );
}

export default function StoreProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const product = products.find(p => p.id === id);

  if (!mounted) return null;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center font-display bg-slate-50 dark:bg-[#0b1120]">
      <div className="text-center">
        <p className="text-2xl font-black italic">Producto no encontrado</p>
        <Link href="/store" className="text-primary text-sm mt-2 block">← Volver al inventario</Link>
      </div>
    </div>
  );

  const productUrl = typeof window !== "undefined" ? `${window.location.origin}/product/${product.sku}` : `https://picky.app/product/${product.sku}`;
  const stockStatus = product.stock <= 5 ? { label: "Crítico", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" }
    : product.stock <= 15 ? { label: "Bajo", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" }
    : { label: "Normal", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b1120] font-display text-slate-900 dark:text-white">
      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-gradient-logo-full rounded-2xl flex items-center justify-center shadow-md">
              <Zap size={18} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter leading-none">Picky</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Portal de Tienda</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { href: "/store", label: "← Inventario", active: false },
            { href: "/store#analytics", label: "Analytics", active: false },
            { href: "/store#orders", label: "Pedidos", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Quick Stock Alert */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className={`flex items-center gap-2 px-3 py-3 rounded-xl border ${stockStatus.bg}`}>
            <Package size={14} className={stockStatus.color} />
            <div>
              <p className={`text-[9px] font-black uppercase tracking-widest ${stockStatus.color}`}>Stock {stockStatus.label}</p>
              <p className={`text-sm font-black italic ${stockStatus.color}`}>{product.stock} unidades</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 overflow-auto">
        {/* Breadcrumb header */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex items-center gap-4">
          <Link href="/store" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700">
            <ArrowLeft size={14} />
            Inventario
          </Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 truncate max-w-48">
            {product.name}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setEditing(!editing)}
              className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${editing ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"}`}
            >
              {editing ? <><Check size={14} />Guardar</> : <><Edit3 size={14} />Editar</>}
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="h-9 px-4 rounded-xl bg-gradient-purple-pink text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-95"
            >
              <QrCode size={14} />
              Ver QR
            </button>
          </div>
        </header>

        <div className="p-8 grid grid-cols-3 gap-6">
          {/* Left col: image + QR */}
          <div className="col-span-1 space-y-5">
            {/* Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
              <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl ${stockStatus.bg} border`}>
                <span className={`text-[9px] font-black uppercase tracking-widest ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
            </div>

            {/* QR Card */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código QR</p>
                  <button onClick={() => setShowQR(false)}>
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-2xl border-2 border-slate-100">
                    <QRCodeSVG value={productUrl} size={140} level="M" fgColor="#0f172a" bgColor="#ffffff" />
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 font-bold text-center break-all">{productUrl}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.print()}
                    className="h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-slate-600 dark:text-slate-200"
                  >
                    <Printer size={13} />
                    Imprimir
                  </button>
                  <button className="h-9 rounded-xl bg-gradient-purple-pink text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-sm">
                    <Download size={13} />
                    Descargar
                  </button>
                </div>
              </motion.div>
            )}

            {/* Specs */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Especificaciones</p>
              <div className="space-y-2.5">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700/50 pb-2 last:border-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-200">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right cols: details + stats */}
          <div className="col-span-2 space-y-5">
            {/* Product Info */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-7">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">{product.category}</span>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase mt-2 leading-tight">{product.name}</h2>
                  <p className="text-sm font-bold text-slate-400 mt-1">{product.brand} · <span className="font-mono">{product.sku}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black italic gradient-text-logo tracking-tighter">${product.price.toLocaleString("es-AR")}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-slate-400 line-through">${product.originalPrice.toLocaleString("es-AR")}</p>
                  )}
                  {product.wholesalePrice && (
                    <p className="text-[10px] font-black text-primary mt-1">Mayorista: ${product.wholesalePrice.toLocaleString("es-AR")}</p>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

              {product.zone && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ubicación en Tienda</p>
                    <p className="text-sm font-black italic">{product.zone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stock stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Stock Actual", value: product.stock + " uds.", icon: Package, color: "text-primary", bg: "bg-primary/10" },
                { label: "Precio Venta", value: "$" + product.price.toLocaleString("es-AR"), icon: Tag, color: "text-violet-500", bg: "bg-violet-500/10" },
                { label: "Valor en Stock", value: "$" + (product.price * product.stock / 1000).toFixed(0) + "K", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              ].map((kpi, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                  <div className={`size-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <kpi.icon size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-lg font-black italic tracking-tight leading-none">{kpi.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{kpi.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock history chart */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Historial de Stock</p>
                  <h3 className="text-lg font-black italic tracking-tighter">Últimos 7 días</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <BarChart3 size={14} className="text-violet-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Movimiento</span>
                </div>
              </div>
              <MiniChart data={STOCK_HISTORY} />
              <div className="flex justify-between mt-2">
                {STOCK_HISTORY.map(d => (
                  <span key={d.date} className="text-[9px] font-bold text-slate-400">{d.date}</span>
                ))}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Variantes del Producto</p>
                <div className="space-y-4">
                  {product.variants.map((v) => (
                    <div key={v.label}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{v.label}</p>
                      <div className="flex gap-2 flex-wrap">
                        {v.type === "color" ? (
                          v.options.map(c => (
                            <div key={c} className="size-8 rounded-xl border-2 border-slate-200 shadow-sm" style={{ background: c }} />
                          ))
                        ) : (
                          v.options.map(o => (
                            <span key={o} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-[10px] font-black uppercase">{o}</span>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wholesale info */}
            {product.wholesalePrice && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl border border-primary/20 p-6">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Precio Mayorista</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Precio</p>
                    <p className="text-xl font-black italic gradient-text-logo">${product.wholesalePrice.toLocaleString("es-AR")}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mín. Unidades</p>
                    <p className="text-xl font-black italic">{product.wholesaleMinQuantity || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ahorro por Un.</p>
                    <p className="text-xl font-black italic text-emerald-500">-${(product.price - product.wholesalePrice).toLocaleString("es-AR")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
