"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, Search,
  ChevronDown, ChevronUp, Package, User, CreditCard,
  SlidersHorizontal, Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "@/stores/useOrderStore";
import type { PickyOrder } from "@/stores/useOrderStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDuration(createdAt: string, updatedAt: string): string {
  const ms = new Date(updatedAt).getTime() - new Date(createdAt).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "< 1m";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const PAYMENT_LABELS: Record<string, string> = {
  mercadopago: "MercadoPago",
  cash: "Efectivo",
  debit: "Débito",
};

const PICKUP_LABELS: Record<string, string> = {
  counter: "Mostrador",
  locker: "Locker",
  "picky-car": "Picky Car",
  delivery: "Envío",
};

// ─── Expanded row ─────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: PickyOrder }) {
  const [expanded, setExpanded] = useState(false);
  const isDelivered = order.status === "DELIVERED";
  const pickedCount = order.items.filter((i) => i.picked).length;

  return (
    <motion.div
      layout
      className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden"
    >
      {/* Summary row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        {/* Status icon */}
        {isDelivered ? (
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
        ) : (
          <XCircle size={18} className="text-red-400 shrink-0" />
        )}

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight">{order.id}</span>
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                isDelivered
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}
            >
              {isDelivered ? "Entregado" : "Cancelado"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {order.customerName} · {formatDate(order.updatedAt)}
          </p>
        </div>

        {/* Total + chevron */}
        <div className="text-right shrink-0">
          <p className="text-sm font-black text-primary">{formatCurrency(order.total)}</p>
          <p className="text-[10px] text-slate-600">{order.items.length} items</p>
        </div>

        {expanded ? (
          <ChevronUp size={14} className="text-slate-600 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-slate-600 shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Metadata chips */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                  <User size={10} />
                  {order.customerEmail}
                </span>
                <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                  <CreditCard size={10} />
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </span>
                <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                  <Package size={10} />
                  {PICKUP_LABELS[order.pickupMethod] ?? order.pickupMethod}
                </span>
                <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                  <Clock size={10} />
                  Duración: {formatDuration(order.createdAt, order.updatedAt)}
                </span>
                {order.pickerId && (
                  <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 px-2.5 py-1 rounded-full text-blue-400">
                    Picker: {order.pickerId}
                  </span>
                )}
              </div>

              {/* Items list */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">
                  Items ({pickedCount}/{order.items.length} armados)
                </p>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span
                      className={`size-3.5 rounded-full shrink-0 flex items-center justify-center ${
                        item.picked ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-600"
                      }`}
                    >
                      {item.picked ? "✓" : "·"}
                    </span>
                    <span className="flex-1 text-slate-300 truncate">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {formatCurrency(item.priceAtPurchase * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/5 pt-3 space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Ahorro</span>
                    <span>−{formatCurrency(order.savings)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-white pt-1">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = "date_desc" | "date_asc" | "total_desc" | "total_asc";

export default function PickerHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useOrderStore((state) => state.orders);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "DELIVERED" | "CANCELLED">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => { setMounted(true); }, []);
  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, filterStatus, sortKey]);

  const historyOrders = useMemo(() => {
    const finished = orders.filter(
      (o) => o.status === "DELIVERED" || o.status === "CANCELLED"
    );

    const searched = finished.filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    });

    const filtered = filterStatus === "all"
      ? searched
      : searched.filter((o) => o.status === filterStatus);

    return filtered.sort((a, b) => {
      if (sortKey === "date_desc") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortKey === "date_asc")  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      if (sortKey === "total_desc") return b.total - a.total;
      if (sortKey === "total_asc")  return a.total - b.total;
      return 0;
    });
  }, [orders, search, filterStatus, sortKey]);

  const totalPages = Math.max(1, Math.ceil(historyOrders.length / PAGE_SIZE));
  const paginated = historyOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary stats
  const delivered = historyOrders.filter((o) => o.status === "DELIVERED");
  const cancelled = historyOrders.filter((o) => o.status === "CANCELLED");
  const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0b1120] text-white font-display overflow-x-hidden pb-16">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center gap-3">
        <Link
          href="/picker"
          className="flex size-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors shrink-0"
        >
          <ArrowLeft size={18} className="text-slate-400" />
        </Link>

        <div className="flex-1">
          <h1 className="text-base font-black uppercase italic tracking-tighter leading-none">
            Historial <span className="text-primary">de Pedidos</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {historyOrders.length} registros finalizados
          </p>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            showFilters
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
          }`}
        >
          <SlidersHorizontal size={13} />
          Filtros
        </button>
      </header>

      {/* Summary bar */}
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Entregados", value: delivered.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Cancelados", value: cancelled.length, color: "text-red-400",     bg: "bg-red-500/10"     },
          { label: "Recaudado",  value: formatCurrency(totalRevenue), color: "text-primary", bg: "bg-primary/10" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-xl px-3 py-2.5 border border-white/5`}>
            <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-3 pb-1 space-y-3 border-b border-white/5">
              {/* Status filter */}
              <div className="flex gap-2">
                {(["all", "DELIVERED", "CANCELLED"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                      filterStatus === s
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-white/5 text-slate-500 border border-white/10"
                    }`}
                  >
                    {s === "all" ? "Todos" : s === "DELIVERED" ? "Entregados" : "Cancelados"}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-slate-600 shrink-0" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="flex-1 h-8 px-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-primary/40 transition-colors"
                >
                  <option value="date_desc" className="bg-[#0b1120]">Más reciente primero</option>
                  <option value="date_asc"  className="bg-[#0b1120]">Más antiguo primero</option>
                  <option value="total_desc" className="bg-[#0b1120]">Mayor total primero</option>
                  <option value="total_asc"  className="bg-[#0b1120]">Menor total primero</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-2 mt-1">
        {paginated.length === 0 ? (
          <div className="text-center py-20 space-y-2">
            <Package size={32} className="text-slate-700 mx-auto" />
            <p className="text-slate-600 text-sm">
              {historyOrders.length === 0
                ? "Aún no hay pedidos finalizados"
                : "Sin resultados para esta búsqueda"}
            </p>
          </div>
        ) : (
          paginated.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            ← Ant.
          </button>
          <span className="text-xs text-slate-500 font-mono">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            Sig. →
          </button>
        </div>
      )}
    </div>
  );
}
