"use client";

interface MonthlyChartProps {
  categories: string[];
  transactions: number[];
  revenue: number[];
}

const GOLD = "#ffc032";
const BLUE = "#60a5fa";
const GRID = "rgba(255,255,255,0.08)";
const TEXT = "rgba(255,255,255,0.48)";

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
      <div className="flex h-80 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/45">
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: GOLD }} />
          Transactions
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: BLUE }} />
          Revenue
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <svg
          role="img"
          aria-label="Monthly transactions and revenue chart"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-80 w-full"
          preserveAspectRatio="none"
        >
          <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="transparent" />

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
                  strokeDasharray="4 6"
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
            stroke="rgba(255,255,255,0.14)"
          />

          {points.map((point, index) => {
            const barHeight = (point.transactions / maxTransactions) * CHART_HEIGHT;
            const x = xFor(index) - barWidth / 2;
            const y = PADDING.top + CHART_HEIGHT - barHeight;

            return (
              <g key={`${point.label}-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="5"
                  fill={GOLD}
                  opacity="0.84"
                />
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

          <path d={revenuePath} fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((point, index) => (
            <circle
              key={`revenue-${point.label}-${index}`}
              cx={xFor(index)}
              cy={yForRevenue(point.revenue)}
              r="4"
              fill="#111111"
              stroke={BLUE}
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
