import {Product} from "./Product";

// Define the CartItem type
export interface CartItem {
    productId: Product;
    quantity: number;
  selectedVariant?: string;
  priceAtTimeOfOrder:number;
  }