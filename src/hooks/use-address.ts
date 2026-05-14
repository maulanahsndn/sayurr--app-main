import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  name: string;
  phone: string;
  street: string;
  note: string;
  isDefault?: boolean;
};

type AddressStore = {
  addresses: Address[];
  addAddress: (addr: Address) => void;
  updateAddress: (id: string, addr: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => Address | undefined;
};

export const useAddress = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [
        {
          id: "default-1",
          name: "Mama Ceria",
          phone: "08123456789",
          street: "Jl. Mawar Merah No. 12, RT 01/RW 02, Kec. Cilandak",
          note: "Pagar warna hijau",
          isDefault: true,
        }
      ],
      addAddress: (addr) => set((state) => {
        const newAddrs = [...state.addresses];
        if (newAddrs.length === 0 || addr.isDefault) {
          newAddrs.forEach(a => a.isDefault = false);
          addr.isDefault = true;
        }
        return { addresses: [...newAddrs, addr] };
      }),
      updateAddress: (id, addr) => set((state) => ({
        addresses: state.addresses.map(a => a.id === id ? { ...a, ...addr } : a)
      })),
      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter(a => a.id !== id)
      })),
      setDefault: (id) => set((state) => ({
        addresses: state.addresses.map(a => ({ ...a, isDefault: a.id === id }))
      })),
      getDefault: () => get().addresses.find(a => a.isDefault) || get().addresses[0],
    }),
    {
      name: "mama-shop-address",
    }
  )
);
