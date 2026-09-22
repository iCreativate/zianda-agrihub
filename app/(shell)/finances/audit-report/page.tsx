"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FileText, Printer } from "lucide-react";
import {
  useDashboardMetrics,
  useLivestockList,
  useTransactions,
  useVaccinationSchedule,
  useVegetationList
} from "@/lib/supabase/hooks";
import { formatMoney, formatNumber } from "@/lib/format";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { useFarm } from "@/lib/farm/use-farm";
import { cropLabel, formatHectares } from "@/lib/crops/stages";

export default function AuditReportInfoPage() {
  const { farm } = useFarm();
  const metrics = useDashboardMetrics();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const transactions = useTransactions();
  const vaccinations = useVaccinationSchedule(60, 14);

  const animals = livestock.data ?? [];
  const blocks = crops.data ?? [];
  const txs = transactions.data ?? [];
  const due = (vaccinations.data ?? []).filter((item) => !item.completed);

  const bySpecies = useMemo(() => {
    const map: Record<string, number> = {};
    for (const animal of animals) {
      map[animal.species] = (map[animal.species] ?? 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [animals]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of txs) {
      map[row.category] = (map[row.category] ?? 0) + (Number.isFinite(row.amount) ? row.amount : 0);
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [txs]);

  const totalSpend = txs.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0);
  const totalHa = blocks.reduce((sum, block) => sum + (block.areaHectares || 0), 0);

  return (
    <AppPage
      contentClassName="print:space-y-6"
      hero={
        <PageHero
          className="print:hidden"
          eyebrow="Reports"
          title="Audit & investor report"
          description={`Live farm snapshot for ${farm.name}. Print this page or save as PDF for your bank, advisor or buyer.`}
          image="/images/home/reports.jpg"
          imageAlt="Printed farm reports and records"
          asideTitle="Export"
          asideNote="Print or save as PDF when you need a clean snapshot for outsiders."
          actions={
            <>
              <Link href="/finances" className="btn-secondary min-h-12 flex-1">
                ← Back to finances
              </Link>
              <button type="button" onClick={() => window.print()} className="btn-primary min-h-12 flex-1">
                <Printer className="h-4 w-4" />
                Print / save PDF
              </button>
            </>
          }
        />
      }
    >

      <section className="surface p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-eyebrow">Farm</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{farm.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{farm.location}</p>
          </div>
          <FileText className="h-5 w-5 text-ink-subtle" />
        </div>
        <p className="mt-4 text-xs text-ink-subtle">
          Generated {new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </section>

      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Livestock" value={livestock.isLoading ? "—" : formatNumber(animals.length)} />
        <Stat label="Crop blocks" value={crops.isLoading ? "—" : formatNumber(blocks.length)} />
        <Stat label="Area" value={crops.isLoading ? "—" : formatHectares(totalHa)} />
        <Stat
          label="Health tasks due"
          value={vaccinations.isLoading ? "—" : formatNumber(due.length)}
        />
        <Stat
          label="Monthly burn"
          value={metrics.isLoading ? "—" : formatMoney(metrics.data?.monthlyBurn ?? 0)}
        />
        <Stat
          label="Yield forecast"
          value={metrics.isLoading ? "—" : formatMoney(metrics.data?.projectedYield ?? 0)}
        />
        <Stat label="Total recorded spend" value={transactions.isLoading ? "—" : formatMoney(totalSpend)} />
        <Stat label="Transactions" value={transactions.isLoading ? "—" : formatNumber(txs.length)} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Herd by species</h2>
          <div className="mt-4 space-y-2">
            {bySpecies.length === 0 && (
              <p className="text-sm text-ink-muted">No livestock recorded yet.</p>
            )}
            {bySpecies.map(([species, count]) => (
              <div
                key={species}
                className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2"
              >
                <span className="capitalize text-sm font-medium">{species}</span>
                <span className="text-sm tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Crop blocks</h2>
          <div className="mt-4 space-y-2">
            {blocks.length === 0 && (
              <p className="text-sm text-ink-muted">No crop blocks recorded yet.</p>
            )}
            {blocks.slice(0, 8).map((block) => (
              <div
                key={block.id}
                className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{block.externalId}</span>
                  <span className="block truncate text-xs text-ink-subtle">
                    {cropLabel(block.cropType, block.variety)} · {formatHectares(block.areaHectares)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Spend by category</h2>
          <div className="mt-4 space-y-2">
            {byCategory.length === 0 && (
              <p className="text-sm text-ink-muted">No transactions recorded yet.</p>
            )}
            {byCategory.map(([category, amount]) => (
              <div
                key={category}
                className="flex min-h-11 items-center justify-between rounded-control border border-stone bg-ivory px-3 py-2"
              >
                <span className="capitalize text-sm font-medium">{category}</span>
                <span className="text-sm tabular-nums font-semibold">{formatMoney(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-semibold tracking-tight">Upcoming health tasks</h2>
          <div className="mt-4 space-y-2">
            {due.length === 0 && (
              <p className="text-sm text-ink-muted">No open health tasks in the current window.</p>
            )}
            {due.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.vaccineName}</span>
                  <span className="block truncate text-xs text-ink-subtle">
                    {item.livestock?.name || item.livestock?.externalId || "Livestock"}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-ink-subtle">{item.scheduledDate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppPage>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{props.value}</p>
    </div>
  );
}
