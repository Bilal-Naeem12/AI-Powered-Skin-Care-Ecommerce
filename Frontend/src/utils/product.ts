import type { Product } from "@/types/Product";

export function categoryName(category: Product["category"]): string {
  return category && typeof category === "object" && category.name ? category.name : "Uncategorized";
}

export function productPrice(product: Product, selectedVariant?: string): number {
  const variant = product.variants?.find(v => v.size === selectedVariant);
  const price = variant?.price ?? (product.discount?.percentage && Number.isFinite(product.discount.discountedPrice)
    ? product.discount.discountedPrice! : product.price);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

export function productStock(product: Product, selectedVariant?: string): number {
  const stock = product.variants?.find(v => v.size === selectedVariant)?.stock ?? product.stock;
  return product.isAvailable && Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
}

export function cartQuantity(quantity: number, stock: number): number {
  return Number.isFinite(quantity) && stock > 0 ? Math.min(stock, Math.max(1, Math.floor(quantity))) : 0;
}
