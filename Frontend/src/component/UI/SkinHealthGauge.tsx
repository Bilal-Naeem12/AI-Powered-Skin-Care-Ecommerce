// src/components/SkinHealthGauge.tsx
import React, { useMemo } from "react";
import useSkinAnalysisStore from "@/store/useSkinAnalysis";
import type { Classification, Detections } from "@/types/SkinAnalysisResult";

export interface SkinHealthGaugeProps {
  /** Optional override of maxSpots; defaults to store value */
  maxSpots?: number;
  /** Override of weights; defaults to store value */
  weights?: { severity: number; count: number; puffy: number };
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
    const SevPen =
      acne_severity.label === "level -1" ? 1 - S : S;

    // 2) count penalty
    const CountPen = Math.min(Na / M, 1);

    // 3) type penalty
    const T = skin_type.score;
    const TypePen =
      skin_type.label.toLowerCase() === "normal" ? 1 - T : T;

    // 4) puffy penalty
    const PuffyPen = result.detections.puffy_eyes.objects.length > 0
      ? result.detections.puffy_eyes.objects.reduce((acc, o) => acc + o.confidence, 0) 
        / result.detections.puffy_eyes.objects.length
      : 0;

    // combined badness
    const B = w_s * SevPen + w_c * CountPen + w_t * TypePen + w_p * PuffyPen;

    return Math.round((1 - B) * 100);
  }, [result, w_s, w_c, w_t, w_p, M]);

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
