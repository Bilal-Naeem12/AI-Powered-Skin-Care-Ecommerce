import { Product } from "./Product";

export interface RecommendedProduct extends Product {}

export interface RoutineStep {
  title: string;
  category: string;
  products: RecommendedProduct[];
}

export interface Routine {
  step1?: RoutineStep;
  step2?: RoutineStep;
  step3?: RoutineStep;
  step4?: RoutineStep;
}

export interface RecommendationResponse {
  success: boolean;
  skinType: string;
  problemsDetected: string[];
  routine: Routine;
}
