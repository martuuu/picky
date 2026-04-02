"use client";

/**
 * /admin/qrs — Impresión masiva de QR de productos
 *
 * Descarga todos los productos (mock o TiendaNube) y genera una cuadrícula
 * de etiquetas QR lista para imprimir en A4 (4 columnas × 4 filas = 16 por hoja).
 * Cada etiqueta incluye: QR code, nombre, SKU y zona del producto.
 *
 * USO:
 *   1. Abrir en navegador de escritorio
 *   2. Clic en "Imprimir" → aparece la cuadrícula sin controles
 *   3. Guillotinar y pegar en la estantería del corralón
 *
 * QR value: "picky://product/<sku>" — la app de scanner lo decodifica y
 * navega directamente al producto correcto.
 */

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Printer, RefreshCw, AlertTriangle, Store, Database } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { products as mockProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { motion } from "framer-motion";

// ─── QR Label Card ────────────────────────────────────────────────────────────

function QRLabel({ product }: { product: Product }) {
  const qrValue = `picky://product/${product.sku}`;

  return (
    <div
      className="
        qr-label
        flex flex-col items-center justify-between
        border border-gray-300 rounded-lg p-3
        bg-white text-black
        w-full aspect-square
        print:rounded-none print:border-gray-400
      "
    >
      {/* QR Code */}
      <div className="flex-1 flex items-center justify-center w-full">
        <QRCodeSVG
          value={qrValue}
          size={96}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
          includeMargin={false}
        />
      </div>

      {/* Product info */}
      <div className="w-full mt-2 text-center space-y-0.5">
        <p className="text-[10px] font-bold leading-tight line-clamp-2 text-gray-900">
          {product.name}
        </p>
        <p className="text-[9px] text-gray-500 font-mono">{product.sku}</p>
        {product.zone && (
          <p className="text-[9px] text-blue-600 font-medium truncate">
            {product.zone}
          </p>
        )}
        {product.brand && (
          <p className="text-[8px] text-gray-400 truncate">{product.brand}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminQRsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [useTiendaNube, setUseTiendaNube] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  useEffect(() => { setMounted(true); }, []);

  // Fetch all products from TiendaNube (pages until exhausted)
  async function fetchAllTiendaNubeProducts() {
    setLoading(true);
    setError(null);
    const all: Product[] = [];
    let page = 1;

    try {
      while (true) {
        const res = await fetch(`/api/tiendanube/products?page=${page}&per_page=200`);
        const data = await res.json();

        if (!res.ok) {
          if (data.credentialsMissing) {
            throw new Error("Credenciales de TiendaNube no configuradas (.env)");
          }
          throw new Error(data.details ?? "Error al conectar con TiendaNube");
        }

        if (!Array.isArray(data) || data.length === 0) break;
        all.push(...data);
        if (data.length < 200) break; // last page
        page++;
      }
      setProducts(all.length > 0 ? all : mockProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }

  function handleToggleSource() {
    if (!useTiendaNube) {
      setUseTiendaNube(true);
      fetchAllTiendaNubeProducts();
    } else {
      setUseTiendaNube(false);
      setProducts(mockProducts);
      setError(null);
    }
  }

  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category))).sort()];

  const filtered = products.filter((p) => {
    const matchSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Group into pages of 16 (4×4)
  const LABELS_PER_PAGE = 16;
  const pages: Product[][] = [];
  for (let i = 0; i < filtered.length; i += LABELS_PER_PAGE) {
    pages.push(filtered.slice(i, i + LABELS_PER_PAGE));
  }

  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  if (!mounted) return null;

  return (
    <>
      {/* ── Print styles (injected inline to avoid a separate CSS file) ─────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #qr-print-area, #qr-print-area * { visibility: visible !important; }
          #qr-print-area { position: fixed; inset: 0; background: white; }
          .print-page {
            page-break-after: always;
            break-after: page;
          }
          .print-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── Screen UI ──────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-screen flex-col bg-[#0b1120] text-white font-display overflow-x-hidden print:hidden">

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center gap-3">
          <Link
            href="/admin"
            className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="text-slate-400" />
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black uppercase italic tracking-tighter leading-none">
              QR <span className="text-primary">Etiquetas</span>
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {filtered.length} productos · {pages.length} hojas A4
            </p>
          </div>

          {/* Source toggle */}
          <button
            onClick={handleToggleSource}
            disabled={loading}
            className={`
              flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all
              ${useTiendaNube
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }
              disabled:opacity-50
            `}
          >
            {loading ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : useTiendaNube ? (
              <Store size={13} />
            ) : (
              <Database size={13} />
            )}
            {loading ? "Cargando..." : useTiendaNube ? "TiendaNube" : "Mock"}
          </button>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold uppercase tracking-wide bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all"
          >
            <Printer size={13} />
            Imprimir
          </button>
        </header>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-white/5 flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0b1120]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}. Mostrando productos demo.</span>
          </div>
        )}

        {/* Preview grid */}
        <div className="px-4 py-6">
          {pages.length === 0 ? (
            <div className="text-center py-20 text-slate-600 text-sm">
              Sin productos que coincidan
            </div>
          ) : (
            pages.map((page, pageIdx) => (
              <motion.div
                key={pageIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pageIdx * 0.04 }}
                className="mb-8"
              >
                <p className="text-[11px] text-slate-600 mb-3 uppercase tracking-widest font-mono">
                  Hoja {pageIdx + 1} — etiquetas {pageIdx * LABELS_PER_PAGE + 1}–
                  {Math.min((pageIdx + 1) * LABELS_PER_PAGE, filtered.length)}
                </p>
                <div className="grid grid-cols-4 gap-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                  {page.map((product) => (
                    <QRLabel key={product.id} product={product} />
                  ))}
                  {/* Fill empty cells to keep grid alignment */}
                  {Array.from({ length: LABELS_PER_PAGE - page.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="border border-dashed border-gray-700 rounded-lg aspect-square opacity-20" />
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* ── Print-only area ────────────────────────────────────────────────── */}
      <div id="qr-print-area" ref={printRef} className="hidden print:block bg-white">
        {pages.map((page, pageIdx) => (
          <div
            key={pageIdx}
            className="print-page"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "4mm",
              padding: "0",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            {page.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "0.5px solid #aaa",
                  padding: "6px",
                  backgroundColor: "white",
                  aspectRatio: "1 / 1",
                  boxSizing: "border-box",
                }}
              >
                {/* QR */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <QRCodeSVG
                    value={`picky://product/${product.sku}`}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={false}
                  />
                </div>

                {/* Text */}
                <div style={{ width: "100%", textAlign: "center", marginTop: "4px" }}>
                  <p style={{ fontSize: "8px", fontWeight: "bold", margin: 0, lineHeight: 1.2, color: "#111", wordBreak: "break-word" }}>
                    {product.name}
                  </p>
                  <p style={{ fontSize: "7px", margin: "2px 0 0", color: "#666", fontFamily: "monospace" }}>
                    {product.sku}
                  </p>
                  {product.zone && (
                    <p style={{ fontSize: "7px", margin: "1px 0 0", color: "#2563eb" }}>
                      {product.zone}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Empty filler cells */}
            {Array.from({ length: LABELS_PER_PAGE - page.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  border: "0.5px dashed #ddd",
                  aspectRatio: "1 / 1",
                  backgroundColor: "white",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
