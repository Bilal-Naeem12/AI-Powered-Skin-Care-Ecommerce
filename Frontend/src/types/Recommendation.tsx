import { Product } from "./Product";

export interface RecommendedProduct extends Product {}

export interface RoutineStep {
  title: string;
  category: string;
  products: RecommendedProduct[];
}

export interface Routine {
  [stepKey: string]: RoutineStep ;
}


export interface RecommendationResponse {
  success: boolean;
  skinType: string;
  problemsDetected: string[];
  routine: Routine;
    exploreMore?: Product[];
}
