import * as React from "react";
import { X, Minus, Plus, Star, Truck, ShieldCheck, Heart, Coins, ChevronDown } from "lucide-react";
import { formatRp, type Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export function ProductSheet({ product, onClose }: { product: any; onClose: () => void }) {
  const { add, setOpen } = useCart();
  const { has, toggle } = useWishlist();
  
  const imageUrl = product?.image_url || product?.image;
  const description = product?.description || product?.desc;
  
  const [qty, setQty] = React.useState(1);
  const [isNominal, setIsNominal] = React.useState(false);
  const [nominalValue, setNominalValue] = React.useState("");
  const fav = product ? has(product.id) : false;

  React.useEffect(() => {
    if (product) {
      setQty(1);
      setIsNominal(false);
      setNominalValue("");
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    if (isNominal && nominalValue) {
      const num = parseInt(nominalValue.replace(/\D/g, ""));
      if (num > 0) {
        add({
          ...product!,
          id: `${product!.id}-nom-${num}`,
          price: num,
          unit: "Eceran",
          nama: `${product!.nama} (Beli Rp ${num.toLocaleString("id-ID")})`
        }, 1);
      }
    } else {
      add(product!, qty);
    }
    onClose();
    setTimeout(() => setOpen(true), 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2.5rem] bg-card shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-out sm:rounded-3xl border border-white/10">
        
        {/* ── IMMERSIVE HERO IMAGE ── */}
        <div className="relative h-[40vh] w-full overflow-hidden bg-surface shrink-0">
          <img 
            src={imageUrl} 
            alt={product.nama} 
            className="h-full w-full object-cover transition-transform duration-[2s] scale-105 hover:scale-110" 
          />
          {/* Top Gradient for icons */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent" />
          {/* Bottom Gradient blending to background */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />

          {/* Floating Actions */}
          <div className="absolute inset-x-0 top-0 flex justify-between p-5">
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white transition-transform active:scale-90 shadow-soft"
              aria-label="Tutup"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            <button
              onClick={() => product && toggle(product)}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white transition-transform active:scale-90 shadow-soft"
              aria-label="Favorit"
            >
              <Heart className={`h-5 w-5 transition-colors ${fav ? "fill-spice text-spice" : "text-white"}`} />
            </button>
          </div>
          
          {/* Pill indicator */}
          <div className="absolute top-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/30 backdrop-blur-md" />
        </div>

        {/* ── CONTENT BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2 no-scrollbar">
          <div className="flex items-center justify-between">
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-accent/15 border border-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                ✨ {product.badge}
              </span>
            )}
          </div>
          
          <h2 className="mt-3 text-3xl font-black leading-none tracking-tight text-foreground drop-shadow-sm">
            {product.nama}
          </h2>

          <div className="mt-3 flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-surface-2 px-2.5 py-1 rounded-full">
              <Star className="h-4 w-4 fill-sun text-sun" />
              <b className="text-foreground">{product.rating}</b>
            </span>
            <span className="bg-surface-2 px-2.5 py-1 rounded-full">{product.sold} terjual</span>
            <span className="bg-surface-2 px-2.5 py-1 rounded-full">{product.unit}</span>
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            <p className="text-4xl font-black text-primary drop-shadow-sm">{formatRp(product.price)}</p>
            {product.oldPrice && (
              <p className="text-sm font-semibold text-muted-foreground line-through decoration-destructive/50">{formatRp(product.oldPrice)}</p>
            )}
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground/90 font-medium">
            {description}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: "Pengiriman", val: "Sameday" },
              { icon: ShieldCheck, label: "Jaminan", val: "Fresh 100%" },
              { icon: Coins, label: "Stok", val: `${product.stock} Tersedia` },
            ].map((f) => (
              <div key={f.label} className="rounded-[1.25rem] bg-surface/80 border border-border/50 p-3 text-center transition-transform hover:scale-105">
                <f.icon className="mx-auto mb-1.5 h-5 w-5 text-primary drop-shadow-sm" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{f.label}</p>
                <p className="mt-0.5 text-xs font-bold text-foreground">{f.val}</p>
              </div>
            ))}
          </div>

          {product.allowNominal && (
            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-primary/20 bg-primary/5 p-4 relative">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-primary">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Beli Eceran</p>
                    <p className="text-[11px] font-medium text-muted-foreground">Pesan nominal suka-suka</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNominal(!isNominal)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${isNominal ? "bg-primary" : "bg-surface-2 border border-border"}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isNominal ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── CINEMATIC STICKY FOOTER ── */}
        <div className="border-t border-white/5 bg-card/80 px-5 py-4 backdrop-blur-2xl pb-safe">
          {isNominal ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-muted-foreground">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="5.000"
                  value={nominalValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setNominalValue(val ? parseInt(val).toLocaleString("id-ID") : "");
                  }}
                  className="w-full rounded-[1.25rem] bg-surface/80 py-4 pl-10 pr-4 text-sm font-extrabold text-foreground outline-none border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!nominalValue}
                className="rounded-[1.25rem] bg-gradient-hero px-7 py-4 text-sm font-extrabold text-primary-foreground shadow-glow transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Tambah
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-[1.25rem] bg-surface/80 p-1.5 border border-border/50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-card shadow-sm active:scale-90 transition-transform"
                >
                  <Minus className="h-5 w-5 text-foreground/80" />
                </button>
                <span className="w-8 text-center text-base font-black tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow active:scale-90 transition-transform"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-[1.25rem] bg-gradient-hero py-4 text-[15px] font-black tracking-wide text-primary-foreground shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Tambah</span>
                <span className="text-primary-foreground/50 font-normal">|</span>
                <span>{formatRp(product.price * qty)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
