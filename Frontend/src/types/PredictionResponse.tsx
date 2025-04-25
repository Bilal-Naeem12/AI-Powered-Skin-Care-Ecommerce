export interface PredictionResponse {
    result: {
      detections: Array<{
        confidence: number;
        bbox: number[];
        class: string;
      }>;
      labeled_image: string;
    };
  }
  

  export interface SkinAnalysisResponse {
    acne: PredictionResponse;         // result from the acne detector
    puffy_eyes: PredictionResponse;   // result from the puffy-eyes detector
    scanned_image: string;            // base-64 JPEG with colour-coded boxes
  }
  