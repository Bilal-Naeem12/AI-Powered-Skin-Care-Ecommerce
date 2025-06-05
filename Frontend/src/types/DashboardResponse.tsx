import { Product } from "./Product";

/* ------------------------------------------------------------------
   2.  KPI block
   ------------------------------------------------------------------ */
export interface DashboardKPI {
  totalRevenue: number;
  totalOrders:  number;
  totalUsers:   number;
  totalProducts:number;
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
