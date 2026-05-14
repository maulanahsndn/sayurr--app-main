import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Package, Clock, CheckCircle2, Truck } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import { useCart } from "@/hooks/use-cart";
import { formatRp } from "@/lib/products";

export const Route = createFileRoute("/pesanan")({
  component: PesananPage,
  head: () => ({
    meta: [
      { title: "Riwayat Pesanan · Mama Shop" },
      { name: "description", content: "Daftar riwayat pesanan Anda." },
    ],
  }),
});

function PesananPage() {
  const { orders } = useOrders();
  const { add, setOpen } = useCart();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link to="/akun" className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft" aria-label="Kembali">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-extrabold leading-tight">Riwayat Pesanan</h1>
        </div>
      </header>

      <main className="px-5 pt-5 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-card mt-10">
            <Package className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-base font-bold">Belum ada pesanan</p>
            <p className="mt-1 text-xs text-muted-foreground">Yuk, mulai belanja sekarang!</p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-full bg-gradient-hero px-6 py-3 text-xs font-bold text-primary-foreground shadow-glow"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = order.status === "Selesai" ? CheckCircle2 : order.status === "Dikirim" ? Truck : Clock;
            const statusColor = order.status === "Selesai" ? "text-fresh bg-fresh/10" : order.status === "Dikirim" ? "text-primary bg-primary/10" : "text-spice bg-spice/10";
            
            return (
              <div key={order.id} className="rounded-3xl bg-card p-4 shadow-card">
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                      <StatusIcon className="h-3 w-3" />
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                
                <div className="space-y-3">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-semibold">{item.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.qty} × {formatRp(item.product.price)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-[11px] text-muted-foreground">+{order.items.length - 2} produk lainnya</p>
                  )}
                </div>
                
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-dashed border-border/60">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Belanja</p>
                      <p className="text-sm font-extrabold text-primary">{formatRp(order.grandTotal)}</p>
                    </div>
                    <button 
                      onClick={() => {
                        order.items.forEach(item => {
                          add(item.product, item.qty);
                        });
                        setOpen(true);
                      }}
                      className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary active:scale-95 transition-transform">
                      Beli Lagi
                    </button>
                  </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
