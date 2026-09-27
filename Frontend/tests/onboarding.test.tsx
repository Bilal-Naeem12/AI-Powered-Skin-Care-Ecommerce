import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import OnboardingModal from '@/component/UI/OnboardingModal';

const state = vi.hoisted(() => ({ user: { _id: 'user-1', walkThroughCompleted: false }, setUser: vi.fn() }));
vi.mock('@/store/UserStore', () => ({ default: () => state }));
vi.mock('axios', () => ({ default: { patch: vi.fn(), post: vi.fn() } }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/component/UI/FaceScanner', () => ({ default: () => null }));
vi.mock('@/component/UI/ProfilePicUploader', () => ({ default: () => null }));
vi.mock('@/component/comboboxes/IngredientSelect', () => ({ default: () => null }));
vi.mock('@/component/UI/UniversalCapture', () => ({ default: ({ onCapture, onContinue }: { onCapture: (s: string) => void; onContinue: () => void }) =>
  <><button onClick={() => onCapture('data:image/jpeg;base64,AA==')}>Capture</button><button onClick={onContinue}>Use photo</button></> }));
vi.mock('framer-motion', () => ({ AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>, motion: { div: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => <div className={className}>{children}</div> } }));

beforeEach(() => {
  localStorage.clear();
  vi.mocked(axios.patch).mockReset();
  vi.mocked(axios.patch).mockResolvedValue({ data: { user: { _id: 'user-1', walkThroughCompleted: true } } });
});
afterEach(cleanup);

async function reachFinish() {
  render(<OnboardingModal />);
  fireEvent.click(screen.getByText(/Get Started/));
  fireEvent.click(screen.getByText('Skip this step'));
  fireEvent.click(screen.getByText('Continue'));
}

describe('optional onboarding capture', () => {
  it('completes without uploading a face when skipped', async () => {
    await reachFinish();
    fireEvent.click(screen.getByText('Finish'));
    await waitFor(() => expect(state.setUser).toHaveBeenCalled());
    expect(axios.post).not.toHaveBeenCalled();
    expect(axios.patch).toHaveBeenCalledWith(expect.stringContaining('/users/user-1/walkthrough'), expect.objectContaining({ walkThroughCompleted: true }), expect.anything());
  });
  it('keeps completion retryable after failure', async () => {
    vi.mocked(axios.patch).mockRejectedValueOnce(new Error('offline'));
    await reachFinish();
    fireEvent.click(screen.getByText('Finish'));
    await waitFor(() => expect((screen.getByText('Finish') as HTMLButtonElement).disabled).toBe(false));
    expect(state.setUser).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Finish'));
    await waitFor(() => expect(state.setUser).toHaveBeenCalledTimes(1));
  });
  it('blocks duplicate completion requests', async () => {
    vi.mocked(axios.patch).mockImplementation(() => new Promise(() => {}));
    await reachFinish();
    const button = screen.getByText('Finish');
    fireEvent.click(button); fireEvent.click(button);
    expect(axios.patch).toHaveBeenCalledTimes(1);
  });
  it('restores prior body scrolling after unmount', () => {
    document.body.style.overflow = 'auto';
    const view = render(<OnboardingModal />);
    expect(document.body.style.overflow).toBe('hidden');
    view.unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
