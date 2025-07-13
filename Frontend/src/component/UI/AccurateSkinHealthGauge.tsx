import React, { useMemo } from "react";
import type { Detections, Classifications } from "@/types/SkinAnalysisResult";

interface AccurateSkinHealthGaugeProps {
  detections: Detections;
  classifications: Classifications;
  maxSpots?: number;
  weights?: {
    severity: number;
    count: number;
    type: number;
    puffy: number;
  };
}

const AccurateSkinHealthGauge: React.FC<AccurateSkinHealthGaugeProps> = ({
  detections,
  classifications,
  maxSpots = 30,
  weights = {
    severity: 0.4,
    count: 0.4,
    type: 0.1,
    puffy: 0.1,
  },
}) => {
  const health = useMemo(() => {
    if (!detections || !classifications) return 0;

    const { acne_severity, skin_type } = classifications;
    const acneCount = detections.acne.objects.length;

    const SevPen =
      acne_severity.label === "Very Severe" ? 1 :
      acne_severity.label === "Severe" ? 0.95 :
      acne_severity.label === "Moderate" ? 0.6 :
      acne_severity.label === "Mild" ? 0.3 : 0;

    const CountPen = Math.min(acneCount / (maxSpots * 0.6), 1);

    const TypePen =
      skin_type.label.toLowerCase() === "dry" ? 0.5 :
      skin_type.label.toLowerCase() === "oily" ? 0.4 :
      skin_type.label.toLowerCase() === "normal" ? 0 :
      0.2;

    const PuffyPen = detections.puffy_eyes.objects.length > 0
      ? detections.puffy_eyes.objects.reduce((sum, o) => sum + o.confidence, 0) / detections.puffy_eyes.objects.length
      : 0;

    const totalPenalty =
      weights.severity * SevPen +
      weights.count * CountPen +
      weights.type * TypePen +
      weights.puffy * PuffyPen;

    const rawScore = Math.round((1 - Math.min(totalPenalty, 1)) * 100);
    return Math.max(0, Math.min(100, rawScore)); // Clamp
  }, [detections, classifications, weights, maxSpots]);

  let status = "Excellent";
  let barColor = "bg-green-500";
  if (health < 70) {
    status = "Fair";
    barColor = "bg-yellow-500";
  }
  if (health < 40) {
    status = "Poor";
    barColor = "bg-red-500";
  }

  return (
    <div className="p-4 bg-white/50 ">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-800">Skin Health</span>
        <span className="text-sm font-semibold text-gray-900">{health}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-1">
        <div
          className={`transition-all duration-500 ${barColor} h-3`}
          style={{ width: `${health}%` }}
        />
      </div>
      <p className="text-xs text-gray-600">
        Status: <span className="font-medium">{status}</span>
      </p>
    </div>
  );
};

export default AccurateSkinHealthGauge;
