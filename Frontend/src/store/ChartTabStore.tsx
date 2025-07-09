import { create } from "zustand";

/** User-friendly keys */
export type ChartPeriodKey =
  | "months"   // 12 months
  | "days7"    // 7 days
  | "hours24"; // 24 hours

/** Map to your backend period values */
export const PERIOD_MAP: Record<ChartPeriodKey, string> = {
  months: "Month",
  days7:  "Week",
  hours24: "Day"
};

/** The store shape */
interface ChartTabStore {
  /** Global (used for multiple charts) */
  globalPeriod: ChartPeriodKey;
  setGlobalPeriod: (key: ChartPeriodKey) => void;

  /** Specific chart: e.g. statistics tab */
  statisticsPeriod: ChartPeriodKey;
  setStatisticsPeriod: (key: ChartPeriodKey) => void;

  /** Add more chart-specific periods if needed */
}

export const useChartTabStore = create<ChartTabStore>((set) => ({
  globalPeriod: "months",
  setGlobalPeriod: (key) => set({ globalPeriod: key }),

  statisticsPeriod: "months",
  setStatisticsPeriod: (key) => set({ statisticsPeriod: key }),
}));
