import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some(item => item.id === product.id);

        if (exists) {
          set({ items: items.filter(item => item.id !== product.id) });
          toast.success('Removed from wishlist');
        } else {
          set({ items: [...items, product] });
          toast.success('Added to wishlist ♥');
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      }
    }),
    {
      name: 'freshmart-wishlist-storage',
    }
  )
);
