"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { AppPage } from "@/components/shell/app-page";
import {
  useDashboardMetrics,
  useLivestockList,
  useVaccinationSchedule,
  useVegetationList
} from "@/lib/supabase/hooks";
import { currentCropStage, cropLabel, formatHectares } from "@/lib/crops/stages";
import { formatNumber } from "@/lib/format";

export default function TasksPage() {
  const { data = [], isLoading, isError } = useVaccinationSchedule(60, 7);
  const metrics = useDashboardMetrics();
  const livestock = useLivestockList();
  const crops = useVegetationList();

  const open = data.filter((item) => !item.completed);
  const done = data.filter((item) => item.completed);
  const overdue = open.filter(
    (item) => item.scheduledDate < new Date().toISOString().slice(0, 10)
  );
  const upcoming = open.filter(
    (item) => item.scheduledDate >= new Date().toISOString().slice(0, 10)
  );

  const animalsMissingDob = (livestock.data ?? []).filter((animal) => !animal.dateOfBirth);
  const fieldTasks = useMemo(() => {
    return (crops.data ?? []).slice(0, 6).map((block) => {
      const stage = currentCropStage(block.cropType, block.plantingDate);
      return {
        id: block.id,
        title: `Scout ${block.externalId}`,
        detail: `${cropLabel(block.cropType, block.variety)} · ${stage.label} · ${formatHectares(block.areaHectares)}`,
        href: `/vegetation/${block.id}`
      };
    });
  }, [crops.data]);

  return (
    <AppPage
      hero={
        <PageHero
        eyebrow="Operations"
        title="Tasks"
        description="Health care, overdue work, and field scouting for the current window."
        image="/images/home/farmer.jpg"
        imageAlt="Farmer working in the field"
        asideTitle="Today’s board"
        asideNote="Clear overdue health work first, then walk the fields that need scouting."
        actions={
          <Link href="/vaccinations" className="btn-secondary min-h-12">
            Health calendar
          </Link>
        }
      />
      }
    >
      <section className="grid gap-px overflow-hidden rounded-card border border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Open health tasks"
          value={isLoading ? "—" : formatNumber(open.length)}
        />
        <Metric
          label="Overdue"
          value={isLoading ? "—" : formatNumber(overdue.length)}
          tone="clay"
        />
        <Metric
          label="Due in 30 days"
          value={
            metrics.isLoading ? "—" : formatNumber(metrics.data?.upcomingVaccinations ?? 0)
          }
        />
        <Metric
          label="Completed"
          value={isLoading ? "—" : formatNumber(done.length)}
          tone="crop"
        />
      </section>

      {isError && <p className="alert-error">Could not load tasks. Check your connection.</p>}
      {isLoading && <p className="text-sm text-ink-muted">Loading tasks…</p>}

      {!isLoading && !isError && (
        <div className="grid gap-5 lg:grid-cols-2">
          <TaskGroup
            title="Overdue"
            empty="Nothing overdue."
            items={overdue.map((item) => ({
              id: item.id,
              title: item.vaccineName,
              detail: item.livestock?.name || item.livestock?.externalId || "Livestock",
              date: item.scheduledDate,
              href: item.livestockId ? `/livestock/${item.livestockId}` : "/vaccinations"
            }))}
          />
          <TaskGroup
            title="Upcoming care"
            empty="No upcoming health tasks in this window."
            items={upcoming.map((item) => ({
              id: item.id,
              title: item.vaccineName,
              detail: item.livestock?.name || item.livestock?.externalId || "Livestock",
              date: item.scheduledDate,
              href: item.livestockId ? `/livestock/${item.livestockId}` : "/vaccinations"
            }))}
          />
          <TaskGroup
            title="Field scouting"
            empty="Add crop blocks to generate field tasks."
            items={fieldTasks.map((item) => ({
              id: item.id,
              title: item.title,
              detail: item.detail,
              href: item.href
            }))}
          />
          <TaskGroup
            title="Herd records to complete"
            empty="All animals have a date of birth on file."
            items={animalsMissingDob.slice(0, 8).map((animal) => ({
              id: animal.id,
              title: animal.name || animal.externalId,
              detail: `${animal.species} · add DOB for vaccination schedule`,
              href: `/livestock/${animal.id}`
            }))}
          />
        </div>
      )}
    </AppPage>
  );
}

function Metric(props: {
  label: string;
  value: string;
  tone?: "crop" | "clay";
}) {
  const color =
    props.tone === "crop" ? "text-crop" : props.tone === "clay" ? "text-clay" : "text-ink";
  return (
    <div className="bg-paper px-4 py-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">{props.label}</p>
      <p className={`mt-3 text-2xl font-semibold tracking-tight tabular-nums ${color}`}>
        {props.value}
      </p>
    </div>
  );
}

function TaskGroup(props: {
  title: string;
  empty: string;
  items: Array<{
    id: string;
    title: string;
    detail: string;
    date?: string;
    href: string;
  }>;
}) {
  return (
    <div className="surface p-5">
      <h2 className="text-lg font-semibold tracking-tight">{props.title}</h2>
      <div className="mt-4 space-y-2">
        {props.items.length === 0 && <p className="text-sm text-ink-muted">{props.empty}</p>}
        {props.items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex min-h-11 items-center justify-between gap-3 rounded-control border border-stone bg-ivory px-3 py-2.5"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{item.title}</span>
              <span className="block truncate text-xs text-ink-subtle">{item.detail}</span>
            </span>
            {item.date && (
              <span className="shrink-0 text-xs text-ink-subtle">
                {new Date(item.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric"
                })}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
