import { create } from "zustand";

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image?: string;
  permalink: string;
  quantity: number;
}

interface CartState {
  items: CartProduct[];
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product) => set((state) => {
    const existing = state.items.find((p) => p.id === product.id);
    if (existing) {
      return {
        items: state.items.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        ),
      };
    }
    return {
      items: [...state.items, { ...product, quantity: 1 }],
    };
  }),
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((p) => p.id !== id),
  })),
  clearCart: () => set({ items: [] }),
}));
