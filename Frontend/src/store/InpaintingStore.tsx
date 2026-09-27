// src/stores/useInpaintingStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";

// shape of the inpainting API response
export interface InpaintingResult {
  labeled_image: string;         // base64 of detection overlay
  inpainted_image: string | null; // base64 of the cleaned image
}

interface InpaintingState {
  result: InpaintingResult | null;
  loading: boolean;
  error: string | null;

  // call this to start inpainting (always uses 'acne' model)
  inpaint: (file: File) => Promise<void>;
  clear: () => void;
}

const useInpaintingStore = create<InpaintingState>()(
  devtools(
    persist(
      (set) => ({
        result: null,
        loading: false,
        error: null,

        inpaint: async (file: File) => {
          set({ loading: true, error: null, result: null });
          const formData = new FormData();
          formData.append("file", file);
          formData.append("model_type", "acne"); // fixed

          try {
            const resp = await axios.post<InpaintingResult>(
              `${import.meta.env.VITE_API_FASTAPI}/inpainting/inpaint`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            set({ result: resp.data });
            toast.success("Inpainting complete!");
          } catch (e: any) {
            const msg = e.response?.data?.detail || e.message || "Unknown error";
            set({ error: msg });
            toast.error("Inpainting failed: " + msg);
          } finally {
            set({ loading: false });
          }
        },

        clear: () => set({ result: null, error: null }),
      }),
      {
        name: "inpainting-storage",
        partialize: (state) => ({ result: state.result }),
      }
    )
  )
);

export default useInpaintingStore;
