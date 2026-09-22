"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AreaChart, BarChart, type ChartPoint } from "@/components/viz/charts";
import { formatMoney } from "@/lib/format";

type PerformanceMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  href: string;
  actionLabel: string;
  data: ChartPoint[];
  chart: "area" | "bar" | null;
  color: string;
  fill?: string;
  valueFormatter?: (value: number) => string;
};

export function PerformancePanel(props: { metrics: PerformanceMetric[]; loading?: boolean }) {
  return (
    <section
      aria-label="Farm performance"
      className="overflow-hidden rounded-card bg-ink px-5 py-8 md:px-8 md:py-10"
    >
      <div>
        <p className="section-eyebrow !text-wheat">Farm intelligence</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-paper md:text-3xl">
          From farm records
          <br />
          to better decisions.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/70">
          Historical trends appear once you have records. Charts stay compact until data grows.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {props.loading &&
          [0, 1, 2, 3].map((key) => (
            <div key={key} className="h-36 animate-pulse rounded-card bg-paper/5" />
          ))}

        {!props.loading &&
          props.metrics.map((metric) => {
            const hasData = metric.data.some((point) => point.value > 0);

            return (
              <div
                key={metric.id}
                className="rounded-card border border-paper/10 bg-paper/5 p-5 backdrop-blur-sm transition hover:border-paper/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-paper/55">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-paper">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-paper/65">{metric.note}</p>
                  </div>
                  {hasData && (
                    <Link
                      href={metric.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-paper/70 transition hover:text-paper"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                <div className="mt-4 min-h-[72px]">
                  {hasData && metric.chart === "area" && (
                    <AreaChart
                      data={metric.data}
                      color={metric.color === "#1C1917" ? "#F6F1E8" : metric.color}
                      fill={metric.fill ?? "rgba(255, 252, 247, 0.08)"}
                      height={72}
                      valueFormatter={metric.valueFormatter}
                    />
                  )}
                  {hasData && metric.chart === "bar" && (
                    <BarChart
                      data={metric.data}
                      color={metric.color === "#4F6F56" ? "#E7EFE8" : metric.color}
                      height={72}
                    />
                  )}
                  {!hasData && (
                    <div className="flex items-center justify-between gap-3 rounded-control bg-paper/5 px-4 py-3">
                      <p className="text-sm text-paper/55">Chart appears as records accumulate.</p>
                      <Link
                        href={metric.href}
                        className="inline-flex shrink-0 items-center gap-1 rounded-control border border-paper/20 px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-paper/10"
                      >
                        {metric.actionLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export function moneyAxis(value: number) {
  return value >= 1000 ? `${Math.round(value / 1000)}k` : String(Math.round(value));
}

export function buildPerformanceMetrics(input: {
  herd: ChartPoint[];
  livestockCount: number;
  cropBars: ChartPoint[];
  cropCount: number;
  expenseSeries: ChartPoint[];
  monthlyBurn: number;
  revenueSeries: ChartPoint[];
  sellingCount: number;
  yieldSeries: ChartPoint[];
  projectedYield: number;
  healthSeries: ChartPoint[];
  healthEvents: number;
}): PerformanceMetric[] {
  const herdHasData = input.herd.some((point) => point.value > 0);
  const cropHasData = input.cropBars.some((point) => point.value > 0);
  const expenseHasData = input.expenseSeries.some((point) => point.value > 0);
  const revenueHasData = input.revenueSeries.some((point) => point.value > 0);
  const healthHasData = input.healthSeries.some((point) => point.value > 0);

  return [
    {
      id: "herd",
      label: "Herd growth",
      value: String(input.livestockCount),
      note: herdHasData ? "Animals on record over six months" : "No animals recorded yet",
      href: "/livestock",
      actionLabel: "Add animal",
      data: input.herd,
      chart: "area",
      color: "#1C1917",
      fill: "rgba(255, 252, 247, 0.1)"
    },
    {
      id: "crops",
      label: "Crop performance",
      value: cropHasData
        ? `${input.cropBars.reduce((sum, row) => sum + row.value, 0).toFixed(1)} ha`
        : String(input.cropCount),
      note: cropHasData ? "Planted area by crop type" : "No active fields mapped",
      href: "/vegetation",
      actionLabel: "Add field",
      data: input.cropBars,
      chart: cropHasData ? "bar" : null,
      color: "#4F6F56"
    },
    {
      id: "expenses",
      label: "Expenses",
      value: formatMoney(input.monthlyBurn),
      note: expenseHasData ? "Recorded spend by month" : "No expenses logged this month",
      href: "/finances",
      actionLabel: "Log expense",
      data: input.expenseSeries,
      chart: "area",
      color: "#C9A227",
      fill: "rgba(201, 162, 39, 0.2)"
    },
    {
      id: "revenue",
      label: "Revenue",
      value: revenueHasData
        ? `${input.sellingCount} listing${input.sellingCount === 1 ? "" : "s"}`
        : formatMoney(0),
      note: revenueHasData ? "Active sale listings by month" : "No sales recorded this month",
      href: "/marketplace/new",
      actionLabel: "Record sale",
      data: input.revenueSeries,
      chart: "area",
      color: "#5B7C99",
      fill: "rgba(91, 124, 153, 0.2)"
    },
    {
      id: "yield",
      label: "Yield forecast",
      value: formatMoney(input.projectedYield),
      note: expenseHasData ? "Projected return against spend" : "Forecast available after expenses",
      href: "/finances/burn-vs-yield",
      actionLabel: "Open burn vs yield",
      data: input.yieldSeries,
      chart: expenseHasData ? "area" : null,
      color: "#F6F1E8",
      fill: "rgba(255, 252, 247, 0.08)",
      valueFormatter: moneyAxis
    },
    {
      id: "health",
      label: "Health events",
      value: String(input.healthEvents),
      note: healthHasData ? "Scheduled care in current window" : "No vaccinations scheduled",
      href: "/vaccinations",
      actionLabel: "Open health",
      data: input.healthSeries,
      chart: healthHasData ? "bar" : null,
      color: "#C45C3E"
    }
  ];
}
