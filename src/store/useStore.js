import { create } from "zustand";

export const useStore = create((set) => ({
  cartCount: 0,

  setCartCount: (count) => {
    set({ cartCount: count });
  },
}));
