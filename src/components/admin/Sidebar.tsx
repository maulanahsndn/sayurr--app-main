import React from 'react';
import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Layers, Globe, BarChart3, Zap, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  setTab: (tab: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setTab }) => {
  const { logout } = useAuth();

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Produk", icon: Layers },
    { id: "orders", label: "Pesanan", icon: Globe },
    { id: "analytics", label: "Analitik", icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex-col py-8 px-6 shrink-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/20">
          <Zap className="h-5 w-5 text-black fill-black" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight uppercase leading-none text-white">MPOK RIS</h1>
          <p className="text-[9px] text-emerald-400 font-bold tracking-widest mt-0.5">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`group flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${
              activeTab === item.id
                ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-black" : "text-white/30"}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="space-y-2 pt-4 border-t border-white/5">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
        <Link to="/" className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <Home className="h-4 w-4" /> Kembali ke Toko
        </Link>
      </div>
    </aside>
  );
};
