import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "@/component/admin/Dropdown";
import { DropdownItem } from "@/component/admin/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { useState } from "react";
import { LinePoint } from "@/types/DashboardResponse";

interface Props { points: LinePoint[] }

export default function MonthlySalesChart({ points }: Props) {

   const series = [{ name: "Revenue", data: points.map(p => parseFloat(p.value.toFixed(0))) }];
  const options: ApexOptions = {
    colors: ["#ff69b4"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
    categories: points.map(p => new Date(p.date).toLocaleString("default", { month: "short" })),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  // const series = [
  //   {
  //     name: "Sales",
  //     data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
  //   },
  // ];
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
       
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
