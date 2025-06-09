
import { Classification, Classifications, Detections } from "./SkinAnalysisResult";
import { Product } from "./Product";

export interface RecommendationStepInfo {
  stepKey: string;      // e.g., "step1"
  title: string;        // e.g., "Cleanse Your Skin"
  category: string;     // e.g., "Cleanser"
}
export interface RecommendationProduct {
  _id: string;
  productId: Product;
  step: RecommendationStepInfo;
  recommendedAt: string;
}
export interface SkinHistoryEntry {
  _id: string;
  userId: string;
  scanned_image_before: string;
  scanned_image_after?: string;
  detections: Detections;
  classifications: Classifications;
  hydrationLevel?: number | null;
  uvExposureIndex?: number | null;
  analyzedAt: string;
  recommendations: RecommendationProduct[];
}