import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product } from "@/types/Product";
import { CartItem } from "@/types/CartItem";
import { toast } from 'react-toastify';

interface CartStore {
  cart: CartItem[];
  addProductToCart: (product: Product, quantity?: number) => void;
  removeProductFromCart: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartEmpty: () => boolean;
  isProductInCart: (productId: string) => boolean;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addProductToCart: (product, quantity = 1) => {
          set((state: any) => {
            const existingProduct = state.cart.find(
              (item: any) => item.product._id === product._id
            );

            toast.success(
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }}
                />
                <span><strong>{product.name}</strong><br /> added to cart!</span>
              </div>,
            );

            if (existingProduct) {
              return {
                cart: state.cart.map((item: any) =>
                  item.product._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }

            return {
              cart: [...state.cart, { product, quantity }],
            };
          });
        },

        removeProductFromCart: (productId) => {
          set((state) => ({
            cart: state.cart.filter((item: any) => item.product._id !== productId),
          }));
        },

        updateProductQuantity: (productId, quantity) => {
          set((state) => ({
            cart: state.cart.map((item: any) =>
              item.product._id === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            ),
          }));
        },

        clearCart: () => set({ cart: [] }),

        getTotalItems: () => {
          const cart = get().cart;
          return cart.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice: () => {
          const cart = get().cart;
          return cart.reduce(
            (total, item: any) => total + item.product.price * item.quantity,
            0
          );
        },

        isCartEmpty: () => {
          return get().cart.length === 0;
        },

        isProductInCart: (productId) => {
          return get().cart.some((item: any) => item.product._id === productId);
        },
      }),
      {
        name: "cart-store", // 👈 localStorage key
      }
    )
  )
);

export default useCartStore;
