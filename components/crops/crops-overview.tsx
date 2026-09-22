"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Camera, CloudSun, Plus, Sprout } from "lucide-react";
import { useTransactions, useVegetationList } from "@/lib/supabase/hooks";
import { useFarm } from "@/lib/farm/use-farm";
import { useWeather } from "@/lib/farm/use-weather";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import { platformImage } from "@/lib/images/platform-images";
import { formatMoney, formatNumber } from "@/lib/format";
import {
  computeCropsMetrics,
  cropImage,
  cropLabel,
  currentCropStage,
  expectedHarvestDate,
  fieldHealth,
  formatHectares,
  stageProgress
} from "@/lib/crops/stages";

export function CropsOverview() {
  const { data, isLoading, isError, refetch } = useVegetationList();
  const transactions = useTransactions();
  const { farm } = useFarm();
  const weather = useWeather(farm.lat, farm.lon);
  const blocks = data ?? [];

  const inputCosts = useMemo(() => {
    return (transactions.data ?? [])
      .filter(
        (row) =>
          row.vegetationBlockId ||
          row.category === "fertilizer" ||
          row.category === "pesticide"
      )
      .reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0);
  }, [transactions.data]);

  const metrics = useMemo(
    () => computeCropsMetrics(blocks, inputCosts, weather.data),
    [blocks, inputCosts, weather.data]
  );

  return (
    <AppPage
      hero={
        <PageHero
          eyebrow="Fields"
          title="Crops"
          description="Your farm as it looks from above — hectares, stages, and harvest windows in one place."
          image={platformImage("aerial").src}
          imageAlt={platformImage("aerial").alt}
          aside={
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-eyebrow text-paper/55">
                  Season snapshot
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-paper">
                  <CloudSun className="h-4 w-4 text-wheat" />
                  {weather.data
                    ? `${Math.round(weather.data.temperature)}° · ${weather.data.label}`
                    : "Weather loading…"}
                </div>
                <p className="mt-2 text-sm text-paper/75">
                  {metrics.activeFields
                    ? `${metrics.plantingProgress}% average planting progress across active fields.`
                    : "Add a field to start the season map."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/vegetation/new" className="btn-primary min-h-12 flex-1">
                  <Plus className="h-4 w-4" />
                  Add field
                </Link>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn-secondary min-h-12 flex-1"
                >
                  Refresh fields
                </button>
              </div>
            </div>
          }
        />
      }
    >

      {isError && (
        <p className="alert-error">
          Could not load crop blocks. Check your connection or Supabase policies.
        </p>
      )}

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-4">
        <Metric
          label="Total hectares"
          value={isLoading ? "—" : formatHectares(metrics.totalHectares)}
        />
        <Metric
          label="Active fields"
          value={isLoading ? "—" : formatNumber(metrics.activeFields)}
          accent="crop"
        />
        <Metric
          label="Crops planted"
          value={isLoading ? "—" : formatNumber(metrics.cropsPlanted)}
        />
        <Metric
          label="Planting progress"
          value={isLoading ? "—" : `${metrics.plantingProgress}%`}
          accent="sky"
        />
        <Metric
          label="Expected harvest"
          value={
            isLoading || !metrics.nextHarvest
              ? "—"
              : new Date(metrics.nextHarvest).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric"
                })
          }
          note="Next window"
        />
        <Metric
          label="Yield forecast"
          value={isLoading ? "—" : formatMoney(metrics.yieldForecast)}
          note="Estimated return"
          accent="wheat"
        />
        <Metric
          label="Weather risk"
          value={weather.isLoading ? "—" : metrics.weatherRisk}
          note={metrics.weatherNote}
          accent={metrics.weatherRisk === "High" ? "clay" : undefined}
        />
        <Metric
          label="Input costs"
          value={transactions.isLoading ? "—" : formatMoney(metrics.inputCosts)}
          note="Linked field spend"
        />
      </section>

      {!isLoading && blocks.length === 0 && !isError && (
        <EmptyState
          icon={<Sprout className="h-6 w-6" />}
          title="No fields yet"
          description="Add a crop block to map hectares, planting dates, growth stages, and a photo timeline from seed to harvest."
          actions={
            <Link href="/vegetation/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Add first field
            </Link>
          }
        />
      )}

      {blocks.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Farm map</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Fields</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {formatNumber(blocks.length)} block{blocks.length === 1 ? "" : "s"} ·{" "}
                {formatHectares(metrics.totalHectares)} under crops
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/finances" className="btn-secondary min-h-10">
                Input costs
              </Link>
              <Link href="/vegetation/new" className="btn-secondary min-h-10">
                <Plus className="h-4 w-4" />
                Add field
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-stone bg-paper shadow-soft">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone bg-gradient-to-r from-ivory via-paper to-crop-soft/30 px-4 py-3 md:px-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                Season board
              </span>
              <LegendDot tone="crop" label="On track" />
              <LegendDot tone="wheat" label="Watch" />
              <LegendDot tone="sky" label="Cool / wet" />
              <LegendDot tone="clay" label="At risk" />
              <span className="ml-auto text-xs text-ink-subtle">
                {metrics.plantingProgress}% avg progress
              </span>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {blocks.map((block, index) => {
                const stage = currentCropStage(block.cropType, block.plantingDate);
                const harvest = expectedHarvestDate(block.cropType, block.plantingDate);
                const health = fieldHealth(stage, weather.data);
                const photo = block.photoUrl || cropImage(block.cropType);
                const progress = stageProgress(block.cropType, block.plantingDate);
                const toneSoft =
                  health.tone === "crop"
                    ? "bg-crop-soft text-crop"
                    : health.tone === "clay"
                      ? "bg-clay-soft text-clay"
                      : health.tone === "sky"
                        ? "bg-sky-soft text-sky"
                        : "bg-wheat-soft text-ink";
                const bar =
                  health.tone === "crop"
                    ? "bg-crop"
                    : health.tone === "clay"
                      ? "bg-clay"
                      : health.tone === "sky"
                        ? "bg-sky"
                        : "bg-wheat";

                return (
                  <Link
                    key={block.id}
                    href={`/vegetation/${block.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-stone bg-ivory/40 transition hover:-translate-y-0.5 hover:border-stone-strong hover:bg-paper hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={block.externalId}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="rounded-control bg-paper/95 px-2 py-1 font-mono text-[10px] font-semibold tabular-nums text-ink-subtle">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`rounded-control px-2 py-1 text-[10px] font-semibold ${toneSoft}`}
                        >
                          {health.label}
                        </span>
                      </div>

                      {!block.photoUrl && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-control bg-paper/95 px-2 py-1 text-[10px] font-medium text-ink-muted">
                          <Camera className="h-3 w-3" />
                          Add photo
                        </span>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                        <p className="truncate text-lg font-semibold tracking-tight text-paper">
                          {block.externalId}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-paper/75">
                          {cropLabel(block.cropType, block.variety)}
                          {block.variety && block.cropType !== "other"
                            ? ` · ${block.variety}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <FieldStat label="Area" value={formatHectares(block.areaHectares)} />
                        <FieldStat
                          label="Planted"
                          value={
                            block.plantingDate
                              ? new Date(block.plantingDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric"
                                })
                              : "—"
                          }
                        />
                        <FieldStat label="Stage" value={stage.label} />
                        <FieldStat
                          label="Harvest"
                          value={
                            harvest
                              ? new Date(harvest).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric"
                                })
                              : "—"
                          }
                        />
                      </div>

                      <div className="mt-auto">
                        <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-medium text-ink-muted">Season progress</span>
                          <span className="tabular-nums text-ink-subtle">{progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone">
                          <div
                            className={`h-full rounded-full transition-[width] ${bar}`}
                            style={{ width: `${Math.max(progress, 3)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </AppPage>
  );
}

function Metric(props: {
  label: string;
  value: string;
  note?: string;
  accent?: "crop" | "clay" | "wheat" | "sky";
}) {
  const color =
    props.accent === "crop"
      ? "text-crop"
      : props.accent === "clay"
        ? "text-clay"
        : props.accent === "sky"
          ? "text-sky"
          : "text-ink";

  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${color}`}>{props.value}</p>
      {props.note && <p className="mt-1 text-xs text-ink-subtle">{props.note}</p>}
    </div>
  );
}

function FieldStat(props: { label: string; value: string }) {
  return (
    <div className="rounded-control border border-stone/80 bg-paper px-2.5 py-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink-subtle">
        {props.label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink">{props.value}</p>
    </div>
  );
}

function LegendDot(props: {
  tone: "crop" | "clay" | "wheat" | "sky";
  label: string;
}) {
  const color =
    props.tone === "crop"
      ? "bg-crop"
      : props.tone === "clay"
        ? "bg-clay"
        : props.tone === "sky"
          ? "bg-sky"
          : "bg-wheat";

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {props.label}
    </span>
  );
}
