import { create } from "zustand";
import { addCartItem, getCart, removeCartItem, updateCartItem, type StoreApiCart } from "../api/storeApi";

interface CartState {
  cart: StoreApiCart | null;
  loading: boolean;
  error: string | null;
  loadCart: () => Promise<void>;
  addToCart: (productId: number, customization: Record<string, string>, attachmentTokens?: string[]) => Promise<void>;
  removeFromCart: (key: string) => Promise<void>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,
  error: null,
  async loadCart() {
    set({ loading: true, error: null });
    try { set({ cart: await getCart() }); }
    catch (reason) { set({ error: reason instanceof Error ? reason.message : "Errore durante il caricamento del carrello." }); }
    finally { set({ loading: false }); }
  },
  async addToCart(productId, customization, attachmentTokens = []) {
    set({ loading: true, error: null });
    try { set({ cart: await addCartItem(productId, customization, attachmentTokens) }); }
    catch (reason) { set({ error: reason instanceof Error ? reason.message : "Non è stato possibile aggiungere il prodotto." }); throw reason; }
    finally { set({ loading: false }); }
  },
  async removeFromCart(key) {
    set({ loading: true, error: null });
    try { set({ cart: await removeCartItem(key) }); }
    catch (reason) { set({ error: reason instanceof Error ? reason.message : "Non è stato possibile rimuovere il prodotto." }); }
    finally { set({ loading: false }); }
  },
  async updateQuantity(key, quantity) {
    set({ loading: true, error: null });
    try { set({ cart: quantity > 0 ? await updateCartItem(key, quantity) : await removeCartItem(key) }); }
    catch (reason) { set({ error: reason instanceof Error ? reason.message : "Non è stato possibile aggiornare la quantità." }); }
    finally { set({ loading: false }); }
  },
}));
