"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Wallet, Plus, FileText, TrendingUp, RefreshCw } from "lucide-react";
import {
  useDashboardMetrics,
  useLivestockList,
  useTransactions,
  useVegetationList
} from "@/lib/supabase/hooks";
import { formatMoney } from "@/lib/format";
import { DonutChart, MixTrack } from "@/components/viz/charts";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";

const CATEGORY_META: Record<string, { label: string; color: string; soft: string }> = {
  feed: { label: "Feed", color: "#4F6F56", soft: "#E7EFE8" },
  labor: { label: "Labour", color: "#5B7C99", soft: "#E8EEF3" },
  medical: { label: "Medical", color: "#C45C3E", soft: "#F6E8E2" },
  fertilizer: { label: "Fertilizer", color: "#C9A227", soft: "#F7F0DC" },
  pesticide: { label: "Pesticide", color: "#6B5B4F", soft: "#EFE8DC" },
  equipment: { label: "Equipment", color: "#1C1917", soft: "#E8E0D4" },
  other: { label: "Other", color: "#8A847A", soft: "#F0EBE3" }
};

export default function FinancesPage() {
  const { data, isLoading, isError, refetch } = useTransactions();
  const metrics = useDashboardMetrics();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const transactions = data ?? [];

  const animalById = useMemo(() => {
    const map = new Map<string, string>();
    for (const animal of livestock.data ?? []) {
      map.set(animal.id, animal.name || animal.externalId);
    }
    return map;
  }, [livestock.data]);

  const cropById = useMemo(() => {
    const map = new Map<string, string>();
    for (const block of crops.data ?? []) {
      map.set(block.id, block.externalId);
    }
    return map;
  }, [crops.data]);

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of transactions) {
      const key = row.category || "other";
      map[key] = (map[key] ?? 0) + (Number.isFinite(row.amount) ? row.amount : 0);
    }
    return Object.entries(map)
      .map(([id, value]) => {
        const meta = CATEGORY_META[id] ?? CATEGORY_META.other;
        return {
          id,
          label: meta.label,
          color: meta.color,
          soft: meta.soft,
          value
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalSpend = transactions.reduce(
    (sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0),
    0
  );
  const topCategory = categoryTotals[0];
  const donutData = categoryTotals.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color
  }));

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Books"
          title="Finances"
          description="Track feed, labour, medical, and other costs linked to livestock or crops."
          image="/images/home/finances.jpg"
          imageAlt="Farm finance and harvest records"
          asideTitle="Cost control"
          asideNote="Log expenses as they happen so burn vs yield stays honest."
          actions={
            <>
              <Link href="/finances/new" className="btn-primary min-h-12 flex-1">
                <Plus className="h-4 w-4" />
                Add transaction
              </Link>
              <Link href="/finances/audit-report" className="btn-secondary min-h-12 flex-1">
                <FileText className="h-4 w-4" />
                Audit report
              </Link>
            </>
          }
        />
      }
    >
      {isError && (
        <p className="alert-error">
          Could not load transactions. Check your connection or Supabase policies.
        </p>
      )}

      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="This month"
          value={metrics.isLoading ? "—" : formatMoney(metrics.data?.monthlyBurn ?? 0)}
          note="Monthly burn"
        />
        <Metric
          label="Yield forecast"
          value={metrics.isLoading ? "—" : formatMoney(metrics.data?.projectedYield ?? 0)}
          note="Projected return"
        />
        <Metric
          label="All-time spend"
          value={isLoading ? "—" : formatMoney(totalSpend)}
          note={`${transactions.length} transactions`}
        />
        <Metric
          label="Categories used"
          value={isLoading ? "—" : String(categoryTotals.length)}
          note="Active cost buckets"
        />
      </section>

      <section className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
        <div className="relative border-b border-stone bg-gradient-to-br from-ivory via-paper to-crop-soft/40 px-5 py-5 md:px-7 md:py-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-wheat-soft/60 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-sky-soft/50 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Breakdown</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                Spend mix
              </h2>
              <p className="mt-1 max-w-lg text-sm text-ink-muted">
                How recorded costs split across feed, labour, medical, and the rest of the farm.
              </p>
            </div>
            <Link href="/finances/categories" className="link-quiet shrink-0">
              All categories
            </Link>
          </div>

          {!isLoading && categoryTotals.length > 0 && (
            <div className="relative mt-5 space-y-3">
              <MixTrack data={donutData} className="h-3.5" />
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {categoryTotals.slice(0, 7).map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                    <span
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 md:p-7">
          {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
              <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-ivory-deep" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-control bg-ivory-deep" />
                ))}
              </div>
            </div>
          ) : categoryTotals.length === 0 ? (
            <div className="rounded-control border border-dashed border-stone-strong bg-ivory px-5 py-10 text-center">
              <p className="text-sm font-medium text-ink">No spend recorded yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                Log feed, labour, medical, or crop costs and this mix fills in with live share and
                totals.
              </p>
              <Link href="/finances/new" className="btn-primary mt-5">
                <Plus className="h-4 w-4" />
                Add transaction
              </Link>
            </div>
          ) : (
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
              <div className="relative mx-auto w-full max-w-[240px]">
                <div className="aspect-square">
                  <DonutChart data={donutData} />
                </div>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-ink-subtle">
                    Total
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-ink sm:text-2xl">
                    {formatMoney(totalSpend)}
                  </p>
                  {topCategory && (
                    <p className="mt-1 text-xs text-ink-muted">
                      {Math.round((topCategory.value / totalSpend) * 100)}% {topCategory.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {categoryTotals.map((item, index) => {
                  const share = totalSpend > 0 ? Math.round((item.value / totalSpend) * 100) : 0;
                  return (
                    <Link
                      key={item.id}
                      href="/finances/categories"
                      className="group flex items-center gap-3 rounded-control border border-transparent px-3 py-3 transition hover:border-stone hover:bg-ivory"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control text-sm font-semibold tabular-nums"
                        style={{ backgroundColor: item.soft, color: item.color }}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate font-medium text-ink">{item.label}</p>
                          <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                            {formatMoney(item.value)}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone">
                            <div
                              className="h-full rounded-full transition-[width]"
                              style={{
                                width: `${Math.max(share, 3)}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-ink-subtle">
                            {share}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {isLoading && !isError && (
        <div className="rounded-card border border-stone bg-paper p-6 text-sm text-ink-muted shadow-soft">
          Loading transactions…
        </div>
      )}

      {!isLoading && transactions.length === 0 && !isError && (
        <div className="empty-state">
          <Wallet className="mx-auto h-12 w-12 text-ink-subtle" />
          <h2 className="mt-4 text-lg font-semibold text-ink">No transactions yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Record feed costs, labour, medical expenses, fertilizer, and equipment. Link them to an
            animal or crop block for clearer reporting.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => refetch()} className="btn-secondary">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link href="/finances/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add first transaction
            </Link>
          </div>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="surface p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Recent transactions ({transactions.length})
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 rounded-control border border-stone-strong bg-ivory-deep px-2 py-1.5 text-xs font-medium text-ink-muted hover:bg-ivory"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
          <div className="divide-y divide-stone">
            {transactions.map((tx) => (
              <Link
                key={tx.id}
                href={`/finances/${tx.id}`}
                className="flex items-center justify-between gap-3 py-2.5 text-sm transition hover:bg-ivory"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-medium text-ink">
                    {tx.description || "No description"}
                  </p>
                  <p className="text-xs capitalize text-ink-muted">
                    {tx.date} · {tx.category}
                  </p>
                  {(tx.livestockId || tx.vegetationBlockId) && (
                    <p className="text-[11px] text-ink-subtle">
                      Linked to{" "}
                      {tx.livestockId
                        ? animalById.get(tx.livestockId) || "animal"
                        : cropById.get(tx.vegetationBlockId!) || "crop block"}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right text-sm font-semibold text-ink">
                  {formatMoney(tx.amount)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/finances/categories" className="surface-interactive p-5">
          <Wallet className="h-5 w-5 text-ink-subtle" />
          <h3 className="mt-3 font-medium text-ink">Categories</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Live totals for feed, labour, medical, fertilizer and more.
          </p>
        </Link>
        <Link href="/finances/burn-vs-yield" className="surface-interactive p-5">
          <TrendingUp className="h-5 w-5 text-ink-subtle" />
          <h3 className="mt-3 font-medium text-ink">Burn vs yield</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Monthly spend against projected return.
          </p>
        </Link>
        <Link href="/finances/audit-report" className="surface-interactive p-5">
          <FileText className="h-5 w-5 text-ink-subtle" />
          <h3 className="mt-3 font-medium text-ink">Audit report</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Printable herd, crop and spend snapshot.
          </p>
        </Link>
      </div>
    </AppPage>
  );
}

function Metric(props: { label: string; value: string; note: string }) {
  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{props.value}</p>
      <p className="mt-1 text-xs text-ink-subtle">{props.note}</p>
    </div>
  );
}
