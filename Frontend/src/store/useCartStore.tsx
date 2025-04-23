import { create } from "zustand";
import { devtools } from "zustand/middleware"; // Import devtools middleware
import Product from "@/types/Product"; // Import the Product type from the correct path
import { CartItem } from "@/types/CartItem";
import { toast } from 'react-toastify'; // Make sure you have this import



// Define the store state type
interface CartStore {
  cart: CartItem[];
  addProductToCart: (product: Product, quantity?: number) => void;
  removeProductFromCart: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartEmpty: () => boolean;
}

const useCartStore = create<CartStore>()(
  devtools((set, get) => ({
    cart: [],

    // Add product to cart
    addProductToCart: (product, quantity = 1) => {
    
    
      set((state) => {
        // Check if the product already exists in the cart using the unique _id
        const existingProduct = state.cart.find(
          (item) => item.product._id === product._id
        )
       // Show toast notification (outside set to avoid duplicates)
       toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={product.images[0]} // Assuming product.image is the URL
            alt={product.name}
            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }}
          />
          <span><strong>{product.name}</strong><br/> added to cart!</span>
        </div>,
    
      );
        if (existingProduct) {
          // If the product exists, update the quantity
          return {
            cart: state.cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }

        // If the product doesn't exist, add it to the cart
        return {
          cart: [...state.cart, { product, quantity }],
        };
      });
    },

    // Remove product from cart
    removeProductFromCart: (productId) => {
      set((state) => ({
        cart: state.cart.filter((item) => item.product._id !== productId),
      }));
    },

    // Update product quantity in cart
    updateProductQuantity: (productId, quantity) => {
      set((state) => ({
        cart: state.cart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        ),
      }));
    },

    // Clear the cart
    clearCart: () => set({ cart: [] }),

    // Get total items in cart
    getTotalItems: () => {
      const cart = get().cart;
      return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Get total price
    getTotalPrice: () => {
      const cart = get().cart;
      return cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    },

    // Check if cart is empty
    isCartEmpty: () => {
      const cart = get().cart;
      return cart.length === 0;
    },
  }))
);

export default useCartStore;
