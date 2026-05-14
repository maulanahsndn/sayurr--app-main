import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin, CheckCircle2, Plus } from "lucide-react";
import { useAddress } from "@/hooks/use-address";

export const Route = createFileRoute("/alamat")({
  component: AlamatPage,
  head: () => ({
    meta: [
      { title: "Alamat Pengiriman · Mama Shop" },
      { name: "description", content: "Kelola alamat pengiriman Anda." },
    ],
  }),
});

function AlamatPage() {
  const { addresses, setDefault, removeAddress } = useAddress();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/akun" className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft" aria-label="Kembali">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-extrabold leading-tight">Alamat Pengiriman</h1>
        </div>
      </header>

      <main className="px-5 pt-5 space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`rounded-3xl p-4 shadow-card border-2 transition-colors ${addr.isDefault ? "bg-primary/5 border-primary" : "bg-card border-border"}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-surface text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold">{addr.name}</p>
                  <p className="text-[11px] text-muted-foreground">{addr.phone}</p>
                </div>
              </div>
              {addr.isDefault && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  Utama
                </span>
              )}
            </div>
            
            <p className="text-xs text-foreground/80 mt-2">{addr.street}</p>
            {addr.note && <p className="text-[11px] text-muted-foreground mt-1">Catatan: {addr.note}</p>}
            
            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-dashed border-border/60">
              {!addr.isDefault && (
                <button 
                  onClick={() => setDefault(addr.id)}
                  className="flex-1 rounded-xl bg-surface py-2 text-xs font-bold text-foreground active:scale-95 transition-transform"
                >
                  Jadikan Utama
                </button>
              )}
              <button className="flex-1 rounded-xl bg-surface py-2 text-xs font-bold text-foreground active:scale-95 transition-transform">
                Ubah
              </button>
            </div>
          </div>
        ))}

        <button className="w-full rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-primary flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform mt-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Plus className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold">Tambah Alamat Baru</span>
        </button>
      </main>
    </div>
  );
}
