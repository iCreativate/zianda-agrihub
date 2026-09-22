"use client";

import { useMemo } from "react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AttentionList } from "@/components/dashboard/attention-list";
import { BroilerPanel } from "@/components/dashboard/broiler-panel";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { FarmSnapshot } from "@/components/dashboard/farm-snapshot";
import {
  buildPerformanceMetrics,
  PerformancePanel
} from "@/components/dashboard/performance-panel";
import { revenueSummary, TodayStrip } from "@/components/dashboard/today-strip";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SyncError } from "@/components/ui/sync-error";
import { buildActivityFeed } from "@/lib/dashboard/activity";
import {
  buildAttentionItems,
  countOverdueTasks,
  countUrgentHealth
} from "@/lib/dashboard/attention";
import { useFarm } from "@/lib/farm/use-farm";
import { useOnline } from "@/lib/farm/use-online";
import { useWeather } from "@/lib/farm/use-weather";
import { lastNMonths, monthKey, monthLabel } from "@/lib/format";
import {
  useDashboardMetrics,
  useLivestockList,
  useMarketplaceListings,
  useTransactions,
  useVaccinationSchedule,
  useVegetationList,
  type VaccinationScheduleRow
} from "@/lib/supabase/hooks";
import type { ChartPoint } from "@/components/viz/charts";
import type { Livestock, MarketplaceListing, Transaction, VegetationBlock } from "@/types/agriculture";

const CROP_LABELS: Record<string, string> = {
  maize: "Maize",
  wheat: "Wheat",
  soybean: "Soy",
  vegetable: "Veg",
  fruit: "Fruit",
  forage: "Forage",
  other: "Other"
};

export function OperationsBoard() {
  const { farm } = useFarm();
  const online = useOnline();
  const weather = useWeather(farm.lat, farm.lon);
  const metrics = useDashboardMetrics();
  const livestock = useLivestockList();
  const crops = useVegetationList();
  const transactions = useTransactions();
  const vaccinations = useVaccinationSchedule(60, 7);
  const listings = useMarketplaceListings();

  const loading =
    metrics.isLoading ||
    livestock.isLoading ||
    crops.isLoading ||
    vaccinations.isLoading ||
    listings.isLoading;

  const lastSync = Math.max(
    metrics.dataUpdatedAt || 0,
    livestock.dataUpdatedAt || 0,
    crops.dataUpdatedAt || 0
  );

  const livestockRows = livestock.data ?? [];
  const cropRows = crops.data ?? [];
  const vaccinationRows = vaccinations.data ?? [];
  const transactionRows = transactions.data ?? [];
  const selling = (listings.data ?? []).filter((item) => item.type === "selling");

  const weatherWarning = useMemo(() => {
    if (!weather.data) return null;
    if (weather.data.wind >= 45) {
      return `Strong winds (${Math.round(weather.data.wind)} km/h) — secure equipment and check livestock shelter.`;
    }
    if (weather.data.temperature >= 35) {
      return `High temperature (${Math.round(weather.data.temperature)}°) — ensure water and shade for livestock.`;
    }
    return null;
  }, [weather.data]);

  const attentionItems = useMemo(
    () =>
      buildAttentionItems({
        vaccinations: vaccinationRows.filter((item) => !item.completed).slice(0, 8),
        livestock: livestockRows,
        crops: cropRows,
        weatherWarning
      }),
    [vaccinationRows, livestockRows, cropRows, weatherWarning]
  );

  const activity = useMemo(
    () =>
      buildActivityFeed({
        livestock: livestockRows,
        crops: cropRows,
        transactions: transactionRows,
        vaccinations: vaccinationRows,
        listings: listings.data ?? []
      }),
    [livestockRows, cropRows, transactionRows, vaccinationRows, listings.data]
  );

  const herd = herdSeries(livestockRows);
  const cropBars = cropSeries(cropRows);
  const expenseSeries = expenseSeriesFrom(transactionRows);
  const yieldSeries = expenseSeries.map((point) => ({
    label: point.label,
    value: Math.round(point.value * 1.2)
  }));
  const revenueSeries = revenueSeriesFrom(selling);
  const healthSeries = healthSeriesFrom(vaccinationRows);

  const performanceMetrics = buildPerformanceMetrics({
    herd,
    livestockCount: metrics.data?.livestockCount ?? livestockRows.length,
    cropBars,
    cropCount: metrics.data?.cropCount ?? cropRows.length,
    expenseSeries,
    monthlyBurn: metrics.data?.monthlyBurn ?? 0,
    revenueSeries,
    sellingCount: selling.length,
    yieldSeries,
    projectedYield: metrics.data?.projectedYield ?? 0,
    healthSeries,
    healthEvents: vaccinationRows.filter((item) => !item.completed).length
  });

  const weatherLabel = weather.data
    ? `${Math.round(weather.data.temperature)}° ${weather.data.label}`
    : null;

  return (
    <div className="command-centre pb-4">
      <div className="-mx-4 overflow-hidden md:-mx-6 lg:-mx-8 lg:rounded-b-card">
        <DashboardHero
          farmName={farm.name}
          location={farm.location}
          weatherLabel={weatherLabel}
          online={online}
          lastSync={lastSync}
        />
      </div>

      <div className="relative z-10 px-1 md:px-2">
        <TodayStrip
          loading={loading}
          livestock={metrics.data?.livestockCount ?? livestockRows.length}
          fields={metrics.data?.cropCount ?? cropRows.length}
          urgentHealth={countUrgentHealth(vaccinationRows)}
          revenueLabel={revenueSummary(selling.length)}
          overdueTasks={countOverdueTasks(vaccinationRows)}
        />
      </div>

      <div className="mx-auto mt-10 max-w-[1200px] space-y-10 md:mt-12 md:space-y-12">
        {metrics.isError && <SyncError onRetry={() => metrics.refetch()} />}

        <ScrollReveal>
          <AttentionList items={attentionItems} loading={vaccinations.isLoading} />
        </ScrollReveal>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:gap-10">
          <ScrollReveal delay={80}>
            <FarmSnapshot farmName={farm.name} livestock={livestockRows} crops={cropRows} />
          </ScrollReveal>
          <ScrollReveal delay={140}>
            <ActivityFeed events={activity} loading={loading} />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={100}>
          <PerformancePanel metrics={performanceMetrics} loading={loading} />
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <BroilerPanel />
        </ScrollReveal>
      </div>
    </div>
  );
}

