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
  