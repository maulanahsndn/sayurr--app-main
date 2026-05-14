import * as React from "react";
import type { Product } from "@/lib/products";

type CartItem = { product: Product; qty: number };
type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = React.createContext<CartCtx | null>(null);

const STORAGE = "mama-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p: Product, qty = 1) =>
    setItems((s) => {
      const e = s.find((i) => i.product.id === p.id);
      if (e) return s.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...s, { product: p, qty }];
    });
  const remove = (id: string) => setItems((s) => s.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((s) => (qty <= 0 ? s.filter((i) => i.product.id !== id) : s.map((i) => (i.product.id === id ? { ...i, qty } : i))));
  const clear = () => setItems([]);

  const total = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  const count = items.reduce((a, i) => a + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count, open, setOpen }}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
};
