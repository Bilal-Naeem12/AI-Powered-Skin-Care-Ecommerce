// src/stores/useSkinAnalysisStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  SkinAnalysisResult,
  Detections,
} from "@/types/SkinAnalysisResult";

interface SkinAnalysisState {
  result: SkinAnalysisResult | null;
  loading: boolean;
  error: string | null;

  analyzeSkin: (file: File) => Promise<void>;
  clearResult: () => void;

  maxSpots: number;
  weights: { severity: number; count: number; type: number; puffy: number };
  setMaxSpots: (n: number) => void;
  setWeights: (w: SkinAnalysisState["weights"]) => void;

  checkAnalysis: () => void;
}

const useSkinAnalysisStore = create<SkinAnalysisState>()(
  devtools(
    persist(
      (set, get) => ({
        result: null,
        loading: false,
        error: null,

        analyzeSkin: async (file) => {
          set({ loading: true, error: null });
          const formData = new FormData();
          formData.append("file", file);
          try {
            const resp = await axios.post<SkinAnalysisResult>(
              `${import.meta.env.VITE_API_FASTAPI}/skin_analysis/predict`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            set({ result: resp.data });
            toast.success("Skin analysis completed");
          } catch (e: any) {
            const msg = e.response?.data?.detail || e.message || "Unknown error";
            set({ error: msg });
            toast.error("Analysis failed: " + msg);
          } finally {
            set({ loading: false });
          }
        },

        clearResult: () => set({ result: null, error: null }),

        maxSpots: 20,
        weights: { severity: 0.5, count: 0.2, type: 0.3, puffy: 0.1 },
        setMaxSpots: (n) => set({ maxSpots: n }),
        setWeights: (w) => set({ weights: w }),

        // handy method to re-run or inspect stored result
        checkAnalysis: () => {
          const { result } = get();
          console.log("Rehydrated analysis:", result);
        },
      }),
      {
        name: "skin-analysis-storage", // localStorage key
        partialize: (state) => ({
          result: state.result,
          maxSpots: state.maxSpots,
          weights: state.weights,
        }),
      }
    )
  )
);

export default useSkinAnalysisStore;
