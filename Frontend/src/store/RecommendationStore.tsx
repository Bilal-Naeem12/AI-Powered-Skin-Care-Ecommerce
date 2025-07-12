import { RecommendationResponse, RecommendedProduct } from "@/types/Recommendation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecommendationStore {
  data: RecommendationResponse | null;
  setData: (data: RecommendationResponse) => void;
  clearData: () => void;
  updateProductInStep: (stepKey: string, updatedProducts: RecommendedProduct[]) => void;
}

const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      data: null,

      setData: (data) => set({ data }),

      clearData: () => set({ data: null }),

      updateProductInStep: (stepKey, updatedProducts) => {
        const currentData = get().data;
        if (!currentData) return;

        const updatedRoutine = {
          ...currentData.routine,
          [stepKey]: {
            ...currentData.routine[stepKey],
            products: updatedProducts,
          },
        };

        set({
          data: {
            ...currentData,
            routine: updatedRoutine,
          },
        });
      },
    }),
    {
      name: "recommendation-store", // 👈 localStorage key
    }
  )
);

export default useRecommendationStore;
