import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (item) => {
    const current = get().cart;
    const itemId = item.id || item._id;
    const exists = current.find((i) => (i.id || i._id) === itemId);
    if (!exists) {
      set({ cart: [...current, item] });
    }
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cart: state.cart.filter((i) => (i.id || i._id) !== itemId)
    }));
  },

  clearCart: () => set({ cart: [] }),

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => sum + (item.price || 0), 0);
  }
}));
