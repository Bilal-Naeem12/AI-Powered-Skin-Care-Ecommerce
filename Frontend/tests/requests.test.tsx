import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import useFetchData from '@/hooks/useFetchData';
import usePostAuthData from '@/hooks/usePostAuthData';
vi.mock('axios', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
vi.mock('@/store/UserStore', () => ({ default: () => ({ logout: vi.fn() }) }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
afterEach(cleanup);
it('does not let an obsolete response replace the new route response', async () => {
  let first!: (value: unknown) => void;
  vi.mocked(axios.get).mockImplementationOnce(() => new Promise(resolve => { first = resolve; })).mockResolvedValueOnce({ data: 'new' });
  const { result, rerender } = renderHook(({ url }) => useFetchData<string>(url), { initialProps: { url: '/first' } });
  rerender({ url: '/second' });
  await waitFor(() => expect(result.current.data).toBe('new'));
  await act(async () => first({ data: 'old' }));
  expect(result.current.data).toBe('new');
});
it('clears the previous error when a later request succeeds', async () => {
  vi.mocked(axios.get).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: 'ok' });
  const { result, rerender } = renderHook(({ url }) => useFetchData<string>(url), { initialProps: { url: '/first' } });
  await waitFor(() => expect(result.current.error).toBeTruthy());
  rerender({ url: '/second' });
  await waitFor(() => expect(result.current.data).toBe('ok'));
  expect(result.current.error).toBeNull();
});
it('returns explicit failure so order/review callers cannot continue as success', async () => {
  vi.mocked(axios.post).mockRejectedValueOnce(new Error('offline'));
  const { result } = renderHook(() => usePostAuthData(), { wrapper: ({ children }: React.PropsWithChildren) => <MemoryRouter>{children}</MemoryRouter> });
  let response;
  await act(async () => { response = await result.current.postData('/orders', {}); });
  expect(response).toEqual({ ok: false });
  expect(result.current.loading).toBe(false);
});
