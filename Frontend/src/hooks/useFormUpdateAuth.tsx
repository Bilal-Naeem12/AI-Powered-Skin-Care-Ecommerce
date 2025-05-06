// src/hooks/useFormUpdateAuth.tsx
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/store/useUserStore';

export function useFormUpdateAuth(apiUrl: string, onSuccess?: () => void) {
  const navigate = useNavigate();
  const { logout, setUser } = useUserStore();

  return async <T,>(values: T): Promise<void> => {
    try {
      const { data } = await axios.put(apiUrl, values, {
        withCredentials: true,
      });

      toast.success('Profile updated');
      setUser(data.user);
      onSuccess?.();
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logout();
        navigate('/');
      }
      toast.error(err.response?.data?.message ?? 'Update failed, try again.');
    }
  };
}
