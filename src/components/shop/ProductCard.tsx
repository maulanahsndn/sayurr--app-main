import { Plus, Star, Heart } from "lucide-react";
import { formatRp, type Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

export function ProductCard({ product, onOpen }: { product: any; onOpen: (p: any) => void }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  
  const imageUrl = product.image_url || product.image;
  
  const fav = has(product.id);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <button
      onClick={() => onOpen(product)}
      className="pcard group relative flex w-full flex-col overflow-hidden rounded-[1.4rem] bg-card text-left shadow-card transition-all duration-300 active:scale-[0.97]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3.5] overflow-hidden bg-surface">
        <img
          src={imageUrl}
          alt={product.nama}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-105"
        />
        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-2 top-2 rounded-lg bg-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-foreground shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-2 bottom-2 rounded-lg bg-spice px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <span
          role="button"
          aria-label={fav ? "Hapus favorit" : "Tambah favorit"}
          onClick={(e) => { e.stopPropagation(); toggle(product); }}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/25 backdrop-blur-md border border-white/10 shadow-sm transition-all active:scale-90"
        >
          <Heart className={`h-3.5 w-3.5 ${fav ? "fill-spice text-spice" : "text-white"}`} />
        </span>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">Habis</span>
          </div>
        )}

        {/* Quick add — appears on bottom right of image */}
        {product.stock > 0 && (
          <span
            onClick={(e) => { e.stopPropagation(); add(product); }}
            role="button"
            aria-label="Tambah"
            className="absolute right-2 bottom-2 grid h-8 w-8 place-items-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow transition-all active:scale-90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 px-2.5 pb-2.5 pt-2">
        <h3 className="line-clamp-2 text-[12px] font-bold leading-tight">{product.nama}</h3>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Star className="h-2.5 w-2.5 fill-sun text-sun" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span>· {product.sold > 999 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
          <span className="ml-auto text-[9px] font-medium bg-surface rounded px-1 py-0.5">{product.unit}</span>
        </div>
        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          <p className="text-[14px] font-extrabold text-primary leading-none">{formatRp(product.price)}</p>
          {product.oldPrice && (
            <p className="text-[10px] text-muted-foreground line-through">{formatRp(product.oldPrice)}</p>
          )}
        </div>
      </div>
    </button>
  );
}
