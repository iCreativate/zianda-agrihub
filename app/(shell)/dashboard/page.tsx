"use client";

import Link from "next/link";
import { useDashboardMetrics, useVaccinationSchedule } from "@/lib/supabase/hooks";
import {
  BarChart3,
  Calendar,
  Wallet,
  TrendingUp,
  AlertCircle,
  Cog,
  Truck,
  Wrench,
  Leaf,
  Store,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardMetrics();
  const {
    data: vaccinationData = [],
    isLoading: isVaccinationsLoading,
    isError: isVaccinationsError,
  } = useVaccinationSchedule(60, 7);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Farm overview
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Your assets, upcoming care, and finances at a glance.
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            Could not load dashboard metrics. Check your connection or Supabase
            credentials.
          </span>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/livestock"
          className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Total assets
            </p>
            <BarChart3 className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-50 tabular-nums">
            {isLoading || data === undefined ? "—" : data.totalAssets}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Livestock + crop blocks
          </p>
        </Link>

        <Link
          href="/livestock"
          className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Upcoming vaccinations
            </p>
            <Calendar className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-50 tabular-nums">
            {isLoading || data === undefined ? "—" : data.upcomingVaccinations}
          </p>
          <p className="mt-1 text-sm text-slate-300">Next 30 days</p>
        </Link>

        <Link
          href="/finances/burn-vs-yield"
          className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-6 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Monthly burn vs yield
            </p>
            <Wallet className="h-5 w-5 text-emerald-300" />
          </div>
          {isLoading || data === undefined ? (
            <p className="mt-3 text-sm text-slate-300">Loading…</p>
          ) : (
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-slate-300">Burn</span>
                <span className="text-lg font-semibold text-slate-50 tabular-nums">
                  {Number.isFinite(data.monthlyBurn)
                    ? data.monthlyBurn.toFixed(2)
                    : "—"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-slate-300">Projected yield</span>
                <span className="text-lg font-semibold text-slate-100 tabular-nums">
                  {Number.isFinite(data.projectedYield)
                    ? data.projectedYield.toFixed(2)
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Vaccination calendar (next 30 days) */}
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-300" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Vaccination calendar
            </h2>
          </div>
          <Link
            href="/vaccinations"
            className="text-xs font-medium text-emerald-300 hover:text-emerald-200"
          >
            View full schedule
          </Link>
        </div>
        {isVaccinationsError && (
          <p className="text-xs text-red-200">
            Could not load vaccination calendar. Check your connection.
          </p>
        )}
        {isVaccinationsLoading && !isVaccinationsError && (
            <p className="text-xs text-slate-300">Loading vaccinations around today…</p>
        )}
        {!isVaccinationsLoading &&
          !isVaccinationsError &&
          vaccinationData.length === 0 && (
            <p className="text-xs text-slate-300">
              No livestock vaccinations scheduled in the selected window.
            </p>
          )}
        {!isVaccinationsLoading &&
          !isVaccinationsError &&
          vaccinationData.length > 0 && (
            <div className="mt-2 max-h-60 space-y-2 overflow-auto text-xs">
              {Object.entries(
                vaccinationData.reduce<Record<string, typeof vaccinationData>>(
                  (acc, item) => {
                    (acc[item.scheduledDate] ||= []).push(item);
                    return acc;
                  },
                  {}
                )
              ).map(([date, items]) => (
                <div
                  key={date}
                  className="rounded-xl border border-slate-700/60 bg-slate-950/60 px-3 py-2"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-slate-100">
                            {item.vaccineName}
                          </p>
                          <p className="truncate text-[11px] text-slate-400">
                            {item.livestock
                              ? `Animal: ${
                                  item.livestock.name ||
                                  item.livestock.externalId ||
                                  "Unknown"
                                }`
                              : item.vegetationBlock
                              ? `Crop: ${
                                  item.vegetationBlock.name ||
                                  item.vegetationBlock.externalId ||
                                  "Block"
                                }`
                              : "Asset"}
                          </p>
                        </div>
                        <span className="mt-0.5 shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                          Due
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Resources & marketplace */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
          Resources & marketplace
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Link
            href="/plant-machinery"
            className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
          >
            <Cog className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-medium text-slate-50">Plant and machinery</p>
            <p className="mt-0.5 text-xs text-slate-400">Equipment & maintenance</p>
          </Link>
          <Link
            href="/motor"
            className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
          >
            <Truck className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-medium text-slate-50">Motor (vehicles)</p>
            <p className="mt-0.5 text-xs text-slate-400">Agricultural vehicles</p>
          </Link>
          <Link
            href="/tools"
            className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
          >
            <Wrench className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-medium text-slate-50">Tools</p>
            <p className="mt-0.5 text-xs text-slate-400">Hand & power tools</p>
          </Link>
          <Link
            href="/seeds"
            className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
          >
            <Leaf className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-medium text-slate-50">Seeds</p>
            <p className="mt-0.5 text-xs text-slate-400">Varieties & batches</p>
          </Link>
          <Link
            href="/marketplace"
            className="group rounded-2xl border border-slate-700/40 bg-slate-900/80 p-5 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
          >
            <Store className="h-6 w-6 text-emerald-300" />
            <p className="mt-2 font-medium text-slate-50">Marketplace</p>
            <p className="mt-0.5 text-xs text-slate-400">Buy & sell</p>
          </Link>
        </div>
      </div>

      {/* Quick actions / summary strip */}
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 px-4 py-5 shadow-md shadow-black/40 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-400" />
            {isLoading || !data ? (
              <span className="text-sm font-medium text-slate-200">
                Add livestock, crops, or transactions from the menu to see your
                dashboard update.
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-200">
                This month your recorded burn is{" "}
                <span className="font-semibold text-slate-50">
                  {Number.isFinite(data.monthlyBurn)
                    ? data.monthlyBurn.toFixed(2)
                    : "—"}
                </span>{" "}
                and your projected yield is{" "}
                <span className="font-semibold text-emerald-300">
                  {Number.isFinite(data.projectedYield)
                    ? data.projectedYield.toFixed(2)
                    : "—"}
                </span>
                . Keep logging transactions to sharpen this picture.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
