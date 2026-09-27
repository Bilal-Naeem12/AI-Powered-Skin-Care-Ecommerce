import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/Product";
import type { ShoppingCartItem } from "@/types/CartItem";
import { cartQuantity, productPrice, productStock } from "@/utils/product";
import { toast } from "react-toastify";

interface CartStore {
  cart: ShoppingCartItem[];
  addProductToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeProductFromCart: (productId: string, selectedVariant?: string) => void;
  updateProductQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartEmpty: () => boolean;
  isProductInCart: (productId: string) => boolean;
}
const matches = (item: ShoppingCartItem, id: string, variant?: string) =>
  item.product._id === id && item.selectedVariant === variant;

const useCartStore = create<CartStore>()(persist((set, get) => ({
  cart: [],
  addProductToCart: (product, quantity = 1, selectedVariant) => {
    selectedVariant ??= product.variants?.[0]?.size;
    const stock = productStock(product, selectedVariant);
    if (!Number.isFinite(product.price) || !cartQuantity(quantity, stock)) {
      toast.error("This product is unavailable."); return;
    }
    set(state => {
      const existing = state.cart.find(item => matches(item, product._id, selectedVariant));
      return { cart: existing ? state.cart.map(item => matches(item, product._id, selectedVariant)
        ? { product, selectedVariant, quantity: cartQuantity(item.quantity + quantity, stock) } : item)
        : [...state.cart, { product, selectedVariant, quantity: cartQuantity(quantity, stock) }] };
    });
    toast.success("Added to cart");
  },
  removeProductFromCart: (id, variant) => set(state => ({ cart: state.cart.filter(item => !matches(item, id, variant)) })),
  updateProductQuantity: (id, quantity, variant) => set(state => ({
    cart: state.cart.map(item => matches(item, id, variant)
      ? { ...item, quantity: cartQuantity(quantity, productStock(item.product, variant)) } : item)
      .filter(item => item.quantity > 0),
  })),
  clearCart: () => set({ cart: [] }),
  getTotalItems: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
  getTotalPrice: () => get().cart.reduce((sum, item) => sum + productPrice(item.product, item.selectedVariant) * item.quantity, 0),
  isCartEmpty: () => get().cart.length === 0,
  isProductInCart: id => get().cart.some(item => item.product._id === id),
}), {
  name: "cart-store",
  merge: (persisted, current) => {
    const saved = persisted as { cart?: ShoppingCartItem[] } | null;
    const cart = Array.isArray(saved?.cart) ? saved.cart.filter(item =>
      item?.product && typeof item.product._id === "string" && Number.isFinite(item.product.price)
      && Number.isFinite(item.quantity) && item.quantity > 0
    ).map(item => ({ ...item, quantity: cartQuantity(item.quantity, productStock(item.product, item.selectedVariant)) }))
      .filter(item => item.quantity > 0) : [];
    return { ...current, cart };
  },
}));
export default useCartStore;
