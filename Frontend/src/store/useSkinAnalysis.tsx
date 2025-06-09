// src/stores/useSkinAnalysisStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  SkinAnalysisResult,
  Detections,
} from "@/types/SkinAnalysisResult";
import { RecommendationResponse } from "@/types/Recommendation";

interface SkinAnalysisState {
  result: SkinAnalysisResult | null;
  loading: boolean;
  error: string | null;

  analyzeSkin: (formData: FormData, originalImage: File|string, userId: string | undefined) => Promise<void>;

  clearResult: () => void;

  maxSpots: number;
  weights: { severity: number; count: number; type: number; puffy: number };
  setMaxSpots: (n: number) => void;
  setWeights: (w: SkinAnalysisState["weights"]) => void;

  checkAnalysis: () => void;
}

const uploadImage = async (input: File | string): Promise<string> => {
  const formData = new FormData();

  // If it's a base64 string
  if (typeof input === "string" && input.startsWith("data:image")) {
    const blob = await fetch(input).then(res => res.blob());
    const base64File = new File([blob], "scanned.jpg", { type: blob.type });
    formData.append("file", base64File);
  }

  // If it's already a File
  else if (input instanceof File) {
    formData.append("file", input);
  }

  const res = await axios.post<any>(
    `${import.meta.env.VITE_API_BACKEND_URL}/scan-session/upload-to-folder`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }
  );

  return res.data.cloudinaryUrl;
};

export interface RecommendationStepInfo {
  stepKey: string;      // e.g., "step1"
  title: string;        // e.g., "Cleanse Your Skin"
  category: string;     // e.g., "Cleanser"
}
const saveSkinHistory = async (
  userId: string,
  beforeUrl: string,
  afterUrl: string,
  result: SkinAnalysisResult,
  recProductsWithSteps: { productId: string; step: RecommendationStepInfo }[]
) => {
  const payload = {
    scanned_image_before: beforeUrl,
    scanned_image_after: afterUrl,
    detections: result.detections,
    classifications: result.classifications,
    hydrationLevel: null,
    uvExposureIndex: null,
    analyzedAt: new Date(),
    recommendations: recProductsWithSteps, // each includes productId + step
  };

  await axios.post(
    `${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/${userId}`,
    payload,
    { withCredentials: true }
  );
};


const useSkinAnalysisStore = create<SkinAnalysisState>()(
  devtools(
    persist(
      (set, get) => ({
        result: null,
        loading: false,
        error: null,

        analyzeSkin: async (formData: FormData, originalImage: File|string, userId: string|undefined) => {
  set({ loading: true, error: null });

  try {
    // 1. Upload the original (before) image to Cloudinary
    const beforeUrl = await uploadImage(originalImage);

    // 2. Send to FastAPI for analysis
    const resp = await axios.post<SkinAnalysisResult>(
      `${import.meta.env.VITE_API_FASTAPI}/skin_analysis/predict`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const result = resp.data;
    set({ result });

    toast.success("Skin analysis completed");

    // 3. Upload the returned scanned_image (base64) as 'after'
    const base64 = result.scanned_image;
const fullBase64 = `data:image/jpeg;base64,${base64}`;

    const [metaAfter, dataAfter] = fullBase64.split(",");
const mimeAfter = metaAfter.match(/data:(.+);base64/)?.[1] ?? "image/jpeg";
const byteStrAfter = atob(dataAfter);
const bytesAfter = Uint8Array.from(byteStrAfter, (b) => b.charCodeAt(0));
const blobAfter = new Blob([bytesAfter], { type: mimeAfter });
const afterFile = new File([blobAfter], "after.jpg", { type: mimeAfter });
const afterUrl = await uploadImage(afterFile);
    // 4. Call recommendation API
    const minimized = {
      classifications: result.classifications,
      detections: {
        acne: result.detections.acne.objects?.[0],
        puffy_eyes: result.detections.puffy_eyes.objects?.[0],
      },
    };

    const recResp  = await axios.post<RecommendationResponse>(
      `${import.meta.env.VITE_API_BACKEND_URL}/products/recommend`,
      minimized,
      { withCredentials: true }
    );

   const recProductsWithSteps = Object.entries(recResp.data.routine)
  .flatMap(([stepKey, step]) =>
    step?.products.map((p) => ({
      productId: p._id,
      step: {
        stepKey,
        title: step.title,
        category: step.category,
      },
    })) ?? []
  );

    // 5. Save full history
    await saveSkinHistory(userId ?? "", beforeUrl, afterUrl, result, recProductsWithSteps);

    toast.success("Skin history saved ✅");
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
