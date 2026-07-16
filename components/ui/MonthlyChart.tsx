"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// ApexCharts touches `window`, so it must be client-only (no SSR).
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface MonthlyChartProps {
  categories: string[];
  transactions: number[];
  revenue: number[];
}

const GOLD = "#ffc032";
const BLUE = "#60a5fa";

export default function MonthlyChart({ categories, transactions, revenue }: MonthlyChartProps) {
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      background: "transparent",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { speed: 500 },
    },
    theme: { mode: "dark" },
    colors: [GOLD, BLUE],
    stroke: { width: [0, 3], curve: "smooth" },
    plotOptions: {
      bar: { columnWidth: "45%", borderRadius: 4 },
    },
    dataLabels: { enabled: false },
    grid: { borderColor: "rgba(255,255,255,0.08)", strokeDashArray: 4 },
    xaxis: {
      categories,
      labels: { style: { colors: "rgba(255,255,255,0.5)" } },
      axisBorder: { color: "rgba(255,255,255,0.1)" },
      axisTicks: { color: "rgba(255,255,255,0.1)" },
    },
    yaxis: [
      {
        title: { text: "Transactions", style: { color: "rgba(255,255,255,0.5)" } },
        labels: { style: { colors: "rgba(255,255,255,0.5)" } },
      },
      {
        opposite: true,
        title: { text: "Revenue ($)", style: { color: "rgba(255,255,255,0.5)" } },
        labels: {
          style: { colors: "rgba(255,255,255,0.5)" },
          formatter: (v: number) => `$${v.toLocaleString()}`,
        },
      },
    ],
    legend: { labels: { colors: "rgba(255,255,255,0.7)" }, position: "top", horizontalAlign: "right" },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, opts) =>
          opts?.seriesIndex === 1 ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : val.toLocaleString(),
      },
    },
  };

  const series = [
    { name: "Transactions", type: "column", data: transactions },
    { name: "Revenue", type: "line", data: revenue },
  ];

  return <ReactApexChart options={options} series={series} type="line" height={320} />;
}
