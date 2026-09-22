"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { useDashboardMetrics, useTransactions } from "@/lib/supabase/hooks";
import { formatMoney, lastNMonths, monthKey, monthLabel } from "@/lib/format";
import { AreaChart } from "@/components/viz/charts";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";

export default function BurnVsYieldPage() {
  const metrics = useDashboardMetrics();
  const transactions = useTransactions();
  const rows = transactions.data ?? [];

  const series = useMemo(() => {
    const months = lastNMonths(6);
    return months.map((key) => {
      const burn = rows
        .filter((row) => monthKey(new Date(row.date)) === key)
        .reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0);
      return {
        label: monthLabel(key),
        burn,
        yield: Math.round(burn * 1.2)
      };
    });
  }, [rows]);

  const burnSeries = series.map((point) => ({ label: point.label, value: point.burn }));
  const yieldSeries = series.map((point) => ({ label: point.label, value: point.yield }));
  const burn = metrics.data?.monthlyBurn ?? 0;
  const projected = metrics.data?.projectedYield ?? 0;
  const gap = projected - burn;

  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Returns"
        title="Burn vs projected yield"
        description="How this month’s spend compares with the return Zianda projects from your recorded costs."
        image="/images/home/reports.jpg"
        imageAlt="Farm performance and yield reporting"
        asideTitle="Cash vs return"
        asideNote="Watch the gap between what you spend and what you expect back."
        actions={
          <Link href="/finances" className="btn-secondary min-h-12">
            ← Back to finances
          </Link>
        }
      />
      }
    >
      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-3">
        <Metric
          label="Monthly burn"
          value={metrics.isLoading ? "—" : formatMoney(burn)}
          note="Recorded spend this month"
        />
        <Metric
          label="Projected yield"
          value={metrics.isLoading ? "—" : formatMoney(projected)}
          note="Estimated return (1.2× burn)"
          accent
        />
        <Metric
          label="Coverage gap"
          value={metrics.isLoading ? "—" : formatMoney(gap)}
          note={gap >= 0 ? "Projected surplus" : "Spend ahead of return"}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-ink-subtle" />
            <h2 className="text-base font-semibold tracking-tight">Monthly burn</h2>
          </div>
          <div className="h-[180px]">
            <AreaChart
              data={burnSeries}
              color="#C9A227"
              fill="rgba(201, 162, 39, 0.14)"
              valueFormatter={(value) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : String(Math.round(value))
              }
            />
          </div>
        </div>
        <div className="surface p-5">
          <h2 className="mb-4 text-base font-semibold tracking-tight">Projected yield</h2>
          <div className="h-[180px]">
            <AreaChart
              data={yieldSeries}
              color="#5B7C99"
              fill="rgba(91, 124, 153, 0.14)"
              valueFormatter={(value) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : String(Math.round(value))
              }
            />
          </div>
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="text-base font-semibold tracking-tight">Six-month comparison</h2>
        <div className="mt-4 divide-y divide-stone">
          {series.map((point) => (
            <div key={point.label} className="flex min-h-11 items-center justify-between gap-3 py-2.5 text-sm">
              <span className="font-medium text-ink">{point.label}</span>
              <span className="text-ink-muted">
                Burn {formatMoney(point.burn)} · Yield {formatMoney(point.yield)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppPage>
  );
}

function Metric(props: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className="bg-paper px-5 py-6">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight tabular-nums ${props.accent ? "text-sky" : "text-ink"}`}>
        {props.value}
      </p>
      <p className="mt-1 text-xs text-ink-subtle">{props.note}</p>
    </div>
  );
}