function herdSeries(animals: Livestock[]): ChartPoint[] {
  const months = lastNMonths(6);
  return months.map((key) => ({
    label: monthLabel(key),
    value: animals.filter((animal) => monthKey(new Date(animal.createdAt)) <= key).length
  }));
}

function cropSeries(blocks: VegetationBlock[]): ChartPoint[] {
  const grouped = blocks.reduce<Record<string, number>>((acc, block) => {
    const key = block.cropType || "other";
    acc[key] = (acc[key] ?? 0) + (block.areaHectares || 1);
    return acc;
  }, {});
  return Object.entries(grouped).map(([key, value]) => ({
    label: CROP_LABELS[key] ?? key,
    value: Number(value.toFixed(1))
  }));
}

function expenseSeriesFrom(rows: Transaction[]): ChartPoint[] {
  const months = lastNMonths(6);
  return months.map((key) => ({
    label: monthLabel(key),
    value: rows
      .filter((row) => monthKey(new Date(row.date)) === key)
      .reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0)
  }));
}

function revenueSeriesFrom(rows: MarketplaceListing[]): ChartPoint[] {
  const months = lastNMonths(6);
  return months.map((key) => ({
    label: monthLabel(key),
    value: rows.filter((row) => monthKey(new Date(row.createdAt)) === key).length
  }));
}

function healthSeriesFrom(rows: VaccinationScheduleRow[]): ChartPoint[] {
  return Array.from({ length: 6 }, (_, index) => {
    const start = new Date();
    start.setDate(start.getDate() - 7 + index * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      label: start.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value: rows.filter((row) => {
        const date = new Date(row.scheduledDate);
        return date >= start && date <= end;
      }).length
    };
  });
}
