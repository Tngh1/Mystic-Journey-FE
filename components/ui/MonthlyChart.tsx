"use client";

/* The dashboard's monthly plot, drawn as a hand-cut chart rather than a smooth
   one: square bar corners (`rx="5"` is gone — SVG `rx` is an attribute, so the
   global border-radius reset never touched it), mitred joins on the revenue
   line, and square dots instead of circles.

   Revenue was `#60a5fa`, a second saturated accent competing with gold for the
   eye. It reads as parchment now: gold is the transaction bars, bone-white is
   the revenue trace, and the legend states which is which so the pairing does
   not rest on colour. Colours come from the theme tokens via CSS variables —
   SVG `fill`/`stroke` cannot take a Tailwind class, but it can take a var(). */

interface MonthlyChartProps {
  categories: string[];
  transactions: number[];
  revenue: number[];
}

const GOLD = "var(--color-accent)";
const TRACE = "var(--color-parchment)";
const PLATE = "var(--color-slate)";
const GRID = "color-mix(in srgb, var(--color-parchment) 14%, transparent)";
const AXIS = "color-mix(in srgb, var(--color-parchment) 26%, transparent)";
const TEXT = "var(--color-parchment-dim)";

const VIEWBOX_WIDTH = 720;
const VIEWBOX_HEIGHT = 320;
const PADDING = { top: 26, right: 78, bottom: 46, left: 58 };
const CHART_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;
const CHART_HEIGHT = VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom;

function formatMoney(value: number) {
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toLocaleString()}`;
}

function formatNumber(value: number) {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString();
}

function getMax(values: number[]) {
  const max = Math.max(...values, 0);
  return max > 0 ? max : 1;
}

export default function MonthlyChart({ categories, transactions, revenue }: MonthlyChartProps) {
  const count = Math.min(categories.length, transactions.length, revenue.length);
  const points = Array.from({ length: count }, (_, index) => ({
    label: categories[index] ?? "",
    transactions: Math.max(0, transactions[index] ?? 0),
    revenue: Math.max(0, revenue[index] ?? 0),
  }));

  if (points.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center border-2 border-black/60 bg-surface-2 text-sm text-fg-muted">
        No monthly data available.
      </div>
    );
  }

  const maxTransactions = getMax(points.map((point) => point.transactions));
  const maxRevenue = getMax(points.map((point) => point.revenue));
  const slotWidth = CHART_WIDTH / points.length;
  const barWidth = Math.min(46, Math.max(18, slotWidth * 0.46));

  const xFor = (index: number) => PADDING.left + slotWidth * index + slotWidth / 2;
  const yForRevenue = (value: number) =>
    PADDING.top + CHART_HEIGHT - (value / maxRevenue) * CHART_HEIGHT;

  const revenuePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(index)} ${yForRevenue(point.revenue)}`)
    .join(" ");

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-parchment-dim">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 border border-black/60"
            style={{ backgroundColor: GOLD }}
            aria-hidden="true"
          />
          Transactions (bars)
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-0.5 w-5"
            style={{ backgroundColor: TRACE }}
            aria-hidden="true"
          />
          Revenue (line)
        </div>
      </div>

      <div className="overflow-hidden border-2 border-black/60 bg-surface-2">
        <svg
          role="img"
          aria-label="Monthly transactions and revenue chart"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-80 w-full"
          preserveAspectRatio="none"
        >
          {gridLines.map((ratio) => {
            const y = PADDING.top + CHART_HEIGHT * ratio;
            const transactionValue = maxTransactions * (1 - ratio);
            const revenueValue = maxRevenue * (1 - ratio);

            return (
              <g key={ratio}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={PADDING.left + CHART_WIDTH}
                  y2={y}
                  stroke={GRID}
                  strokeDasharray="3 5"
                />
                <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fill={TEXT} fontSize="11">
                  {formatNumber(transactionValue)}
                </text>
                <text x={PADDING.left + CHART_WIDTH + 10} y={y + 4} fill={TEXT} fontSize="11">
                  {formatMoney(revenueValue)}
                </text>
              </g>
            );
          })}

          <line
            x1={PADDING.left}
            y1={PADDING.top + CHART_HEIGHT}
            x2={PADDING.left + CHART_WIDTH}
            y2={PADDING.top + CHART_HEIGHT}
            stroke={AXIS}
            strokeWidth="2"
          />

          {points.map((point, index) => {
            const barHeight = (point.transactions / maxTransactions) * CHART_HEIGHT;
            const x = xFor(index) - barWidth / 2;
            const y = PADDING.top + CHART_HEIGHT - barHeight;

            return (
              <g key={`${point.label}-${index}`}>
                {/* Hard 2px shadow on the bar, matching the pixel shadow scale */}
                <rect x={x + 3} y={y + 3} width={barWidth} height={barHeight} fill="rgb(0 0 0 / 0.5)" />
                <rect x={x} y={y} width={barWidth} height={barHeight} fill={GOLD} />
                <text
                  x={xFor(index)}
                  y={VIEWBOX_HEIGHT - 22}
                  textAnchor="middle"
                  fill={TEXT}
                  fontSize="11"
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          <path
            d={revenuePath}
            fill="none"
            stroke={TRACE}
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          {points.map((point, index) => (
            <rect
              key={`revenue-${point.label}-${index}`}
              x={xFor(index) - 4}
              y={yForRevenue(point.revenue) - 4}
              width="8"
              height="8"
              fill={PLATE}
              stroke={TRACE}
              strokeWidth="2.5"
            />
          ))}

          <text x={PADDING.left} y="18" fill={TEXT} fontSize="11">
            Transactions
          </text>
          <text x={PADDING.left + CHART_WIDTH} y="18" textAnchor="end" fill={TEXT} fontSize="11">
            Revenue
          </text>
        </svg>
      </div>
    </div>
  );
}
