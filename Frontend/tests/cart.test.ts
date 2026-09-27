import { beforeEach, describe, expect, it, vi } from 'vitest';
import useCartStore from '@/store/CartStore';
import { categoryName, productPrice } from '@/utils/product';
import type { Product } from '@/types/Product';
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
const product: Product = { _id: 'p1', name: 'Serum', description: '', category: null, brand: '', price: 100, stock: 3, isAvailable: true, images: [], discount: { percentage: 20, discountedPrice: 80 } };
beforeEach(() => useCartStore.getState().clearCart());
describe('cart validation and price', () => {
  it('uses fallback category for null and unpopulated relations', () => {
    expect(categoryName(null)).toBe('Uncategorized');
    expect(categoryName('category-id')).toBe('Uncategorized');
  });
  it('uses discounted price in totals', () => {
    useCartStore.getState().addProductToCart(product, 2);
    expect(useCartStore.getState().getTotalPrice()).toBe(160);
  });
  it('caps quantity to stock and rejects nonfinite additions', () => {
    useCartStore.getState().addProductToCart(product, Infinity);
    expect(useCartStore.getState().cart).toHaveLength(0);
    useCartStore.getState().addProductToCart(product, 20);
    expect(useCartStore.getState().cart[0].quantity).toBe(3);
  });
  it('keeps variants separate with their own prices and quantities', () => {
    const p = { ...product, variants: [{ size: 'small', stock: 1, price: 50 }, { size: 'large', stock: 2, price: 120 }] };
    useCartStore.getState().addProductToCart(p, 1, 'small');
    useCartStore.getState().addProductToCart(p, 2, 'large');
    expect(useCartStore.getState().cart).toHaveLength(2);
    expect(useCartStore.getState().getTotalPrice()).toBe(290);
    useCartStore.getState().removeProductFromCart('p1', 'small');
    expect(useCartStore.getState().cart[0].selectedVariant).toBe('large');
  });
  it('does not treat zero discounted price as absent', () => {
    expect(productPrice({ ...product, discount: { percentage: 100, discountedPrice: 0 } })).toBe(0);
  });
  it('rejects unavailable items', () => {
    useCartStore.getState().addProductToCart({ ...product, stock: 0 });
    expect(useCartStore.getState().cart).toHaveLength(0);
  });
});
