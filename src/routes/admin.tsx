import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard, Layers, Globe, BarChart3,
  TrendingUp, Search, Plus, Edit3, Trash2,
  ShoppingBag, Cpu, Lock, Mail, Key, User, Zap,
  Package, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { Sidebar } from "@/components/admin/Sidebar";
import { StatsCard } from "@/components/admin/StatsCard";
import { ProductModal } from "@/components/admin/ProductModal";
import { formatRp } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, loading: authLoading, login, register } = useAuth();
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "analytics">("overview");
  const [isRegister, setIsRegister] = useState(false);

  if (authLoading) return (
    <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center animate-pulse">
        <Zap className="h-6 w-6 text-emerald-400" />
      </div>
      <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Loading...</p>
    </div>
  );

  if (!user) return <AuthView login={login} register={register} isRegister={isRegister} setIsRegister={setIsRegister} />;
  return <DashboardView tab={tab} setTab={setTab} />;
}

/* ═══════════ AUTH ═══════════ */
function AuthView({ login, register, isRegister, setIsRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) await register(email, password, fullName);
      else await login(email, password);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full scale-150" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-white/20">
              <Lock className="h-7 w-7 text-black stroke-[2.5]" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase mb-1">
            <span className="text-white">Mpok Ris</span>
          </h1>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Admin Panel</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama Lengkap" required
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-all" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" required
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-all" />
          </div>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-all" />
          </div>
          <button disabled={loading}
            className="w-full bg-emerald-500 text-black py-4 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? 'Memproses...' : (isRegister ? 'Daftar' : 'Masuk')}
          </button>
          <button type="button" onClick={() => setIsRegister(!isRegister)}
            className="w-full text-center text-xs text-white/30 hover:text-emerald-400 transition-colors py-2">
            {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ═══════════ DASHBOARD ═══════════ */
function DashboardView({ tab, setTab }: any) {
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, stats, updateStatus } = useOrders();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p: any) => (p.nama || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col md:flex-row relative">
      {/* BG ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/[0.02] blur-[100px] rounded-full" />
      </div>

      <Sidebar activeTab={tab} setTab={setTab} />

      <main className="flex-1 overflow-y-auto pb-28 md:pb-8 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-[#060608]/90 backdrop-blur-xl border-b border-white/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-black fill-black" />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">MPOK RIS</p>
                <p className="text-[9px] text-emerald-400 font-bold tracking-widest">ADMIN</p>
              </div>
            </div>
            {tab === "products" && (
              <button onClick={() => setEditingProduct({})}
                className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center active:scale-90 transition-transform">
                <Plus className="h-4 w-4 text-black stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 pt-6 md:pt-12">
          {/* Page Title - Desktop */}
          <div className="hidden md:flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em] mb-2">Panel Admin</p>
              <h2 className="text-4xl font-black tracking-tight capitalize">
                {tab === "overview" ? "Dashboard" : tab === "products" ? "Produk" : tab === "orders" ? "Pesanan" : "Analitik"}
              </h2>
            </div>
            {tab === "products" && (
              <button onClick={() => setEditingProduct({})}
                className="bg-emerald-500 text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2">
                <Plus className="h-4 w-4 stroke-[3]" /> Tambah Produk
              </button>
            )}
          </div>

          {/* Mobile Tab Title */}
          <div className="md:hidden mb-5">
            <h2 className="text-2xl font-black tracking-tight capitalize">
              {tab === "overview" ? "Dashboard" : tab === "products" ? "Produk" : tab === "orders" ? "Pesanan" : "Analitik"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {tab === "overview" && <OverviewTab stats={stats} orders={orders} setTab={setTab} />}
            {tab === "products" && <ProductsTab products={filteredProducts} loading={productsLoading} search={search} setSearch={setSearch} setEditingProduct={setEditingProduct} deleteProduct={deleteProduct} />}
            {tab === "orders" && <OrdersTab orders={orders} updateStatus={updateStatus} />}
            {tab === "analytics" && <AnalyticsTab stats={stats} />}
          </AnimatePresence>
        </div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <ProductModal
            product={editingProduct.id ? editingProduct : null}
            onClose={() => setEditingProduct(null)}
            onSave={async (data, file) => {
              if (editingProduct.id) await updateProduct(editingProduct.id, data, file);
              else await addProduct(data, file);
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-2xl border-t border-white/5 px-2 py-2 pb-safe">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: "overview", icon: LayoutDashboard, label: "Home" },
            { id: "products", icon: Layers, label: "Produk" },
            { id: "orders", icon: Globe, label: "Pesanan" },
            { id: "analytics", icon: BarChart3, label: "Analitik" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex flex-col items-center gap-0.5 py-2 px-4 rounded-2xl transition-all ${
                tab === t.id ? "text-emerald-400" : "text-white/25"
              }`}>
              <t.icon className={`h-5 w-5 ${tab === t.id ? "text-emerald-400" : ""}`} />
              <span className="text-[9px] font-bold">{t.label}</span>
              {tab === t.id && <span className="h-1 w-1 rounded-full bg-emerald-400 mt-0.5" />}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ═══════════ TABS ═══════════ */

function OverviewTab({ stats, orders, setTab }: any) {
  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Quick Actions Mobile */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <button onClick={() => setTab("products")} className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 active:scale-95 transition-all">
          <Package className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">Kelola Produk</span>
        </button>
        <button onClick={() => setTab("orders")} className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 active:scale-95 transition-all">
          <ShoppingBag className="h-5 w-5 text-blue-400" />
          <span className="text-xs font-bold text-blue-400">Lihat Pesanan</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        <StatsCard label="Total Pendapatan" value={formatRp(stats.totalRevenue)} icon={TrendingUp} trend="Live" />
        <StatsCard label="Total Pesanan" value={stats.totalOrders} icon={ShoppingBag} trend="Aktif" />
        <StatsCard label="Jumlah Produk" value={stats.totalProducts} icon={Layers} trend="Synced" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-5 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Pesanan Terbaru</h3>
          <button onClick={() => setTab("orders")} className="text-[10px] font-bold text-emerald-400 hover:underline">Lihat Semua →</button>
        </div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-white/30 text-center py-8">Belum ada pesanan</p>
          ) : orders.slice(0, 5).map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{order.user_name || 'Pelanggan'}</p>
                  <p className="text-[10px] text-white/30">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-emerald-400">{formatRp(order.total_price)}</p>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  order.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>{order.payment_status || 'pending'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProductsTab({ products, loading, search, setSearch, setEditingProduct, deleteProduct }: any) {
  return (
    <motion.div key="products" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-all text-white placeholder:text-white/30" />
      </div>

      {/* Product Count */}
      <p className="text-xs text-white/40 font-medium">{products.length} produk ditemukan</p>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/30 text-sm animate-pulse">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Belum ada produk</p>
          <button onClick={() => setEditingProduct({})} className="mt-4 bg-emerald-500 text-black px-6 py-2.5 rounded-xl text-xs font-bold">
            + Tambah Produk Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p: any) => (
            <div key={p.id} className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3 flex items-center gap-3 transition-all hover:bg-white/[0.06]">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                {p.image_url ? (
                  <img src={p.image_url} className="h-full w-full object-cover" alt={p.nama} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/20"><Package className="h-6 w-6" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate">{p.nama}</h4>
                <p className="text-base font-black text-emerald-400">{formatRp(p.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">Stok: {p.stock ?? 0}</span>
                  {p.unit && <span className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{p.unit}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => setEditingProduct(p)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-emerald-500 hover:text-black transition-all active:scale-90">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => { if (confirm('Hapus produk ini?')) deleteProduct(p.id, p.image_url); }}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-400/60 hover:bg-red-500 hover:text-white transition-all active:scale-90">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function OrdersTab({ orders, updateStatus }: any) {
  return (
    <motion.div key="orders" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-12 w-12 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">Belum ada pesanan masuk</p>
        </div>
      ) : orders.map((order: any) => (
        <div key={order.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-black uppercase tracking-tight">#{String(order.id).slice(0, 8)}</h4>
                <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  order.payment_status === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {order.payment_status === 'paid' ? '✓ Lunas' : '⏳ Pending'}
                </span>
                {order.delivery_status && (
                  <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    order.delivery_status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                    order.delivery_status === 'shipped' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/10 text-white/40'
                  }`}>
                    {order.delivery_status === 'delivered' ? '✓ Diterima' : order.delivery_status === 'shipped' ? '🚚 Dikirim' : order.delivery_status}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40">{order.user_name || 'Pelanggan'} · {new Date(order.created_at).toLocaleString('id-ID')}</p>
            </div>
            <p className="text-xl font-black text-emerald-400">{formatRp(order.total_price)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => updateStatus(order.id, 'paid', 'payment')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all active:scale-95">
              <CheckCircle2 className="h-3 w-3" /> Lunas
            </button>
            <button onClick={() => updateStatus(order.id, 'shipped', 'delivery')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all active:scale-95">
              <Clock className="h-3 w-3" /> Dikirim
            </button>
            <button onClick={() => updateStatus(order.id, 'delivered', 'delivery')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 hover:bg-white hover:text-black transition-all active:scale-95">
              <CheckCircle2 className="h-3 w-3" /> Diterima
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function AnalyticsTab({ stats }: any) {
  return (
    <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-emerald-400">{stats.totalProducts}</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Produk Aktif</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-blue-400">{stats.totalOrders}</p>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Total Pesanan</p>
        </div>
      </div>
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="text-4xl font-black text-emerald-400 mb-2">{formatRp(stats.totalRevenue)}</p>
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Pendapatan</p>
      </div>
    </motion.div>
  );
}
