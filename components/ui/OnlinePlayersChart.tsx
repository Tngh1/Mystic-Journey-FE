"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

/* ApexCharts touches `window` on import, so it can only be pulled in on the
   client — `ssr: false` on a dynamic import is the supported way. */
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
  /** Epoch ms the sample was taken. */
  t: number;
  online: number;
}

/* Apex's defaults are rounded, gradient-filled and animated — all three break
   the house rules — so every one of them is switched off below rather than
   restyled. Colours come through `var()`: an SVG presentation attribute takes a
   custom property fine, and it keeps the chart on the token system. Anything
   that would make Apex do colour arithmetic on those vars (gradients, hover
   shade, monochrome themes) is disabled, since `var()` cannot be lightened. */
const GOLD = "var(--color-accent)";
const GRID = "color-mix(in srgb, var(--color-parchment) 14%, transparent)";
const TEXT = "var(--color-parchment-dim)";

const labelStyle = { colors: TEXT, fontSize: "11px", fontWeight: 700 };

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
      // Reduced motion is a system preference; the safe default is simply no motion.
      animations: { enabled: false },
      fontFamily: "inherit",
      background: "transparent",
      parentHeightOffset: 0,
    },
    // Square joints and caps: the pixel system has no curves anywhere.
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
    /* Apex renders an SVG with no accessible name of its own, and the shape of a
       line is not information a screen reader can use — so the figure is named
       here and the current count is also printed in the caption below it, which
       is the actual accessible answer to "how many are online". */
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
