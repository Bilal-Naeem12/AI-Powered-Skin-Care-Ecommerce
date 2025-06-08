
  // Single detected object
export interface DetectionObject {
  bbox: [number, number, number, number];
  confidence: number;
}

// Grouped detections
export interface Detections {
  acne:       { objects: DetectionObject[] };
  puffy_eyes: { objects: DetectionObject[] };
}

// Single classification result
export interface Classification {
  label: string;
  score: number;
  all_scores: Record<string, number>;
}

// All classifications
export interface Classifications {
  acne_severity: Classification;
  skin_type:     Classification;
}

// Full response shape
export interface SkinAnalysisResult {
  detections:      Detections;
  classifications: Classifications;
  scanned_image:   string; // base64 JPEG
}
