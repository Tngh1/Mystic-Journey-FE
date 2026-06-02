"use client";

import { useState, useEffect } from "react";
import { Eye, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, MoreVertical, Calendar } from "lucide-react";
import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc032]"></div>
    </div>
  ),
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CHART_STYLE = {
  transparent: "transparent",
  gold: "#ffc032",
  goldDark: "#ca831f",
  whiteAlpha50: "rgba(255,255,255,0.5)",
  whiteAlpha70: "rgba(255,255,255,0.7)",
  whiteAlpha10: "rgba(255,255,255,0.1)",
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const monthlySalesOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      background: CHART_STYLE.transparent,
    },
    colors: [CHART_STYLE.gold],
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: MONTHS,
      labels: { style: { colors: CHART_STYLE.whiteAlpha50 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: CHART_STYLE.whiteAlpha50 } },
    },
    grid: {
      borderColor: CHART_STYLE.whiteAlpha10,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px", fontFamily: "inherit" },
    },
  };

  const monthlySalesSeries = [
    { name: "Sales", data: [150, 380, 190, 280, 170, 180, 280, 90, 190, 380, 270, 100] },
  ];

  const areaChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      height: 280,
      toolbar: { show: false },
      background: CHART_STYLE.transparent,
      zoom: { enabled: false },
    },
    colors: [CHART_STYLE.gold, CHART_STYLE.goldDark],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: MONTHS,
      labels: { style: { colors: CHART_STYLE.whiteAlpha50 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: CHART_STYLE.whiteAlpha50 } },
    },
    grid: {
      borderColor: CHART_STYLE.whiteAlpha10,
      strokeDashArray: 4,
    },
    legend: {
      labels: { colors: CHART_STYLE.whiteAlpha70 },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px", fontFamily: "inherit" },
    },
  };

  const areaChartSeries = [
    { name: "Revenue", data: [80, 75, 90, 100, 85, 90, 85, 50, 60, 50, 40, 45] },
    { name: "Orders", data: [170, 160, 175, 165, 150, 160, 170, 120, 100, 110, 95, 105] },
  ];

  const radialBarOptions: ApexCharts.ApexOptions = {
    chart: { background: CHART_STYLE.transparent, toolbar: { show: false } },
    colors: [CHART_STYLE.gold],
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: { margin: 0, size: "70%", background: CHART_STYLE.whiteAlpha10 },
        track: { background: CHART_STYLE.whiteAlpha10, strokeWidth: "100%", margin: 0 },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            formatter: (val: number) => `${Math.round(val)}%`,
            color: "#fff",
            fontSize: "28px",
            fontWeight: "bold",
          },
        },
      },
    },
    fill: {
      type: "solid",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [CHART_STYLE.gold],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: { lineCap: "round" },
    labels: [""],
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customers */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#ffc032]" />
          </div>
          <h3 className="text-white/60 text-sm font-medium mb-1">Customers</h3>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">3,782</h2>
            <span className="flex items-center text-emerald-400 text-sm font-medium gap-1 bg-emerald-400/10 px-2 py-1 rounded">
              <ArrowUpRight className="w-4 h-4" /> 11.01%
            </span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-6 h-6 text-[#ffc032]" />
          </div>
          <h3 className="text-white/60 text-sm font-medium mb-1">Orders</h3>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">5,359</h2>
            <span className="flex items-center text-emerald-400 text-sm font-medium gap-1 bg-emerald-400/10 px-2 py-1 rounded">
              <ArrowUpRight className="w-4 h-4" /> 9.05%
            </span>
          </div>
        </div>
        
        {/* Views */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-[#ffc032]" />
          </div>
          <h3 className="text-white/60 text-sm font-medium mb-1">Total Views</h3>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">3.4M</h2>
            <span className="flex items-center text-emerald-400 text-sm font-medium gap-1 bg-emerald-400/10 px-2 py-1 rounded">
              <ArrowUpRight className="w-4 h-4" /> 15.02%
            </span>
          </div>
        </div>
        
        {/* Revenue */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 text-[#ffc032] font-bold text-xl">
            $
          </div>
          <h3 className="text-white/60 text-sm font-medium mb-1">Total Revenue</h3>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold text-white">$45.2K</h2>
            <span className="flex items-center text-emerald-400 text-sm font-medium gap-1 bg-emerald-400/10 px-2 py-1 rounded">
              <ArrowUpRight className="w-4 h-4" /> 12.5%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales (Bar Chart with ApexCharts) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Monthly Sales</h3>
            <button title="More options" className="text-white/50 hover:text-white cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div>
            {mounted ? (
              <ApexCharts
                type="bar"
                options={monthlySalesOptions}
                series={monthlySalesSeries}
                height={280}
              />
            ) : (
              <div className="h-[280px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc032]"></div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Target (Radial Bar Chart) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-white">Monthly Target</h3>
              <p className="text-xs text-white/50">Target you&apos;ve set for each month</p>
            </div>
            <button title="More options" className="text-white/50 hover:text-white cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div>
            {mounted ? (
              <ApexCharts
                type="radialBar"
                options={radialBarOptions}
                series={[75.55]}
                height={220}
              />
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc032]"></div>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-white/70">
              You earn <span className="text-white font-bold">$3287</span> today, it&apos;s higher than last month. Keep up your good work!
            </p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Target</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                $20K <ArrowDownRight className="w-4 h-4 text-red-400" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Revenue</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                $20K <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50 mb-1">Today</p>
              <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                $20K <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics (Area Chart with ApexCharts) */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-white">Statistics</h3>
            <p className="text-xs text-white/50">Target you&apos;ve set for each month</p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <div className="bg-white/5 border border-white/10 p-1 rounded-lg flex text-sm">
              <button className="px-3 py-1 bg-white/10 text-white rounded shadow-sm cursor-pointer">Overview</button>
              <button className="px-3 py-1 text-white/50 hover:text-white rounded cursor-pointer">Sales</button>
              <button className="px-3 py-1 text-white/50 hover:text-white rounded cursor-pointer">Revenue</button>
            </div>
            <button className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-white/70 hover:text-white flex items-center gap-2 cursor-pointer">
              <Calendar className="w-4 h-4" /> May 26 - Jun 1
            </button>
          </div>
        </div>
        
        {mounted ? (
          <ApexCharts
            type="area"
            options={areaChartOptions}
            series={areaChartSeries}
            height={280}
          />
        ) : (
          <div className="h-[280px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc032]"></div>
          </div>
        )}
      </div>
    </div>
  );
}
