"use client";

import Link from "next/link";
import { Sprout, Plus, QrCode, Droplets, RefreshCw } from "lucide-react";
import { useVegetationList } from "@/lib/supabase/hooks";

export default function VegetationPage() {
  const { data, isLoading, isError, refetch } = useVegetationList();
  const blocks = data ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            Crops
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage crop blocks, soil logs, and fertilizer or pesticide schedules.
          </p>
        </div>
        <Link href="/vegetation/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add crop block
        </Link>
      </div>

      {isError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          Could not load crop blocks. Check your connection or Supabase policies.
        </p>
      )}

      {!isLoading && blocks.length === 0 && !isError && (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-8 text-center shadow-md shadow-black/40">
          <Sprout className="mx-auto h-12 w-12 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-50">
            No crop blocks yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            Add a crop block to record variety, planting date, soil pH and moisture logs, and
            fertilizer or pesticide schedules. Each block can have its own QR code for quick
            scanning in the field.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Already added blocks? Click Refresh to reload the list.
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
            <Link href="/vegetation/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add first block
            </Link>
            <Link href="/scan" className="btn-secondary">
              <QrCode className="h-4 w-4" />
              Scan block QR
            </Link>
          </div>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="group space-y-3 rounded-2xl border-2 border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition-all duration-200 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/20">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Crop blocks ({blocks.length})
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
            {blocks.map((block) => {
              const displayCropType =
                block.cropType === "other" && block.variety
                  ? block.variety
                  : block.cropType;

              return (
              <Link
                key={block.id}
                href={`/vegetation/${block.id}`}
                className="flex items-center justify-between gap-3 py-3 transition hover:bg-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-50 ring-1 ring-slate-600">
                    {(block.externalId || block.cropType || "?")
                      .toString()
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-50">
                      {block.externalId}
                    </p>
                    <p className="text-xs text-slate-300">
                      {displayCropType}
                      {block.variety ? ` • ${block.variety}` : ""}
                      {block.plantingDate ? ` • Planted: ${block.plantingDate}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-slate-300">
                  {block.areaHectares != null && block.areaHectares > 0 && (
                    <span>
                      Area: {block.areaHectares >= 0.0001
                        ? `${block.areaHectares} ha`
                        : `${Math.round((block.areaHectares ?? 0) * 10000)} m²`}
                    </span>
                  )}
                </div>
              </Link>
            ); })}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/vegetation"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <Sprout className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Crop types</h3>
          <p className="mt-1 text-sm text-slate-300">
            Capture the main enterprises on your farm – maize, wheat, soybean, vegetables,
            fruit, forage and more – and group fields into easy-to-manage blocks.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Record variety per block (e.g. hybrid name or cultivar).</li>
            <li>Log planting dates to track growth stages and harvest windows.</li>
            <li>Use area (ha) and expected yield to plan sales and storage.</li>
          </ul>
        </Link>
        <Link
          href="/vegetation/new"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg"
        >
          <Droplets className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Soil &amp; inputs</h3>
          <p className="mt-1 text-sm text-slate-300">
            Keep a simple but powerful log of what goes into each field so you can improve
            fertility over time and prove what you applied.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Record soil pH and moisture checks when you scout.</li>
            <li>Schedule fertilizer, pesticide, and herbicide applications with dates and rates.</li>
            <li>Use the history when talking to advisors, buyers, or certifiers.</li>
          </ul>
        </Link>
        <Link
          href="/scan"
          className="rounded-2xl border border-slate-700/40 bg-slate-900/80 p-4 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:border-emerald-400/60 hover:shadow-lg sm:col-span-2 lg:col-span-1"
        >
          <QrCode className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Block QR codes</h3>
          <p className="mt-1 text-sm text-slate-300">
            Give every block a QR tag at the field edge so anyone on the team can scan and see
            its latest status.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Open the block&apos;s health card directly from the field.</li>
            <li>Check when it was last sprayed, fertilised, or irrigated.</li>
            <li>Use QR codes to standardise notes between workers and seasons.</li>
          </ul>
        </Link>
        <Link
          href="/farmer-hub"
          className="rounded-2xl border border-emerald-500/60 bg-slate-900/80 p-4 shadow-md shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:border-emerald-400/80 hover:shadow-lg"
        >
          <Sprout className="h-8 w-8 text-emerald-300" />
          <h3 className="mt-2 font-medium text-slate-50">Farmer hub: feeding guides</h3>
          <p className="mt-1 text-sm text-slate-300">
            Learn how to match crop production with feed needs for broilers, layers, cattle, sheep,
            goats, and pigs using simple, local-friendly guidelines.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-300">
            <li>Example broiler feed specifications and phase programs.</li>
            <li>Stage-based feeding tips for major livestock groups.</li>
            <li>Ideas to link residues from your fields into rations.</li>
          </ul>
        </Link>
      </div>
    </div>
  );
}
