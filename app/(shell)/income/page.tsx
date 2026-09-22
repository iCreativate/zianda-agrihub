"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Plus, Store, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import {
  useDashboardMetrics,
  useLivestockList,
  useMarketplaceListings,
  useTransactions,
  useVegetationList
} from "@/lib/supabase/hooks";
import { formatMoney, formatNumber, lastNMonths, monthKey, monthLabel } from "@/lib/format";
import { AreaChart } from "@/components/viz/charts";
import { formatHectares } from "@/lib/crops/stages";

export default function IncomePage() {
  const metrics = useDashboardMetrics();
  const listings = useMarketplaceListings();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const transactions = useTransactions();

  const selling = (listings.data ?? []).filter((item) => item.type === "selling");
  const buying = (listings.data ?? []).filter((item) => item.type === "buying");
  const animals = livestock.data ?? [];
  const blocks = crops.data ?? [];
  const totalHa = blocks.reduce((sum, block) => sum + (block.areaHectares || 0), 0);

  const listingSeries = useMemo(() => {
    const months = lastNMonths(6);
    return months.map((key) => ({
      label: monthLabel(key),
      value: selling.filter((item) => monthKey(new Date(item.createdAt)) === key).length
    }));
  }, [selling]);

  const monthlySpend = metrics.data?.monthlyBurn ?? 0;

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Returns"
          title="Income"
          description="Sale listings, inventory behind them, and the yield outlook from this month’s recorded spend."
          image="/images/home/grain.jpg"
          imageAlt="Harvested grain ready for market"
          asideTitle="Bring in cash"
          asideNote="List what you have to sell and watch projected return against spend."
          actions={
            <>
              <Link href="/marketplace/new" className="btn-primary min-h-12 flex-1">
                <Plus className="h-4 w-4" />
                New listing
              </Link>
              <Link href="/finances/burn-vs-yield" className="btn-secondary min-h-12 flex-1">
                <TrendingUp className="h-4 w-4" />
                Burn vs yield
              </Link>
            </>
          }
        />
      }
    >
      <div className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Yield forecast"
          value={metrics.isLoading ? "—" : formatMoney(metrics.data?.projectedYield ?? 0)}
          note="Projected return"
        />
        <Metric
          label="Sale listings"
          value={listings.isLoading ? "—" : formatNumber(selling.length)}
          note="Active selling offers"
        />
        <Metric
          label="Herd on hand"
          value={livestock.isLoading ? "—" : formatNumber(animals.length)}
          note="Animals available to market"
        />
        <Metric
          label="Crop area"
          value={crops.isLoading ? "—" : formatHectares(totalHa)}
          note={`${blocks.length} field${blocks.length === 1 ? "" : "s"}`}
        />
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Sale listings opened</h2>
          <p className="mt-1 text-xs text-ink-subtle">Last six months</p>
          <div className="mt-4 h-[168px]">
            {listingSeries.some((point) => point.value > 0) ? (
              <AreaChart data={listingSeries} color="#5B7C99" fill="rgba(91, 124, 153, 0.14)" />
            ) : (
              <div className="flex h-full items-center justify-center rounded-control bg-ivory text-sm text-ink-muted">
                No sale listings recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Return picture</h2>
          <div className="mt-4 space-y-3">
            <Row label="This month’s burn" value={formatMoney(monthlySpend)} />
            <Row
              label="Projected yield"
              value={formatMoney(metrics.data?.projectedYield ?? 0)}
            />
            <Row
              label="Coverage"
              value={formatMoney((metrics.data?.projectedYield ?? 0) - monthlySpend)}
            />
            <Row
              label="Buying interest"
              value={`${buying.length} listing${buying.length === 1 ? "" : "s"}`}
            />
            <p className="pt-2 text-sm text-ink-muted">
              Yield is estimated from recorded spend until sales invoices are linked. Marketplace
              listings show what you are currently offering.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Marketplace sales</h2>
            <Link href="/marketplace" className="link-quiet inline-flex items-center gap-1">
              <Store className="h-3.5 w-3.5" />
              Open marketplace
            </Link>
          </div>
          {listings.isError && <p className="alert-error">Could not load listings.</p>}
          {!listings.isLoading && selling.length === 0 && (
            <p className="text-sm text-ink-muted">
              No sale listings yet. Create one when you have produce or stock to sell.
            </p>
          )}
          <div className="divide-y divide-stone">
            {selling.map((item) => (
              <Link
                key={item.id}
                href={`/marketplace/${item.id}`}
                className="flex min-h-11 items-center justify-between gap-3 py-3"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {item.title || "Untitled listing"}
                  </span>
                  <span className="block text-xs text-ink-subtle">
                    {item.creatorName || "Your listing"}
                  </span>
                </span>
                <span className="badge-sky">Selling</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Buying interest</h2>
            <Link href="/marketplace/new" className="link-quiet">
              Post a buy request
            </Link>
          </div>
          {buying.length === 0 ? (
            <p className="text-sm text-ink-muted">No buying listings yet.</p>
          ) : (
            <div className="divide-y divide-stone">
              {buying.map((item) => (
                <Link
                  key={item.id}
                  href={`/marketplace/${item.id}`}
                  className="flex min-h-11 items-center justify-between gap-3 py-3"
                >
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      {item.title || "Untitled listing"}
                    </span>
                    <span className="block text-xs text-ink-subtle">
                      {item.creatorName || "Buyer"}
                    </span>
                  </span>
                  <span className="badge-wheat">Buying</span>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-5 rounded-control border border-stone bg-ivory px-3 py-3 text-sm text-ink-muted">
            Recent finance activity:{" "}
            {transactions.isLoading
              ? "…"
              : `${(transactions.data ?? []).length} transactions on record`}
            .
          </div>
        </div>
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

function Row(props: { label: string; value: string }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2">
      <span className="text-sm text-ink-muted">{props.label}</span>
      <span className="text-sm font-semibold tabular-nums text-ink">{props.value}</span>
    </div>
  );
}
