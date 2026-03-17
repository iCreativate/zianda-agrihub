"use client";

import Link from "next/link";
import { Wallet, Plus, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { useTransactions } from "@/lib/supabase/hooks";

export default function FinancesPage() {
  const { data, isLoading, isError, refetch } = useTransactions();
  const transactions = data ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Finances
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Track feed, labour, medical, and other costs linked to livestock or
            crops.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/finances/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            Add transaction
          </Link>
          <Link
            href="/finances/audit-report"
            className="btn-secondary"
            title="Generate audit report"
          >
            <FileText className="h-4 w-4" />
            Audit report
          </Link>
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Could not load transactions. Check your connection or Supabase policies.
        </p>
      )}

      {isLoading && !isError && (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 text-sm text-slate-300 shadow-md shadow-black/40">
          Loading transactions…
        </div>
      )}

      {!isLoading && transactions.length === 0 && !isError && (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-8 text-center shadow-md shadow-black/40">
          <Wallet className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-50">
            No transactions yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            Record feed costs, labour, medical expenses, fertilizer, and
            equipment. Link transactions to a specific animal or crop block for
            better reporting. Your dashboard will show monthly burn vs projected
            yield.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Already added transactions? Click Refresh to reload.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="btn-secondary"
            >
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
        <div className="group space-y-3 rounded-2xl border-2 border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition-all duration-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/20">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Recent transactions ({transactions.length})
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800/60 px-2 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/60"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>
          <div className="divide-y divide-slate-700/60">
            {transactions.map((tx) => (
              <Link
                key={tx.id}
                href={`/finances/${tx.id}`}
                className="flex items-center justify-between gap-3 py-2.5 text-sm transition hover:bg-slate-800/60"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-slate-50">
                    {tx.description || "No description"}
                  </p>
                  <p className="text-xs text-slate-300">
                    {tx.date} • {tx.category} • {tx.currency}
                  </p>
                  {(tx.livestockId || tx.vegetationBlockId) && (
                    <p className="text-[11px] text-slate-400">
                      Linked to{" "}
                      {tx.livestockId
                        ? `animal (${tx.livestockId})`
                        : `crop block (${tx.vegetationBlockId})`}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm font-semibold text-slate-50">
                  {tx.amount.toFixed(2)} {tx.currency}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/finances/categories"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <Wallet className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Categories</h3>
          <p className="mt-1 text-sm text-slate-300">
            Feed, labour, medical, fertilizer, pesticide, equipment, and other.
            Filter and report by category.
          </p>
          <p className="mt-2 text-xs font-medium text-slate-200">
            Click to see how categories roll up into reports.
          </p>
        </Link>
        <Link
          href="/finances/burn-vs-yield"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <TrendingUp className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Burn vs yield</h3>
          <p className="mt-1 text-sm text-slate-300">
            The dashboard shows monthly spend and projected yield so you can
            plan ahead.
          </p>
          <p className="mt-2 text-xs font-medium text-slate-200">
            Click to learn how burn rate and yield are calculated.
          </p>
        </Link>
        <Link
          href="/finances/audit-report"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg sm:col-span-2 lg:col-span-1"
        >
          <FileText className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Audit report</h3>
          <p className="mt-1 text-sm text-slate-300">
            Generate a PDF report of herd health and costs for banks or
            investors.
          </p>
          <p className="mt-2 text-xs font-medium text-slate-200">
            Click to see what will be included in your investment-ready report.
          </p>
        </Link>
      </div>
    </div>
  );
}
