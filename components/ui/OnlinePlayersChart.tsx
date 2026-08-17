"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Renders the react apex chart reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center border-2 border-black/60 bg-surface-2">
      <p role="status" className="text-sm text-fg-muted">
        Loading chart…
      </p>
    </div>
  ),
});

export interface OnlineSample {
  t: number;
  online: number;
}

const GOLD = "var(--color-accent)";
const GRID = "color-mix(in srgb, var(--color-parchment) 14%, transparent)";
const TEXT = "var(--color-parchment-dim)";

// Helper function executing label style.
const labelStyle = { colors: TEXT, fontSize: "11px", fontWeight: 700 };

// Renders the online players chart reusable UI component.
// Returns the styled JSX element.
export default function OnlinePlayersChart({ samples }: { samples: OnlineSample[] }) {
  if (samples.length < 2) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-1 border-2 border-black/60 bg-surface-2 px-4 text-center">
        <p className="text-sm text-fg-muted">Collecting samples…</p>
        <p className="text-xs text-fg-subtle">
          The line is plotted from the live count, which refreshes every 30 seconds.
        </p>
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 288,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      fontFamily: "inherit",
      background: "transparent",
      parentHeightOffset: 0,
    },
    stroke: { curve: "straight", width: 2, lineCap: "square" },
    fill: { type: "solid", opacity: 0.18 },
    colors: [GOLD],
    dataLabels: { enabled: false },
    markers: { size: 4, shape: "square", strokeWidth: 0, hover: { sizeOffset: 2 } },
    states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } },
    grid: { borderColor: GRID, strokeDashArray: 0, padding: { left: 12, right: 12 } },
    xaxis: {
      type: "datetime",
      axisBorder: { color: GRID },
      axisTicks: { color: GRID },
      labels: { style: labelStyle, datetimeUTC: false, format: "HH:mm" },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: { style: labelStyle, formatter: (v: number) => `${Math.round(v)}` },
    },
    tooltip: {
      theme: "dark",
      x: { format: "HH:mm:ss" },
      y: { formatter: (v: number) => `${v.toLocaleString()} online` },
    },
    legend: { show: false },
  };

  return (
    <figure
      role="img"
      aria-label={`Players online over time, ${samples.length} samples, currently ${samples[samples.length - 1].online}`}
    >
      <ReactApexChart
        options={options}
        series={[{ name: "Players Online", data: samples.map((s) => [s.t, s.online]) }]}
        type="area"
        height={288}
      />
      <figcaption className="mt-1 text-center text-xs text-fg-muted">
        Sampled every 30 seconds since this page was opened. Peak{" "}
        <span className="font-bold tabular-nums text-fg">
          {Math.max(...samples.map((s) => s.online)).toLocaleString()}
        </span>
        , now{" "}
        <span className="font-bold tabular-nums text-fg">
          {samples[samples.length - 1].online.toLocaleString()}
        </span>
        .
      </figcaption>
    </figure>
  );
}
