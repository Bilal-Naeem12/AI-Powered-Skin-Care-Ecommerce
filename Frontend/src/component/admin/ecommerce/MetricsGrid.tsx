// src/components/MetricsGrid.tsx
import React from "react";
import { useChartTabStore, PERIOD_MAP } from "@/store/ChartTabStore";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

export interface MetricItem {
  /** Shown under the icon */
  label: string;
  /** The main value (string or number) */
  value: string | number;
  /** The percent change vs previous period */
  changePct: number;
  /** Icon component to render */
  Icon: React.ComponentType<{ className?: string }>;
}

interface MetricsGridProps {
  metrics: MetricItem[];
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  const { globalPeriod } = useChartTabStore();
  const periodLabel = PERIOD_MAP[globalPeriod];          // "Day" | "Week" | "Month"
  const compareText = `Vs last ${periodLabel.toLowerCase()}`; // e.g. "Vs last month"

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {metrics.map(({ label, value, changePct, Icon }) => (
        <div
          key={label}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <Icon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {value}
              </h4>
            </div>
            <div className="space-y-1 text-right">
              <Badge color={changePct >= 0 ? "success" : "error"}>
                {changePct >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(changePct).toFixed(2)}%
              </Badge>
              <p className="font-light text-gray-500 text-[0.8rem]">
                {compareText}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
