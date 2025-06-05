import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/icons";
import Badge from "../ui/badge/Badge";
import { DashboardKPI } from "@/types/DashboardResponse";

interface Props { kpi: DashboardKPI | null }

export default function EcommerceMetrics({ kpi }: Props) {
  if (!kpi) return null;

  const cards = [
    { label: "Revenue", value: `$${kpi.totalRevenue.value.toFixed(2)}`, trend: kpi.totalRevenue.changePct, icon: GroupIcon },
    { label: "Orders",  value: kpi.totalOrders.value,        trend: kpi.totalOrders.changePct,  icon: BoxIconLine },
    // { label: "Users",   value: kpi.totalUsers.value,         trend: kpi.totalUsers.changePct,  icon: GroupIcon }
  ];

  return (
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <c.icon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{c.label}</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{c.value}</h4>
            </div>
            <Badge color={c.trend >= 0 ? "success" : "error"}>
              {c.trend >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(c.trend).toFixed(2)}%
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
