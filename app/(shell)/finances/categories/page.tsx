"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Wallet } from "lucide-react";
import { useTransactions } from "@/lib/supabase/hooks";
import { formatMoney } from "@/lib/format";
import { BarChart } from "@/components/viz/charts";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import type { TransactionCategory } from "@/types/agriculture";

const CATEGORIES: Array<{ id: TransactionCategory; title: string; note: string }> = [
  { id: "feed", title: "Feed", note: "Concentrates, hay, silage, lick and residues." },
  { id: "labor", title: "Labour", note: "Permanent staff, casuals and contractors." },
  { id: "medical", title: "Medical", note: "Vet visits, vaccines, dipping and treatments." },
  { id: "fertilizer", title: "Fertilizer", note: "Basal, top dressing and foliar feeds." },
  { id: "pesticide", title: "Pesticide", note: "Crop protection and herbicides." },
  { id: "equipment", title: "Equipment", note: "Repairs, maintenance, fuel and tools." },
  { id: "other", title: "Other", note: "Anything else you still want on the books." }
];

export default function FinanceCategoriesPage() {
  const { data = [], isLoading, isError } = useTransactions();

  const totals = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((item) => [item.id, 0])) as Record<
      TransactionCategory,
      number
    >;
    for (const row of data) {
      const key = (row.category in map ? row.category : "other") as TransactionCategory;
      map[key] += Number.isFinite(row.amount) ? row.amount : 0;
    }
    return map;
  }, [data]);

  const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
  const chartData = CATEGORIES.map((item) => ({
    label: item.title.slice(0, 4),
    value: totals[item.id]
  })).filter((item) => item.value > 0);

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Spend"
          title="Finance categories"
          description="Where money is going across feed, labour, health, crops and equipment."
          image="/images/home/finances.jpg"
          imageAlt="Farm cost categories in the books"
          asideTitle="Buckets"
          asideNote="Every expense lands in a category so reports stay readable."
          actions={
            <>
              <Link href="/finances" className="btn-secondary min-h-12 flex-1">
                ← Back to finances
              </Link>
              <Link href="/finances/new" className="btn-primary min-h-12 flex-1">
                Log expense
              </Link>
            </>
          }
        />
      }
    >
      {isError && <p className="alert-error">Could not load category totals.</p>}

      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2">
        <div className="bg-paper px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
            All recorded spend
          </p>
          <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
            {isLoading ? "—" : formatMoney(grandTotal)}
          </p>
          <p className="mt-1 text-xs text-ink-subtle">{data.length} transactions</p>
        </div>
        <div className="bg-paper px-5 py-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
            Top category
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {isLoading
              ? "—"
              : CATEGORIES.slice()
                  .sort((a, b) => totals[b.id] - totals[a.id])[0]?.title ?? "—"}
          </p>
          <p className="mt-1 text-xs text-ink-subtle">Highest total spend</p>
        </div>
      </section>

      <section className="surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-ink-subtle" />
          <h2 className="text-base font-semibold tracking-tight">Spend by category</h2>
        </div>
        <div className="h-[180px]">
          {chartData.length ? (
            <BarChart data={chartData} color="#1C1917" />
          ) : (
            <div className="flex h-full items-center justify-center rounded-control bg-ivory text-sm text-ink-muted">
              Log transactions to see the category breakdown.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {CATEGORIES.map((item) => {
          const amount = totals[item.id];
          const share = grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0;
          return (
            <div key={item.id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.note}</p>
                </div>
                <p className="text-lg font-semibold tabular-nums text-ink">
                  {isLoading ? "—" : formatMoney(amount)}
                </p>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[11px] text-ink-subtle">
                  <span>Share of spend</span>
                  <span>{share}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ivory-deep">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${share}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </AppPage>
  );
}
