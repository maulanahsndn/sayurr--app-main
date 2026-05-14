import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatRp } from "@/lib/products";
import { useInventory } from "@/hooks/use-inventory";

export function CartSheet() {
  const { items: rawItems, open, setOpen, setQty, remove, total: rawTotal, count } = useCart();
  const { getEffectiveProduct } = useInventory();

  // Re-calculate based on latest local inventory prices
  const items = rawItems.map(it => ({
    ...it,
    product: getEffectiveProduct(it.product)
  }));

  const total = items.reduce((a, i) => a + i.qty * i.product.price, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in" onClick={() => setOpen(false)} />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2.5rem] bg-card shadow-glow animate-in slide-in-from-bottom-8 sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="text-lg font-bold">Keranjang Belanja</h3>
            <p className="text-xs text-muted-foreground">{count} item siap dikirim</p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-surface" aria-label="Tutup">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-surface">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-semibold">Keranjang masih kosong</p>
              <p className="text-xs text-muted-foreground">Yuk pilih sayur & bumbu segar hari ini.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 rounded-2xl bg-surface p-3">
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-semibold leading-tight">{product.name}</p>
                    <p className="text-[11px] text-muted-foreground">{product.unit}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-sm font-bold text-primary">{formatRp(product.price * qty)}</p>
                      <div className="flex items-center gap-2 rounded-full bg-card p-1 shadow-soft">
                        <button onClick={() => setQty(product.id, qty - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-surface">
                          {qty === 1 ? <Trash2 className="h-3.5 w-3.5 text-spice" /> : <Minus className="h-3.5 w-3.5" />}
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-gradient-hero text-primary-foreground">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border bg-card/95 px-5 py-4 backdrop-blur">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="text-xl font-extrabold text-primary">{formatRp(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full rounded-full bg-gradient-hero py-3.5 text-center text-sm font-bold text-primary-foreground shadow-glow active:scale-[0.98]"
            >
              Checkout Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
