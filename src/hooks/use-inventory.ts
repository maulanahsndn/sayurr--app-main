import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products, type Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

export type InventoryItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  stock: number; 
  isVisible: boolean;
  image?: string;
};

type InventoryStore = {
  items: Record<string, InventoryItem>;
  customProducts: Product[];
  isLoading: boolean;
  isCloudConnected: boolean;
  
  // Actions
  fetchFromCloud: () => Promise<void>;
  updateProduct: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  toggleStock: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  
  // Helpers
  getEffectiveProduct: (p: Product) => Product;
  getAllProducts: () => Product[];
};

export const useInventory = create<InventoryStore>()(
  persist(
    (set, get) => ({
      items: {},
      customProducts: [],
      isLoading: false,
      isCloudConnected: true,

      fetchFromCloud: async () => {
        set({ isLoading: true });
        try {
          // 1. Fetch Overrides
          const { data: cloudItems, error: err1 } = await supabase
            .from('inventory_items')
            .select('*');
          
          if (!err1 && cloudItems) {
            const newItems: Record<string, InventoryItem> = {};
            cloudItems.forEach(item => {
              newItems[item.productId] = {
                productId: item.productId,
                name: item.name,
                price: item.price,
                unit: item.unit,
                stock: item.stock,
                isVisible: item.isVisible,
                image: item.image
              };
            });
            set({ items: newItems });
          }

          // 2. Fetch Custom Products
          const { data: cloudProducts, error: err2 } = await supabase
            .from('custom_products')
            .select('*');
          
          if (!err2 && cloudProducts) {
            set({ customProducts: cloudProducts });
          }
        } catch (e) {
          console.error("Fetch failed", e);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProduct: async (id, data) => {
        // Optimistic Local Update
        set((state) => {
          const base = products.find(p => p.id === id) || state.customProducts.find(p => p.id === id);
          const current = state.items[id] || { 
            productId: id, 
            name: base?.name || "",
            price: base?.price || 0,
            unit: base?.unit || "",
            stock: 1, 
            isVisible: true 
          };
          return { items: { ...state.items, [id]: { ...current, ...data } } };
        });

        // Push to Supabase - Match SQL Exactly
        const updated = get().items[id];
        const { error } = await supabase.from('inventory_items').upsert({
          productId: id, // Matching the SQL column name
          name: updated.name,
          price: updated.price,
          unit: updated.unit,
          stock: updated.stock,
          isVisible: updated.isVisible,
          image: updated.image
        });
        
        if (error) console.error("Cloud Sync Error:", error);
      },

      addProduct: async (product) => {
        set((state) => ({ customProducts: [product, ...state.customProducts] }));
        await supabase.from('custom_products').upsert(product);
      },

      toggleStock: async (id) => {
        const current = get().items[id];
        const newStock = current?.stock === 0 ? 1 : 0;
        await get().updateProduct(id, { stock: newStock });
      },

      toggleVisibility: async (id) => {
        const current = get().items[id];
        const newVis = current?.isVisible === false ? true : false;
        await get().updateProduct(id, { isVisible: newVis });
      },

      getEffectiveProduct: (p) => {
        const custom = get().items[p.id];
        if (!custom) return p;
        return {
          ...p,
          name: custom.name || p.name,
          price: custom.price || p.price,
          unit: custom.unit || p.unit,
          inStock: custom.stock === 1,
          image: custom.image || p.image,
        };
      },

      getAllProducts: () => {
        const state = get();
        const allBase = [...products, ...state.customProducts];
        return allBase.map(p => state.getEffectiveProduct(p));
      }
    }),
    {
      name: "mpok-inventory-cloud-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
