"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  BarChart3, Box, Users, Settings, Search, ScanBarcode,
  Plus, QrCode, AlertTriangle, CheckCircle2, Download,
  X, Printer, ChevronRight, Tag, Package, Zap, TrendingUp,
  Filter, ChevronDown, Eye, Edit3, ExternalLink, MoreHorizontal, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { products as mockProducts, categories, brands } from "@/lib/data";
import type { Product } from "@/lib/data";

const STOCK_THRESHOLD_LOW = 15;
const STOCK_THRESHOLD_CRITICAL = 5;

function getStockStatus(stock: number) {
  if (stock <= STOCK_THRESHOLD_CRITICAL) return { label: "Crítico", color: "text-red-500", bg: "bg-red-500/10", dot: "bg-red-500" };
  if (stock <= STOCK_THRESHOLD_LOW) return { label: "Bajo", color: "text-amber-500", bg: "bg-amber-500/10", dot: "bg-amber-500" };
  return { label: "Normal", color: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500" };
}

function QRModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const productUrl = typeof window !== "undefined"
    ? `${window.location.origin}/product/${product.sku}`
    : `https://picky.app/product/${product.sku}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-black italic tracking-tighter uppercase leading-tight line-clamp-2">{product.name}</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKU: {product.sku}</p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 active:scale-90 transition-all shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white rounded-3xl border-4 border-slate-100 shadow-inner">
            <QRCodeSVG
              value={productUrl}
              size={180}
              level="M"
              marginSize={0}
              fgColor="#0f172a"
              bgColor="#ffffff"
            />
          </div>
        </div>

        {/* URL */}
        <div className="mb-6 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">URL del Producto</p>
          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 break-all">{productUrl}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            <Printer size={15} />
            Imprimir
          </button>
          <button
            onClick={() => {
              const svg = document.querySelector(".qr-download svg");
              if (!svg) return;
              const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `QR-${product.sku}.svg`;
              a.click();
            }}
            className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-gradient-purple-pink text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
          >
            <Download size={15} />
            Descargar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const NAV_ITEMS = [
  { icon: Box, label: "Inventario", id: "inventory", active: true },
  { icon: BarChart3, label: "Analytics", id: "analytics", active: false },
  { icon: Package, label: "Pedidos", id: "orders", active: false },
  { icon: Users, label: "Personal", id: "staff", active: false },
  { icon: ScanBarcode, label: "QR Masivo", id: "qr-bulk", active: false },
  { icon: Settings, label: "Configuración", id: "settings", active: false },
];

export default function StoreManager() {
  const [mounted, setMounted] = useState(false);
  const [activeNav, setActiveNav] = useState("inventory");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [filterBrand, setFilterBrand] = useState("Todas");
  const [filterStock, setFilterStock] = useState("Todos");
  const [qrProduct, setQrProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  // TiendaNube integration toggle
  // TODO (Supabase): Replace with a DB-backed sync flag per branch/store
  const [useTiendaNube, setUseTiendaNube] = useState(false);
  const [tnProducts, setTnProducts] = useState<Product[]>([]);
  const [tnLoading, setTnLoading] = useState(false);
  const [tnError, setTnError] = useState<string | null>(null);

  // Active product catalog — mock or TiendaNube
  const products: Product[] = useTiendaNube ? tnProducts : mockProducts;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!useTiendaNube) return;
    setTnLoading(true);
    setTnError(null);
    fetch("/api/tiendanube/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.credentialsMissing ? "Credenciales de TiendaNube no configuradas. Revisá el .env." : data.error);
        setTnProducts(data);
      })
      .catch((e) => {
        setTnError(e.message);
        setUseTiendaNube(false);
      })
      .finally(() => setTnLoading(false));
  }, [useTiendaNube]);

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || (p.brand ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCategory === "Todos" || p.category === filterCategory;
      const matchBrand = filterBrand === "Todas" || (p.brand ?? "") === filterBrand;
      const stockOk = filterStock === "Todos"
        || (filterStock === "Crítico" && p.stock <= STOCK_THRESHOLD_CRITICAL)
        || (filterStock === "Bajo" && p.stock > STOCK_THRESHOLD_CRITICAL && p.stock <= STOCK_THRESHOLD_LOW)
        || (filterStock === "Normal" && p.stock > STOCK_THRESHOLD_LOW);
      return matchSearch && matchCat && matchBrand && stockOk;
    });
  }, [products, search, filterCategory, filterBrand, filterStock]);

  const criticalCount = products.filter(p => p.stock <= STOCK_THRESHOLD_CRITICAL).length;
  const lowStockCount = products.filter(p => p.stock > STOCK_THRESHOLD_CRITICAL && p.stock <= STOCK_THRESHOLD_LOW).length;

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b1120] font-display text-slate-900 dark:text-white antialiased">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0">
        {/* Logo */}
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

        {/* Store selector */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Sucursal</label>
          <div className="relative">
            <select className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2.5 px-3 text-[10px] font-bold uppercase focus:ring-2 focus:ring-primary/30 outline-none">
              <option>BA Centro</option>
              <option>Rosario Sur</option>
              <option>Córdoba Norte</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${activeNav === item.id ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              <item.icon size={16} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Stock alerts summary */}
        <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Alertas de Stock</p>
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-xl">
              <AlertTriangle size={13} className="text-red-500 shrink-0" />
              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{criticalCount} Crítico{criticalCount > 1 ? "s" : ""}</span>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 rounded-xl">
              <AlertTriangle size={13} className="text-amber-500 shrink-0" />
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{lowStockCount} Stock Bajo</span>
            </div>
          )}
          {criticalCount === 0 && lowStockCount === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Todo en orden</span>
            </div>
          )}
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">Gestión de Inventario</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{products.length} productos registrados</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* TiendaNube data source toggle */}
            <button
              onClick={() => setUseTiendaNube((v) => !v)}
              disabled={tnLoading}
              className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all border ${
                useTiendaNube
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              <ExternalLink size={13} />
              {tnLoading ? "Cargando..." : useTiendaNube ? "TiendaNube ✓" : "Usar TiendaNube"}
            </button>

            {/* TiendaNube error pill */}
            {tnError && (
              <span className="h-9 px-3 rounded-xl bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-red-500/20 max-w-48 truncate" title={tnError}>
                <AlertTriangle size={12} />
                {tnError}
              </span>
            )}

            <button className="relative size-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Bell size={16} />
              {criticalCount > 0 && <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />}
            </button>
            <button className="h-9 px-4 rounded-xl bg-gradient-purple-pink text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md active:scale-95 transition-all">
              <Plus size={15} />
              Nuevo Producto
            </button>
          </div>
        </header>

        {/* Summary KPIs */}
        <div className="px-8 pt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Productos", value: products.length, icon: Box, color: "text-primary", bg: "bg-primary/10" },
            { label: "Categorías", value: categories.length - 1, icon: Tag, color: "text-violet-500", bg: "bg-violet-500/10" },
            { label: "Stock Crítico", value: criticalCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
            { label: "Valor Estimado", value: "$" + (products.reduce((a, p) => a + p.price * p.stock, 0) / 1_000_000).toFixed(1) + "M", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className={`size-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shrink-0`}>
                <kpi.icon size={22} strokeWidth={2} />
              </div>
              <div>
                <p className="text-2xl font-black italic tracking-tighter leading-none">{kpi.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{kpi.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="px-8 mb-4 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o marca..."
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 pl-3 pr-8 appearance-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock filter */}
          <div className="relative">
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="h-10 pl-3 pr-8 appearance-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              {["Todos", "Normal", "Bajo", "Crítico"].map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Products Table */}
        <div className="px-8 pb-10">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[2.5rem_3rem_1fr_auto_auto_auto_auto_auto] items-center gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <div />
              <div />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Producto</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Categoría</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Precio</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Zona</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</span>
            </div>

            {/* Rows */}
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-lg font-black text-slate-400 uppercase italic tracking-tighter">Sin resultados</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Ajustá los filtros para ver productos</p>
                </div>
              ) : (
                filtered.map((product, idx) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`grid grid-cols-[2.5rem_3rem_1fr_auto_auto_auto_auto_auto] items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${idx === filtered.length - 1 ? "border-0" : ""}`}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) => {
                          const s = new Set(selectedProducts);
                          e.target.checked ? s.add(product.id) : s.delete(product.id);
                          setSelectedProducts(s);
                        }}
                        className="size-4 rounded accent-primary cursor-pointer"
                      />

                      {/* Image */}
                      <div className="relative size-10 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 bg-white">
                        <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                      </div>

                      {/* Name + Brand + SKU */}
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase italic tracking-tighter truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold text-slate-400">{product.brand}</span>
                          <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-[9px] font-mono text-slate-400">{product.sku}</span>
                        </div>
                      </div>

                      {/* Category */}
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                        {product.category}
                      </span>

                      {/* Stock */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${stockStatus.bg} whitespace-nowrap`}>
                        <div className={`size-1.5 rounded-full ${stockStatus.dot}`} />
                        <span className={`text-[9px] font-black ${stockStatus.color}`}>{product.stock} uds.</span>
                      </div>

                      {/* Price */}
                      <div className="text-right whitespace-nowrap">
                        <p className="text-sm font-black italic tracking-tighter gradient-text-logo leading-none">
                          ${product.price.toLocaleString("es-AR")}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[9px] text-slate-400 line-through">
                            ${product.originalPrice.toLocaleString("es-AR")}
                          </p>
                        )}
                      </div>

                      {/* Zone */}
                      <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap max-w-[120px] truncate">
                        {product.zone || "—"}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => setQrProduct(product)}
                          className="size-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                          title="Ver QR"
                        >
                          <QrCode size={14} />
                        </button>
                        <Link
                          href={`/store/${product.id}`}
                          className="size-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-90"
                          title="Ver detalle"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          className="size-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-90"
                          title="Editar"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrProduct && <QRModal product={qrProduct} onClose={() => setQrProduct(null)} />}
      </AnimatePresence>
    </div>
  );
}
