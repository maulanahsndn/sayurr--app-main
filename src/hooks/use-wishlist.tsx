import * as React from "react";
import type { Product } from "@/lib/products";

type WishlistCtx = {
  ids: string[];
  items: Product[];
  has: (id: string) => boolean;
  toggle: (p: Product) => void;
  remove: (id: string) => void;
  count: number;
};

const Ctx = React.createContext<WishlistCtx | null>(null);
const STORAGE = "mama-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Product[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); } catch {}
  }, [items]);

  const has = (id: string) => items.some((p) => p.id === id);
  const toggle = (p: Product) =>
    setItems((s) => (s.some((i) => i.id === p.id) ? s.filter((i) => i.id !== p.id) : [p, ...s]));
  const remove = (id: string) => setItems((s) => s.filter((i) => i.id !== id));

  return (
    <Ctx.Provider value={{ ids: items.map((p) => p.id), items, has, toggle, remove, count: items.length }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWishlist = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useWishlist must be inside WishlistProvider");
  return c;
};
