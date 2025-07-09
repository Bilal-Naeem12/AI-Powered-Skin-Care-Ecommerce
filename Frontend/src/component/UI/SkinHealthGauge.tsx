// src/components/SkinHealthGauge.tsx
import React, { useMemo } from "react";
import useSkinAnalysisStore from "@/store/SkinAnalysis";
import type { Classification, Detections } from "@/types/SkinAnalysisResult";

export interface SkinHealthGaugeProps {
  /** Optional override of maxSpots; defaults to store value */
  maxSpots?: number;
  /** Override of weights; defaults to store value */
  weights?: { severity: number; count: number; type: number;puffy: number };
}

const SkinHealthGauge: React.FC<SkinHealthGaugeProps> = ({
  maxSpots: maxSpotsProp,
  weights: weightsProp,
}) => {
  const { result, weights, maxSpots } = useSkinAnalysisStore();
  const { severity: w_s, count: w_c, type: w_t, puffy: w_p } = weights;
  const M = maxSpots;


 const health = useMemo(() => {
  if (!result) return 0;

  const { acne_severity, skin_type } = result.classifications;
  const dets: Detections = result.detections;
  const Na = dets.acne.objects.length;

  // 1) severity penalty
  const S = acne_severity.score;
 const severityLabel = acne_severity.label;
const SevPen =
  severityLabel === "Very Severe" ? 1 :
  severityLabel === "Severe" ? 0.95 :
  severityLabel === "Moderate" ? 0.6 :
  severityLabel === "Mild" ? 0.3 : 0;

  // 2) count penalty (non-linear scaling for more sensitivity)
  const CountPen = Math.min(Na / (M * 0.6), 1);  // more punishing when >60% of maxSpots

  // 3) type penalty (dry or oily should reduce health, normal should boost)
  const skinTypeLabel = skin_type.label.toLowerCase();
  const TypePen =
    skinTypeLabel === "normal" ? 0 :
    skinTypeLabel === "dry" ? 0.5  :
    skinTypeLabel === "oily" ? 0.4  : 0.2 ;

  // 4) puffy eye penalty
  const PuffyPen = dets.puffy_eyes.objects.length > 0
    ? dets.puffy_eyes.objects.reduce((acc, o) => acc + o.confidence, 0) /
      dets.puffy_eyes.objects.length
    : 0;

  // Updated weights (tuned for visible results)
  const W = weightsProp || {
    severity: 0.4,
    count: 0.4,
    type: 0.1,
    puffy: 0.1,
  };

  const B = W.severity * SevPen + W.count * CountPen + W.type * TypePen + W.puffy * PuffyPen;
  return Math.round((1 - Math.min(B, 1)) * 100);
}, [result, weightsProp, M]);

  if (!result) {
    return <div className="p-4 text-gray-500">No analysis yet.</div>;
  }


  if (!result) {
    return (
      <div className="p-4 text-center text-gray-500">
        No skin analysis yet.
      </div>
    );
  }

  let status = "Excellent";
  let barColor = "bg-green-500";
  if (health < 70) { status = "Fair";    barColor = "bg-yellow-500"; }
  if (health < 40) { status = "Poor";    barColor = "bg-red-500";    }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Skin Health</span>
        <span className="text-sm font-semibold text-gray-800">{health}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
        <div className={`${barColor} h-3`} style={{ width: `${health}%` }} />
      </div>
      <p className="text-xs text-gray-600">
        Status: <span className="font-medium">{status}</span>
      </p>
    </div>
  );
};

export default SkinHealthGauge;
