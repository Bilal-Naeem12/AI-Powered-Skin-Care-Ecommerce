import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductInfo from '@/pages/user-side/ProductDetailPage/ProductInfo';
import type { Product } from '@/types/Product';

const response = vi.hoisted(() => ({ data: null as Product | null, loading: false, error: null as string | null }));
vi.mock('@/hooks/useFetchData', () => ({ default: () => response }));
vi.mock('@/component/UI/ReviewSection', () => ({ default: () => null }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
afterEach(cleanup);
it('renders a product with missing category and images without crashing', () => {
  response.data = { _id: 'p1', name: 'Serum', price: 100, stock: 1, isAvailable: true, category: null } as Product;
  render(<MemoryRouter><ProductInfo /></MemoryRouter>);
  expect(screen.getByText('Category: Uncategorized')).toBeTruthy();
  expect(screen.getByText('Created: Not available')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeTruthy();
});
it('shows an error without rendering purchase controls', () => {
  response.data = null; response.error = 'Failed to fetch data.';
  render(<MemoryRouter><ProductInfo /></MemoryRouter>);
  expect(screen.getByRole('alert').textContent).toContain('Failed to fetch');
  expect(screen.queryByRole('button', { name: 'Add to Cart' })).toBeNull();
  response.error = null;
});
