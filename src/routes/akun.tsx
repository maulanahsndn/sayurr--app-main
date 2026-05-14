import { createFileRoute, Link } from "@tanstack/react-router";
import { User, MapPin, ShoppingBag, Heart, CreditCard, Bell, ChevronRight, HeadphonesIcon } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

export const Route = createFileRoute("/akun")({
  component: AkunPage,
  head: () => ({
    meta: [
      { title: "Akun Saya · Mama Shop" },
      { name: "description", content: "Profil, alamat, pesanan, dan pengaturan akun Anda." },
    ],
  }),
});

function AkunPage() {
  const { count: favCount } = useWishlist();
  const { count: cartCount } = useCart();

  const groups: { title: string; items: { icon: typeof User; label: string; sub?: string; to?: string; action?: () => void; badge?: number }[] }[] = [
    {
      title: "Belanja",
      items: [
        { icon: ShoppingBag, label: "Keranjang", sub: `${cartCount} item siap checkout`, to: "/checkout", badge: cartCount },
        { icon: Heart, label: "Favorit", sub: "Produk tersimpan", to: "/favorit", badge: favCount },
        { icon: MapPin, label: "Alamat Pengiriman", sub: "Atur lokasi antar utama", to: "/alamat" },
      ],
    },
    {
      title: "Akun & Pembayaran",
      items: [
        { icon: CreditCard, label: "Metode Pembayaran", sub: "Preferensi bayar (COD, Transfer)" },
        { icon: Bell, label: "Notifikasi", sub: "Promo & status pesanan", to: "/notifikasi" },
      ],
    },
    {
      title: "Bantuan",
      items: [
        { icon: HeadphonesIcon, label: "Pusat Bantuan", sub: "Tanya Mpok Ris" },
      ],
    },
  ];

  return (
    <div className="mx-auto min-h-screen w-full max-w-md pb-32">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-hero px-5 pb-8 pt-8 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 text-2xl font-extrabold backdrop-blur">
            MS
          </div>
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-wider opacity-80">Pelanggan Setia</p>
            <h1 className="text-xl font-extrabold leading-tight">Bunda Warga Parakan</h1>
            <p className="text-xs opacity-90">+62 812-•••-1234</p>
          </div>
        </div>
        <Link to="/pesanan" className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-3 text-center backdrop-blur hover:bg-white/20 transition-colors">
          <div>
            <p className="text-lg font-extrabold">12</p>
            <p className="text-[10px] uppercase tracking-wider opacity-80">Pesanan</p>
          </div>
          <div className="border-x border-white/15">
            <p className="text-lg font-extrabold">{favCount}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-80">Favorit</p>
          </div>
          <div>
            <p className="text-lg font-extrabold">2.4k</p>
            <p className="text-[10px] uppercase tracking-wider opacity-80">Poin</p>
          </div>
        </Link>
      </header>

      <main className="px-5 pt-6">
        {groups.map((g) => (
          <section key={g.title} className="mb-6">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.title}</p>
            <ul className="overflow-hidden rounded-3xl bg-card shadow-card">
              {g.items.map((it, idx) => {
                const inner = (
                  <div className={`flex items-center gap-3 px-4 py-3.5 ${idx > 0 ? "border-t border-border/60" : ""}`}>
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface text-primary">
                      <it.icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{it.label}</p>
                      {it.sub && <p className="text-[11px] text-muted-foreground">{it.sub}</p>}
                    </div>
                    {it.badge ? (
                      <span className="rounded-full bg-spice px-2 py-0.5 text-[10px] font-bold text-white">{it.badge}</span>
                    ) : null}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
                return (
                  <li key={it.label}>
                    {it.to ? <Link to={it.to}>{inner}</Link> : <button className="w-full text-left">{inner}</button>}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <p className="pb-4 text-center text-[10px] text-muted-foreground">Mama Shop · v2026.05</p>
      </main>
    </div>
  );
}
