import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

type NavItem = {
  to?: string;
  icon: typeof Home;
  label: string;
  badge?: number;
  action?: () => void;
};

export function BottomNav() {
  const { count, setOpen } = useCart();
  const { count: favCount } = useWishlist();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const items: NavItem[] = [
    { to: "/", icon: Home, label: "Beranda" },
    { to: "/cari", icon: Search, label: "Cari" },
    { icon: ShoppingBag, label: "Keranjang", badge: count, action: () => setOpen(true) },
    { to: "/favorit", icon: Heart, label: "Favorit", badge: favCount },
    { to: "/akun", icon: User, label: "Akun" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
      <div className="bnav mx-auto flex max-w-md items-center justify-between rounded-2xl px-1.5 py-1.5 pointer-events-auto">
        {items.map((it) => {
          const active = it.to ? (it.to === "/" ? path === "/" : path.startsWith(it.to)) : false;
          const base = "relative flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[9px] font-semibold transition-all duration-300";
          const cls = `${base} ${active ? "text-primary" : "text-muted-foreground"}`;

          const inner = (
            <>
              <span className={`grid h-8 w-8 place-items-center rounded-xl transition-all duration-300 ${
                active ? "bg-gradient-hero text-primary-foreground shadow-glow scale-110" : "text-inherit"
              }`}>
                <it.icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              </span>
              <span className={`transition-all duration-300 ${active ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0.5"}`}>
                {it.label}
              </span>
              {it.badge ? (
                <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-spice px-1 text-[8px] font-extrabold text-white shadow-sm ring-2 ring-background">
                  {it.badge}
                </span>
              ) : null}
            </>
          );

          return it.to ? (
            <Link key={it.label} to={it.to} className={cls}>{inner}</Link>
          ) : (
            <button key={it.label} onClick={it.action} className={cls}>{inner}</button>
          );
        })}
      </div>

      <style>{`
        .bnav {
          background: rgba(var(--card-rgb, 255 255 255) / 0.75);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow:
            0 -2px 20px rgba(0,0,0,0.06),
            0 8px 32px rgba(0,0,0,0.1);
        }
      `}</style>
    </nav>
  );
}
