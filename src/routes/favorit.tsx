import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2, Plus, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { ProductSheet } from "@/components/shop/ProductSheet";
import { formatRp, type Product } from "@/lib/products";

export const Route = createFileRoute("/favorit")({
  component: FavoritPage,
  head: () => ({
    meta: [
      { title: "Favorit · Mama Shop" },
      { name: "description", content: "Daftar produk favorit yang Anda simpan." },
    ],
  }),
});

function FavoritPage() {
  const { items, remove } = useWishlist();
  const { add } = useCart();
  const [sel, setSel] = React.useState<Product | null>(null);

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="sticky top-0 z-30 glass border-b border-border/40 px-5 py-5">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Wishlist</p>
        <h1 className="text-2xl font-extrabold">Favorit Saya</h1>
        <p className="mt-1 text-xs text-muted-foreground">{items.length} produk tersimpan</p>
      </header>

      <main className="px-5 pt-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-card p-10 text-center shadow-card">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-spice/10">
              <Heart className="h-9 w-9 text-spice" />
            </div>
            <p className="mt-4 text-base font-bold">Belum ada favorit</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap ikon hati pada produk untuk menyimpan ke daftar favorit Anda.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-hero px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow"
            >
              <ShoppingBag className="h-4 w-4" /> Mulai Belanja
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex gap-3 rounded-[1.5rem] bg-surface/60 border border-border/50 p-3 shadow-card backdrop-blur-md transition-transform hover:scale-[1.02]"
              >
                <button onClick={() => setSel(p)} className="shrink-0 relative overflow-hidden rounded-[1.25rem]">
                  <img src={p.image} alt={p.name} className="h-28 w-28 object-cover transition-transform duration-500 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </button>
                <div className="flex flex-1 flex-col py-1">
                  <button onClick={() => setSel(p)} className="text-left">
                    <p className="line-clamp-2 text-[13px] font-extrabold leading-tight drop-shadow-sm">{p.name}</p>
                    <p className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{p.unit}</p>
                  </button>
                  <div className="mt-auto flex items-end justify-between">
                    <p className="text-[15px] font-black text-primary drop-shadow-sm">{formatRp(p.price)}</p>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => remove(p.id)}
                        aria-label="Hapus favorit"
                        className="grid h-9 w-9 place-items-center rounded-xl bg-card border border-border text-spice shadow-sm active:scale-90 transition-transform"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => add(p)}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow active:scale-90 transition-transform"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <ProductSheet product={sel} onClose={() => setSel(null)} />
    </div>
  );
}
