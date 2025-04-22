import Product from "./Product";

// Define the CartItem type
export interface CartItem {
    product: Product;
    quantity: number;
  }