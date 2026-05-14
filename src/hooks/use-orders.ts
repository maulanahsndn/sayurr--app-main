import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

export type OrderStatus = "Diproses" | "Dikirim" | "Selesai";

export type OrderItem = {
  product: Product;
  qty: number;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  serviceFee: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
};

type OrdersStore = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

export const useOrders = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: "mama-shop-orders",
    }
  )
);
