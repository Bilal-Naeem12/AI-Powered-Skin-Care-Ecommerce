import { Product } from "./Product";


export interface MetricKPI {
  value: number;
  changePct: number; // Percentage change vs previous period
}
/* ------------------------------------------------------------------
   2.  KPI block
   ------------------------------------------------------------------ */

export interface DashboardKPI {
  totalRevenue: MetricKPI;
  totalOrders:  MetricKPI;
  totalUsers:   MetricKPI;
  totalProducts: MetricKPI;
}

/* ------------------------------------------------------------------
   3.  Line-chart point
   ------------------------------------------------------------------ */
export interface LinePoint {
  date:  string;   // ISO date string
  value: number;
}

/* ------------------------------------------------------------------
   4.  Leaderboard row
   ------------------------------------------------------------------ */
export interface LeaderboardRow {
  views:   number;
  product: Product;
}

/* ------------------------------------------------------------------
   5.  Full dashboard response
   ------------------------------------------------------------------ */
export interface DashboardResponse {
  kpi:        DashboardKPI;
  lineChart:  LinePoint[];
  leaderboard: LeaderboardRow[];
}
